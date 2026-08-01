import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function loadEvidence() {
  return JSON.parse(await readFile("data/media/figma-placement-evidence.json", "utf8"));
}

test("Figma evidence records empty production pages without inventing placements", async () => {
  const evidence = await loadEvidence();
  assert.equal(evidence.schemaVersion, 1);
  assert.equal(evidence.figmaFileKey, "w12E41un4krAwBqlo8fHa6");
  assert.deepEqual(evidence.productionPages.map(({ id, name, childCount }) => ({ id, name, childCount })), [
    { id: "22:6", name: "04 Desktop", childCount: 0 },
    { id: "22:7", name: "05 Tablet", childCount: 0 },
    { id: "22:8", name: "06 Mobile", childCount: 0 },
  ]);
  assert.equal(evidence.productionReady, false);
});

test("Figma evidence maps every current placement except the missing search-result pattern", async () => {
  const evidence = await loadEvidence();
  assert.equal(evidence.placements.length, 18);
  assert.equal(evidence.summary.mapped, 17);
  assert.equal(evidence.summary.unmapped, 1);
  const byId = new Map(evidence.placements.map((placement) => [placement.id, placement]));
  assert.equal(byId.get("home.hero.primary").nodeId, "93:59");
  assert.equal(byId.get("company.evolution.static-fallback").nodeId, "99:267");
  assert.equal(byId.get("pattern.product-card.image").nodeId, "57:39");
  assert.equal(byId.get("pattern.product-detail.primary").nodeId, "102:292");
  assert.equal(byId.get("pattern.inquiry-snapshot.image").nodeId, "63:122");
  assert.equal(byId.get("pattern.search-result.image").nodeId, null);
  assert.equal(byId.get("pattern.search-result.image").evidenceStatus, "missing-dedicated-node");
});

test("wireframe section evidence is not mislabeled as high-fidelity production approval", async () => {
  const evidence = await loadEvidence();
  for (const placement of evidence.placements.filter((entry) => entry.nodeId)) {
    assert.ok(["wireframe-node", "component-node"].includes(placement.evidenceStatus));
    assert.equal(placement.productionApproved, false);
  }
});
