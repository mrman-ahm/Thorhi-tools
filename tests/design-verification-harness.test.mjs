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
  assert.match(shell, /data-milestone-contract="surgical-precision-archive-v1"/);
});

test("company trust verification runs the full isolated regression gate", async () => {
  const script = await read("scripts/verify-design-milestone-2.sh");

  assert.match(script, /PLAYWRIGHT_PORT=3101/);
  assert.match(script, /PLAYWRIGHT_REUSE_SERVER=0/);
  assert.match(script, /rebuild-home-design\.spec\.ts/);
  assert.match(script, /rebuild-company-trust\.spec\.ts/);
  assert.match(script, /--project=desktop-chromium/);
  assert.match(script, /--project=mobile-chromium/);
});

test("catalogue discovery verification runs every rebuild regression suite", async () => {
  const script = await read("scripts/verify-design-milestone-3.sh");

  assert.match(script, /PLAYWRIGHT_PORT=3102/);
  assert.match(script, /PLAYWRIGHT_REUSE_SERVER=0/);
  assert.match(script, /rebuild-home-design\.spec\.ts/);
  assert.match(script, /rebuild-company-trust\.spec\.ts/);
  assert.match(script, /rebuild-catalogue-design\.spec\.ts/);
});

test("product inquiry verification runs every rebuild regression suite", async () => {
  const script = await read("scripts/verify-design-milestone-4.sh");

  assert.match(script, /PLAYWRIGHT_PORT=3103/);
  assert.match(script, /PLAYWRIGHT_REUSE_SERVER=0/);
  assert.match(script, /rebuild-product-inquiry-design\.spec\.ts/);
  assert.match(script, /--project=desktop-chromium/);
  assert.match(script, /--project=mobile-chromium/);
});

test("milestone 6 keeps the complete pre-redesign regression gate", async () => {
  const script = await read("scripts/verify-design-milestone-6.sh");

  assert.match(script, /PLAYWRIGHT_PORT=3104/);
  assert.match(script, /PLAYWRIGHT_REUSE_SERVER=0/);
  assert.match(script, /npm run readiness:check/);
  assert.match(script, /rebuild-premium-convergence\.spec\.ts/);
  assert.match(script, /rebuild-premium-utility-states\.spec\.ts/);
  assert.match(script, /rebuild-production-readiness\.spec\.ts/);
  assert.match(script, /rebuild-rendered-visual-qa\.spec\.ts/);
});

test("full redesign verification runs the isolated precision heritage gate", async () => {
  const [script, shell] = await Promise.all([
    read("scripts/verify-full-redesign.sh"),
    read("src/app/rebuild/rebuild-shell.tsx"),
  ]);

  assert.match(script, /rm -rf playwright-report test-results \.next/);
  assert.match(script, /PLAYWRIGHT_PORT=3105/);
  assert.match(script, /PLAYWRIGHT_REUSE_SERVER=0/);
  assert.match(script, /npm run readiness:check/);
  assert.match(script, /rebuild-full-redesign\.spec\.ts/);
  assert.match(script, /--project=desktop-chromium/);
  assert.match(script, /--project=mobile-chromium/);
  assert.match(shell, /data-redesign-contract="precision-heritage-house-v1"/);
  assert.doesNotMatch(shell, /premium-convergence\.module\.css/);
  assert.doesNotMatch(shell, /visual-qa-refinements\.module\.css/);
});

test("eslint excludes generated browser-test artifacts", async () => {
  const config = await read("eslint.config.mjs");

  assert.match(config, /playwright-report\/\*\*/);
  assert.match(config, /test-results\/\*\*/);
});
