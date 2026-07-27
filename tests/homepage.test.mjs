import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const discovery = await readFile(new URL("../src/components/discovery-experience.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("homepage exposes the two supplied catalogue divisions and canonical routes", () => {
  assert.match(page, /<DiscoveryExperience\s*\/>/);
  assert.match(discovery, /divisions as catalogueDivisions/);
  assert.match(discovery, /catalogueDivisions\.map/);
  assert.match(discovery, /surgical:\s*\{/);
  assert.match(discovery, /dental:\s*\{/);
  assert.match(discovery, /Two catalogues/);
  assert.match(discovery, /href=\{`\/products\/\$\{division\.slug\}`\}/);
  assert.doesNotMatch(discovery, /\b(?:veterinary|beauty):\s*\{/);
});

test("homepage avoids ecommerce language", () => {
  for (const forbidden of ["checkout", "price", "in stock", "best seller"]) {
    assert.doesNotMatch(`${page}\n${discovery}`.toLowerCase(), new RegExp(forbidden));
  }
});

test("accessibility foundations exist", () => {
  assert.match(page, /id="main"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});
