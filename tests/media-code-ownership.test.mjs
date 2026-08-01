import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { auditCodeOwnership } from "../scripts/media/audit-code-ownership.mjs";

async function loadInputs() {
  const [codeAudit, placementMap] = await Promise.all([
    readFile("data/media/code-ownership.json", "utf8").then(JSON.parse),
    readFile("data/media/placement-map.json", "utf8").then(JSON.parse),
  ]);
  return { codeAudit, placementMap };
}

test("every media placement has explicit frontend ownership or a blocked route", async () => {
  const { codeAudit, placementMap } = await loadInputs();
  const result = auditCodeOwnership(codeAudit, placementMap);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.totalPlacements, 18);
  assert.equal(result.summary.mapped, 16);
  assert.equal(result.summary.blocked, 2);
  assert.equal(result.summary.unexpectedDivisions, 2);
  assert.equal(result.summary.missingRoutes, 1);
  assert.equal(result.summary.globalBlockers, 2);
});

test("frontend division scope conflict is explicit and fail-closed", async () => {
  const { codeAudit, placementMap } = await loadInputs();
  const result = auditCodeOwnership(codeAudit, placementMap);
  const scopeBlocker = result.blockers.find(
    (blocker) => blocker.id === "global.public-division-scope"
  );
  assert.ok(scopeBlocker);
  assert.deepEqual(scopeBlocker.divisions, ["beauty", "veterinary"]);
  assert.equal(scopeBlocker.status, "blocked-public-division-conflict");
});

test("catalogue cover placements remain blocked while the route is absent", async () => {
  const { codeAudit, placementMap } = await loadInputs();
  const result = auditCodeOwnership(codeAudit, placementMap);
  assert.ok(
    result.blockers.some(
      (blocker) =>
        blocker.id === "global.catalogues-route" &&
        blocker.status === "blocked-missing-route"
    )
  );
  for (const placementId of [
    "catalogues.surgical.cover",
    "catalogues.dental.cover",
  ]) {
    const ownership = codeAudit.placements.find(
      (item) => item.placementId === placementId
    );
    assert.equal(ownership.codeOwner, null);
    assert.equal(ownership.status, "blocked-missing-route");
  }
});

test("mapped ownership cannot omit its inspected code evidence", async () => {
  const { codeAudit, placementMap } = await loadInputs();
  const broken = structuredClone(codeAudit);
  const hero = broken.placements.find(
    (item) => item.placementId === "home.hero.primary"
  );
  hero.evidence = [];
  const result = auditCodeOwnership(broken, placementMap);
  assert.ok(
    result.errors.includes(
      "home.hero.primary: mapped ownership requires evidence"
    )
  );
});
