import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("rendered visual QA uses one scoped rebuild refinement layer", async () => {
  const [shell, styles] = await Promise.all([
    read("src/app/rebuild/rebuild-shell.tsx"),
    read("src/app/rebuild/visual-qa-refinements.module.css"),
  ]);

  assert.match(shell, /visual-qa-refinements\.module\.css/);
  assert.match(shell, /qaStyles\.root/);
  assert.match(shell, /data-visual-qa-contract="rendered-visual-qa-v1"/);
  assert.match(styles, /12px/);
  assert.match(styles, /14px/);
  assert.match(styles, /80px/);
  assert.match(styles, /66px/);
  assert.match(styles, /1280px/);
  assert.match(styles, /850px/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /var\(--font-regal\)/);
});

test("representative routes expose stable visual QA markers", async () => {
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
  assert.match(catalogue, /data-catalogue-workspace/);
  assert.match(product, /data-product-page/);
  assert.match(product, /data-product-return/);
  assert.match(product, /data-product-media-stage/);
  assert.match(product, /data-product-spec-ledger/);
  assert.match(product, /data-variant-record/);
  assert.match(product, /data-related-record/);
  assert.match(inquiry, /data-inquiry-stages/);
});

test("homepage and product composition use current premium shell heights", async () => {
  const styles = await read("src/app/rebuild/visual-qa-refinements.module.css");
  assert.match(styles, /\[data-home-hero\]::before/);
  assert.match(styles, /inset:\s*80px 44% 0 auto/);
  assert.match(styles, /min-width:\s*821px/);
  assert.match(styles, /max-height:\s*850px/);
  assert.match(styles, /\[data-product-page\][\s\S]*padding-top:\s*80px/);
  assert.match(styles, /padding-top:\s*66px/);
  assert.match(styles, /100svh - 156px/);
});
