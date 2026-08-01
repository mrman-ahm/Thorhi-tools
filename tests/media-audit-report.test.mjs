import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  buildMediaAudit,
  renderMediaAuditMarkdown,
} from "../scripts/media/build-media-audit-report.mjs";

async function sourceRegistry() {
  return JSON.parse(
    await readFile("data/media/catalogue-sources.json", "utf8")
  );
}

async function placementMap() {
  return JSON.parse(
    await readFile("data/media/placement-map.json", "utf8")
  );
}

async function codeOwnership() {
  return JSON.parse(
    await readFile("data/media/code-ownership.json", "utf8")
  );
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

test("combined report preserves deterministic sections and blocker truth", async () => {
  const audit = buildMediaAudit({
    sourcesRegistry: await sourceRegistry(),
    placementMap: await placementMap(),
    codeOwnership: await codeOwnership(),
    productInventory: productInventory(),
    generatedAt: "2026-08-01T00:00:00.000Z",
  });
  assert.equal(audit.generatedAt, "2026-08-01T00:00:00.000Z");
  assert.equal(audit.sourceCatalogues.total, 5);
  assert.equal(audit.placementSummary.required, 13);
  assert.equal(audit.codeSummary.mapped, 16);
  assert.equal(audit.codeSummary.blocked, 2);
  assert.equal(audit.productSummary.runtimeProducts, 2);
  assert.equal(audit.blockers.length, 15);
  assert.ok(
    audit.blockers.every((blocker) => blocker.severity === "blocker")
  );
  assert.equal(audit.nextQueue[0].id, "global.public-division-scope");

  const markdown = renderMediaAuditMarkdown(audit);
  const headings = [
    "# THROHI Media Audit Report",
    "## Source Catalogues",
    "## Placement Coverage",
    "## Frontend Ownership",
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

test("product media inconsistencies become blockers", async () => {
  const inventory = productInventory();
  inventory.summary.missingMedia = 1;
  inventory.summary.duplicatePaths = 1;
  const audit = buildMediaAudit({
    sourcesRegistry: await sourceRegistry(),
    placementMap: await placementMap(),
    codeOwnership: await codeOwnership(),
    productInventory: inventory,
  });
  assert.ok(
    audit.blockers.some((blocker) => blocker.type === "product-media")
  );
  assert.ok(
    audit.blockers.some((blocker) => blocker.type === "duplicate-assets")
  );
});
