import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/page.tsx", "utf8");
const discovery = readFileSync("src/components/discovery-experience.tsx", "utf8");
const preview = readFileSync("src/components/catalogue-preview.tsx", "utf8");
const utility = readFileSync("src/components/v3/homepage-utility-chapters.tsx", "utf8");
const footer = readFileSync("src/components/site-footer.tsx", "utf8");
const evolution = readFileSync("src/components/frame-evolution-scene.tsx", "utf8");
const styles = readFileSync("src/app/v3-home-chapters.css", "utf8");
const layout = readFileSync("src/app/layout.tsx", "utf8");

const sequence = [
  "<HeroExperience />",
  "<DiscoveryExperience />",
  "<MacroInspectionScene />",
  "<FrameEvolutionScene />",
  "<HomepageUtilityChapters products={featuredProducts} />"
];

test("homepage renders the complete V3 chapter sequence", () => {
  let cursor = -1;
  for (const chapter of sequence) {
    const next = page.indexOf(chapter);
    assert.ok(next > cursor, `${chapter} must follow the previous chapter`);
    cursor = next;
  }
});

test("homepage featured objects come from the canonical catalogue", () => {
  assert.match(page, /products as catalogueProducts/);
  assert.match(page, /catalogueProducts\.filter/);
  assert.match(page, /featuredCodes/);
  assert.match(preview, /import \{ ProductCard \}/);
  assert.match(preview, /<ProductCard product=\{product\}/);
  assert.doesNotMatch(preview, /Temporary image placeholder for \$\{product\.name\}/);
});

test("homepage inquiry summary represents the complete basket, not only featured objects", () => {
  assert.match(utility, /<SavedInquiryPanel \/>/);
  assert.match(preview, /const \{ items \} = useInquiry\(\)/);
  assert.match(preview, /items\.map\(item =>/);
  assert.match(preview, /item\.manual \? <small>Unlisted reference<\/small>/);
  assert.doesNotMatch(preview, /products\.filter\(product => items\.some/);
});

test("division and family discovery derive from canonical catalogue records", () => {
  assert.match(discovery, /divisions as catalogueDivisions/);
  assert.match(discovery, /families as catalogueFamilies/);
  assert.match(discovery, /catalogueDivisions\.map/);
  assert.match(discovery, /catalogueFamilies\.find/);
  assert.match(discovery, /route: `\/products\/\$\{family\.division\}\/\$\{family\.slug\}`/);
  assert.match(discovery, /href=\{`\/products\/\$\{division\.slug\}`\}/);
  assert.match(discovery, /href=\{`\/search\?q=\$\{item\.query\}`\}/);
  assert.match(discovery, /href=\{family\.route\}/);
  assert.match(discovery, /division: "surgical", slug: "scissors"/);
  assert.match(discovery, /division: "dental", slug: "extraction"/);
});

test("family archive no longer creates an artificial horizontal scroll runway", () => {
  assert.doesNotMatch(discovery, /scrollWidth|maximumShift|translate3d\(\$\{-maximumShift|style\.height|window\.innerHeight \* 1\.25/);
  assert.doesNotMatch(discovery, /addEventListener\("scroll"/);
  assert.match(discovery, /normal document flow/);
});

test("catalogue command and inquiry workflow remain functional", () => {
  assert.match(utility, /action="\/search"/);
  assert.match(utility, /name="q"/);
  assert.match(utility, /<ProductCatalogue products=\{products\} \/>/);
  assert.match(utility, /<SavedInquiryPanel \/>/);
  assert.match(utility, /href="\/inquiry"/);
  assert.match(utility, /href="\/contact"/);
});

test("verification chapter does not expose false document downloads", () => {
  assert.match(utility, /Verified files only/);
  assert.match(utility, /No false download action/);
  assert.doesNotMatch(utility, /download=|href=.*\.pdf/i);
});

test("260-frame one-canvas evolution renderer remains present", () => {
  assert.match(evolution, /<canvas ref=\{canvasRef\}/);
  assert.match(evolution, /\/ 260/);
  assert.match(evolution, /chapterIndexForFrame\(frame\)/);
  assert.match(evolution, /data-rendered-frame/);
  assert.doesNotMatch(evolution, /EVOLUTION_CHAPTERS\.map\([^)]*<img/);
});

test("V3 homepage styles include responsive, reduced-motion, and reduced-transparency states", () => {
  assert.match(styles, /@media \(max-width:900px\)/);
  assert.match(styles, /@media \(max-width:680px\)/);
  assert.match(styles, /@media \(max-width:480px\)/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /prefers-reduced-transparency:reduce/);
});

test("quiet footer keeps official identity and all core routes", () => {
  assert.match(footer, /\/brand\/throhi-logo-clean\.webp/);
  for (const route of ["/products", "/search", "/inquiry", "/company", "/resources", "/contact", "/privacy", "/terms"]) {
    assert.match(footer, new RegExp(route.replace("/", "\\/")));
  }
  assert.doesNotMatch(footer, /footer-display/);
});

test("homepage chapter style layer loads after cinematic and optical layers", () => {
  const optical = layout.indexOf('import "./v3-optical-system.css"');
  const cinematic = layout.indexOf('import "./v3-cinematic-hero.css"');
  const chapters = layout.indexOf('import "./v3-home-chapters.css"');
  assert.ok(optical >= 0);
  assert.ok(cinematic > optical);
  assert.ok(chapters > cinematic);
});
