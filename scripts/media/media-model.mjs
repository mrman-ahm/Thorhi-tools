import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PUBLIC_DIVISIONS = Object.freeze(["surgical", "dental"]);
export const SOURCE_AVAILABILITY = Object.freeze([
  "attached-not-mounted",
  "mounted-verified",
  "mounted-mismatch",
]);
export const PLACEMENT_STATUSES = Object.freeze([
  "blocked-figma-node",
  "blocked-code-owner",
  "candidate-needed",
  "candidate-selected",
  "production-approved",
]);
export const CROP_POLICIES = Object.freeze([
  "contain",
  "editorial-cover",
  "document-cover",
]);

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

export function validateCatalogueSourceRecord(record) {
  const errors = [];
  if (!record || typeof record !== "object") return ["record must be an object"];
  if (!record.id || typeof record.id !== "string") errors.push("id is required");
  if (!record.fileName || typeof record.fileName !== "string") errors.push("fileName is required");
  if (record.division !== "surgical") errors.push("division must be surgical for the supplied source set");
  if (!record.category || typeof record.category !== "string") errors.push("category is required");
  if (!Number.isInteger(record.pageCount) || record.pageCount <= 0) errors.push("pageCount must be a positive integer");
  if (!Number.isInteger(record.byteSize) || record.byteSize <= 0) errors.push("byteSize must be a positive integer");
  if (!SHA256_PATTERN.test(record.sha256 ?? "")) errors.push("sha256 must be 64 lowercase hex characters");
  if (!(Number(record.pageWidthPt) > 0)) errors.push("pageWidthPt must be positive");
  if (!(Number(record.pageHeightPt) > 0)) errors.push("pageHeightPt must be positive");
  if (!record.pdfVersion || typeof record.pdfVersion !== "string") errors.push("pdfVersion is required");
  if (!SOURCE_AVAILABILITY.includes(record.availability)) errors.push("availability is invalid");
  if (record.licenseStatus !== "client-owned") errors.push("licenseStatus must be client-owned");
  return errors;
}

export function validateCatalogueRegistry(registry) {
  const errors = [];
  if (registry?.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (registry?.sourcePathEnv !== "THROHI_CATALOGUE_SOURCE_DIR") {
    errors.push("sourcePathEnv must be THROHI_CATALOGUE_SOURCE_DIR");
  }
  if (!Array.isArray(registry?.sources)) return [...errors, "sources must be an array"];
  const seen = new Set();
  for (const source of registry.sources) {
    if (seen.has(source.id)) errors.push(`duplicate source id: ${source.id}`);
    seen.add(source.id);
    for (const error of validateCatalogueSourceRecord(source)) {
      errors.push(`${source.id ?? "unknown"}: ${error}`);
    }
  }
  return errors;
}

export async function loadCatalogueSources(rootDir = process.cwd()) {
  const filePath = path.join(rootDir, "data/media/catalogue-sources.json");
  const registry = JSON.parse(await readFile(filePath, "utf8"));
  const errors = validateCatalogueRegistry(registry);
  if (errors.length) throw new Error(`Invalid catalogue registry:\n${errors.join("\n")}`);
  return registry.sources;
}

export function repositoryRootFrom(importMetaUrl) {
  return path.resolve(path.dirname(fileURLToPath(importMetaUrl)), "../..");
}
