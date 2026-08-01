import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { repositoryRootFrom } from "./media-model.mjs";

const ALLOWED_REVIEW_STATES = new Set([
  "discovered",
  "needs-review",
  "catalogue-verified",
  "production-approved",
  "rejected",
]);
const ALLOWED_IDENTITY_CONFIDENCE = new Set([
  "unapproved",
  "catalogue-matched",
  "client-confirmed",
]);
const ALLOWED_SILHOUETTE_STATUSES = new Set([
  "needs-review",
  "acceptable",
  "incorrect",
]);

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Unable to parse ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function normalizeDecision(decision) {
  assertObject(decision, "review decision");
  if (!decision.productId || typeof decision.productId !== "string") {
    throw new Error("review decision productId is required");
  }
  if (decision.reviewState !== undefined && !ALLOWED_REVIEW_STATES.has(decision.reviewState)) {
    throw new Error(`${decision.productId}: invalid reviewState`);
  }
  if (
    decision.identityConfidence !== undefined &&
    !ALLOWED_IDENTITY_CONFIDENCE.has(decision.identityConfidence)
  ) {
    throw new Error(`${decision.productId}: invalid identityConfidence`);
  }
  if (
    decision.silhouetteStatus !== undefined &&
    !ALLOWED_SILHOUETTE_STATUSES.has(decision.silhouetteStatus)
  ) {
    throw new Error(`${decision.productId}: invalid silhouetteStatus`);
  }
  for (const forbidden of [
    "id",
    "name",
    "code",
    "division",
    "family",
    "familyLabel",
    "productName",
    "representativeCode",
    "familyId",
  ]) {
    if (Object.hasOwn(decision, forbidden)) {
      throw new Error(`${decision.productId}: decisions may not override ${forbidden}`);
    }
  }
  return decision;
}

function decisionMap(decisionsDocument) {
  if (decisionsDocument?.schemaVersion !== 1 || !Array.isArray(decisionsDocument.decisions)) {
    throw new Error("product review decisions must use schemaVersion 1 and a decisions array");
  }
  const map = new Map();
  for (const rawDecision of decisionsDocument.decisions) {
    const decision = normalizeDecision(rawDecision);
    if (map.has(decision.productId)) {
      throw new Error(`duplicate product review decision: ${decision.productId}`);
    }
    map.set(decision.productId, decision);
  }
  return map;
}

function measurableQualityFlags(media, duplicatePath) {
  const flags = [];
  if (!media) return ["missing-media"];
  const width = Number(media.width);
  const height = Number(media.height);
  const bytes = Number(media.bytes);
  if (!(width > 0) || !(height > 0)) flags.push("missing-dimensions");
  if (!(bytes > 0)) flags.push("zero-byte-record");
  if (media.format !== "avif") flags.push("unexpected-format");
  if (width > 0 && height > 0 && (width < 480 || height < 480)) flags.push("small-source");
  if (width > 0 && height > 0 && Math.max(width, height) / Math.min(width, height) > 8) {
    flags.push("extreme-aspect-ratio");
  }
  if (duplicatePath) flags.push("duplicate-asset-path");
  return flags;
}

