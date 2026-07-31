import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("rebuild exposes the regal type system and precision heritage tokens", async () => {
  const [layout, heritage] = await Promise.all([
    read("src/app/layout.tsx"),
    read("src/app/rebuild/precision-heritage.module.css"),
  ]);

  assert.match(layout, /Cormorant_Garamond/);
  assert.match(layout, /--font-regal/);
  assert.match(heritage, /--heritage-ivory/);
  assert.match(heritage, /--heritage-brass/);
  assert.match(heritage, /--heritage-body/);
  assert.match(heritage, /--heritage-header:\s*78px/);
  assert.match(heritage, /--heritage-header-mobile:\s*66px/);
  assert.match(heritage, /--heritage-shadow/);
});

test("full redesign is scoped to rebuild routes and replaces superseded layers", async () => {
  const shell = await read("src/app/rebuild/rebuild-shell.tsx");

  assert.match(shell, /precision-heritage\.module\.css/);
  assert.match(shell, /corporate-heritage\.module\.css/);
  assert.match(shell, /data-redesign-contract="precision-heritage-house-v1"/);
  assert.doesNotMatch(shell, /premium-convergence\.module\.css/);
  assert.doesNotMatch(shell, /visual-qa-refinements\.module\.css/);
});

test("shared navigation and footer use the heritage hierarchy", async () => {
  const [header, footer] = await Promise.all([
    read("src/components/rebuild/rebuild-header.module.css"),
    read("src/components/rebuild/rebuild-footer.module.css"),
  ]);

  assert.match(header, /var\(--heritage-header, 78px\)/);
  assert.match(header, /var\(--heritage-header-mobile, 66px\)/);
  assert.match(header, /var\(--font-regal\)/);
  assert.match(header, /full-screen|mobilePanel/);
  assert.match(footer, /var\(--font-regal\)/);
  assert.match(footer, /var\(--heritage-brass-light/);
  assert.match(footer, /manufacturer|identityLedger|Instrument archive/);
});
