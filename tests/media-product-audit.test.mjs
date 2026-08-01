import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildProductMediaInventory } from "../scripts/media/audit-product-media.mjs";

function fixture() {
  return {
    runtime: {
      products: [
        {
          id: "surgical-scissors-aa-1",
          code: "AA-1",
          name: "Operating Scissors",
          division: "surgical",
          family: "scissors",
          familyLabel: "Scissors",
          variants: [{ id: "aa-1", code: "AA-1" }, { id: "aa-2", code: "AA-2" }],
          sourceFile: "Scissors Catalog(1).pdf",
          sourcePdfPage: 3,
          sourcePrintedPage: 2,
        },
        {
          id: "dental-cutters-bb-1",
          code: "BB-1",
          name: "Ligature Cutter",
          division: "dental",
          family: "ligature-and-wire-cutters",
          familyLabel: "Ligature & Wire Cutters",
          variants: [{ id: "bb-1", code: "BB-1" }],
          sourceFile: "Cutters Catalog(1).pdf",
          sourcePdfPage: 4,
          sourcePrintedPage: 3,
        },
      ],
    },
    media: {
      products: {
        "surgical-scissors-aa-1": {
          path: "/catalogue/products/surgical-scissors-aa-1.avif",
          width: 1200,
          height: 700,
          bytes: 12000,
          format: "avif",
        },
        "dental-cutters-bb-1": {
          path: "/catalogue/products/dental-cutters-bb-1.avif",
          width: 1200,
          height: 400,
          bytes: 10000,
          format: "avif",
        },
      },
    },
    decisions: { schemaVersion: 1, updatedAt: null, decisions: [] },
  };
}

test("product media inventory preserves identity and derives measurable review flags", async () => {
  const inventory = await buildProductMediaInventory({
    ...fixture(),
    generatedAt: "2026-08-01T00:00:00.000Z",
  });
  assert.equal(inventory.schemaVersion, 1);
  assert.equal(inventory.products.length, 2);
  assert.equal(inventory.summary.runtimeProducts, 2);
  assert.equal(inventory.summary.mediaRecords, 2);
  assert.equal(inventory.summary.variantCodes, 3);
  assert.equal(inventory.summary.missingMedia, 0);
  assert.equal(inventory.summary.duplicatePaths, 0);
  const scissors = inventory.products.find((product) => product.productId === "surgical-scissors-aa-1");
  assert.deepEqual(scissors.variantCodes, ["AA-1", "AA-2"]);
  assert.equal(scissors.sourceType, "repository-source-derived");
  assert.equal(scissors.licenseStatus, "client-owned");
  assert.equal(scissors.identityConfidence, "unapproved");
  assert.equal(scissors.silhouetteStatus, "needs-review");
  assert.equal(scissors.reviewState, "discovered");
  assert.deepEqual(scissors.qualityFlags, []);
  const cutter = inventory.products.find((product) => product.productId === "dental-cutters-bb-1");
  assert.deepEqual(cutter.qualityFlags, ["small-source"]);
});

test("manual decisions cannot mutate stable product identity", async () => {
  const input = fixture();
  input.decisions.decisions.push({
    productId: "surgical-scissors-aa-1",
    productName: "Wrong replacement",
  });
  await assert.rejects(() => buildProductMediaInventory(input), /may not override productName/);
});

test("public-file verification reports missing assets only when a public root is supplied", async () => {
  const input = fixture();
  const publicRoot = await mkdtemp(path.join(os.tmpdir(), "throhi-media-"));
  await mkdir(path.join(publicRoot, "catalogue/products"), { recursive: true });
  await writeFile(path.join(publicRoot, "catalogue/products/surgical-scissors-aa-1.avif"), "fixture");
  const inventory = await buildProductMediaInventory({ ...input, publicRoot });
  assert.equal(inventory.summary.missingPublicFiles, 1);
  const missing = inventory.products.find((product) => product.productId === "dental-cutters-bb-1");
  assert.ok(missing.qualityFlags.includes("missing-public-file"));
});

test("repository inventory reconciles all 626 products", async () => {
  const [runtime, media] = await Promise.all([
    readFile("src/data/catalogue.runtime.generated.json", "utf8").then(JSON.parse),
    readFile("src/data/catalogue.media.generated.json", "utf8").then(JSON.parse),
  ]);
  const inventory = await buildProductMediaInventory({
    runtime,
    media,
    decisions: { schemaVersion: 1, updatedAt: null, decisions: [] },
  });
  assert.equal(inventory.products.length, 626);
  assert.equal(new Set(inventory.products.map((product) => product.productId)).size, 626);
  assert.equal(inventory.summary.runtimeProducts, 626);
  assert.equal(inventory.summary.mediaRecords, 626);
  assert.equal(inventory.summary.variantCodes, 1434);
  assert.equal(inventory.summary.missingMedia, 0);
  assert.equal(inventory.summary.duplicatePaths, 0);
});
