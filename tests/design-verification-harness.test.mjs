import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("design milestone verification uses an isolated production server", async () => {
  const [config, script, shell] = await Promise.all([
    read("playwright.config.ts"),
    read("scripts/verify-design-milestone-1.sh"),
    read("src/app/rebuild/rebuild-shell.tsx"),
  ]);

  assert.match(config, /PLAYWRIGHT_PORT/);
  assert.match(config, /PLAYWRIGHT_REUSE_SERVER/);
  assert.match(script, /rm -rf playwright-report test-results/);
  assert.match(script, /rm -rf \.next/);
  assert.match(script, /PLAYWRIGHT_PORT=3100/);
  assert.match(script, /PLAYWRIGHT_REUSE_SERVER=0/);
  assert.match(script, /--project=desktop-chromium/);
  assert.match(script, /--project=mobile-chromium/);
  assert.match(
    shell,
    /data-milestone-contract="surgical-precision-archive-v1"/,
  );
});

test("eslint excludes generated browser-test artifacts", async () => {
  const config = await read("eslint.config.mjs");

  assert.match(config, /playwright-report\/\*\*/);
  assert.match(config, /test-results\/\*\*/);
});