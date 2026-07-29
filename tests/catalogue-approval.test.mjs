import assert from "node:assert/strict";
import test from "node:test";
import runtime from "../src/data/catalogue.runtime.generated.json" with { type: "json" };
import { buildApprovedCatalogue } from "../scripts/promote-approved-catalogue.mjs";

const first = runtime.products[0];
const second = runtime.products[1];
const reviewedAt = "2026-07-30T00:00:00.000Z";

function review(decisions) {
  return {
    version: 1,
    reviewer: "Catalogue Reviewer",
    exportedAt: reviewedAt,
    decisions
  };
}

function decision(product, status = "approved", overrides = {}) {
  return {
    productId: product.id,
    status,
    reviewedAt,
    approvedName: "",
    approvedCode: "",
    approvedFamily: "",
    confirmImage: true,
    confirmVariants: true,
    confirmSourceReference: true,
    notes: "",
    ...overrides
  };
}

test("promotes only explicitly approved or corrected product identities", () => {
  const approved = buildApprovedCatalogue(runtime, review([
    decision(first),
    decision(second, "needs-client")
  ]));

  assert.equal(approved.products.length, 1);
  assert.equal(approved.products[0].id, first.id);
  assert.equal(approved.counts.approved, 1);
  assert.equal(approved.counts.needsClient, 1);
  assert.equal(approved.technicalStatus, "withheld-pending-verification");
});

test("requires separate confirmation for image, variants, and source reference", () => {
  const approved = buildApprovedCatalogue(runtime, review([
    decision(first, "approved", {
      confirmImage: false,
      confirmVariants: false,
      confirmSourceReference: false
    })
  ]));
  const product = approved.products[0];

  assert.equal(product.image, null);
  assert.equal(product.sourceReference, null);
  assert.deepEqual(product.variants, []);
});

test("accepts controlled identity corrections in the existing division", () => {
  const approved = buildApprovedCatalogue(runtime, review([
    decision(first, "corrected", { approvedName: `${first.name} Reviewed` })
  ]));

  assert.equal(approved.products[0].name, `${first.name} Reviewed`);
  assert.equal(approved.products[0].approval.decision, "corrected");
});

test("rejects unsupported fields and no-op corrections", () => {
  assert.throws(
    () => buildApprovedCatalogue(runtime, review([
      { ...decision(first), description: "Unsupported technical copy" }
    ])),
    /unsupported field/
  );
  assert.throws(
    () => buildApprovedCatalogue(runtime, review([decision(first, "corrected")])),
    /contains no identity correction/
  );
});

test("never emits technical catalogue fields", () => {
  const approved = buildApprovedCatalogue(runtime, review([decision(first)]));
  const serialized = JSON.stringify(approved);

  for (const field of ["description", "material", "finish", "measurement", "availability", "certification"]) {
    assert.equal(field in approved.products[0], false);
    assert.equal(serialized.includes(`"${field}"`), false);
  }
});

test("produces deterministic approved output for identical review input", () => {
  const input = review([decision(first), decision(second, "rejected")]);
  assert.deepEqual(buildApprovedCatalogue(runtime, input), buildApprovedCatalogue(runtime, input));
});
