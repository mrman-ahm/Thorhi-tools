import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { validateCatalogueRegistry } from "../scripts/media/media-model.mjs";
import { verifyCatalogueSources } from "../scripts/media/register-catalogue-sources.mjs";

const expected = new Map([
  ["knives", ["Knives Catalog(1).pdf", 15, 4783754, "babb328d97f5dda7cf3903bc716828ddb2589c9cf64de522294973b099b49175"]],
  ["cutters", ["Cutters Catalog(1).pdf", 13, 8796374, "79c0051f5298dea217ea8d99c2feec3a683667e44143dabb920a1d21ba68a6df"]],
  ["scissors", ["Scissors Catalog(1).pdf", 11, 9886964, "d55e98a41ddab4c87b328b8b4750a5a06f904f86f123d7618497a5f4de067901"]],
  ["punches", ["Punches Catalog(1).pdf", 31, 15930907, "124db1af5b108bb1439b76750b23f7dd4aaa050cfe9f5d225bf49426ff0ff09f"]],
  ["chisels", ["Chisels Catalog(1).pdf", 21, 9477868, "52ed46c5e88008566e0ee5c65e87dc853bf6a928e05625f5d382724071c5b3a0"]],
]);

test("catalogue source registry preserves supplied PDF identity", async () => {
  const registry = JSON.parse(await readFile("data/media/catalogue-sources.json", "utf8"));
  assert.deepEqual(validateCatalogueRegistry(registry), []);
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.sources.length, 5);
  for (const source of registry.sources) {
    const expectedRecord = expected.get(source.id);
    assert.ok(expectedRecord, `unexpected source ${source.id}`);
    const [fileName, pageCount, byteSize, sha256] = expectedRecord;
    assert.equal(source.fileName, fileName);
    assert.equal(source.pageCount, pageCount);
    assert.equal(source.byteSize, byteSize);
    assert.equal(source.sha256, sha256);
    assert.equal(source.division, "surgical");
    assert.equal(source.pageWidthPt, 612);
    assert.equal(source.pageHeightPt, 858);
    assert.equal(source.licenseStatus, "client-owned");
  }
});

test("registry-only validation reports attachments without pretending they are mounted", async () => {
  const results = await verifyCatalogueSources({ rootDir: process.cwd() });
  assert.equal(results.length, 5);
  assert.ok(results.every((result) => result.status === "attached-not-mounted"));
  assert.ok(results.every((result) => result.verified === false));
});

test("mounted supplied PDFs match the recorded byte sizes and hashes", async (context) => {
  const sourceDirectory = process.env.THROHI_CATALOGUE_SOURCE_DIR;
  if (!sourceDirectory) {
    context.skip("THROHI_CATALOGUE_SOURCE_DIR is not mounted in this environment");
    return;
  }
  const results = await verifyCatalogueSources({ rootDir: process.cwd(), sourceDirectory });
  assert.equal(results.length, 5);
  assert.ok(results.every((result) => result.status === "mounted-verified"));
  assert.ok(results.every((result) => result.verified === true));
});
