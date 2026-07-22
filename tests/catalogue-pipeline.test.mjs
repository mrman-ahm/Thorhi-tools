import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCode, processRecords, slugify } from "../scripts/process-catalogue.mjs";

test("normalizes product codes and slugs deterministically", () => {
  assert.equal(normalizeCode(" thr sc 001 "), "THR-SC-001");
  assert.equal(slugify("  Operating   Scissors "), "operating-scissors");
});

test("separates approved and rejected records without silent loss", () => {
  const result = processRecords([
    { division: "Surgical", family: "Scissors", name: "Operating Scissors", code: "thr sc 001", status: "approved", legacyUrl: "/old/one" },
    { division: "Surgical", family: "Scissors", name: "Missing Code", code: "", status: "approved" },
    { division: "Unknown", family: "Unknown", name: "Unknown Product", code: "ABC-1", status: "approved" }
  ]);
  assert.equal(result.report.inputCount, 3);
  assert.equal(result.approved.length, 1);
  assert.equal(result.rejected.length, 2);
  assert.equal(result.approved.length + result.rejected.length, 3);
  assert.deepEqual(result.redirects, [{ from: "/old/one", to: "/products/surgical/scissors/operating-scissors", status: 301 }]);
});

test("rejects duplicate codes and warns about duplicate names", () => {
  const result = processRecords([
    { division: "Dental", family: "Extraction", name: "Extraction Forceps", code: "THR-DE-001", status: "approved" },
    { division: "Dental", family: "Extraction", name: "Extraction Forceps", code: "THR-DE-001", status: "approved" }
  ]);
  assert.equal(result.approved.length, 1);
  assert.equal(result.rejected.length, 1);
  assert.equal(result.report.warningCount, 1);
  assert.match(result.rejected[0].reasons.join(" "), /duplicate product code/);
});
