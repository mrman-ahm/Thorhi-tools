import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("rebuild exposes a regal display face and premium shared tokens", async () => {
  const [layout, shell] = await Promise.all([
    read("src/app/layout.tsx"),
    read("src/app/rebuild/surgical-precision-shell.module.css"),
  ]);

  assert.match(layout, /Cormorant_Garamond/);
  assert.match(layout, /--font-regal/);
  assert.match(shell, /--throhi-ivory-50/);
  assert.match(shell, /--throhi-brass-500/);
  assert.match(shell, /--throhi-body-size/);
  assert.match(shell, /--throhi-control-size/);
  assert.match(shell, /--throhi-shadow-premium/);
});

test("premium convergence is scoped to rebuild routes and preserves readable controls", async () => {
  const [component, styles] = await Promise.all([
    read("src/app/rebuild/rebuild-shell.tsx"),
    read("src/app/rebuild/premium-convergence.module.css"),
  ]);

  assert.match(component, /premiumStyles\.root/);
  assert.match(component, /premium-visual-convergence-v1/);
  assert.match(styles, /var\(--font-regal\)/);
  assert.match(styles, /\[data-home-hero\]/);
  assert.match(styles, /\[data-catalogue-masthead\]/);
  assert.match(styles, /\[data-product-examination\]/);
  assert.match(styles, /\[data-inquiry-masthead\]/);
  assert.match(styles, /\[data-corporate-hero\]/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /animation-delay:\s*calc\(/);
});

test("shared navigation and footer use the premium hierarchy", async () => {
  const [header, footer] = await Promise.all([
    read("src/components/rebuild/rebuild-header.module.css"),
    read("src/components/rebuild/rebuild-footer.module.css"),
  ]);

  assert.match(header, /height:\s*80px/);
  assert.match(header, /font-size:\s*0\.875rem/);
  assert.match(header, /inset:\s*80px 0 auto/);
  assert.match(header, /@media \(max-width: 980px\)[\s\S]*height:\s*66px/);
  assert.match(footer, /var\(--font-regal\)/);
  assert.match(footer, /var\(--throhi-brass-300/);
  assert.match(footer, /font-size:\s*1\.125rem/);
});
