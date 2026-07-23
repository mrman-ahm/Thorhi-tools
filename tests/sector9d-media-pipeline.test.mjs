import assert from "node:assert/strict";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";
import { createSprite } from "../scripts/prepare-cinematic-assets.mjs";

test("Sector 9D sprite compiler composes frames through sharp", async () => {
  const directory = mkdtempSync(join(tmpdir(), "throhi-sector9d-"));
  try {
    const frames = ["#102a2e", "#14b8a6", "#1684c7", "#d77b35"].map((color, index) => [
      `frame-${String(index + 1).padStart(3, "0")}.jpg`,
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="4"><rect width="8" height="4" fill="${color}"/></svg>`)
    ]);

    await createSprite(sharp, frames, {
      filename: "test-sprite.webp",
      outputDirectory: directory,
      columns: 2,
      cellWidth: 8,
      cellHeight: 4,
      quality: 80
    });

    const output = join(directory, "test-sprite.webp");
    assert.ok(statSync(output).size > 0);
    const metadata = await sharp(output).metadata();
    assert.equal(metadata.width, 16);
    assert.equal(metadata.height, 8);
    assert.equal(metadata.format, "webp");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
