import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const provider = readFileSync("src/components/inquiry-provider.tsx", "utf8");
const catalogueUi = readFileSync("src/components/catalogue-ui.tsx", "utf8");
const preview = readFileSync("src/components/catalogue-preview.tsx", "utf8");

test("catalogue product addition reports duplicates from current inquiry state", () => {
  assert.match(provider, /draft\.items\.some\(existing => existing\.code === code\)/);
  assert.match(provider, /current\.items\.some\(existing => existing\.code === code\)/);
  assert.doesNotMatch(provider, /let result: "added" \| "duplicate"/);
});

test("first product addition accepts configured quantity and note", () => {
  assert.match(provider, /export type InquiryProductInput/);
  assert.match(provider, /Partial<Pick<InquiryItem, "quantity" \| "note">>/);
  assert.match(provider, /quantity: normalizeQuantity\(item\.quantity\)/);
  assert.match(provider, /note: item\.note \?\? ""/);
  assert.match(catalogueUi, /addProduct\(\{[\s\S]*quantity,[\s\S]*note[\s\S]*\}\)/);
  assert.doesNotMatch(catalogueUi, /addProduct\([^;]+\);\s*updateItem\(product\.code/s);
});

test("stored inquiry data is normalized before hydration", () => {
  assert.match(provider, /function normalizeStoredItem/);
  assert.match(provider, /parsed\.items\.map\(normalizeStoredItem\)/);
  assert.match(provider, /normalizeQuantity\(item\.quantity\)/);
  assert.match(provider, /typeof item\.note === "string"/);
});

test("manual items do not create duplicate inquiry codes", () => {
  assert.match(provider, /current\.items\.some\(item => item\.code === manualCode\)/);
  assert.match(provider, /\? current\.items/);
});

test("quantity normalization handles missing invalid and bounded values", () => {
  assert.match(provider, /function normalizeQuantity/);
  assert.match(provider, /!Number\.isFinite\(value\)/);
  assert.match(provider, /Math\.max\(1, Math\.min\(9999, Math\.floor\(value\)\)\)/);
  assert.match(provider, /updates\.quantity === undefined \? item\.quantity : normalizeQuantity\(updates\.quantity\)/);
});

test("exact variants preserve their source catalogue description in the inquiry", () => {
  assert.match(catalogueUi, /function ExactVariantAction/);
  assert.match(catalogueUi, /code: variant\.label/);
  assert.match(catalogueUi, /note: variant\.value/);
  assert.match(catalogueUi, /productId: `\$\{product\.id\}:\$\{variant\.id\}`/);
});

test("clearing creates a fresh inquiry draft", () => {
  assert.match(provider, /setDraft\(\{ \.\.\.initialDraft, items: \[\] \}\)/);
});

test("homepage saved summary reads every inquiry item directly", () => {
  assert.match(preview, /const \{ items \} = useInquiry\(\)/);
  assert.match(preview, /items\.map\(item =>/);
  assert.doesNotMatch(preview, /products\.filter/);
});
