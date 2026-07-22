import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("homepage keeps the four confirmed divisions and routes", () => {
  for (const [name, slug] of [["Surgical", "surgical"], ["Dental", "dental"], ["Veterinary", "veterinary"], ["Beauty", "beauty"]]) {
    assert.match(page, new RegExp(`name: "${name}"`));
    assert.match(page, new RegExp(`slug: "${slug}"`));
  }
});
test("homepage avoids ecommerce language", () => { for (const forbidden of ["checkout", "price", "in stock", "best seller"]) assert.doesNotMatch(page.toLowerCase(), new RegExp(forbidden)); });
test("accessibility foundations exist", () => { assert.match(page, /id="main"/); assert.match(css, /:focus-visible/); assert.match(css, /prefers-reduced-motion/); });
