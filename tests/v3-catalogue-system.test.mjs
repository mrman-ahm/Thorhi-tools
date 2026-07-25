import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/app/layout.tsx", "utf8");
const catalogueUi = readFileSync("src/components/catalogue-ui.tsx", "utf8");
const searchCommand = readFileSync("src/components/search-command.tsx", "utf8");
const productsPage = readFileSync("src/app/products/page.tsx", "utf8");
const divisionPage = readFileSync("src/app/products/[division]/page.tsx", "utf8");
const familyPage = readFileSync("src/app/products/[division]/[family]/page.tsx", "utf8");
const productPage = readFileSync("src/app/products/[division]/[family]/[product]/page.tsx", "utf8");
const searchPage = readFileSync("src/app/search/page.tsx", "utf8");
const styles = readFileSync("src/app/v3-catalogue-system.css", "utf8");

test("V3 catalogue layer loads after homepage visual layers", () => {
  const chapters = layout.indexOf('import "./v3-home-chapters.css"');
  const catalogue = layout.indexOf('import "./v3-catalogue-system.css"');
  assert.ok(chapters >= 0);
  assert.ok(catalogue > chapters);
});

test("catalogue routes preserve direct search and manual recovery", () => {
  assert.match(productsPage, /action="\/search"/);
  assert.match(productsPage, /\/inquiry\?manual=1/);
  assert.match(divisionPage, /action="\/search"/);
  assert.match(divisionPage, /manual=1&division=/);
  assert.match(familyPage, /name="q"/);
  assert.match(familyPage, /name="sort"/);
  assert.match(familyPage, /manual=1&division=/);
});

test("product route keeps verification, inquiry, documents, and related objects", () => {
  assert.match(productPage, /verifiedSpecifications/);
  assert.match(productPage, /<ProductInquiryControls product=\{product\} \/>/);
  assert.match(productPage, /<DocumentList documents=\{product\.documents\} \/>/);
  assert.match(productPage, /getRelatedProducts/);
  assert.match(productPage, /manual=1&reference=/);
});

test("quantity control supports typing and accessible increment and decrement buttons", () => {
  assert.match(catalogueUi, /catalogue-quantity-control/);
  assert.match(catalogueUi, /aria-label=\{`Decrease quantity for \$\{product\.name\}`\}/);
  assert.match(catalogueUi, /aria-label=\{`Increase quantity for \$\{product\.name\}`\}/);
  assert.match(catalogueUi, /type="number"/);
  assert.match(catalogueUi, /inputMode="numeric"/);
  assert.match(catalogueUi, /min="1"/);
  assert.match(catalogueUi, /max="9999"/);
  assert.match(catalogueUi, /disabled=\{quantity <= 1\}/);
  assert.match(catalogueUi, /disabled=\{quantity >= 9999\}/);
});

test("search command preserves keyboard navigation and focus restoration", () => {
  assert.match(searchCommand, /event\.key === "ArrowDown"/);
  assert.match(searchCommand, /event\.key === "ArrowUp"/);
  assert.match(searchCommand, /event\.key === "Enter"/);
  assert.match(searchCommand, /event\.key === "Escape"/);
  assert.match(searchCommand, /previousFocus\.current/);
  assert.match(searchCommand, /aria-activedescendant/);
  assert.match(searchCommand, /role="listbox"/);
  assert.match(searchCommand, /role="option"/);
});

test("full search retains ranking context, filters, and manual fallback", () => {
  assert.match(searchPage, /searchProducts\(q, \{ division, family \}\)/);
  assert.match(searchPage, /result\.reason/);
  assert.match(searchPage, /result\.score/);
  assert.match(searchPage, /name="division"/);
  assert.match(searchPage, /name="family"/);
  assert.match(searchPage, /name="sort"/);
  assert.match(searchPage, /manual=1&reference=/);
});

test("V3 catalogue styling provides optical, clinical, responsive, and preference fallbacks", () => {
  assert.match(styles, /\.catalogue-command,/);
  assert.match(styles, /\.catalogue-object-card\{/);
  assert.match(styles, /\.product-examination-stage\{/);
  assert.match(styles, /\.search-command-dialog\{/);
  assert.match(styles, /\.catalogue-quantity-control\{/);
  assert.match(styles, /@media \(max-width:960px\)/);
  assert.match(styles, /@media \(max-width:720px\)/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /prefers-reduced-transparency:reduce/);
});

test("catalogue system does not introduce checkout, price, globe, or WebGL behavior", () => {
  const combined = `${catalogueUi}\n${productsPage}\n${divisionPage}\n${familyPage}\n${productPage}\n${searchPage}\n${styles}`;
  assert.doesNotMatch(combined, /checkout|add to cart|price\s*[:=]|WebGL|WebGPU|3D globe|three\.js/i);
});
