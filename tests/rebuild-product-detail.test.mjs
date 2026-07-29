import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("product detail preserves catalogue return context and related-family routes", async () => {
  const [catalogue, detail] = await Promise.all([
    read("src/app/rebuild/products/catalogue-client.tsx"),
    read("src/app/rebuild/products/[productId]/page.tsx"),
  ]);

  assert.match(catalogue, /from=\$\{encodeURIComponent\(currentLocation\)\}/);
  assert.match(detail, /safeReturnPath/);
  assert.match(detail, /Back to catalogue/);
  assert.match(detail, /candidate\.family === product\.family/);
  assert.match(detail, /Continue comparing/);
});

test("product detail keeps base and variant inquiry identities explicit", async () => {
  const [detail, actions] = await Promise.all([
    read("src/app/rebuild/products/[productId]/page.tsx"),
    read("src/app/rebuild/products/[productId]/product-actions.tsx"),
  ]);

  assert.match(detail, /Catalogue variant codes/);
  assert.match(detail, /variant\.sourcePrintedPage/);
  assert.match(actions, /variantId: variant\?\.id/);
  assert.match(actions, /variantLabel: variant\?\.code/);
  assert.match(actions, /existing\.quantity/);
  assert.match(actions, /aria-live="polite"/);
});

test("product detail uses blue contrast and reduced-motion-safe refinement", async () => {
  const styles = await read(
    "src/app/rebuild/products/[productId]/product-detail.module.css"
  );

  assert.match(styles, /--blue: #0d3b5a/);
  assert.match(styles, /--blue-light: #e4eef4/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /#000(?:000)?\b|background:\s*black/);
});
