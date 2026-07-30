import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const componentFiles = [
  "src/app/rebuild/products/catalogue-filter-controls.tsx",
  "src/app/rebuild/products/catalogue-product-entry.tsx",
  "src/app/rebuild/products/catalogue-results-toolbar.tsx",
  "src/app/rebuild/products/catalogue-empty-state.tsx",
];

test("catalogue discovery uses focused presentation components", () => {
  for (const path of componentFiles) {
    assert.doesNotThrow(() => read(path), path);
  }

  const client = read("src/app/rebuild/products/catalogue-client.tsx");
  for (const component of [
    "CatalogueFilterControls",
    "CatalogueProductEntry",
    "CatalogueResultsToolbar",
    "CatalogueEmptyState",
  ]) {
    assert.match(client, new RegExp(component));
  }
});

test("catalogue redesign preserves core state and product routing", () => {
  const client = read("src/app/rebuild/products/catalogue-client.tsx");

  assert.match(client, /const PAGE_SIZE = 24/);
  assert.match(client, /scoreRebuildProduct/);
  assert.match(client, /useSearchParams/);
  assert.match(client, /divisionParam/);
  assert.match(client, /familyParam/);
  assert.match(client, /sortParam/);
  assert.match(client, /pageParam/);
  assert.match(client, /\/rebuild\/products\/\$\{product\.id\}\?from=/);
  assert.match(client, /addProduct/);
});

test("catalogue route exposes the precision ledger design boundaries", () => {
  const [page, client, css] = [
    read("src/app/rebuild/products/page.tsx"),
    read("src/app/rebuild/products/catalogue-client.tsx"),
    read("src/app/rebuild/products/catalogue.module.css"),
  ];

  assert.match(page, /data-catalogue-masthead/);
  assert.match(client, /data-catalogue-search/);
  assert.match(client, /data-catalogue-ledger/);
  assert.match(css, /\.catalogueMasthead/);
  assert.match(css, /\.catalogueLedger/);
  assert.match(css, /\.productEntry/);
  assert.match(css, /\.mobileFilters/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("catalogue design does not introduce ecommerce or unsupported divisions", () => {
  const source = [
    read("src/app/rebuild/products/page.tsx"),
    read("src/app/rebuild/products/catalogue-client.tsx"),
    ...componentFiles.map(read),
  ].join("\n");

  assert.doesNotMatch(source, /checkout|add to cart|buy now|price|wishlist/i);
  assert.doesNotMatch(source, /value="veterinary"|value="beauty"/i);
});
