import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/app/layout.tsx", "utf8");
const cinematic = readFileSync("src/components/cinematic-entry.tsx", "utf8");
const hero = readFileSync("src/components/hero-experience.tsx", "utf8");
const styles = readFileSync("src/app/v3-cinematic-hero.css", "utf8");
const refinement = readFileSync("src/app/v2-sector9d-refinement.css", "utf8");

test("V3 cinematic and hero styles load after the optical foundation", () => {
  const optical = layout.indexOf('import "./v3-optical-system.css"');
  const heroLayer = layout.indexOf('import "./v3-cinematic-hero.css"');
  assert.ok(optical >= 0);
  assert.ok(heroLayer > optical);
});

test("opening cinematic keeps the rigid native-scroll cover contract", () => {
  assert.match(refinement, /height:200svh!important/);
  assert.match(refinement, /margin-bottom:-100svh/);
  assert.match(cinematic, /--cinematic-progress/);
  assert.match(cinematic, /window\.addEventListener\("scroll", requestUpdate, \{ passive: true \}\)/);
  assert.doesNotMatch(cinematic, /addEventListener\("wheel"/);
  assert.match(cinematic, /section\.inert = cleared/);
});

test("opening cinematic preserves source media loading and uses metadata-first preload", () => {
  assert.match(cinematic, /fetch\("\/media\/sector9d\/manifest\.json"/);
  assert.match(cinematic, /preload="metadata"/);
  assert.match(cinematic, /onEnded=\{\(\) => setVideoEnded\(true\)\}/);
  assert.match(cinematic, /\/brand\/throhi-logo-clean\.webp/);
});

test("the editorial hero remains the single homepage level-one heading", () => {
  assert.doesNotMatch(cinematic, /<h1/);
  assert.match(cinematic, /<p id="cinematic-entry-title" className="cinematic-entry-title">/);
  assert.match(hero, /<h1 className="hero-type" id="hero-title">/);
});

test("hero uses official identity, evidence-led copy, and real catalogue actions", () => {
  assert.match(hero, /\/brand\/throhi-logo-clean\.webp/);
  assert.match(hero, /Precision that/);
  assert.match(hero, /the instrument\./);
  assert.match(hero, /href="\/products"/);
  assert.match(hero, /href="\/inquiry"/);
  assert.match(hero, /action="\/search"/);
  assert.match(hero, /Search an instrument/);
});

test("hero typography is sentence-case and restrained by V3 ceilings", () => {
  assert.match(styles, /font-size:var\(--v3-display-xl\)/);
  assert.match(styles, /font-weight:540/);
  assert.match(styles, /text-transform:none/);
  assert.match(styles, /letter-spacing:-\.052em/);
});

test("navigation and cinematic glass degrade for reduced preferences", () => {
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /prefers-reduced-transparency:reduce/);
  assert.match(styles, /backdrop-filter:none/);
});

test("phase 2 introduces no globe, cursor replacement, or WebGL dependency", () => {
  const combined = `${cinematic}\n${hero}\n${styles}`;
  assert.doesNotMatch(combined, /WebGL|WebGPU|three\.js|react-three|cursor:\s*none/i);
});
