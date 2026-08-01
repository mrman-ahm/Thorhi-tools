import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  buildMediaAudit,
  renderMediaAuditMarkdown,
} from "../scripts/media/build-media-audit-report.mjs";

async function sourceRegistry() {
  return JSON.parse(await readFile("data/media/catalogue-sources.json", "utf8"));
}

async function placementMap() {
  return JSON.parse(await readFile("data/media/placement-map.json", "utf8"));
}

async function figmaEvidence() {
  return JSON.parse(await readFile("data/media/figma-placement-evidence.json", "utf8"));
}

function productInventory() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-08-01T00:00:00.000Z",
    summary: {
      runtimeProducts: 2,
      mediaRecords: 2,
      variantCodes: 3,
      missingMedia: 0,
      orphanMedia: 0,
      duplicatePaths: 0,
      missingPublicFiles: 0,
      qualityReviewRequired: 1,
      identityReviewRequired: 2,
    },
    products: [
      {
        productId: "dental-cutters-bb-1",
        division: "dental",
        familyId: "cutters",
        familyLabel: "Cutters",
        identityConfidence: "unapproved",
        qualityFlags: ["small-source"],
      },
      {
        productId: "surgical-scissors-aa-1",
        division: "surgical",
        familyId: "scissors",
        familyLabel: "Scissors",
        identityConfidence: "unapproved",
        qualityFlags: [],
      },
    ],
  };
}

test("combined report uses observed Figma evidence instead of requesting decorative images", async () => {
  const audit = buildMediaAudit({
    sourcesRegistry: await sourceRegistry(),
    placementMap: await placementMap(),
    figmaEvidence: await figmaEvidence(),
    productInventory: productInventory(),
    generatedAt: "2026-08-01T00:00:00.000Z",
  });
  assert.equal(audit.generatedAt, "2026-08-01T00:00:00.000Z");
  assert.equal(audit.sourceCatalogues.total, 5);
  assert.equal(audit.placementSummary.required, 13);
  assert.equal(audit.productSummary.runtimeProducts, 2);
  assert.equal(audit.figmaEvidence.productionReady, false);
  assert.equal(audit.figmaEvidence.mapped, 17);
  assert.equal(audit.figmaEvidence.unmapped, 1);
  assert.equal(audit.figmaEvidence.dedicatedImageNodes, 5);
  assert.equal(audit.figmaEvidence.noDedicatedImageSlot, 12);
  assert.deepEqual(audit.figmaEvidence.emptyProductionPages, ["04 Desktop", "05 Tablet", "06 Mobile"]);
  assert.equal(audit.blockers.length, 2);
  assert.deepEqual(
    audit.blockers.map((blocker) => blocker.id).sort(),
    ["company.evolution.static-fallback", "home.hero.primary"]
  );
  assert.equal(audit.nextQueue[0].id, "home.hero.primary");
  assert.ok(!audit.nextQueue.some((item) => item.id === "home.division.dental"));
  assert.ok(!audit.nextQueue.some((item) => item.id === "company.sialkot.context"));

  const markdown = renderMediaAuditMarkdown(audit);
  const headings = [
    "# THROHI Media Audit Report",
    "## Source Catalogues",
    "## Placement Coverage",
    "## Figma Placement Evidence",
    "## Existing Product Media",
    "## Blocking Issues",
    "## Next Review Queue",
  ];
  let previous = -1;
  for (const heading of headings) {
    const index = markdown.indexOf(heading);
    assert.ok(index > previous, `${heading} must appear in order`);
    previous = index;
  }
});

test("product media inconsistencies remain blockers alongside image-bearing placements", async () => {
  const inventory = productInventory();
  inventory.summary.missingMedia = 1;
  inventory.summary.duplicatePaths = 1;
  const audit = buildMediaAudit({
    sourcesRegistry: await sourceRegistry(),
    placementMap: await placementMap(),
    figmaEvidence: await figmaEvidence(),
    productInventory: inventory,
  });
  assert.ok(audit.blockers.some((blocker) => blocker.type === "product-media"));
  assert.ok(audit.blockers.some((blocker) => blocker.type === "duplicate-assets"));
  assert.equal(audit.blockers.filter((blocker) => blocker.type === "placement").length, 2);
});

test("Figma evidence must match the approved file and placement registry", async () => {
  const evidence = await figmaEvidence();
  evidence.figmaFileKey = "wrong-file";
  assert.throws(
    () =>
      buildMediaAudit({
        sourcesRegistry: awaitableSourceRegistry,
        placementMap: awaitablePlacementMap,
        figmaEvidence: evidence,
        productInventory: productInventory(),
      }),
    /Figma evidence file key/
  );
});

const awaitableSourceRegistry = await sourceRegistry();
const awaitablePlacementMap = await placementMap();
