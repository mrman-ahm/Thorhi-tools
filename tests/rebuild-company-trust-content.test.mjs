import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const requiredRoutes = [
  "src/app/rebuild/company/page.tsx",
  "src/app/rebuild/company/scissors-through-time/page.tsx",
  "src/app/rebuild/catalogues/page.tsx",
  "src/app/rebuild/contact/page.tsx",
];

test("company trust routes and shared components exist", () => {
  for (const path of requiredRoutes) assert.doesNotThrow(() => read(path), path);

  for (const path of [
    "src/components/rebuild/corporate/rebuild-page-hero.tsx",
    "src/components/rebuild/corporate/rebuild-section-heading.tsx",
    "src/components/rebuild/corporate/rebuild-division-ledger.tsx",
    "src/components/rebuild/corporate/rebuild-truth-boundary.tsx",
    "src/components/rebuild/corporate/rebuild-action-rail.tsx",
    "src/components/rebuild/corporate/rebuild-document-ledger.tsx",
    "src/components/rebuild/corporate/rebuild-contact-routes.tsx",
  ]) {
    assert.doesNotThrow(() => read(path), path);
  }
});

test("company content is verified and contains the four divisions", () => {
  const source = read("src/rebuild/company-content.ts");
  for (const required of [
    "THROHI Medical Tools",
    "Sialkot, Pakistan",
    "Surgical",
    "Dental and Orthodontic",
    "Veterinary",
    "Beauty",
  ]) {
    assert.match(source, new RegExp(required, "i"));
  }

  for (const prohibited of [
    "ISO",
    "certified",
    "premium steel",
    "world-class",
    "trusted worldwide",
    "years of experience",
    "OEM",
    "private label",
  ]) {
    assert.doesNotMatch(source, new RegExp(prohibited, "i"));
  }
});

test("full evolution route uses the approved renderer and truth boundary", () => {
  const source = read("src/app/rebuild/company/scissors-through-time/page.tsx");
  assert.match(source, /FrameEvolutionScene/);
  assert.match(source, /variant="full"/);
  assert.match(source, /not presented as THROHI corporate history/i);
});

test("rebuild navigation points to real corporate routes", () => {
  const navigation = read("src/rebuild/navigation.ts");
  const footer = read("src/components/rebuild/rebuild-footer.tsx");

  for (const route of [
    "/rebuild/company",
    "/rebuild/catalogues",
    "/rebuild/contact",
  ]) {
    assert.match(navigation, new RegExp(route.replaceAll("/", "\\/")));
    assert.match(footer, new RegExp(route.replaceAll("/", "\\/")));
  }

  assert.doesNotMatch(navigation, /\/rebuild#company|\/rebuild#contact/);
  assert.doesNotMatch(footer, /\/rebuild#company|\/rebuild#contact/);
});
