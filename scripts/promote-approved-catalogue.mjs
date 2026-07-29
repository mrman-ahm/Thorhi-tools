import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export const reviewStatuses = Object.freeze([
  "pending",
  "approved",
  "corrected",
  "needs-client",
  "rejected"
]);

const allowedDecisionKeys = new Set([
  "productId",
  "status",
  "reviewedAt",
  "approvedName",
  "approvedCode",
  "approvedFamily",
  "confirmImage",
  "confirmVariants",
  "confirmSourceReference",
  "notes"
]);

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeCode(value) {
  return normalizeText(value).toUpperCase();
}

function assertIsoDate(value, label) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.valueOf()) || date.toISOString() !== value) {
    throw new Error(`${label} must be an ISO date string.`);
  }
}

function assertBoolean(value, label) {
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be true or false.`);
  }
}

function validateDecisionShape(decision, index) {
  if (!decision || typeof decision !== "object" || Array.isArray(decision)) {
    throw new Error(`Decision ${index + 1} must be an object.`);
  }
  for (const key of Object.keys(decision)) {
    if (!allowedDecisionKeys.has(key)) {
      throw new Error(`Decision ${index + 1} contains unsupported field "${key}".`);
    }
  }
  if (!reviewStatuses.includes(decision.status)) {
    throw new Error(`Decision ${index + 1} has an invalid status.`);
  }
  if (decision.status !== "pending") {
    assertIsoDate(decision.reviewedAt, `Decision ${index + 1} reviewedAt`);
  }
}

export function buildApprovedCatalogue(runtime, review) {
  if (!runtime || typeof runtime !== "object" || !Array.isArray(runtime.products)) {
    throw new Error("Runtime catalogue is invalid.");
  }
  if (!review || typeof review !== "object" || review.version !== 1) {
    throw new Error("Review file must use schema version 1.");
  }

  const reviewer = normalizeText(review.reviewer);
  if (!reviewer) throw new Error("A reviewer name is required.");
  assertIsoDate(review.exportedAt, "Review exportedAt");
  if (!Array.isArray(review.decisions)) {
    throw new Error("Review decisions must be an array.");
  }

  const productById = new Map(runtime.products.map(product => [product.id, product]));
  const familyByKey = new Map(
    runtime.families.map(family => [`${family.division}:${family.slug}`, family])
  );
  const seenDecisions = new Set();
  const approvedCodes = new Map();
  const products = [];
  const counts = {
    reviewed: 0,
    approved: 0,
    corrected: 0,
    rejected: 0,
    needsClient: 0,
    pending: 0
  };

  review.decisions.forEach((decision, index) => {
    validateDecisionShape(decision, index);
    const productId = normalizeText(decision.productId);
    const product = productById.get(productId);
    if (!product) throw new Error(`Decision ${index + 1} references unknown product "${productId}".`);
    if (seenDecisions.has(productId)) {
      throw new Error(`Review contains duplicate decisions for "${productId}".`);
    }
    seenDecisions.add(productId);

    if (decision.status === "pending") {
      counts.pending += 1;
      return;
    }

    counts.reviewed += 1;
    if (decision.status === "needs-client") {
      counts.needsClient += 1;
      return;
    }
    if (decision.status === "rejected") {
      counts.rejected += 1;
      return;
    }

    assertBoolean(decision.confirmImage, `${productId} confirmImage`);
    assertBoolean(decision.confirmVariants, `${productId} confirmVariants`);
    assertBoolean(decision.confirmSourceReference, `${productId} confirmSourceReference`);

    const code = decision.status === "corrected"
      ? normalizeCode(decision.approvedCode || product.code)
      : product.code;
    const name = decision.status === "corrected"
      ? normalizeText(decision.approvedName || product.name)
      : product.name;
    const familySlug = decision.status === "corrected"
      ? normalizeText(decision.approvedFamily || product.family)
      : product.family;
    const family = familyByKey.get(`${product.division}:${familySlug}`);

    if (!code || !name) throw new Error(`${productId} must have an approved code and name.`);
    if (!family) throw new Error(`${productId} references an invalid approved family.`);
    if (
      decision.status === "corrected" &&
      code === product.code &&
      name === product.name &&
      familySlug === product.family
    ) {
      throw new Error(`${productId} is marked corrected but contains no identity correction.`);
    }
    if (approvedCodes.has(code)) {
      throw new Error(`Approved code "${code}" is duplicated by ${approvedCodes.get(code)} and ${productId}.`);
    }
    approvedCodes.set(code, productId);

    counts[decision.status] += 1;
    products.push({
      id: product.id,
      code,
      name,
      division: product.division,
      family: familySlug,
      familyLabel: family.label,
      variants: decision.confirmVariants
        ? product.variants.map(variant => ({
            id: variant.id,
            code: variant.code,
            sourcePrintedPage: variant.sourcePrintedPage,
            status: "approved"
          }))
        : [],
      sourceReference: decision.confirmSourceReference
        ? {
            file: product.sourceFile,
            pdfPage: product.sourcePdfPage,
            printedPage: product.sourcePrintedPage,
            status: "approved"
          }
        : null,
      image: decision.confirmImage
        ? {
            path: `/catalogue/products/${product.id}.avif`,
            status: "approved"
          }
        : null,
      status: "approved",
      technicalStatus: "withheld-pending-verification",
      approval: {
        decision: decision.status,
        reviewer,
        reviewedAt: decision.reviewedAt,
        notes: normalizeText(decision.notes)
      }
    });
  });

  return {
    schemaVersion: 1,
    generatedAt: review.exportedAt,
    source: "Client catalogue review of source-derived identity records",
    publicationStatus: "partially-approved",
    technicalStatus: "withheld-pending-verification",
    counts: {
      ...counts,
      promoted: products.length,
      variants: products.reduce((sum, product) => sum + product.variants.length, 0),
      images: products.filter(product => product.image).length,
      sourceReferences: products.filter(product => product.sourceReference).length
    },
    products
  };
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, filePath);
}

async function main() {
  const root = process.cwd();
  const reviewPath = path.resolve(
    process.argv[2] ?? "data/working/finemed/catalogue-review.decisions.json"
  );
  const outputPath = path.resolve(
    process.argv[3] ?? "data/approved/catalogue.approved.json"
  );
  const runtimePath = path.join(root, "src/data/catalogue.runtime.generated.json");
  const [runtime, review] = await Promise.all([
    readFile(runtimePath, "utf8").then(JSON.parse),
    readFile(reviewPath, "utf8").then(JSON.parse)
  ]);
  const approved = buildApprovedCatalogue(runtime, review);
  await writeJson(outputPath, approved);
  console.log(JSON.stringify({ outputPath, counts: approved.counts }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
