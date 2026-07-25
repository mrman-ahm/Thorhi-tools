import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/app/layout.tsx", "utf8");
const styles = readFileSync("src/app/v3-optical-system.css", "utf8");
const primitives = readFileSync("src/components/v3/optical-primitives.tsx", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

test("V3 optical system loads after the complete V2 style stack", () => {
  const refinement = layout.indexOf('import "./v2-sector9d-refinement.css"');
  const optical = layout.indexOf('import "./v3-optical-system.css"');
  assert.ok(refinement >= 0);
  assert.ok(optical > refinement);
});

test("V3 corrects font ownership and removes global smooth scrolling", () => {
  assert.match(styles, /--font-display:var\(--font-archivo\)/);
  assert.match(styles, /--font-body:var\(--font-instrument\)/);
  assert.match(styles, /--font-mono:var\(--font-plex\)/);
  assert.match(styles, /html\{scroll-behavior:auto\}/);
});

test("V3 defines distinct optical, smoked, clear, and clinical materials", () => {
  assert.match(styles, /\.v3-glass\{/);
  assert.match(styles, /data-glass="smoked"/);
  assert.match(styles, /data-glass="clear"/);
  assert.match(styles, /data-glass="clinical"/);
  assert.match(styles, /backdrop-filter:blur/);
  assert.match(styles, /prefers-reduced-transparency:reduce/);
});

test("V3 machined controls retain visible focus and reduced-motion states", () => {
  assert.match(styles, /\.v3-field-control:focus-visible/);
  assert.match(styles, /min-height:52px/);
  assert.match(styles, /\.v3-button\{/);
  assert.match(styles, /min-height:48px/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
});

test("V3 field primitive requires a real label and descriptive linkage", () => {
  assert.match(primitives, /id: string/);
  assert.match(primitives, /label: string/);
  assert.match(primitives, /<label htmlFor=\{id\}>\{label\}<\/label>/);
  assert.match(primitives, /aria-describedby=\{descriptionId\}/);
});

test("V3 stays on the existing animation stack and rejects heavy visual dependencies", () => {
  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {})
  };
  assert.equal(dependencies["framer-motion"], undefined);
  assert.equal(dependencies.gsap, undefined);
  assert.equal(dependencies.three, undefined);
  assert.equal(dependencies["@react-three/fiber"], undefined);
  assert.equal(dependencies.animejs, "4.5.0");
});
