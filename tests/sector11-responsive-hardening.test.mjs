import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cinematic = readFileSync("src/components/cinematic-entry.tsx", "utf8");
const evolution = readFileSync("src/components/frame-evolution-scene.tsx", "utf8");
const styles = readFileSync("src/app/v2-sector11-responsive.css", "utf8");
const layout = readFileSync("src/app/layout.tsx", "utf8");

test("Sector 11 loads after the approved motion, cinematic, and secret layers", () => {
  assert.match(layout, /v2-sector10-secrets\.css/);
  assert.match(layout, /v2-sector11-responsive\.css/);
  assert.ok(layout.indexOf("v2-sector11-responsive.css") > layout.indexOf("v2-sector10-secrets.css"));
});

test("cinematic cover responds to dynamic viewports and constrained media", () => {
  assert.match(cinematic, /window\.visualViewport/);
  assert.match(cinematic, /orientationchange/);
  assert.match(cinematic, /saveData/);
  assert.match(cinematic, /effectiveType/);
  assert.match(cinematic, /preload="metadata"/);
  assert.match(cinematic, /visibilitychange/);
  assert.match(cinematic, /section\.inert = cleared/);
});

test("evolution selects responsive media and redraws without changing frame timing", () => {
  assert.match(evolution, /deviceMemory/);
  assert.match(evolution, /saveData/);
  assert.match(evolution, /data-sprite-mode=\{spriteMode\}/);
  assert.match(evolution, /ResizeObserver/);
  assert.match(evolution, /visualViewport/);
  assert.match(evolution, /pixelRatioCapRef/);
  assert.match(evolution, /frameForEvolutionProgress/);
  assert.match(evolution, /chapterIndexForFrame/);
  assert.doesNotMatch(evolution, /scrollTo\(|preventDefault\(\).*wheel|addEventListener\("wheel"/s);
});

test("responsive layer covers safe areas, narrow mobile, landscape, low height, and container width", () => {
  assert.match(styles, /env\(safe-area-inset-top\)/);
  assert.match(styles, /env\(safe-area-inset-bottom\)/);
  assert.match(styles, /@media \(max-width:340px\)/);
  assert.match(styles, /@media \(max-height:600px\) and \(orientation:landscape\)/);
  assert.match(styles, /@media \(min-width:901px\) and \(max-height:760px\)/);
  assert.match(styles, /container-type:inline-size/);
  assert.match(styles, /@container \(max-width:760px\)/);
  assert.match(styles, /100dvh/);
});
