import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const cinematic = readFileSync("src/components/cinematic-entry.tsx", "utf8");
const hero = readFileSync("src/components/hero-experience.tsx", "utf8");
const header = readFileSync("src/components/site-header.tsx", "utf8");
const styles = readFileSync("src/app/v2-sector9d-refinement.css", "utf8");
const prepare = readFileSync("scripts/prepare-cinematic-assets.mjs", "utf8");

test("opening cinematic behaves as a rigid cover sliding over the real website", () => {
  assert.match(styles, /height:200svh!important/);
  assert.match(styles, /margin-bottom:-100svh/);
  assert.match(styles, /calc\(var\(--cinematic-progress\) \* -100svh\)/);
  assert.match(styles, /opacity:1!important/);
  assert.match(styles, /box-shadow:/);
  assert.match(cinematic, /data-video-ended/);
  assert.match(cinematic, /onEnded=\{\(\) => setVideoEnded\(true\)\}/);
  assert.doesNotMatch(styles, /opacity:calc\(1 - var\(--cinematic-progress\)/);
});

test("cleared cinematic cover releases the underlying homepage", () => {
  assert.match(cinematic, /dataset\.exitState = cleared \? "cleared"/);
  assert.match(cinematic, /section\.inert = cleared/);
  assert.match(styles, /data-exit-state="cleared"/);
  assert.match(styles, /pointer-events:none/);
});

test("evolution compiler keeps high-resolution frames in bounded sheets", () => {
  assert.match(prepare, /const framesPerSheet = 20/);
  assert.match(prepare, /const sheetColumns = 5/);
  assert.match(prepare, /cellWidth: 640/);
  assert.match(prepare, /cellHeight: 360/);
  assert.match(prepare, /quality: 90/);
  assert.match(prepare, /cellWidth: 400/);
  assert.match(prepare, /cellHeight: 225/);
  assert.match(prepare, /quality: 86/);
  assert.match(prepare, /maxDecodedSheets: 3/);
  assert.match(prepare, /maxDecodedSheets: 2/);
  assert.doesNotMatch(prepare, /7680 × 7920|8192 texture ceiling/);
});

test("evolution stage preserves the original sixteen-by-nine frame geometry", () => {
  assert.match(styles, /\.frame-evolution-stage\{/);
  assert.match(styles, /aspect-ratio:16\/9/);
  assert.match(styles, /height:auto!important/);
  assert.match(styles, /min-height:0!important/);
});

test("homepage and header use the visible transparent THROHI vector identity", () => {
  assert.ok(existsSync("public/brand/throhi-logo-clean.svg"));
  assert.match(hero, /\/brand\/throhi-logo-clean\.svg/);
  assert.match(header, /\/brand\/throhi-logo-clean\.svg/);
  assert.doesNotMatch(hero, /\/brand\/throhi-logo-clean\.webp/);
  assert.doesNotMatch(header, /\/brand\/throhi-logo-clean\.webp/);
});

test("reduced motion removes the cover overlap and keeps entry accessible", () => {
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /margin-bottom:0/);
  assert.match(styles, /transform:none!important/);
  assert.match(styles, /pointer-events:auto/);
});
