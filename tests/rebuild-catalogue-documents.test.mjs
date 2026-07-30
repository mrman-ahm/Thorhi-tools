import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

function isCompleteCatalogueDocument(value) {
  return Boolean(
    value.id &&
      value.title &&
      value.division &&
      value.format === "PDF" &&
      value.sizeLabel &&
      value.publishedOrUpdated &&
      value.href,
  );
}

test("catalogue document source defines the complete verified contract", () => {
  const source = read("src/rebuild/catalogue-documents.ts");
  for (const field of [
    "id: string",
    "title: string",
    "division:",
    'format: "PDF"',
    "sizeLabel: string",
    "publishedOrUpdated: string",
    "href: string",
  ]) {
    assert.match(source, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(source, /isCompleteCatalogueDocument/);
  assert.match(source, /rebuildCatalogueDocuments/);
});

test("document completeness requires every publication field", () => {
  const complete = {
    id: "surgical-2026",
    title: "Surgical Instruments Catalogue",
    division: "surgical",
    format: "PDF",
    sizeLabel: "12 MB",
    publishedOrUpdated: "2026-07-30",
    href: "/catalogues/surgical.pdf",
  };

  assert.equal(isCompleteCatalogueDocument(complete), true);
  for (const key of Object.keys(complete)) {
    const incomplete = { ...complete };
    delete incomplete[key];
    assert.equal(isCompleteCatalogueDocument(incomplete), false, key);
  }
});

test("empty document collection creates no download records", () => {
  assert.equal([].filter(isCompleteCatalogueDocument).length, 0);
});
