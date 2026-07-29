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
  const [client, styles] = await Promise.all([
    read("src/app/rebuild/products/catalogue-client.tsx"),
    read("src/app/rebuild/products/catalogue.module.css"),
  ]);

  assert.match(client, /<details className=\{styles\.mobileFilters\}>/);
  assert.match(client, /<aside className=\{styles\.desktopFilters\}/);
  assert.match(client, /type="radio"/);
  assert.match(styles, /\.stickyFilters[\s\S]*position: sticky/);
  assert.match(styles, /@media \(max-width: 820px\)/);
});

test("catalogue cards preserve real imagery, codes, and inquiry state", async () => {
  const client = await read("src/app/rebuild/products/catalogue-client.tsx");

  assert.match(client, /CatalogueMedia/);
  assert.match(client, /stageCode/);
  assert.match(client, /Add to Inquiry/);
  assert.match(client, /data-selected=\{Boolean\(inquiryItem\)\}/);
  assert.match(client, /aria-live="polite"/);
});

test("catalogue motion is restrained and has reduced-motion parity", async () => {
  const styles = await read("src/app/rebuild/products/catalogue.module.css");

  assert.match(styles, /@keyframes catalogue-enter/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.productCard,[\s\S]*animation: none/);
  assert.doesNotMatch(styles, /scroll-behavior|perspective:|translateZ|position: fixed/);
});
