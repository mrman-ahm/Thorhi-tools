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
const facets = readFileSync("src/lib/catalogue-facets.ts", "utf8");
const styles = readFileSync("src/app/v3-catalogue-system.css", "utf8");
const dataStyles = readFileSync("src/app/v3-catalogue-data.css", "utf8");

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

test("product route keeps verification, inquiry, documents, variants, and related objects", () => {
  assert.match(productPage, /verifiedSpecifications/);
  assert.match(productPage, /<ProductInquiryControls product=\{product\} \/>/);
  assert.match(productPage, /<ProductVariantTable product=\{product\} \/>/);
  assert.match(productPage, /<DocumentList documents=\{product\.documents\} \/>/);
  assert.match(productPage, /getRelatedProducts/);
  assert.match(productPage, /manual=1&reference=/);
});

test("quantity control persists configured data on the first addition", () => {
  assert.match(catalogueUi, /catalogue-quantity-control/);
  assert.match(catalogueUi, /aria-label=\{`Decrease quantity for \$\{product\.name\}`\}/);
  assert.match(catalogueUi, /aria-label=\{`Increase quantity for \$\{product\.name\}`\}/);
  assert.match(catalogueUi, /type="number"/);
  assert.match(catalogueUi, /inputMode="numeric"/);
  assert.match(catalogueUi, /min="1"/);
  assert.match(catalogueUi, /max="9999"/);
  assert.match(catalogueUi, /disabled=\{quantity <= 1\}/);
  assert.match(catalogueUi, /disabled=\{quantity >= 9999\}/);
  assert.match(catalogueUi, /addProduct\(\{[\s\S]*quantity,[\s\S]*note[\s\S]*\}\)/);
  assert.match(catalogueUi, /if \(existing\) \{[\s\S]*updateItem/);
});

test("every exact catalogue variant can enter the inquiry with source wording", () => {
  assert.match(catalogueUi, /function ExactVariantAction/);
  assert.match(catalogueUi, /code: variant\.label/);
  assert.match(catalogueUi, /name: variantName/);
  assert.match(catalogueUi, /note: variant\.value/);
  assert.match(catalogueUi, /Add exact variant/);
  assert.match(catalogueUi, /<th scope="col">Inquiry<\/th>/);
  assert.match(catalogueUi, /<ExactVariantAction product=\{product\} variant=\{variant\} \/>/);
});

test("search command preserves keyboard navigation, naming, and focus restoration", () => {
  assert.match(searchCommand, /event\.key === "ArrowDown"/);
  assert.match(searchCommand, /event\.key === "ArrowUp"/);
  assert.match(searchCommand, /event\.key === "Enter"/);
  assert.match(searchCommand, /event\.key === "Escape"/);
  assert.match(searchCommand, /previousFocus\.current/);
  assert.match(searchCommand, /aria-label="Search catalogue by name, family, or product code"/);
  assert.match(searchCommand, /aria-autocomplete="list"/);
  assert.match(searchCommand, /aria-activedescendant/);
  assert.match(searchCommand, /role="listbox"/);
  assert.match(searchCommand, /role="option"/);
  assert.match(searchCommand, /<kbd aria-hidden="true">/);
});

test("shared catalogue facets cover source descriptions, codes, materials, and finishes", () => {
  assert.match(facets, /export const cataloguePageSize = 36/);
  assert.match(facets, /export const materialFilters/);
  assert.match(facets, /export const finishFilters/);
  assert.match(facets, /product\.variants\.flatMap\(variant => \[variant\.label, variant\.value\]\)/);
  assert.match(facets, /product\.specifications\.flatMap/);
  assert.match(facets, /productContainsFacet/);
  assert.match(facets, /clampPage/);
});

test("full search uses shared material and finish facets with preserved pagination", () => {
  assert.match(searchPage, /from "@\/lib\/catalogue-facets"/);
  assert.match(searchPage, /searchProducts\(q, \{ division, family \}\)/);
  assert.match(searchPage, /productContainsFacet\(result\.product, material\)/);
  assert.match(searchPage, /productContainsFacet\(result\.product, finish\)/);
  assert.match(searchPage, /name="material"/);
  assert.match(searchPage, /name="finish"/);
  assert.match(searchPage, /cataloguePageSize/);
  assert.match(searchPage, /totalPages/);
  assert.match(searchPage, /catalogue-pagination/);
  assert.match(searchPage, /rel="prev"/);
  assert.match(searchPage, /rel="next"/);
  assert.match(searchPage, /result\.reason/);
  assert.match(searchPage, /result\.score/);
  assert.match(searchPage, /manual=1&reference=/);
});

test("family routes support material finish sorting and pagination without client state", () => {
  assert.match(familyPage, /from "@\/lib\/catalogue-facets"/);
  assert.match(familyPage, /name="material"/);
  assert.match(familyPage, /name="finish"/);
  assert.match(familyPage, /value="variants">Most variants/);
  assert.match(familyPage, /cataloguePageSize/);
  assert.match(familyPage, /familyHref/);
  assert.match(familyPage, /rel="prev"/);
  assert.match(familyPage, /rel="next"/);
  assert.doesNotMatch(familyPage, /"use client"|useState|useEffect/);
});

test("V3 catalogue styling provides optical, clinical, variant-action, pagination, and preference fallbacks", () => {
  assert.match(styles, /\.catalogue-command,/);
  assert.match(styles, /\.catalogue-object-card\{/);
  assert.match(styles, /\.product-examination-stage\{/);
  assert.match(styles, /\.search-command-dialog\{/);
  assert.match(styles, /\.catalogue-quantity-control\{/);
  assert.match(dataStyles, /\.catalogue-variant-action\{/);
  assert.match(dataStyles, /min-height:44px/);
  assert.match(dataStyles, /\.catalogue-pagination\{/);
  assert.match(dataStyles, /aria-disabled="true"/);
  assert.match(dataStyles, /@media \(hover:none\)/);
  assert.match(dataStyles, /@media \(max-width:720px\)/);
  assert.match(styles, /@media \(max-width:960px\)/);
  assert.match(styles, /@media \(max-width:720px\)/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /prefers-reduced-transparency:reduce/);
});

test("catalogue system does not introduce checkout, price, globe, or WebGL behavior", () => {
  const combined = `${catalogueUi}\n${productsPage}\n${divisionPage}\n${familyPage}\n${productPage}\n${searchPage}\n${facets}\n${styles}\n${dataStyles}`;
  assert.doesNotMatch(combined, /checkout|add to cart|price\s*[:=]|WebGL|WebGPU|3D globe|three\.js/i);
});
