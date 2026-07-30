import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("product detail exposes the examination desk without losing catalogue context", async () => {
  const [page, actions, styles] = await Promise.all([
    read("src/app/rebuild/products/[productId]/page.tsx"),
    read("src/app/rebuild/products/[productId]/product-actions.tsx"),
    read("src/app/rebuild/products/[productId]/product-detail.module.css"),
  ]);

  assert.match(page, /data-product-examination/);
  assert.match(page, /data-variant-ledger/);
  assert.match(page, /data-related-products/);
  assert.match(page, /safeReturnPath/);
  assert.match(page, /CatalogueMedia/);
  assert.match(page, /candidate\.family === product\.family/);
  assert.match(actions, /data-product-action/);
  assert.match(actions, /existing\?\.quantity|existing\.quantity/);
  assert.match(styles, /\.examination/);
  assert.match(styles, /\.identityRail/);
  assert.match(styles, /@media \(max-width: 700px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("variant inquiry identity remains independent from the base product", async () => {
  const actions = await read(
    "src/app/rebuild/products/[productId]/product-actions.tsx",
  );

  assert.match(actions, /variantId: variant\?\.id/);
  assert.match(actions, /variantLabel: variant\?\.code/);
  assert.match(actions, /const key = variant \? `\$\{product\.id\}:\$\{variant\.id\}` : product\.id/);
  assert.match(actions, /aria-live="polite"/);
  assert.doesNotMatch(actions, /cart|checkout|buy now|price/i);
});

test("inquiry route uses focused procurement records and review desk", async () => {
  const [page, client, item, review, styles] = await Promise.all([
    read("src/app/rebuild/inquiry/page.tsx"),
    read("src/app/rebuild/inquiry/inquiry-client.tsx"),
    read("src/app/rebuild/inquiry/inquiry-item-record.tsx"),
    read("src/app/rebuild/inquiry/inquiry-review-desk.tsx"),
    read("src/app/rebuild/inquiry/inquiry.module.css"),
  ]);

  assert.match(page, /data-inquiry-masthead/);
  assert.match(client, /data-inquiry-workspace/);
  assert.match(client, /InquiryItemRecord/);
  assert.match(client, /InquiryReviewDesk/);
  assert.match(client, /fetch\("\/api\/inquiries"/);
  assert.match(client, /crypto\.randomUUID/);
  assert.match(item, /data-inquiry-item/);
  assert.match(item, /Quantity/);
  assert.match(item, /Item note/);
  assert.match(review, /data-inquiry-review/);
  assert.match(review, /This is a product inquiry, not an online order or payment/);
  assert.match(styles, /\.reviewDesk[\s\S]*position: sticky/);
  assert.match(styles, /@media \(max-width: 980px\)/);
  assert.match(styles, /@media \(max-width: 600px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("inquiry redesign preserves validation and manual-reference behavior", async () => {
  const client = await read("src/app/rebuild/inquiry/inquiry-client.tsx");

  assert.match(client, /addManualItem/);
  assert.match(client, /allowedAttachmentTypes/);
  assert.match(client, /maxAttachmentBytes/);
  assert.match(client, /buyer\.consent/);
  assert.match(client, /restoreItem/);
  assert.match(client, /router\.push/);
  assert.match(client, /storage=/);
  assert.doesNotMatch(client, /payment form|checkout|place order/i);
});
