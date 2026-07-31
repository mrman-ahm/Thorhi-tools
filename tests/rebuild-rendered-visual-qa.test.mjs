import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("rendered visual QA uses the replacement heritage foundation", async () => {
  const [shell, heritage, product, inquiry] = await Promise.all([
    read("src/app/rebuild/rebuild-shell.tsx"),
    read("src/app/rebuild/precision-heritage.module.css"),
    read("src/app/rebuild/products/[productId]/product-heritage.module.css"),
    read("src/app/rebuild/inquiry/inquiry-heritage.module.css"),
  ]);

  assert.match(shell, /data-redesign-contract="precision-heritage-house-v1"/);
  assert.match(heritage, /--heritage-label:\s*0\.75rem/);
  assert.match(heritage, /--heritage-body/);
  assert.match(heritage, /--heritage-header:\s*78px/);
  assert.match(heritage, /--heritage-header-mobile:\s*66px/);
  assert.match(heritage, /prefers-reduced-motion/);
  assert.match(product, /100svh - 148px/);
  assert.match(inquiry, /data-inquiry-review/);
});

test("representative routes expose stable redesign markers", async () => {
  const [
    divisions,
    selected,
    company,
    utilities,
    catalogue,
    product,
    inquiry,
  ] = await Promise.all([
    read("src/components/rebuild/home/home-division-index.tsx"),
    read("src/components/rebuild/home/home-selected-families.tsx"),
    read("src/components/rebuild/home/home-company-intro.tsx"),
    read("src/components/rebuild/home/home-utilities-contact.tsx"),
    read("src/app/rebuild/products/page.tsx"),
    read("src/app/rebuild/products/[productId]/page.tsx"),
    read("src/app/rebuild/inquiry/page.tsx"),
  ]);

  assert.match(divisions, /data-home-divisions/);
  assert.match(divisions, /data-division-state/);
  assert.match(selected, /data-home-selected/);
  assert.match(company, /data-home-company/);
  assert.match(utilities, /data-home-utilities/);
  assert.match(catalogue, /data-redesign-catalogue/);
  assert.match(product, /data-redesign-product/);
  assert.match(product, /data-product-dossier/);
  assert.match(product, /data-variant-record/);
  assert.match(inquiry, /data-redesign-inquiry/);
  assert.match(inquiry, /data-inquiry-stages/);
});

test("route-owned redesign modules replace legacy corrective styling", async () => {
  const [catalogue, product, inquiry, shell] = await Promise.all([
    read("src/app/rebuild/products/catalogue-heritage.module.css"),
    read("src/app/rebuild/products/[productId]/product-heritage.module.css"),
    read("src/app/rebuild/inquiry/inquiry-heritage.module.css"),
    read("src/app/rebuild/rebuild-shell.tsx"),
  ]);

  assert.match(catalogue, /data-catalogue-record/);
  assert.match(product, /data-product-examination/);
  assert.match(inquiry, /data-inquiry-workspace/);
  assert.doesNotMatch(shell, /premiumStyles/);
  assert.doesNotMatch(shell, /qaStyles/);
});
