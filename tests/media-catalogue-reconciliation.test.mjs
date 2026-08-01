import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCatalogueProductReconciliation,
} from "../scripts/media/reconcile-catalogue-page-evidence.mjs";

function inventoryFixture() {
  return {
    schemaVersion: 1,
    products: [
      {
        productId: "scissors-iris",
        productName: "Iris Scissors",
        representativeCode: "04-0901",
        division: "surgical",
        familyId: "scissors",
        variantCodes: ["04-0901", "04-0911"],
        sourceFile: "Scissors Catalog(1).pdf",
        sourcePdfPage: 2,
        sourcePrintedPage: 1,
      },
      {
        productId: "scissors-image-only",
        productName: "Image Only Instrument",
        representativeCode: "04-9999",
        division: "surgical",
        familyId: "scissors",
        variantCodes: ["04-9999"],
        sourceFile: "Scissors Catalog(1).pdf",
        sourcePdfPage: 3,
        sourcePrintedPage: 2,
      },
      {
        productId: "scissors-mismatch",
        productName: "Mismatched Instrument",
        representativeCode: "04-7777",
        division: "surgical",
        familyId: "scissors",
        variantCodes: ["04-7777"],
        sourceFile: "Scissors Catalog(1).pdf",
        sourcePdfPage: 2,
        sourcePrintedPage: 1,
      },
      {
        productId: "unknown-source-code-hit",
        productName: "Unlocated Iris",
        representativeCode: "04-0901",
        division: "surgical",
        familyId: "scissors",
        variantCodes: ["04-0901"],
        sourceFile: null,
        sourcePdfPage: null,
        sourcePrintedPage: null,
      },
      {
        productId: "outside-source-set",
        productName: "Dental Mirror",
        representativeCode: "DM-1",
        division: "dental",
        familyId: "mirrors",
        variantCodes: ["DM-1"],
        sourceFile: "Dental Catalog.pdf",
        sourcePdfPage: 4,
        sourcePrintedPage: 3,
      },
      {
        productId: "bad-page-pointer",
        productName: "Bad Pointer",
        representativeCode: "04-0901",
        division: "surgical",
        familyId: "scissors",
        variantCodes: ["04-0901"],
        sourceFile: "Scissors Catalog(1).pdf",
        sourcePdfPage: 99,
        sourcePrintedPage: 98,
      },
    ],
  };
}

function pageEvidenceFixture() {
  return {
    schemaVersion: 1,
    sources: [
      {
        id: "scissors",
        fileName: "Scissors Catalog(1).pdf",
        division: "surgical",
        category: "scissors",
        pages: [
          {
            sourceId: "scissors",
            pageNumber: 1,
            pageLabel: "cover",
            textLayerQuality: "image-only",
            observedCodes: [],
            reviewState: "cover-verified",
            renderSha256: "a".repeat(64),
          },
          {
            sourceId: "scissors",
            pageNumber: 2,
            pageLabel: "1",
            textLayerQuality: "rich",
            observedCodes: ["04-0901", "04-0911"],
            reviewState: "text-layer-review",
            renderSha256: "b".repeat(64),
          },
          {
            sourceId: "scissors",
            pageNumber: 3,
            pageLabel: "2",
            textLayerQuality: "image-only",
            observedCodes: [],
            reviewState: "manual-visual-review-required",
            renderSha256: "c".repeat(64),
          },
        ],
      },
    ],
  };
}

test("reconciliation uses exact source-page and code evidence without auto-approval", () => {
  const result = buildCatalogueProductReconciliation({
    inventory: inventoryFixture(),
    pageEvidence: pageEvidenceFixture(),
    generatedAt: "2026-08-01T00:00:00.000Z",
  });
  assert.equal(result.generatedAt, "2026-08-01T00:00:00.000Z");
  assert.deepEqual(result.summary, {
    products: 6,
    suppliedSourceProducts: 4,
    sourcePageExactCodeMatches: 1,
    manualVisualReviewRequired: 1,
    sourcePageCodeMismatches: 1,
    exactCodeCandidates: 1,
    outsideSuppliedSourceSet: 1,
    missingSourcePages: 1,
    identityApproved: 0,
  });

  const byId = new Map(result.products.map((product) => [product.productId, product]));
  const iris = byId.get("scissors-iris");
  assert.equal(iris.reconciliationStatus, "source-page-exact-code-match");
  assert.deepEqual(iris.matchedCodes, ["04-0901", "04-0911"]);
  assert.equal(iris.cataloguePage.sourceId, "scissors");
  assert.equal(iris.cataloguePage.pageNumber, 2);
  assert.equal(iris.cataloguePage.renderSha256, "b".repeat(64));
  assert.equal(iris.identityApproved, false);
  assert.equal(iris.recommendedReviewAction, "verify-silhouette-and-attach-evidence");

  assert.equal(
    byId.get("scissors-image-only").reconciliationStatus,
    "manual-visual-review-required"
  );
  assert.equal(
    byId.get("scissors-mismatch").reconciliationStatus,
    "source-page-code-mismatch"
  );
  assert.equal(
    byId.get("unknown-source-code-hit").reconciliationStatus,
    "exact-code-candidate"
  );
  assert.equal(
    byId.get("outside-source-set").reconciliationStatus,
    "outside-supplied-source-set"
  );
  assert.equal(
    byId.get("bad-page-pointer").reconciliationStatus,
    "missing-source-page"
  );
});

test("printed-page label is a safe fallback when PDF page is absent", () => {
  const inventory = inventoryFixture();
  inventory.products = [
    {
      ...inventory.products[0],
      sourcePdfPage: null,
      sourcePrintedPage: 1,
    },
  ];
  const result = buildCatalogueProductReconciliation({
    inventory,
    pageEvidence: pageEvidenceFixture(),
  });
  assert.equal(result.products[0].pageResolution, "printed-page-label");
  assert.equal(result.products[0].cataloguePage.pageNumber, 2);
  assert.equal(result.products[0].reconciliationStatus, "source-page-exact-code-match");
});

test("duplicate exact code locations remain review candidates, never automatic identity", () => {
  const evidence = pageEvidenceFixture();
  evidence.sources.push({
    id: "knives",
    fileName: "Knives Catalog(1).pdf",
    division: "surgical",
    category: "knives",
    pages: [
      {
        sourceId: "knives",
        pageNumber: 1,
        pageLabel: "cover",
        textLayerQuality: "image-only",
        observedCodes: [],
        reviewState: "cover-verified",
        renderSha256: "d".repeat(64),
      },
      {
        sourceId: "knives",
        pageNumber: 2,
        pageLabel: "1",
        textLayerQuality: "rich",
        observedCodes: ["04-0901"],
        reviewState: "text-layer-review",
        renderSha256: "e".repeat(64),
      },
    ],
  });
  const inventory = inventoryFixture();
  inventory.products = [inventory.products[3]];
  const result = buildCatalogueProductReconciliation({
    inventory,
    pageEvidence: evidence,
  });
  assert.equal(result.products[0].reconciliationStatus, "exact-code-candidate");
  assert.equal(result.products[0].exactCodeCandidates.length, 2);
  assert.equal(result.products[0].identityApproved, false);
});
