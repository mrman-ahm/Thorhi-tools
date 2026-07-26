import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/app/layout.tsx", "utf8");
const motion = readFileSync("src/components/motion-shell.tsx", "utf8");
const cinematic = readFileSync("src/components/cinematic-entry.tsx", "utf8");
const evolution = readFileSync("src/components/frame-evolution-scene.tsx", "utf8");
const discovery = readFileSync("src/components/discovery-experience.tsx", "utf8");
const styles = readFileSync("src/app/v3-performance-hardening.css", "utf8");
const polish = readFileSync("src/app/v3-final-polish.css", "utf8");

test("performance safeguards load before the final non-destructive polish layer", () => {
  const utility = layout.indexOf('import "./v3-utility-routes.css"');
  const hardening = layout.indexOf('import "./v3-performance-hardening.css"');
  const finalPolish = layout.indexOf('import "./v3-final-polish.css"');
  assert.ok(utility >= 0);
  assert.ok(hardening > utility);
  assert.ok(finalPolish > hardening);
});

test("MotionShell no longer duplicates bespoke homepage hero timelines", () => {
  assert.match(motion, /MotionShell intentionally does not animate them again/);
  assert.match(motion, /if \(kind !== "home"\)/);
  assert.doesNotMatch(motion, /heroWords|heroObjectParts|heroSearchParts|heroScrollParts/);
});

test("MotionShell honors data saver and document visibility", () => {
  assert.match(motion, /connection\?: \{ saveData\?: boolean \}/);
  assert.match(motion, /dataset\.dataSaver/);
  assert.match(motion, /document\.hidden/);
  assert.match(motion, /IntersectionObserver/);
});

test("cinematic skips video and authored entry motion for data saver", () => {
  assert.match(cinematic, /saveDataEnabled\(\)/);
  assert.match(cinematic, /const allowed = !reduced\.matches && !savingData/);
  assert.match(cinematic, /data-save-data/);
  assert.match(cinematic, /videoSource && motionAllowed/);
  assert.match(cinematic, /behavior: constrained \? "auto" : "smooth"/);
});

test("evolution selects smaller media for data saver and caps DPR", () => {
  assert.match(evolution, /saveDataEnabled\(\) \? 1 : 1\.5/);
  assert.match(evolution, /saveDataEnabled\(\) \|\| window\.matchMedia/);
  assert.match(evolution, /manifest\.sprites\.mobile/);
  assert.match(evolution, /manifest\.sprites\.desktop/);
});

test("evolution pauses rendering outside the viewport and while hidden", () => {
  assert.match(evolution, /visibleRef/);
  assert.match(evolution, /visibilityObserver/);
  assert.match(evolution, /document\.addEventListener\("visibilitychange"/);
  assert.match(evolution, /document\.hidden \|\| !visibleRef\.current/);
  assert.match(evolution, /window\.cancelAnimationFrame/);
});

test("hardening removes permanent compositor hints and constrains offscreen content", () => {
  assert.match(styles, /data-exit-state="cleared".*will-change:auto/s);
  assert.match(styles, /content-visibility:auto/);
  assert.match(styles, /contain-intrinsic-size/);
  assert.match(styles, /motion-shell\[data-data-saver="true"\]/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /prefers-reduced-transparency:reduce/);
});

test("final polish restores canonical homepage card structure and stronger preference support", () => {
  assert.match(polish, /v3-home-product-grid/);
  assert.match(polish, /grid-template-rows:minmax\(250px,1fr\) auto/);
  assert.match(polish, /prefers-contrast:more/);
  assert.match(polish, /forced-colors:active/);
  assert.match(polish, /@media \(hover:none\)/);
});

test("division preview interaction avoids false current-page semantics and touch hover", () => {
  assert.match(discovery, /onMouseEnter=\{\(\) => setActiveDivision\(index\)\}/);
  assert.match(discovery, /onFocus=\{\(\) => setActiveDivision\(index\)\}/);
  assert.doesNotMatch(discovery, /aria-current/);
  assert.doesNotMatch(discovery, /aria-live="polite"/);
});
