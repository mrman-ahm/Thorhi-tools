import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const divisionMap = new Map([
  ["surgical", "surgical"],
  ["dental", "dental"],
  ["veterinary", "veterinary"],
  ["beauty", "beauty"]
]);
const familyMap = new Map([
  ["surgical|scissors", "scissors"],
  ["surgical|forceps clamps", "forceps-clamps"],
  ["surgical|needle holders", "needle-holders"],
  ["dental|extraction", "extraction"],
  ["dental|periodontal", "periodontal"],
  ["dental|restorative", "restorative"],
  ["veterinary|equine", "equine"],
  ["veterinary|hoof farrier", "hoof-farrier"],
  ["veterinary|obstetrical", "obstetrical"],
  ["beauty|hair scissors", "hair-scissors"],
  ["beauty|tweezers", "tweezers"],
  ["beauty|nail cuticle", "nail-cuticle"]
]);

export function normalizeText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function normalizeKey(value) {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function normalizeCode(value) {
  const compact = normalizeText(value).toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return compact.replace(/-+/g, "-");
}

export function slugify(value) {
  return normalizeKey(value).replace(/\s+/g, "-");
}

export function processRecords(rawRecords) {
  const approved = [];
  const rejected = [];
  const redirects = [];
  const warnings = [];
  const seenCodes = new Map();
  const seenNames = new Map();

  for (const [index, source] of rawRecords.entries()) {
    const reasons = [];
    const division = divisionMap.get(normalizeKey(source.division));
    if (!division) reasons.push("unknown division");
    const familyKey = `${division ?? normalizeKey(source.division)}|${normalizeKey(source.family)}`;
    const family = familyMap.get(familyKey);
    if (!family) reasons.push("unknown family");
    const name = normalizeText(source.name);
    const code = normalizeCode(source.code);
    if (!name) reasons.push("missing product name");
    if (!code) reasons.push("missing product code");
    const publicationStatus = normalizeKey(source.status);
    if (publicationStatus !== "approved") reasons.push("record is not approved for publication");

    if (code) {
      if (seenCodes.has(code)) reasons.push(`duplicate product code; first seen at row ${seenCodes.get(code) + 1}`);
      else seenCodes.set(code, index);
    }

    const normalizedName = normalizeKey(name);
    if (normalizedName) {
      if (seenNames.has(normalizedName)) warnings.push({ row: index + 1, type: "duplicate-name", message: `Possible duplicate name: ${name}` });
      else seenNames.set(normalizedName, index);
    }

    if (reasons.length) {
      rejected.push({ row: index + 1, source, reasons });
      continue;
    }

    const slug = slugify(name);
    const record = {
      id: `migrated-${code.toLowerCase()}`,
      slug,
      code,
      name,
      division,
      family,
      description: normalizeText(source.description),
      aliases: Array.isArray(source.aliases) ? source.aliases.map(normalizeText).filter(Boolean) : [],
      status: "approved",
      imageState: normalizeText(source.image) ? "available" : "missing",
      image: normalizeText(source.image) || null,
      legacyUrl: normalizeText(source.legacyUrl) || null,
      updatedAt: normalizeText(source.updatedAt) || null,
      approvalNotes: normalizeText(source.approvalNotes) || "Migrated from approved raw record."
    };
    approved.push(record);
    if (record.legacyUrl) redirects.push({ from: record.legacyUrl, to: `/products/${division}/${family}/${slug}`, status: 301 });
  }

  approved.sort((a, b) => a.code.localeCompare(b.code));
  rejected.sort((a, b) => a.row - b.row);
  redirects.sort((a, b) => a.from.localeCompare(b.from));
  warnings.sort((a, b) => a.row - b.row || a.type.localeCompare(b.type));

  return {
    approved,
    rejected,
    redirects,
    report: {
      inputCount: rawRecords.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      warningCount: warnings.length,
      warnings
    }
  };
}

async function main() {
  const inputPath = path.resolve(process.argv[2] ?? "data/raw/catalogue-seed.json");
  const outputDir = path.resolve(process.argv[3] ?? "data/working/generated");
  const raw = JSON.parse(await readFile(inputPath, "utf8"));
  if (!Array.isArray(raw)) throw new Error("Catalogue input must be a JSON array.");
  const result = processRecords(raw);
  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outputDir, "approved.json"), `${JSON.stringify(result.approved, null, 2)}\n`),
    writeFile(path.join(outputDir, "rejected.json"), `${JSON.stringify(result.rejected, null, 2)}\n`),
    writeFile(path.join(outputDir, "redirects.json"), `${JSON.stringify(result.redirects, null, 2)}\n`),
    writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(result.report, null, 2)}\n`)
  ]);
  console.log(JSON.stringify(result.report));
  if (result.rejected.length) process.exitCode = 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
