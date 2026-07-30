import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("rebuild shell uses the consolidated header and footer", async () => {
  const shell = await read("src/app/rebuild/rebuild-shell.tsx");

  assert.match(shell, /<RebuildHeader \/>/);
  assert.match(shell, /<RebuildFooter \/>/);
  assert.doesNotMatch(shell, /usePathname|useRouter|mobileMenu/);
});

test("rebuild navigation stays scoped and contains no direct-contact shortcut", async () => {
  const [navigation, header] = await Promise.all([
    read("src/rebuild/navigation.ts"),
    read("src/components/rebuild/rebuild-header.tsx"),
  ]);

  assert.match(navigation, /\/rebuild\/products/);
  assert.match(navigation, /\/rebuild\/inquiry/);
  assert.match(navigation, /\/rebuild\/company/);
  assert.match(navigation, /\/rebuild\/catalogues/);
  assert.match(navigation, /\/rebuild\/contact/);
  assert.match(navigation, /catalogueState: "pending"/);
  assert.doesNotMatch(navigation, /href: "\/rebuild#/);
  assert.doesNotMatch(`${navigation}\n${header}`, /wa\.me|WhatsApp/);
  assert.doesNotMatch(navigation, /href: "\/products"/);
});

test("rebuild homepage uses real catalogue media and verified source counts", async () => {
  const [page, hero, divisions, selectedFamilies] = await Promise.all([
    read("src/app/rebuild/page.tsx"),
    read("src/components/rebuild/home/home-hero.tsx"),
    read("src/components/rebuild/home/home-division-index.tsx"),
    read("src/components/rebuild/home/home-selected-families.tsx"),
  ]);

  assert.match(hero, /CatalogueMedia/);
  assert.match(divisions, /CatalogueMedia/);
  assert.match(selectedFamilies, /CatalogueMedia/);
  assert.match(page, /requireProduct\("04-0101"\)/);
  assert.match(page, /requireProduct\("SP-84"\)/);
  assert.match(page, /rebuildCatalogue\.counts\.products/);
  assert.match(page, /rebuildCatalogue\.counts\.variants/);
  assert.match(page, /SIALKOT \/ PAKISTAN/);
  assert.doesNotMatch(page, /mailto:|wa\.me/);
});

test("nonblocking quality work has one explicit deferred register", async () => {
  const deferred = await read("docs/qa/DEFERRED_WORK.md");

  assert.match(deferred, /Playwright/);
  assert.match(deferred, /EPERM/);
  assert.match(deferred, /url\.parse/);
  assert.match(deferred, /durable inquiry delivery/);
});
