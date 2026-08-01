import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  validateCataloguePageEvidence,
} from "../scripts/media/validate-catalogue-page-evidence.mjs";

async function loadEvidence() {
  return JSON.parse(
    await readFile("data/media/catalogue-page-evidence.generated.json", "utf8")
  );
}

const expectedSources = [
  {
    id: "knives",
    fileName: "Knives Catalog(1).pdf",
    pageCount: 15,
    byteSize: 4783754,
    sha256: "babb328d97f5dda7cf3903bc716828ddb2589c9cf64de522294973b099b49175",
  },
  {
    id: "cutters",
    fileName: "Cutters Catalog(1).pdf",
    pageCount: 13,
    byteSize: 8796374,
    sha256: "79c0051f5298dea217ea8d99c2feec3a683667e44143dabb920a1d21ba68a6df",
  },
  {
    id: "scissors",
    fileName: "Scissors Catalog(1).pdf",
    pageCount: 11,
    byteSize: 9886964,
    sha256: "d55e98a41ddab4c87b328b8b4750a5a06f904f86f123d7618497a5f4de067901",
  },
  {
    id: "punches",
    fileName: "Punches Catalog(1).pdf",
    pageCount: 31,
    byteSize: 15930907,
    sha256: "124db1af5b108bb1439b76750b23f7dd4aaa050cfe9f5d225bf49426ff0ff09f",
  },
  {
    id: "chisels",
    fileName: "Chisels Catalog(1).pdf",
    pageCount: 21,
    byteSize: 9477868,
    sha256: "52ed46c5e88008566e0ee5c65e87dc853bf6a928e05625f5d382724071c5b3a0",
  },
];

test("catalogue page evidence covers the exact five supplied PDFs", async () => {
  const evidence = await loadEvidence();
  assert.deepEqual(validateCataloguePageEvidence(evidence), {
    sources: 5,
    pages: 91,
    errors: [],
  });
  assert.equal(evidence.generator.ocrUsed, false);
  assert.deepEqual(evidence.summary, {
    sources: 5,
    pages: 91,
    bytes: 48875867,
    textChars: 16215,
    embeddedImageCount: 475,
    richPages: 22,
    sparsePages: 18,
    imageOnlyPages: 51,
    manualVisualReviewRequired: 64,
  });
  assert.deepEqual(
    evidence.sources.map(({ id, fileName, pageCount, byteSize, sha256 }) => ({
      id,
      fileName,
      pageCount,
      byteSize,
      sha256,
    })),
    expectedSources
  );
});

test("every PDF page has stable render evidence and contiguous numbering", async () => {
  const evidence = await loadEvidence();
  for (const source of evidence.sources) {
    assert.equal(source.pages.length, source.pageCount);
    for (const [index, page] of source.pages.entries()) {
      assert.equal(page.sourceId, source.id);
      assert.equal(page.pageNumber, index + 1);
      assert.equal(page.pageLabel, index === 0 ? "cover" : String(index));
      assert.equal(page.widthPt, 612);
      assert.equal(page.heightPt, 858);
      assert.match(page.renderSha256, /^[a-f0-9]{64}$/);
      assert.ok(page.renderWidthPx > 0);
      assert.ok(page.renderHeightPx > 0);
    }
  }
});

test("sparse and image-only pages cannot receive automatic product identity", async () => {
  const evidence = await loadEvidence();
  for (const source of evidence.sources) {
    for (const page of source.pages) {
      assert.equal("productId" in page, false);
      assert.equal("productName" in page, false);
      if (page.pageNumber === 1) {
        assert.equal(page.reviewState, "cover-verified");
      } else if (
        page.textLayerQuality !== "rich" ||
        page.observedCodes.length === 0
      ) {
        assert.equal(page.reviewState, "manual-visual-review-required");
      }
    }
  }
  const punches = evidence.sources.find((source) => source.id === "punches");
  assert.equal(punches.textLayerQualityCounts.rich, 0);
  assert.equal(punches.reviewStateCounts["manual-visual-review-required"], 30);
});

test("rich text pages preserve source-derived codes without renaming products", async () => {
  const evidence = await loadEvidence();
  const source = (id) => evidence.sources.find((entry) => entry.id === id);
  assert.ok(source("scissors").pages[1].observedCodes.includes("04-0901"));
  assert.ok(source("cutters").pages[10].observedCodes.includes("SC-01T"));
  assert.ok(source("chisels").pages[3].observedCodes.includes("36-6901"));
  assert.ok(source("knives").pages[2].observedCodes.includes("18-0648"));
  assert.equal(source("knives").pages[2].reviewState, "manual-visual-review-required");
});
