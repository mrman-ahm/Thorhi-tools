import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const media = JSON.parse(
  await readFile(new URL("src/data/catalogue.media.generated.json", root), "utf8")
);
const catalogue = JSON.parse(
  await readFile(new URL("src/data/catalogue.runtime.generated.json", root), "utf8")
);

test("maps every runtime product to one optimized individual image", async () => {
  const records = Object.entries(media.products);

  assert.equal(media.count, 626);
  assert.equal(records.length, catalogue.products.length);
  assert.deepEqual(
    new Set(records.map(([productId]) => productId)),
    new Set(catalogue.products.map((product) => product.id))
  );
  assert.ok(records.every(([, image]) => image.format === "avif"));
  assert.ok(records.every(([, image]) => image.path.startsWith("/catalogue/products/")));
  await Promise.all(
    records.map(([, image]) =>
      access(new URL(`public${image.path}`, root))
    )
  );
});

test("keeps the complete high-quality media set within a lean transfer budget", async () => {
  const records = Object.values(media.products);
  const measuredBytes = (
    await Promise.all(
      records.map((image) => stat(new URL(`public${image.path}`, root)))
    )
  ).reduce((total, file) => total + file.size, 0);

  assert.equal(measuredBytes, media.delivery.totalBytes);
  assert.ok(measuredBytes < 5_000_000);
  assert.ok(
    measuredBytes / records.length < 8_000,
    "average product image should remain below 8 KB"
  );
  assert.equal(media.delivery.fallback, "/catalogue/catalogue-sheet.avif");
});

test("preserves materially higher resolution for representative products", async () => {
  const expected = [
    ["dental-wire-bending-and-loop-forming-pliers-sp-84", 1200, 545],
    ["surgical-scissors-04-0101", 415, 170],
  ];

  for (const [productId, width, height] of expected) {
    const image = media.products[productId];
    const metadata = await sharp(
      fileURLToPath(new URL(`public${image.path}`, root))
    ).metadata();
    assert.equal(metadata.width, width);
    assert.equal(metadata.height, height);
    assert.ok(metadata.width > catalogue.assetManifest.cellSize);
  }
});

test("uses zero-runtime eager media only for first-viewport objects and lazy media elsewhere", async () => {
  const [component, catalogueClient, productPage] = await Promise.all([
    readFile(new URL("src/app/rebuild/products/catalogue-media.tsx", root), "utf8"),
    readFile(new URL("src/app/rebuild/products/catalogue-client.tsx", root), "utf8"),
    readFile(new URL("src/app/rebuild/products/[productId]/page.tsx", root), "utf8"),
  ]);

  assert.doesNotMatch(component, /"use client"|useState|next\/image/);
  assert.match(component, /loading=\{priority \? "eager" : "lazy"\}/);
  assert.match(component, /fetchPriority=\{priority \? "high" : "auto"\}/);
  assert.match(component, /CatalogueSprite/);
  assert.match(component, /\/catalogue\/products\/\$\{product\.id\}\.avif/);
  assert.doesNotMatch(catalogueClient, /priority/);
  assert.match(productPage, /priority/);
});
