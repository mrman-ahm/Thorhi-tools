import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("catalogue discovery state is URL-backed", async () => {
  const client = await read("src/app/rebuild/products/catalogue-client.tsx");

  assert.match(client, /usePathname, useRouter, useSearchParams/);
  assert.match(client, /params\.get\("q"\)/);
  assert.match(client, /params\.get\("division"\)/);
  assert.match(client, /params\.get\("family"\)/);
  assert.match(client, /params\.get\("sort"\)/);
  assert.match(client, /params\.get\("page"\)/);
  assert.match(client, /router\[mode\]/);
});

test("catalogue offers compact desktop and native mobile filtering", async () => {
  const [client, controls, styles] = await Promise.all([
    read("src/app/rebuild/products/catalogue-client.tsx"),
    read("src/app/rebuild/products/catalogue-filter-controls.tsx"),
    read("src/app/rebuild/products/catalogue.module.css"),
  ]);

  assert.match(client, /<details className=\{styles\.mobileFilters\}>/);
  assert.match(client, /<aside className=\{styles\.desktopFilters\}/);
  assert.match(client, /CatalogueFilterControls/);
  assert.match(controls, /type="radio"/);
  assert.match(controls, /<select id=\{`\$\{prefix\}-family`\}/);
  assert.match(styles, /\.stickyFilters[\s\S]*position: sticky/);
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /\.desktopFilters[\s\S]*display: none/);
  assert.match(styles, /\.mobileFilters[\s\S]*display: block/);
});

test("catalogue entries preserve real imagery, codes, and inquiry state", async () => {
  const [client, entry] = await Promise.all([
    read("src/app/rebuild/products/catalogue-client.tsx"),
    read("src/app/rebuild/products/catalogue-product-entry.tsx"),
  ]);

  assert.match(client, /aria-live="polite"/);
  assert.match(client, /inquiryQuantity=\{inquiryItem\?\.quantity \?\? 0\}/);
  assert.match(entry, /CatalogueMedia/);
  assert.match(entry, /styles\.entryCode/);
  assert.match(entry, /Add to Inquiry/);
  assert.match(entry, /data-selected=\{inquiryQuantity > 0\}/);
  assert.match(entry, /onClick=\{\(\) => onAdd\(product\)\}/);
});

test("catalogue motion is restrained and has reduced-motion parity", async () => {
  const styles = await read("src/app/rebuild/products/catalogue.module.css");

  assert.doesNotMatch(styles, /@keyframes catalogue-enter|animation:\s*catalogue-enter/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /animation-duration: 0\.01ms !important/);
  assert.match(styles, /transition-duration: 0\.01ms !important/);
  assert.match(styles, /\.entryStage:hover \.entryMedia/);
  assert.doesNotMatch(styles, /perspective:|translateZ|position: fixed/);
});
