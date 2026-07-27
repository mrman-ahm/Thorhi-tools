import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { brotliDecompressSync } from "node:zlib";
import { unzipSync } from "fflate";

const root = resolve(process.cwd());
const bundleDirectory = join(root, "assets", "catalogue");
const zipBundlePath = join(bundleDirectory, "fine-med-catalogue.bundle.zip");
const base64BundlePath = join(bundleDirectory, "fine-med-catalogue.bundle.b64");
const dataDirectory = join(root, "src", "data");
const publicDirectory = join(root, "public", "catalogue");
const cataloguePath = join(dataDirectory, "catalogue.generated.json");
const searchPath = join(dataDirectory, "catalogue-search.generated.json");
const manifestPath = join(publicDirectory, "manifest.json");
const spritePath = join(publicDirectory, "catalogue-sheet.avif");

function fail(message) {
  throw new Error(`FineMed catalogue preparation failed: ${message}`);
}

function readBundleArchive() {
  if (existsSync(zipBundlePath)) {
    const archive = readFileSync(zipBundlePath);
    if (!archive.length) fail(`bundle is empty at ${zipBundlePath}`);
    return archive;
  }

  const partNames = existsSync(bundleDirectory)
    ? readdirSync(bundleDirectory)
      .filter(name => /^fine-med-catalogue\.bundle\.part-\d+\.b64$/.test(name))
      .sort()
    : [];

  const encoded = partNames.length > 0
    ? partNames
      .map(name => readFileSync(join(bundleDirectory, name), "utf8").replace(/\s+/g, ""))
      .join("")
    : existsSync(base64BundlePath)
      ? readFileSync(base64BundlePath, "utf8").replace(/\s+/g, "")
      : "";

  if (!encoded) {
    fail(`missing bundle at ${zipBundlePath}`);
  }

  return Buffer.from(encoded, "base64");
}

function repairSplitVariant(catalogue, { targetCode, donorCode, description }) {
  const target = catalogue.products.find(product => product.code === targetCode);
  const donor = catalogue.products.find(product => product.code === donorCode);

  if (!target || !donor || target.variants?.length) return;

  const variantIndex = donor.variants?.findIndex(variant => variant.value === description) ?? -1;
  if (variantIndex < 0) {
    fail(`cannot repair ${targetCode}; matching source variant is missing`);
  }

  const [variant] = donor.variants.splice(variantIndex, 1);
  target.variants = [variant];
}

function normalizeCatalogue(catalogue) {
  if (!Array.isArray(catalogue?.products)) {
    fail("catalogue products are missing");
  }

  repairSplitVariant(catalogue, {
    targetCode: "06-1913",
    donorCode: "06-1909",
    description: "TC METZENBAUM ScissorsSTR cum BL/BL 18.0 cm"
  });
  repairSplitVariant(catalogue, {
    targetCode: "04-3102-2",
    donorCode: "04-3102",
    description: "Pane Scissors ANGLED 18.0cm"
  });
  repairSplitVariant(catalogue, {
    targetCode: "21-0104-2",
    donorCode: "21-0104",
    description: "ARAGAWA Rectal Speculum 60X12mm HJM PATT"
  });

  for (const product of catalogue.products) {
    product.catalogue = product.catalogue ?? product.catalog ?? "";
    delete product.catalog;

    if (product.legacyUrl == null) {
      delete product.legacyUrl;
    }
  }

  return catalogue;
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
  let archive;
  try {
    archive = unzipSync(readBundleArchive());
  } catch (error) {
    fail(error instanceof Error ? `invalid ZIP archive (${error.message})` : "invalid bundle");
  }

  const sprite = archive["catalogue-sheet.avif"];
  const compressedCatalogue = archive["catalogue.generated.json.br"];
  if (!sprite?.length) fail("catalogue sprite is missing");
  if (!compressedCatalogue?.length) fail("catalogue payload is missing");

  let catalogue;
  try {
    const json = brotliDecompressSync(Buffer.from(compressedCatalogue)).toString("utf8");
    catalogue = normalizeCatalogue(JSON.parse(json));
  } catch (error) {
    fail(error instanceof Error ? `cannot decode catalogue payload (${error.message})` : "cannot decode catalogue payload");
  }

  const expected = { divisions: 2, families: 53, products: 626, variants: 1434, images: 626 };
  for (const [key, value] of Object.entries(expected)) {
    if (catalogue.counts?.[key] !== value) {
      fail(`expected ${value} ${key}, received ${catalogue.counts?.[key] ?? "none"}`);
    }
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
