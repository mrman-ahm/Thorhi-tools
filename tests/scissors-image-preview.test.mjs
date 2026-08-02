import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewDataPath = path.join(root, "src/lib/scissors-preview.ts");
const componentPath = path.join(root, "src/components/catalogue-ui.tsx");
const listingPath = path.join(root, "src/app/preview/scissors/page.tsx");
const detailPath = path.join(root, "src/app/preview/scissors/[product]/page.tsx");

const expected = [
  ["preview-scissors-iris-regular", "04-0800", "scissors-iris-regular.svg"],
  ["preview-scissors-iris-super-cut", "05-0802", "scissors-iris-super-cut.svg"],
  ["preview-scissors-iris-tc", "06-0802", "scissors-iris-tc.svg"],
  ["preview-scissors-stevens-regular", "04-0901", "scissors-stevens.svg#regular"],
  ["preview-scissors-stevens-super-cut", "05-0901", "scissors-stevens.svg#super-cut"],
  ["preview-scissors-stevens-tc", "06-0901", "scissors-stevens.svg#tc"],
  ["preview-scissors-operating-regular", "04-0101", "scissors-operating.svg#regular"],
  ["preview-scissors-operating-super-cut", "05-0101", "scissors-operating.svg#super-cut"],
  ["preview-scissors-operating-tc", "06-0101", "scissors-operating.svg#tc"],
  ["preview-scissors-mayo-regular", "04-0401", "scissors-mayo.svg#regular"],
  ["preview-scissors-mayo-super-cut", "05-0401", "scissors-mayo.svg#super-cut"],
  ["preview-scissors-mayo-tc", "06-0401", "scissors-mayo.svg#tc"],
  ["preview-scissors-metzenbaum-regular", "04-1901", "scissors-metzenbaum.svg#regular"],
  ["preview-scissors-metzenbaum-super-cut", "05-1901", "scissors-metzenbaum.svg#super-cut"],
  ["preview-scissors-metzenbaum-tc", "06-1901", "scissors-metzenbaum.svg#tc"]
];

test("preview data exposes exactly 15 routed Scissors products", async () => {
  const source = await readFile(previewDataPath, "utf8");
  for (const [id, code, file] of expected) {
    assert.match(source, new RegExp(`id: \\"${id}\\"`));
    assert.match(source, new RegExp(`code: \\"${code}\\"`));
    assert.match(source, new RegExp(`imagePath: \\"/media/scissors-preview/${file.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\"`));
  }
  assert.equal((source.match(/id: "preview-scissors-/g) ?? []).length, 15);
  assert.match(source, /status: "draft"/);
  assert.match(source, /imageState: "available"/);
});

test("all referenced preview image assets exist", async () => {
  const uniqueFiles = new Set(expected.map(([, , file]) => file.split("#")[0]));
  for (const file of uniqueFiles) {
    await access(path.join(root, "public/media/scissors-preview", file));
  }
});

test("real ProductImage rendering remains isolated behind imagePath", async () => {
  const source = await readFile(componentPath, "utf8");
  assert.match(source, /imagePath\?: string/);
  assert.match(source, /productWithImage\.imagePath/);
  assert.match(source, /<img/);
  assert.match(source, /objectFit: "contain"/);
  assert.match(source, /alt=\{product\.name\}/);
  assert.match(source, /Temporary image placeholder/);
  assert.match(source, /hrefOverride\?: string/);
});

test("preview listing and details use the real catalogue components", async () => {
  const [listing, detail] = await Promise.all([
    readFile(listingPath, "utf8"),
    readFile(detailPath, "utf8")
  ]);
  assert.match(listing, /<ProductCard/);
  assert.match(listing, /hrefOverride=/);
  assert.match(detail, /<ProductExaminationMotion/);
  assert.match(detail, /<ProductInquiryControls/);
});
