import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { repositoryRootFrom } from "./media-model.mjs";
import { loadCataloguePageEvidence } from "./validate-catalogue-page-evidence.mjs";

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function normalizeCode(value) {
  return typeof value === "string"
    ? value.trim().toUpperCase().replace(/\s+/g, " ")
    : "";
}

function productCodes(product) {
  const codes = new Set();
  const representativeCode = normalizeCode(product.representativeCode);
  if (representativeCode) codes.add(representativeCode);
  for (const code of product.variantCodes ?? []) {
    const normalized = normalizeCode(code);
    if (normalized) codes.add(normalized);
  }
  return [...codes].sort();
}

function cataloguePageRecord(source, page) {
  return {
    sourceId: source.id,
    fileName: source.fileName,
    category: source.category,
    pageNumber: page.pageNumber,
    pageLabel: page.pageLabel,
    renderSha256: page.renderSha256,
    textLayerQuality: page.textLayerQuality,
    reviewState: page.reviewState,
    observedCodes: [...(page.observedCodes ?? [])].sort(),
  };
}

function buildExactCodeIndex(pageEvidence) {
  const index = new Map();
  for (const source of pageEvidence.sources) {
    for (const page of source.pages) {
      for (const rawCode of page.observedCodes ?? []) {
        const code = normalizeCode(rawCode);
        if (!code) continue;
        const locationKey = `${source.id}:${page.pageNumber}`;
        const locations = index.get(code) ?? new Map();
        const existing = locations.get(locationKey) ?? {
          ...cataloguePageRecord(source, page),
          matchedCodes: [],
        };
        if (!existing.matchedCodes.includes(code)) existing.matchedCodes.push(code);
        locations.set(locationKey, existing);
        index.set(code, locations);
      }
    }
  }
  return index;
}

function exactCandidates(codes, exactCodeIndex) {
  const candidates = new Map();
  for (const code of codes) {
    for (const [locationKey, location] of exactCodeIndex.get(code) ?? []) {
      const existing = candidates.get(locationKey) ?? {
        ...location,
        matchedCodes: [],
      };
      if (!existing.matchedCodes.includes(code)) existing.matchedCodes.push(code);
      candidates.set(locationKey, existing);
    }
  }
  return [...candidates.values()]
    .map((candidate) => ({
      ...candidate,
      matchedCodes: candidate.matchedCodes.sort(),
    }))
    .sort(
      (left, right) =>
        left.fileName.localeCompare(right.fileName) ||
        left.pageNumber - right.pageNumber
    );
}

function resolvePage(source, product) {
  if (Number.isInteger(product.sourcePdfPage) && product.sourcePdfPage > 0) {
    const page = source.pages.find(
      (candidate) => candidate.pageNumber === product.sourcePdfPage
    );
    if (page) return { page, pageResolution: "pdf-page-number" };
  }
  if (
    product.sourcePrintedPage !== null &&
    product.sourcePrintedPage !== undefined
  ) {
    const printedPage = String(product.sourcePrintedPage);
    const page = source.pages.find(
      (candidate) => String(candidate.pageLabel) === printedPage
    );
    if (page) return { page, pageResolution: "printed-page-label" };
  }
  return { page: null, pageResolution: null };
}

function statusFor({ source, page, matchedCodes, candidates }) {
  if (!source) {
    return candidates.length > 0
      ? "exact-code-candidate"
      : "outside-supplied-source-set";
  }
  if (!page) return "missing-source-page";
  if (matchedCodes.length > 0) return "source-page-exact-code-match";
  if (
    page.reviewState === "manual-visual-review-required" ||
    page.textLayerQuality !== "rich" ||
    (page.observedCodes ?? []).length === 0
  ) {
    return "manual-visual-review-required";
  }
  return "source-page-code-mismatch";
}

function recommendedReviewAction(status) {
  const actions = {
    "source-page-exact-code-match": "verify-silhouette-and-attach-evidence",
    "manual-visual-review-required": "inspect-rendered-catalogue-page",
    "source-page-code-mismatch": "reconcile-source-pointer-or-code",
    "exact-code-candidate": "confirm-source-page-and-silhouette",
    "outside-supplied-source-set": "no-supplied-catalogue-action",
    "missing-source-page": "repair-source-page-pointer",
  };
  return actions[status];
}

