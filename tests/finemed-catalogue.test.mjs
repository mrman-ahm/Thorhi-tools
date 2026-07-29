import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";
import {
  buildRuntimeCatalogue,
  expectedCounts,
  extractBundle
} from "../scripts/import-finemed-catalogue.mjs";

const bundle = await readFile(new URL(
  "../sources(previousAI)/fine-med-catalogue.bundle (1).zip",
  import.meta.url
));
const { source, sprite } = extractBundle(bundle);
const { runtime, audit } = buildRuntimeCatalogue(source);

test("imports the supplied FineMed bundle without silent catalogue loss", () => {
  assert.deepEqual(runtime.counts, expectedCounts);
  assert.equal(runtime.products.length, 626);
  assert.equal(runtime.families.length, 53);
  assert.equal(runtime.products.reduce((sum, product) => sum + product.variants.length, 0), 1434);
  assert.ok(sprite.byteLength > 200_000);
});

test("keeps all imported records behind the source-derived truth boundary", () => {
  assert.equal(runtime.publicationStatus, "source-derived");
  assert.equal(runtime.technicalStatus, "pending-verification");
  assert.ok(runtime.products.every(product => product.status === "source-derived"));
  assert.ok(runtime.products.every(product => product.technicalStatus === "pending-verification"));
  assert.ok(runtime.products.every(product => !("description" in product)));
  assert.ok(runtime.products.every(product => !("sourceName" in product)));
  assert.ok(runtime.products.every(product => product.variants.every(variant => !("value" in variant))));
  assert.ok(runtime.products.every(product =>
    !/\b(?:stainless|steel|matte finish)\b|\d+(?:\.\d+)?\s*(?:mm|cm|inch(?:es)?|°|")/i.test(product.name)
  ));
});

test("validates every sprite coordinate and preserves representative products", () => {
  const spriteKeys = new Set();
  for (const product of runtime.products) {
    assert.ok(product.imageSprite.row >= 0 && product.imageSprite.row < runtime.assetManifest.rows);
    assert.ok(product.imageSprite.column >= 0 && product.imageSprite.column < runtime.assetManifest.columns);
    spriteKeys.add(`${product.imageSprite.row}:${product.imageSprite.column}`);
  }
  assert.equal(spriteKeys.size, 626);
  assert.equal(runtime.products.find(product => product.code === "04-0101")?.variants.length, 12);
  assert.equal(runtime.products.find(product => product.code === "SP-84")?.division, "dental");
});

test("produces a deterministic review queue for suspicious OCR-derived names", () => {
  assert.equal(audit.counts.duplicateCodes, 0);
  assert.equal(audit.counts.duplicateSprites, 0);
  assert.ok(audit.counts.reviewQueue > 0);
  assert.ok(audit.reviewQueue.some(entry => entry.code === "SP-84"));
});

test("generates identical runtime and audit payloads from the same source", () => {
  assert.deepEqual(buildRuntimeCatalogue(source), { runtime, audit });
});

test("uses decodable production media with the expected dimensions", async () => {
  const spriteMetadata = await sharp(sprite).metadata();
  const logo = await readFile(new URL("../public/brand/throhi-logo-temporary.webp", import.meta.url));
  const logoMetadata = await sharp(logo).metadata();

  assert.equal(spriteMetadata.width, 4992);
  assert.equal(spriteMetadata.height, 4800);
  assert.equal(logoMetadata.width, 1086);
  assert.equal(logoMetadata.height, 816);
  assert.equal(logoMetadata.hasAlpha, true);
});
