import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(".github/workflows/quality.yml", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const hasLockfile = existsSync("package-lock.json") || existsSync("npm-shrinkwrap.json");

test("quality workflow validates the isolated V3 branch", () => {
  assert.match(workflow, /experiment\/v3-surgical-editorial-glass/);
  assert.match(workflow, /cancel-in-progress: true/);
  assert.match(workflow, /contents: read/);
});

test("dependency installation matches the repository lockfile state", () => {
  if (hasLockfile) {
    assert.match(workflow, /npm ci --no-audit --no-fund/);
  } else {
    assert.match(workflow, /npm install --no-audit --no-fund/);
    assert.doesNotMatch(workflow, /cache: npm/);
    assert.doesNotMatch(workflow, /npm ci/);
  }
});

test("catalogue assets are prepared before static and browser validation", () => {
  assert.equal(packageJson.scripts.pretest, "npm run prepare:catalogue");
  assert.equal(packageJson.scripts["pretest:e2e"], "npm run prepare:assets");
  assert.match(packageJson.scripts.prebuild, /prepare:assets/);
});

test("quality workflow runs every required validation stage", () => {
  for (const command of [
    "npm run lint",
    "npm run typecheck",
    "npm test",
    "npm run build",
    "npx playwright install --with-deps chromium",
    "npm run test:e2e"
  ]) {
    assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(workflow, /throhi-v3-browser-validation/);
});
