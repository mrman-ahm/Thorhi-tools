import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/app/layout.tsx", "utf8");
const header = readFileSync("src/components/site-header.tsx", "utf8");
const hero = readFileSync("src/components/hero-experience.tsx", "utf8");
const evolution = readFileSync("src/components/frame-evolution-scene.tsx", "utf8");
const prepare = readFileSync("scripts/prepare-cinematic-assets.mjs", "utf8");
const styles = readFileSync("src/app/v2-sector11-responsive.css", "utf8");
const logo = readFileSync("public/brand/throhi-logo-clean.svg", "utf8");

test("visible vector logo replaces the empty raster identity", () => {
  assert.ok(statSync("public/brand/throhi-logo-clean.svg").size > 1500);
  assert.match(logo, /<svg/);
  assert.match(logo, /THROHI Medical Tools/);
  assert.match(logo, /linearGradient id="green"/);
  assert.match(header, /throhi-logo-clean\.svg/);
  assert.match(hero, /throhi-logo-clean\.svg/);
  assert.doesNotMatch(header, /throhi-logo-clean\.webp/);
  assert.doesNotMatch(hero, /throhi-logo-clean\.webp/);
});

test("evolution quality is preserved through bounded decoded sheets", () => {
  assert.match(prepare, /const framesPerSheet = 20/);
  assert.match(prepare, /const sheetColumns = 5/);
  assert.match(prepare, /maxDecodedSheets: 3/);
  assert.match(prepare, /maxDecodedSheets: 2/);
  assert.match(prepare, /cellWidth: 640/);
  assert.match(prepare, /cellHeight: 360/);
  assert.match(prepare, /cellWidth: 400/);
  assert.match(prepare, /cellHeight: 225/);
  assert.match(evolution, /sheetCacheRef/);
  assert.match(evolution, /evictSheets/);
  assert.match(evolution, /image\.src = ""/);
  assert.match(evolution, /mobileMedia\.addEventListener\("change"/);
});

test("Sector 11 loads last and defines compact touch-safe header behavior", () => {
  assert.match(layout, /v2-sector11-responsive\.css/);
  assert.match(styles, /@media \(max-width:560px\)/);
  assert.match(styles, /@media \(max-width:340px\)/);
  assert.match(styles, /min-height:48px/);
  assert.match(styles, /min-width:44px/);
  assert.match(styles, /grid-template-columns:minmax\(72px,1fr\) auto/);
});

test("reduced-height and reduced-motion modes retain critical controls", () => {
  assert.match(styles, /max-height:650px/);
  assert.match(styles, /max-height:560px/);
  assert.match(styles, /cinematic-entry-scroll/);
  assert.match(styles, /frame-evolution-stage/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
});
