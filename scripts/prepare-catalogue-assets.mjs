import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { brotliDecompressSync } from "node:zlib";
import { unzipSync } from "fflate";

const root = resolve(process.cwd());
const bundleDirectory = join(root, "assets", "catalogue");
const bundlePath = join(bundleDirectory, "fine-med-catalogue.bundle.b64");
const dataDirectory = join(root, "src", "data");
const publicDirectory = join(root, "public", "catalogue");
const cataloguePath = join(dataDirectory, "catalogue.generated.json");
const searchPath = join(dataDirectory, "catalogue-search.generated.json");
const manifestPath = join(publicDirectory, "manifest.json");
const spritePath = join(publicDirectory, "catalogue-sheet.avif");

function fail(message) {
  throw new Error(`FineMed catalogue preparation failed: ${message}`);
}

function readEncodedBundle() {
  const partNames = existsSync(bundleDirectory)
    ? readdirSync(bundleDirectory)
      .filter(name => /^fine-med-catalogue\.bundle\.part-\d+\.b64$/.test(name))
      .sort()
    : [];

  if (partNames.length > 0) {
    return partNames
      .map(name => readFileSync(join(bundleDirectory, name), "utf8").replace(/\s+/g, ""))
      .join("");
  }

  if (!existsSync(bundlePath)) fail(`missing bundle at ${bundlePath}`);
  return readFileSync(bundlePath, "utf8").replace(/\s+/g, "");
}

function buildSearchIndex(catalogue) {
  return catalogue.products.map(product => ({
    id: product.id,
    slug: product.slug,
    code: product.code,
    name: product.name,
    division: product.division,
    family: product.family,
    aliases: product.aliases,
    variantCodes: product.variants.map(variant => variant.label),
    variantDescriptions: product.variants.map(variant => variant.value)
  }));
}

export function prepareCatalogueAssets() {
  const encoded = readEncodedBundle();
  if (!encoded) fail("bundle is empty");

  let archive;
  try {
    archive = unzipSync(Buffer.from(encoded, "base64"));
  } catch (error) {
    fail(error instanceof Error ? `invalid base64 or ZIP archive (${error.message})` : "invalid bundle");
  }

  const sprite = archive["catalogue-sheet.avif"];
  const compressedCatalogue = archive["catalogue.generated.json.br"];
  if (!sprite?.length) fail("catalogue sprite is missing");
  if (!compressedCatalogue?.length) fail("catalogue payload is missing");

  let catalogue;
  try {
    const json = brotliDecompressSync(Buffer.from(compressedCatalogue)).toString("utf8");
    catalogue = JSON.parse(json);
  } catch (error) {
    fail(error instanceof Error ? `cannot decode catalogue payload (${error.message})` : "cannot decode catalogue payload");
  }

  const expected = { divisions: 2, families: 53, products: 626, variants: 1434, images: 626 };
  for (const [key, value] of Object.entries(expected)) {
    if (catalogue.counts?.[key] !== value) fail(`expected ${value} ${key}, received ${catalogue.counts?.[key] ?? "none"}`);
  }
  if (catalogue.products.some(product => !product.imageSprite || !product.variants?.length)) {
    fail("every catalogue object must have a sprite position and at least one documented variant");
  }

  const searchIndex = buildSearchIndex(catalogue);
  const manifest = {
    generatedAt: catalogue.generatedAt,
    source: catalogue.source,
    counts: catalogue.counts,
    sprite: catalogue.assetManifest,
    payload: "/catalogue/catalogue-sheet.avif"
  };

  mkdirSync(dataDirectory, { recursive: true });
  rmSync(publicDirectory, { recursive: true, force: true });
  mkdirSync(publicDirectory, { recursive: true });
  writeFileSync(cataloguePath, `${JSON.stringify(catalogue)}\n`);
  writeFileSync(searchPath, `${JSON.stringify(searchIndex)}\n`);
  writeFileSync(spritePath, sprite);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`Prepared ${catalogue.counts.products} catalogue objects, ${catalogue.counts.variants} variants, and ${catalogue.counts.images} representative images.`);
  return catalogue.counts;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  try {
    prepareCatalogueAssets();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
