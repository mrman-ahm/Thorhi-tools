import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const discovery = await readFile(new URL("../src/components/discovery-experience.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("homepage keeps the four confirmed divisions and routes", () => {
  assert.match(page, /<DiscoveryExperience\s*\/>/);
  for (const [name, slug] of [["Surgical", "surgical"], ["Dental", "dental"], ["Veterinary", "veterinary"], ["Beauty", "beauty"]]) {
    assert.match(discovery, new RegExp(`name: "${name}"`));
    assert.match(discovery, new RegExp(`slug: "${slug}"`));
    assert.match(discovery, new RegExp(`/products/\\$\\{division\\.slug\\}`));
  }
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
