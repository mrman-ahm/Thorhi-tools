import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("rebuild exposes the precision heritage redesign contract", async () => {
  const [shell, styles] = await Promise.all([
    read("src/app/rebuild/rebuild-shell.tsx"),
    read("src/app/rebuild/precision-heritage.module.css"),
  ]);

  assert.match(shell, /precision-heritage\.module\.css/);
  assert.match(shell, /data-redesign-contract="precision-heritage-house-v1"/);
  assert.match(styles, /--heritage-ink:\s*#071722/);
  assert.match(styles, /--heritage-navy:\s*#0b2b3f/i);
  assert.match(styles, /--heritage-ivory:\s*#f3efe5/i);
  assert.match(styles, /--heritage-paper:\s*#fbf9f3/i);
  assert.match(styles, /--heritage-green:\s*#2e7254/i);
  assert.match(styles, /--heritage-brass:\s*#a78955/i);
  assert.match(styles, /--heritage-header:\s*78px/);
  assert.match(styles, /--heritage-header-mobile:\s*66px/);
  assert.match(styles, /var\(--font-regal\)/);
  assert.match(styles, /prefers-reduced-motion/);
});

test("shared shell exposes redesign markers", async () => {
  const [header, footer] = await Promise.all([
    read("src/components/rebuild/rebuild-header.tsx"),
    read("src/components/rebuild/rebuild-footer.tsx"),
  ]);

  assert.match(header, /data-redesign-header/);
  assert.match(footer, /data-redesign-footer/);
});
