import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const provider = readFileSync("src/components/inquiry-provider.tsx", "utf8");
const preview = readFileSync("src/components/catalogue-preview.tsx", "utf8");

test("catalogue product addition reports duplicates from current inquiry state", () => {
  assert.match(provider, /if \(draft\.items\.some\(existing => existing\.code === item\.code\)\) return "duplicate"/);
  assert.match(provider, /current\.items\.some\(existing => existing\.code === item\.code\)/);
  assert.doesNotMatch(provider, /let result: "added" \| "duplicate"/);
});

test("manual items do not create duplicate inquiry codes", () => {
  assert.match(provider, /current\.items\.some\(item => item\.code === manualCode\)/);
  assert.match(provider, /\? current\.items/);
});

test("quantity normalization handles explicit values rather than truthiness", () => {
  assert.match(provider, /updates\.quantity === undefined/);
  assert.match(provider, /Math\.max\(1, Math\.min\(9999, Math\.floor\(updates\.quantity\)\)\)/);
  assert.doesNotMatch(provider, /quantity: updates\.quantity \?/);
});

test("clearing creates a fresh inquiry draft", () => {
  assert.match(provider, /setDraft\(\{ \.\.\.initialDraft, items: \[\] \}\)/);
});

test("homepage saved summary reads every inquiry item directly", () => {
  assert.match(preview, /const \{ items \} = useInquiry\(\)/);
  assert.match(preview, /items\.map\(item =>/);
  assert.doesNotMatch(preview, /products\.filter/);
});
