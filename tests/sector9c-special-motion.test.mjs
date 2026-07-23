import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const hero = readFileSync("src/components/hero-experience.tsx", "utf8");
const instrument = readFileSync("src/components/instrument-visual.tsx", "utf8");
const scenes = readFileSync("src/components/signature-scenes.tsx", "utf8");
const productMotion = readFileSync("src/components/product-examination-motion.tsx", "utf8");
const discovery = readFileSync("src/components/discovery-experience.tsx", "utf8");
const shell = readFileSync("src/components/motion-shell.tsx", "utf8");
const styles = readFileSync("src/app/v2-sector9c.css", "utf8");

const combined = `${hero}\n${instrument}\n${scenes}\n${productMotion}\n${discovery}\n${styles}`;

test("homepage hero hands instrument theatre to the cinematic entry", () => {
  assert.match(hero, /hero-brand-stage/);
  assert.match(hero, /\/logo\.webp/);
  assert.doesNotMatch(hero, /InstrumentVisual|instrument-half-upper|instrument-half-lower/);
  assert.match(hero, /scope\?\.revert\(\)/);
});

test("macro instrument geometry retains a dedicated fixed pivot and generic annotations", () => {
  assert.match(instrument, /className="instrument-pivot"/);
  assert.match(instrument, /transformOrigin: "447px 460px"/);
  assert.match(instrument, />EDGE</);
  assert.match(instrument, />PIVOT</);
  assert.match(instrument, />GRIP</);
  assert.doesNotMatch(instrument, /\b(mm|cm|inch|inches|micron|steel grade)\b/i);
});

test("macro examination retains scoped bespoke motion", () => {
  assert.match(scenes, /macro-annotation-connectors/);
  assert.match(scenes, /macro-connector-path/);
  assert.match(scenes, /svg\.createDrawable/);
  assert.match(scenes, /scope\.revert\(\)/);
});

test("division state uses controlled mechanical alignment", () => {
  assert.match(discovery, /stage-axis/);
  assert.match(discovery, /stage-blade/);
  assert.match(discovery, /stage-pivot/);
  assert.match(discovery, /createTimeline/);
  assert.doesNotMatch(discovery, /spring|elastic|bounce/i);
});

test("product examination motion remains isolated from inquiry controls", () => {
  assert.match(productMotion, /product-measurement-overlay/);
  assert.match(productMotion, /product-stage-engraving/);
  assert.match(productMotion, /ProductImage/);
  assert.doesNotMatch(productMotion, /ProductInquiryControls|quantity|textarea|addProduct/);
});

test("global shell does not compete with component-owned signature timelines", () => {
  assert.doesNotMatch(shell, /const divisionScene/);
  assert.doesNotMatch(shell, /const macroScene/);
  assert.doesNotMatch(shell, /const evolutionScene/);
});

test("remaining special motion avoids prohibited spectacle and includes reduced motion", () => {
  assert.doesNotMatch(combined, /particle|cursor trail|magnetic|webgl|three\.js|liquid distortion/i);
  assert.doesNotMatch(combined, /spring\(|elastic|bounce/i);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /instrument-steel-sweep/);
  assert.match(styles, /product-inspection-sweep/);
});
