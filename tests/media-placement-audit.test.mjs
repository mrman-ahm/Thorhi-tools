import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  auditPlacementMap,
  PRODUCT_PATTERN_IDS,
  REQUIRED_PLACEMENT_IDS,
} from "../scripts/media/audit-placement-map.mjs";

async function loadMap() {
  return JSON.parse(await readFile("data/media/placement-map.json", "utf8"));
}

test("placement map covers the approved required image roles", async () => {
  const map = await loadMap();
  assert.equal(map.figmaFileKey, "w12E41un4krAwBqlo8fHa6");
  assert.deepEqual(map.figmaAudit.topLevelPages, [{ id: "22:2", name: "00 Cover" }]);
  assert.equal(map.figmaAudit.status, "blocked-production-pages-missing");
  assert.ok(map.placements.every((slot) => slot.figmaPage === null));
  assert.ok(map.placements.every((slot) => slot.figmaNodeId === null));
  assert.deepEqual(
    map.placements.filter((slot) => slot.required).map((slot) => slot.id).sort(),
    [...REQUIRED_PLACEMENT_IDS].sort()
  );
  assert.deepEqual(
    map.placements.filter((slot) => slot.role === "product-pattern").map((slot) => slot.id).sort(),
    [...PRODUCT_PATTERN_IDS].sort()
  );
});

test("initial placement audit stays truthful about missing Figma and code mappings", async () => {
  const result = auditPlacementMap(await loadMap());
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.required, 13);
  assert.equal(result.summary.productPatterns, 5);
  assert.equal(result.summary.productionApproved, 0);
  assert.equal(result.summary.blocked, 13);
  assert.ok(result.blockers.every((blocker) => blocker.status === "blocked-figma-node"));
});

test("product patterns cannot use destructive cover crops", async () => {
  const map = await loadMap();
  const broken = structuredClone(map);
  broken.placements.find((slot) => slot.id === "pattern.product-card.image").cropPolicy = "editorial-cover";
  const result = auditPlacementMap(broken);
  assert.ok(result.errors.includes("pattern.product-card.image: product patterns must use contain"));
});

test("production approval requires Figma node, code owner, and asset", async () => {
  const map = await loadMap();
  const broken = structuredClone(map);
  const hero = broken.placements.find((slot) => slot.id === "home.hero.primary");
  hero.status = "production-approved";
  const result = auditPlacementMap(broken);
  assert.ok(result.errors.includes("home.hero.primary: approved placement requires an observed Figma page"));
  assert.ok(result.errors.includes("home.hero.primary: approved placement requires figmaNodeId"));
  assert.ok(result.errors.includes("home.hero.primary: approved placement requires codeOwner"));
  assert.ok(result.errors.includes("home.hero.primary: approved placement requires assetId"));
});
