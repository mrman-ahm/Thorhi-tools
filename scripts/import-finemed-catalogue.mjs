import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { brotliDecompressSync } from "node:zlib";
import { unzipSync } from "fflate";
import sharp from "sharp";

export const expectedCounts = Object.freeze({
  divisions: 2,
  families: 53,
  products: 626,
  variants: 1434,
  images: 626
});

const textDecoder = new TextDecoder();
const suspiciousNamePatterns = [
  { code: "long-name", test: value => value.length > 80 },
  { code: "ocr-punctuation", test: value => /[\\|_=]| {2,}|,\s*,/.test(value) },
  { code: "dangling-copy", test: value => /(?:\bwith\b|\bfor\b|\bup to\b|[,.;:/-])\s*$/i.test(value) },
  { code: "known-ocr-token", test: value => /\b(?:seissors|giude|heavey|tela|daa|om)\b/i.test(value) }
];

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeCode(value) {
  return normalizeText(value).toUpperCase();
}

function safePage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : null;
}

const technicalBoundary = /\s*(?:[|\\=_;]|,|\bwith\b|\bfor\b|\buse(?:d)?\b|\bhelps\b|\bstainless\b|\bsteel\b|\bmatte\b|\bfinish(?:ed)?\b|\d+(?:\.\d+)?\s*(?:mm|cm|inch(?:es)?|°|"))/i;
const technicalAliasPattern = /\b(?:stainless|steel|matte|finish|sharp|blunt|serrated|insert|wire up to)\b|\d+(?:\.\d+)?\s*(?:mm|cm|inch(?:es)?|°|")/i;

function cleanDisplayName(value, fallbackCode, familyLabel) {
  const normalized = normalizeText(value).replace(/\s+([,.;:])/g, "$1");
  const [identity] = normalized.split(technicalBoundary);
  const cleaned = normalizeText(identity)
    .replace(/^(?:TC|TITANIUM)\s+/i, "")
    .replace(/[-,.;:/]+$/, "")
    .trim();
  return cleaned.length >= 3 ? cleaned : normalizeText(familyLabel) || fallbackCode;
}

function safeAliases(values) {
  return Array.from(new Set(values.map(normalizeText).filter(value =>
    value &&
    value.length <= 80 &&
    !technicalAliasPattern.test(value)
  )));
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label} must be ${expected}; received ${actual}.`);
  }
}

function assertSprite(sprite, assetManifest, productId) {
  if (!sprite || typeof sprite !== "object") {
    throw new Error(`Product ${productId} has no sprite coordinates.`);
  }
  const { row, column, columns, rows, cellSize } = sprite;
  if (![row, column, columns, rows, cellSize].every(Number.isInteger)) {
    throw new Error(`Product ${productId} has non-integer sprite coordinates.`);
  }
  if (row < 0 || row >= rows || column < 0 || column >= columns) {
    throw new Error(`Product ${productId} has out-of-bounds sprite coordinates.`);
  }
  if (
    columns !== assetManifest.columns ||
    rows !== assetManifest.rows ||
    cellSize !== assetManifest.cellSize
  ) {
    throw new Error(`Product ${productId} does not match the sprite manifest.`);
  }
}

function auditProduct(product, runtimeProduct) {
  const sourceName = normalizeText(product.name);
  const flags = suspiciousNamePatterns
    .filter(pattern => pattern.test(sourceName))
    .map(pattern => pattern.code);

  if (!normalizeText(product.sourceFile)) flags.push("missing-source-file");
  if (!safePage(product.sourcePdfPage) && !safePage(product.sourcePrintedPage)) {
    flags.push("missing-source-page");
  }
  if (!runtimeProduct.variants.length) flags.push("missing-variants");
  if (runtimeProduct.variants.some(variant => !variant.code)) flags.push("incomplete-variant-code");

  return flags;
}

export function buildRuntimeCatalogue(source) {
  if (!source || typeof source !== "object") throw new Error("Catalogue payload must be an object.");
  const sourceCounts = source.counts ?? {};
  for (const [label, expected] of Object.entries(expectedCounts)) {
    assertEqual(sourceCounts[label], expected, `Source ${label} count`);
  }

  const assetManifest = source.assetManifest;
  if (!assetManifest || typeof assetManifest !== "object") {
    throw new Error("Catalogue sprite manifest is missing.");
  }
  assertEqual(assetManifest.columns, 26, "Sprite column count");
  assertEqual(assetManifest.rows, 25, "Sprite row count");
  assertEqual(assetManifest.cellSize, 192, "Sprite cell size");
  assertEqual(assetManifest.width, 4992, "Sprite width");
  assertEqual(assetManifest.height, 4800, "Sprite height");

  const familyByKey = new Map(
    source.families.map(family => [`${family.division}:${family.slug}`, family])
  );
  const seenProductIds = new Set();
  const seenCodes = new Map();
  const seenSprites = new Map();
  const duplicateCodes = [];
  const duplicateSprites = [];
  const reviewQueue = [];
  let variantCount = 0;

  const products = source.products.map(product => {
    const id = normalizeText(product.id);
    const code = normalizeCode(product.code);
    if (!id || seenProductIds.has(id)) throw new Error(`Invalid or duplicate product id: ${id || "(empty)"}.`);
    seenProductIds.add(id);

    if (seenCodes.has(code)) duplicateCodes.push({ code, productIds: [seenCodes.get(code), id] });
    else seenCodes.set(code, id);

    assertSprite(product.imageSprite, assetManifest, id);
    const spriteKey = `${product.imageSprite.row}:${product.imageSprite.column}`;
    if (seenSprites.has(spriteKey)) {
      duplicateSprites.push({ sprite: spriteKey, productIds: [seenSprites.get(spriteKey), id] });
    } else {
      seenSprites.set(spriteKey, id);
    }

    const family = familyByKey.get(`${product.division}:${product.family}`);
    if (!family) throw new Error(`Product ${id} references an unknown family.`);

    const variants = (Array.isArray(product.variants) ? product.variants : []).map((variant, index) => ({
      id: normalizeText(variant.id) || `${id}:variant-${index + 1}`,
      code: normalizeCode(variant.label),
      sourcePrintedPage: safePage(variant.printedPage),
      status: "source-derived"
    }));
    variantCount += variants.length;

    const runtimeProduct = {
      id,
      slug: normalizeText(product.slug),
      code,
      name: cleanDisplayName(product.name, code, family.label),
      division: normalizeText(product.division),
      family: normalizeText(product.family),
      familyLabel: normalizeText(family.label),
      aliases: safeAliases([
        code,
        cleanDisplayName(product.name, code, family.label),
        ...(Array.isArray(product.aliases) ? product.aliases : [])
      ]),
      variants,
      sourceFile: normalizeText(product.sourceFile),
      sourcePdfPage: safePage(product.sourcePdfPage),
      sourcePrintedPage: safePage(product.sourcePrintedPage),
      imageSprite: {
        row: product.imageSprite.row,
        column: product.imageSprite.column
      },
      status: "source-derived",
      technicalStatus: "pending-verification"
    };

    const flags = auditProduct(product, runtimeProduct);
    if (flags.length) reviewQueue.push({ id, code, name: runtimeProduct.name, flags });
    return runtimeProduct;
  });

  assertEqual(products.length, expectedCounts.products, "Runtime product count");
  assertEqual(variantCount, expectedCounts.variants, "Runtime variant count");
  assertEqual(seenSprites.size, expectedCounts.images, "Unique sprite assignment count");

  const divisions = source.divisions.map(division => ({
    slug: normalizeText(division.slug),
    label: normalizeText(division.label),
    index: normalizeText(division.index),
    familySlugs: Array.isArray(division.familySlugs) ? division.familySlugs.map(normalizeText) : [],
    productCount: Number(division.productCount),
    variantCount: Number(division.variantCount),
    status: "source-derived"
  }));

  const families = source.families.map(family => ({
    slug: normalizeText(family.slug),
    division: normalizeText(family.division),
    label: normalizeText(family.label),
    index: normalizeText(family.index),
    aliases: Array.isArray(family.aliases) ? family.aliases.map(normalizeText).filter(Boolean) : [],
    order: Number(family.order),
    productCount: Number(family.productCount),
    variantCount: Number(family.variantCount),
    status: "source-derived"
  }));

  const runtime = {
    generatedAt: normalizeText(source.generatedAt),
    source: "FineMed supplied catalogue bundle; identity fields only",
    publicationStatus: "source-derived",
    technicalStatus: "pending-verification",
    counts: { ...expectedCounts },
    assetManifest: {
      path: "/catalogue/catalogue-sheet.avif",
      columns: assetManifest.columns,
      rows: assetManifest.rows,
      cellSize: assetManifest.cellSize,
      width: assetManifest.width,
      height: assetManifest.height,
      format: "avif"
    },
    divisions,
    families,
    products
  };

  const audit = {
    generatedAt: runtime.generatedAt,
    sourceStatus: "source-derived",
    technicalStatus: "pending-verification",
    counts: {
      ...expectedCounts,
      reviewQueue: reviewQueue.length,
      duplicateCodes: duplicateCodes.length,
      duplicateSprites: duplicateSprites.length
    },
    duplicateCodes,
    duplicateSprites,
    reviewQueue
  };

  if (duplicateCodes.length || duplicateSprites.length) {
    throw new Error("Catalogue contains duplicate product codes or sprite assignments.");
  }

  return { runtime, audit };
}

export function extractBundle(zipBytes) {
  const entries = unzipSync(new Uint8Array(zipBytes));
  const compressedCatalogue = entries["catalogue.generated.json.br"];
  const sprite = entries["catalogue-sheet.avif"];
  if (!compressedCatalogue || !sprite) {
    throw new Error("FineMed bundle must contain catalogue.generated.json.br and catalogue-sheet.avif.");
  }
  const json = brotliDecompressSync(compressedCatalogue);
  return { source: JSON.parse(textDecoder.decode(json)), sprite: Buffer.from(sprite) };
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, filePath);
}

export async function importFineMedCatalogue({
  inputPath,
  workingPath,
  runtimePath,
  auditPath,
  spritePath,
  manifestPath
}) {
  const bundle = await readFile(inputPath);
  const { source, sprite } = extractBundle(bundle);
  const metadata = await sharp(sprite).metadata();
  assertEqual(metadata.width, source.assetManifest.width, "Decoded sprite width");
  assertEqual(metadata.height, source.assetManifest.height, "Decoded sprite height");
  if (metadata.format !== "heif") {
    throw new Error(`Expected an AVIF/HEIF sprite; received ${metadata.format ?? "unknown"}.`);
  }

  const { runtime, audit } = buildRuntimeCatalogue(source);
  await Promise.all([
    writeJson(workingPath, source),
    writeJson(runtimePath, runtime),
    writeJson(auditPath, audit),
    writeJson(manifestPath, {
      generatedAt: runtime.generatedAt,
      source: runtime.source,
      publicationStatus: runtime.publicationStatus,
      technicalStatus: runtime.technicalStatus,
      counts: runtime.counts,
      sprite: runtime.assetManifest
    }),
    mkdir(path.dirname(spritePath), { recursive: true }).then(() => writeFile(spritePath, sprite))
  ]);

  return { runtime, audit };
}

async function main() {
  const root = process.cwd();
  const inputPath = path.resolve(
    process.argv[2] ?? "sources(previousAI)/fine-med-catalogue.bundle (1).zip"
  );
  const outputs = {
    inputPath,
    workingPath: path.join(root, "data/working/finemed/catalogue.source-derived.json"),
    runtimePath: path.join(root, "src/data/catalogue.runtime.generated.json"),
    auditPath: path.join(root, "data/working/finemed/catalogue-audit.generated.json"),
    spritePath: path.join(root, "public/catalogue/catalogue-sheet.avif"),
    manifestPath: path.join(root, "public/catalogue/manifest.json")
  };
  const { runtime, audit } = await importFineMedCatalogue(outputs);
  console.log(JSON.stringify({
    counts: runtime.counts,
    reviewQueue: audit.counts.reviewQueue,
    status: runtime.publicationStatus
  }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
