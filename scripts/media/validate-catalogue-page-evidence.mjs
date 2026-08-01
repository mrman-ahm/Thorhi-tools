import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SHA256 = /^[a-f0-9]{64}$/;
const TEXT_QUALITIES = new Set(["rich", "sparse", "image-only"]);
const REVIEW_STATES = new Set([
  "cover-verified",
  "text-layer-review",
  "manual-visual-review-required",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

export function validateCataloguePageEvidence(evidence) {
  const errors = [];
  if (!object(evidence)) {
    return { sources: 0, pages: 0, errors: ["evidence must be an object"] };
  }
  if (evidence.schemaVersion !== 1) errors.push("schemaVersion must equal 1");
  if (!object(evidence.generator)) errors.push("generator must be an object");
  if (evidence.generator?.ocrUsed !== false) errors.push("generator.ocrUsed must be false");
  if (!Array.isArray(evidence.sources)) errors.push("sources must be an array");

  const sourceIds = new Set();
  let pages = 0;
  const calculated = {
    sources: Array.isArray(evidence.sources) ? evidence.sources.length : 0,
    pages: 0,
    bytes: 0,
    textChars: 0,
    embeddedImageCount: 0,
    richPages: 0,
    sparsePages: 0,
    imageOnlyPages: 0,
    manualVisualReviewRequired: 0,
  };

  for (const source of evidence.sources ?? []) {
    if (!object(source)) {
      errors.push("source must be an object");
      continue;
    }
    if (!source.id || typeof source.id !== "string") errors.push("source.id is required");
    if (sourceIds.has(source.id)) errors.push(`duplicate source id: ${source.id}`);
    sourceIds.add(source.id);
    if (source.division !== "surgical") errors.push(`${source.id}: division must be surgical`);
    if (source.licenseStatus !== "client-owned") {
      errors.push(`${source.id}: licenseStatus must be client-owned`);
    }
    if (!SHA256.test(source.sha256 ?? "")) errors.push(`${source.id}: invalid sha256`);
    if (!Number.isInteger(source.pageCount) || source.pageCount < 1) {
      errors.push(`${source.id}: invalid pageCount`);
    }
    if (!Array.isArray(source.pages)) {
      errors.push(`${source.id}: pages must be an array`);
      continue;
    }
    if (source.pages.length !== source.pageCount) {
      errors.push(`${source.id}: pages length must equal pageCount`);
    }

    calculated.bytes += source.byteSize ?? 0;
    calculated.textChars += source.textChars ?? 0;
    calculated.embeddedImageCount += source.embeddedImageCount ?? 0;

    let sourceTextChars = 0;
    let sourceImages = 0;
    const qualityCounts = { rich: 0, sparse: 0, "image-only": 0 };
    const reviewCounts = {
      "cover-verified": 0,
      "text-layer-review": 0,
      "manual-visual-review-required": 0,
    };

    for (const [index, page] of source.pages.entries()) {
      pages += 1;
      calculated.pages += 1;
      const prefix = `${source.id} page ${index + 1}`;
      if (!object(page)) {
        errors.push(`${prefix}: page must be an object`);
        continue;
      }
      if (page.sourceId !== source.id) errors.push(`${prefix}: sourceId mismatch`);
      if (page.pageNumber !== index + 1) errors.push(`${prefix}: pageNumber must be contiguous`);
      if (page.pageLabel !== (index === 0 ? "cover" : String(index))) {
        errors.push(`${prefix}: invalid pageLabel`);
      }
      if (!SHA256.test(page.renderSha256 ?? "")) errors.push(`${prefix}: invalid renderSha256`);
      if (!TEXT_QUALITIES.has(page.textLayerQuality)) {
        errors.push(`${prefix}: invalid textLayerQuality`);
      }
      if (!REVIEW_STATES.has(page.reviewState)) errors.push(`${prefix}: invalid reviewState`);
      if (!Array.isArray(page.observedCodes)) {
        errors.push(`${prefix}: observedCodes must be an array`);
      }
      if ("productId" in page || "productName" in page) {
        errors.push(`${prefix}: product identity must not be auto-assigned`);
      }
      if (index === 0 && page.reviewState !== "cover-verified") {
        errors.push(`${prefix}: cover must be cover-verified`);
      }
      if (
        index > 0 &&
        (page.textLayerQuality !== "rich" || (page.observedCodes?.length ?? 0) === 0) &&
        page.reviewState !== "manual-visual-review-required"
      ) {
        errors.push(`${prefix}: sparse evidence must require visual review`);
      }
      if (
        index > 0 &&
        page.textLayerQuality === "rich" &&
        (page.observedCodes?.length ?? 0) > 0 &&
        page.reviewState !== "text-layer-review"
      ) {
        errors.push(`${prefix}: rich coded page must be text-layer-review`);
      }
      sourceTextChars += page.textChars ?? 0;
      sourceImages += page.embeddedImageCount ?? 0;
      if (TEXT_QUALITIES.has(page.textLayerQuality)) {
        qualityCounts[page.textLayerQuality] += 1;
        if (page.textLayerQuality === "rich") calculated.richPages += 1;
        if (page.textLayerQuality === "sparse") calculated.sparsePages += 1;
        if (page.textLayerQuality === "image-only") calculated.imageOnlyPages += 1;
      }
      if (REVIEW_STATES.has(page.reviewState)) reviewCounts[page.reviewState] += 1;
      if (page.reviewState === "manual-visual-review-required") {
        calculated.manualVisualReviewRequired += 1;
      }
    }

    if (sourceTextChars !== source.textChars) errors.push(`${source.id}: textChars summary mismatch`);
    if (sourceImages !== source.embeddedImageCount) {
      errors.push(`${source.id}: embeddedImageCount summary mismatch`);
    }
    for (const [quality, count] of Object.entries(qualityCounts)) {
      if (source.textLayerQualityCounts?.[quality] !== count) {
        errors.push(`${source.id}: ${quality} count mismatch`);
      }
    }
    for (const [state, count] of Object.entries(reviewCounts)) {
      if ((source.reviewStateCounts?.[state] ?? 0) !== count) {
        errors.push(`${source.id}: ${state} count mismatch`);
      }
    }
  }

  for (const [key, value] of Object.entries(calculated)) {
    if (evidence.summary?.[key] !== value) errors.push(`summary.${key} must equal ${value}`);
  }

  return { sources: calculated.sources, pages, errors };
}

async function main() {
  const filePath =
    process.argv[2] ??
    path.join(process.cwd(), "data/media/catalogue-page-evidence.generated.json");
  const evidence = JSON.parse(await readFile(filePath, "utf8"));
  const result = validateCataloguePageEvidence(evidence);
  if (result.errors.length) throw new Error(result.errors.join("\n"));
  console.log(JSON.stringify(result));
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