async function publicFileExists(publicRoot, assetPath) {
  if (!publicRoot || !assetPath) return null;
  const relativePath = assetPath.replace(/^\/+/, "");
  try {
    await access(path.join(publicRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

function sortProducts(left, right) {
  return (
    left.division.localeCompare(right.division) ||
    left.familyLabel.localeCompare(right.familyLabel) ||
    left.productName.localeCompare(right.productName) ||
    left.representativeCode.localeCompare(right.representativeCode)
  );
}

export async function buildProductMediaInventory({
  runtime,
  media,
  decisions = { schemaVersion: 1, updatedAt: null, decisions: [] },
  publicRoot = null,
  generatedAt = new Date().toISOString(),
}) {
  assertObject(runtime, "runtime catalogue");
  assertObject(media, "media catalogue");
  if (!Array.isArray(runtime.products)) throw new Error("runtime catalogue products must be an array");
  assertObject(media.products, "media catalogue products");

  const manualDecisions = decisionMap(decisions);
  const mediaEntries = Object.entries(media.products);
  const mediaPaths = new Map();
  for (const [, record] of mediaEntries) {
    if (!record?.path) continue;
    mediaPaths.set(record.path, (mediaPaths.get(record.path) ?? 0) + 1);
  }

  const runtimeIds = new Set();
  const products = [];
  let variantCodes = 0;
  let missingMedia = 0;
  let missingPublicFiles = 0;
  for (const product of runtime.products) {
    if (!product?.id || typeof product.id !== "string") throw new Error("runtime product id is required");
    if (runtimeIds.has(product.id)) throw new Error(`duplicate runtime product id: ${product.id}`);
    runtimeIds.add(product.id);

    const mediaRecord = media.products[product.id] ?? null;
    if (!mediaRecord) missingMedia += 1;
    const duplicatePath = Boolean(mediaRecord?.path && (mediaPaths.get(mediaRecord.path) ?? 0) > 1);
    const qualityFlags = measurableQualityFlags(mediaRecord, duplicatePath);
    const fileExists = await publicFileExists(publicRoot, mediaRecord?.path);
    if (fileExists === false) {
      qualityFlags.push("missing-public-file");
      missingPublicFiles += 1;
    }

    const variants = Array.isArray(product.variants) ? product.variants : [];
    const codes = variants
      .map((variant) => variant?.code)
      .filter((code) => typeof code === "string" && code.length > 0);
    variantCodes += codes.length;
    const decision = manualDecisions.get(product.id) ?? {};

    products.push({
      productId: product.id,
      productName: product.name ?? "",
      representativeCode: product.code ?? "",
      division: product.division ?? "",
      familyId: product.family ?? "",
      familyLabel: product.familyLabel ?? product.family ?? "",
      variantCodes: codes,
      sourceFile: product.sourceFile ?? null,
      sourcePdfPage: product.sourcePdfPage ?? null,
      sourcePrintedPage: product.sourcePrintedPage ?? null,
      currentAssetPath: mediaRecord?.path ?? null,
      width: Number.isFinite(Number(mediaRecord?.width)) ? Number(mediaRecord.width) : null,
      height: Number.isFinite(Number(mediaRecord?.height)) ? Number(mediaRecord.height) : null,
      bytes: Number.isFinite(Number(mediaRecord?.bytes)) ? Number(mediaRecord.bytes) : null,
      format: mediaRecord?.format ?? null,
      sourceType: "repository-source-derived",
      licenseStatus: "client-owned",
      identityConfidence: decision.identityConfidence ?? "unapproved",
      silhouetteStatus: decision.silhouetteStatus ?? "needs-review",
      qualityStatus: qualityFlags.length === 0 ? "measurably-clean" : "needs-review",
      qualityFlags,
      reviewState: decision.reviewState ?? "discovered",
      evidence: Array.isArray(decision.evidence) ? decision.evidence : [],
      reviewNotes: decision.notes ?? null,
    });
  }

  products.sort(sortProducts);
  const orphanMediaIds = mediaEntries
    .map(([productId]) => productId)
    .filter((productId) => !runtimeIds.has(productId))
    .sort();
  const duplicatePaths = [...mediaPaths.values()].filter((count) => count > 1).length;

  return {
    schemaVersion: 1,
    generatedAt,
    source: {
      runtime: "src/data/catalogue.runtime.generated.json",
      media: "src/data/catalogue.media.generated.json",
      decisions: "data/media/product-review.decisions.json",
    },
    summary: {
      runtimeProducts: runtime.products.length,
      mediaRecords: mediaEntries.length,
      variantCodes,
      missingMedia,
      orphanMedia: orphanMediaIds.length,
      duplicatePaths,
      missingPublicFiles,
      qualityReviewRequired: products.filter((product) => product.qualityFlags.length > 0).length,
      identityReviewRequired: products.filter((product) => product.identityConfidence === "unapproved").length,
    },
    orphanMediaIds,
    products,
  };
}

export async function loadProductMediaInputs(rootDir) {
  const [runtimeText, mediaText, decisionsText] = await Promise.all([
    readFile(path.join(rootDir, "src/data/catalogue.runtime.generated.json"), "utf8"),
    readFile(path.join(rootDir, "src/data/catalogue.media.generated.json"), "utf8"),
    readFile(path.join(rootDir, "data/media/product-review.decisions.json"), "utf8"),
  ]);
  return {
    runtime: parseJson(runtimeText, "runtime catalogue"),
    media: parseJson(mediaText, "media catalogue"),
    decisions: parseJson(decisionsText, "product review decisions"),
  };
}

export async function writeProductMediaInventory(rootDir, options = {}) {
  const inputs = await loadProductMediaInputs(rootDir);
  const inventory = await buildProductMediaInventory({
    ...inputs,
    publicRoot: options.verifyPublicFiles === false ? null : path.join(rootDir, "public"),
    generatedAt: options.generatedAt,
  });
  const outputPath = path.join(rootDir, "data/media/product-inventory.generated.json");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
  return inventory;
}

async function main() {
  const rootDir = repositoryRootFrom(import.meta.url);
  const inventory = await writeProductMediaInventory(rootDir);
  console.log(
    JSON.stringify({
      products: inventory.summary.runtimeProducts,
      variants: inventory.summary.variantCodes,
      missingMedia: inventory.summary.missingMedia,
      duplicatePaths: inventory.summary.duplicatePaths,
      missingPublicFiles: inventory.summary.missingPublicFiles,
    })
  );
  if (
    inventory.summary.missingMedia > 0 ||
    inventory.summary.orphanMedia > 0 ||
    inventory.summary.duplicatePaths > 0 ||
    inventory.summary.missingPublicFiles > 0
  ) {
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
