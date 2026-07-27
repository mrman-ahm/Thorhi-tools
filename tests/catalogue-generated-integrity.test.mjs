import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const catalogue = JSON.parse(readFileSync("src/data/catalogue.generated.json", "utf8"));
const searchIndex = JSON.parse(readFileSync("src/data/catalogue-search.generated.json", "utf8"));
const manifest = JSON.parse(readFileSync("public/catalogue/manifest.json", "utf8"));
const sprite = statSync("public/catalogue/catalogue-sheet.avif");

const expected = {
  divisions: 2,
  families: 53,
  products: 626,
  variants: 1434,
  images: 626
};

function unique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
}

test("generated FineMed inventory matches the complete supplied catalogue", () => {
  assert.deepEqual(catalogue.counts, expected);
  assert.deepEqual(manifest.counts, expected);
  assert.equal(catalogue.divisions.length, expected.divisions);
  assert.equal(catalogue.families.length, expected.families);
  assert.equal(catalogue.products.length, expected.products);
  assert.equal(searchIndex.length, expected.products);
  assert.equal(catalogue.products.reduce((sum, product) => sum + product.variants.length, 0), expected.variants);
});

test("every representative object has a unique route identity and usable image cell", () => {
  unique(catalogue.products.map(product => product.id), "Product IDs");
  unique(catalogue.products.map(product => `${product.division}/${product.family}/${product.slug}`), "Product routes");
  unique(catalogue.products.map(product => product.code), "Representative codes");

  for (const product of catalogue.products) {
    assert.equal(product.imageState, "available", `${product.code} must have an available representative image`);
    assert.equal(product.image, "/catalogue/catalogue-sheet.avif", `${product.code} must use the generated sprite`);
    assert.ok(product.imageSprite, `${product.code} must have sprite coordinates`);
    assert.ok(Number.isInteger(product.imageSprite.row) && product.imageSprite.row >= 0);
    assert.ok(Number.isInteger(product.imageSprite.column) && product.imageSprite.column >= 0);
    assert.ok(product.imageSprite.row < product.imageSprite.rows);
    assert.ok(product.imageSprite.column < product.imageSprite.columns);
    assert.ok(product.imageSprite.cellSize > 0);
    assert.ok(product.variants.length > 0, `${product.code} must retain at least one variant`);
  }
  assert.ok(sprite.size > 0, "Generated catalogue sprite must not be empty");
});

test("all 1,434 variants retain exact codes descriptions and source pages", () => {
  for (const product of catalogue.products) {
    for (const variant of product.variants) {
      assert.ok(typeof variant.label === "string" && variant.label.trim(), `${product.code} has a missing variant code`);
      assert.ok(typeof variant.value === "string" && variant.value.trim(), `${variant.label} has a missing source description`);
      assert.ok(Number.isInteger(variant.pdfPage) && variant.pdfPage > 0, `${variant.label} has an invalid PDF page`);
      assert.ok(typeof variant.sourceFile === "string" && variant.sourceFile.trim(), `${variant.label} has no source file`);
    }
  }
});

test("family and division aggregates reconcile with product and variant records", () => {
  for (const family of catalogue.families) {
    const products = catalogue.products.filter(product => product.division === family.division && product.family === family.slug);
    assert.equal(products.length, family.productCount, `${family.division}/${family.slug} product count mismatch`);
    assert.equal(products.reduce((sum, product) => sum + product.variants.length, 0), family.variantCount, `${family.division}/${family.slug} variant count mismatch`);
  }

  for (const division of catalogue.divisions) {
    const products = catalogue.products.filter(product => product.division === division.slug);
    assert.equal(products.length, division.productCount, `${division.slug} product count mismatch`);
    assert.equal(products.reduce((sum, product) => sum + product.variants.length, 0), division.variantCount, `${division.slug} variant count mismatch`);
  }
});

test("search index retains every exact variant code and source description", () => {
  const byId = new Map(searchIndex.map(record => [record.id, record]));
  for (const product of catalogue.products) {
    const record = byId.get(product.id);
    assert.ok(record, `Missing search record for ${product.code}`);
    assert.deepEqual(record.variantCodes, product.variants.map(variant => variant.label));
    assert.deepEqual(record.variantDescriptions, product.variants.map(variant => variant.value));
  }
});
