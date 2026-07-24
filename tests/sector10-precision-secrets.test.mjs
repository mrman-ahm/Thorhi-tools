import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const component = readFileSync("src/components/precision-secrets.tsx", "utf8");
const styles = readFileSync("src/app/v2-sector10-secrets.css", "utf8");
const layout = readFileSync("src/app/layout.tsx", "utf8");
const packageFile = readFileSync("package.json", "utf8");

test("Sector 10 mounts one global precision-secret controller", () => {
  assert.match(layout, /PrecisionSecrets/);
  assert.match(layout, /v2-sector10-secrets\.css/);
  assert.match(layout, /<PrecisionSecrets \/>/);
});

test("secret activation has keyboard, pointer, timeout, and Escape paths", () => {
  assert.match(component, /SECRET_WORD = "THROHI"/);
  assert.match(component, /isTypingTarget/);
  assert.match(component, /pointerdown/);
  assert.match(component, /PRESS_DURATION = 720/);
  assert.match(component, /event\.key === "Escape"/);
  assert.match(component, /ACTIVE_DURATION = 9000/);
  assert.match(component, /delete document\.documentElement\.dataset\.precisionSecret/);
});

test("secret state ignores typing fields and preserves normal interactions", () => {
  assert.match(component, /input, textarea, select/);
  assert.match(component, /event\.preventDefault\(\)/);
  assert.match(component, /suppressClick/);
  assert.match(styles, /pointer-events:none/);
  assert.match(styles, /data-search-open="true"/);
  assert.match(styles, /input:focus/);
});

test("precision layer remains restrained and reduced-motion safe", () => {
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /animation:none!important/);
  assert.match(styles, /PRECISION LAYER/);
  assert.doesNotMatch(styles, /infinite/);
  assert.doesNotMatch(component, /audio|Audio\(|WebGL|particle|cursor trail|magnetic/i);
});

test("Sector 10 introduces no additional runtime dependency", () => {
  const parsed = JSON.parse(packageFile);
  assert.equal(parsed.dependencies.animejs, "4.5.0");
  assert.deepEqual(Object.keys(parsed.dependencies).sort(), ["animejs", "next", "react", "react-dom"]);
});
