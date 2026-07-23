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

test("evolution compiler generates higher-resolution responsive sprites", () => {
  assert.match(prepare, /cellWidth: 640/);
  assert.match(prepare, /cellHeight: 360/);
  assert.match(prepare, /quality: 90/);
  assert.match(prepare, /cellWidth: 400/);
  assert.match(prepare, /cellHeight: 225/);
  assert.match(prepare, /quality: 86/);
  assert.match(prepare, /8192 texture ceiling/);
});

test("evolution stage preserves the original sixteen-by-nine frame geometry", () => {
  assert.match(styles, /\.frame-evolution-stage\{/);
  assert.match(styles, /aspect-ratio:16\/9/);
  assert.match(styles, /height:auto!important/);
  assert.match(styles, /min-height:0!important/);
});

test("homepage and header use the cleaned transparent THROHI identity", () => {
  assert.ok(existsSync("public/brand/throhi-logo-clean.webp"));
  assert.match(hero, /\/brand\/throhi-logo-clean\.webp/);
  assert.match(header, /\/brand\/throhi-logo-clean\.webp/);
  assert.doesNotMatch(hero, /\/logo\.webp/);
  assert.doesNotMatch(header, /\/logo\.webp/);
});

test("reduced motion removes the cover overlap and keeps entry accessible", () => {
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /margin-bottom:0/);
  assert.match(styles, /transform:none!important/);
  assert.match(styles, /pointer-events:auto/);
});
