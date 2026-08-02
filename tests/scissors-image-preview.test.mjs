import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cataloguePath = path.join(root, "src/lib/catalogue.ts");
const componentPath = path.join(root, "src/components/catalogue-ui.tsx");

const expected = [
  ["preview-scissors-iris-regular", "04-0800", "scissors-iris-regular.svg"],
  ["preview-scissors-iris-super-cut", "05-0802", "scissors-iris-super-cut.svg"],
  ["preview-scissors-iris-tc", "06-0802", "scissors-iris-tc.svg"],
  ["preview-scissors-stevens-regular", "04-0901", "scissors-stevens-regular.svg"],
  ["preview-scissors-stevens-super-cut", "05-0901", "scissors-stevens-super-cut.svg"],
  ["preview-scissors-stevens-tc", "06-0901", "scissors-stevens-tc.svg"],
  ["preview-scissors-operating-regular", "04-0101", "scissors-operating-regular.svg"],
  ["preview-scissors-operating-super-cut", "05-0101", "scissors-operating-super-cut.svg"],
  ["preview-scissors-operating-tc", "06-0101", "scissors-operating-tc.svg"],
  ["preview-scissors-mayo-regular", "04-0401", "scissors-mayo-regular.svg"],
  ["preview-scissors-mayo-super-cut", "05-0401", "scissors-mayo-super-cut.svg"],
  ["preview-scissors-mayo-tc", "06-0401", "scissors-mayo-tc.svg"],
  ["preview-scissors-metzenbaum-regular", "04-1901", "scissors-metzenbaum-regular.svg"],
  ["preview-scissors-metzenbaum-super-cut", "05-1901", "scissors-metzenbaum-super-cut.svg"],
  ["preview-scissors-metzenbaum-tc", "06-1901", "scissors-metzenbaum-tc.svg"]
];

test("catalogue exposes exactly 15 routed Scissors preview products", async () => {
  const source = await readFile(cataloguePath, "utf8");
  assert.match(source, /imagePath\?: string/);
  for (const [id, code, file] of expected) {
    assert.match(source, new RegExp(`id: \\"${id}\\"`));
    assert.match(source, new RegExp(`code: \\"${code}\\"`));
    assert.match(source, new RegExp(`imagePath: \\"/media/scissors-preview/${file}\\"`));
  }
  assert.equal((source.match(/id: "preview-scissors-/g) ?? []).length, 15);
});

test("all 15 preview image files exist", async () => {
  for (const [, , file] of expected) {
    await access(path.join(root, "public/media/scissors-preview", file));
  }
});

test("ProductImage renders a real image only for products with imagePath", async () => {
  const source = await readFile(componentPath, "utf8");
  assert.match(source, /product\.imagePath/);
  assert.match(source, /<img/);
  assert.match(source, /objectFit: "contain"/);
  assert.match(source, /alt=\{product\.name\}/);
  assert.match(source, /Temporary image placeholder/);
});
