import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, client, styles, promotion] = await Promise.all([
  readFile(new URL("../src/app/rebuild/review/catalogue/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/rebuild/review/catalogue/review-client.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/rebuild/review/catalogue/review.module.css", import.meta.url), "utf8"),
  readFile(new URL("../scripts/promote-approved-catalogue.mjs", import.meta.url), "utf8"),
]);

test("keeps the catalogue review route private by default", () => {
  assert.match(page, /robots:\s*\{\s*index:\s*false/);
  assert.match(page, /nocache:\s*true/);
  assert.match(client, /not access-controlled/);
  assert.match(client, /Drafts stay in this browser/);
});

test("supports the complete local review and handoff workflow", () => {
  assert.match(client, /throhi-catalogue-review-v1/);
  assert.match(client, /Import JSON/);
  assert.match(client, /Export review/);
  assert.match(client, /confirmImage/);
  assert.match(client, /confirmVariants/);
  assert.match(client, /confirmSourceReference/);
  assert.match(client, /approvedName/);
  assert.match(client, /approvedCode/);
  assert.match(client, /approvedFamily/);
});

test("keeps technical fields outside the approval contract", () => {
  assert.doesNotMatch(client, /approvedDescription|approvedMaterial|approvedMeasurement/);
  assert.match(promotion, /unsupported field/);
  assert.match(promotion, /technicalStatus:\s*"withheld-pending-verification"/);
});

test("includes responsive and reduced-motion review behavior", () => {
  assert.match(styles, /@media \(max-width: 780px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(client, /aria-live="polite"/);
});