export function buildCatalogueProductReconciliation({
  inventory,
  pageEvidence,
  generatedAt = new Date().toISOString(),
}) {
  assertObject(inventory, "product inventory");
  assertObject(pageEvidence, "catalogue page evidence");
  if (inventory.schemaVersion !== 1 || !Array.isArray(inventory.products)) {
    throw new Error("product inventory must use schemaVersion 1 and include products");
  }
  if (pageEvidence.schemaVersion !== 1 || !Array.isArray(pageEvidence.sources)) {
    throw new Error("catalogue page evidence must use schemaVersion 1 and include sources");
  }

  const sourceByFile = new Map();
  for (const source of pageEvidence.sources) {
    if (!source?.fileName || !Array.isArray(source.pages)) {
      throw new Error("catalogue source must include fileName and hydrated pages");
    }
    if (sourceByFile.has(source.fileName)) {
      throw new Error(`duplicate catalogue source file: ${source.fileName}`);
    }
    sourceByFile.set(source.fileName, source);
  }
  const exactCodeIndex = buildExactCodeIndex(pageEvidence);

  const products = inventory.products.map((product) => {
    if (!product?.productId || typeof product.productId !== "string") {
      throw new Error("inventory productId is required");
    }
    const codes = productCodes(product);
    const source = sourceByFile.get(product.sourceFile) ?? null;
    const { page, pageResolution } = source
      ? resolvePage(source, product)
      : { page: null, pageResolution: null };
    const pageCodes = new Set(
      (page?.observedCodes ?? []).map(normalizeCode).filter(Boolean)
    );
    const matchedCodes = codes.filter((code) => pageCodes.has(code));
    const candidates = exactCandidates(codes, exactCodeIndex);
    const reconciliationStatus = statusFor({
      source,
      page,
      matchedCodes,
      candidates,
    });

    return {
      productId: product.productId,
      productName: product.productName ?? "",
      representativeCode: product.representativeCode ?? "",
      division: product.division ?? "",
      familyId: product.familyId ?? "",
      variantCodes: [...(product.variantCodes ?? [])],
      sourceFile: product.sourceFile ?? null,
      sourcePdfPage: product.sourcePdfPage ?? null,
      sourcePrintedPage: product.sourcePrintedPage ?? null,
      pageResolution,
      reconciliationStatus,
      matchedCodes,
      cataloguePage: source && page ? cataloguePageRecord(source, page) : null,
      exactCodeCandidates: candidates,
      identityApproved: false,
      recommendedReviewAction: recommendedReviewAction(reconciliationStatus),
    };
  });

  products.sort((left, right) => left.productId.localeCompare(right.productId));
  const count = (status) =>
    products.filter((product) => product.reconciliationStatus === status).length;

  return {
    schemaVersion: 1,
    generatedAt,
    source: {
      inventory: "data/media/product-inventory.generated.json",
      pageEvidence: "data/media/catalogue-page-evidence.generated.json",
    },
    policy: {
      fuzzyMatching: false,
      ocrNaming: false,
      automaticIdentityApproval: false,
      exactCodeMatchingOnly: true,
    },
    summary: {
      products: products.length,
      suppliedSourceProducts: products.filter((product) =>
        sourceByFile.has(product.sourceFile)
      ).length,
      sourcePageExactCodeMatches: count("source-page-exact-code-match"),
      manualVisualReviewRequired: count("manual-visual-review-required"),
      sourcePageCodeMismatches: count("source-page-code-mismatch"),
      exactCodeCandidates: count("exact-code-candidate"),
      outsideSuppliedSourceSet: count("outside-supplied-source-set"),
      missingSourcePages: count("missing-source-page"),
      identityApproved: 0,
    },
    products,
  };
}

export async function writeCatalogueProductReconciliation(rootDir, options = {}) {
  const [inventory, pageEvidence] = await Promise.all([
    readFile(
      path.join(rootDir, "data/media/product-inventory.generated.json"),
      "utf8"
    ).then(JSON.parse),
    loadCataloguePageEvidence(rootDir),
  ]);
  const reconciliation = buildCatalogueProductReconciliation({
    inventory,
    pageEvidence,
    generatedAt: options.generatedAt,
  });
  const outputPath = path.join(
    rootDir,
    "data/media/catalogue-reconciliation.generated.json"
  );
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(reconciliation, null, 2)}\n`);
  return reconciliation;
}

async function main() {
  const reconciliation = await writeCatalogueProductReconciliation(
    repositoryRootFrom(import.meta.url)
  );
  console.log(JSON.stringify(reconciliation.summary));
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
