# THROHI Media Inventory and Placement Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a truthful, testable inventory of every approved image placement and every existing product image before any frontend placeholder is replaced.

**Architecture:** A data-first audit layer will register the five supplied catalogues, define stable semantic placement IDs from the approved Figma/page hierarchy, reconcile the current 626 product-media assignments, and emit machine-readable findings plus a human review report. The audit is isolated from the frontend branch; it publishes manifests that later integration work can consume without hardcoding assets into components.

**Tech Stack:** Node.js 22, ECMAScript modules, TypeScript 5.8, Next.js 15, React 19, `node:test`, Sharp 0.35, existing generated catalogue JSON, Figma file `w12E41un4krAwBqlo8fHa6`.

## Global Constraints

- Work only on `media/production-imagery-system`, based on `implementation/throhi-foundation-layer-1`.
- Do not merge, deploy, enable indexing, open a pull request, or intentionally trigger GitHub Actions.
- Figma file `THROHI Website & Admin Dashboard — Design System and UX` (`w12E41un4krAwBqlo8fHa6`) is the placement authority.
- Public divisions are Surgical and Dental only.
- Production images require exact identity verification and commercial-use approval.
- Competitor, marketplace, social-media, and unknown-license images remain reference-only.
- Preserve full product silhouettes; do not enlarge weak Surgical images merely to fill a stage.
- Do not rename, merge, or regenerate stable product IDs during this audit.
- Missing Figma node IDs, licenses, dimensions, or identity evidence must remain explicit blocked states.
- The audit may register attached catalogue metadata, but original PDF binaries are not committed to Git.

---

## File Structure

### Create

- `data/media/catalogue-sources.json` — immutable metadata and integrity fingerprints for the five supplied PDF sources.
- `data/media/placement-map.json` — semantic website/Figma image slots and their audit states.
- `data/media/product-review.decisions.json` — manual overrides, initially empty and versioned.
- `data/media/product-inventory.generated.json` — generated reconciliation of all runtime products and current media.
- `data/media/media-audit.generated.json` — generated totals, blockers, and severity findings.
- `docs/media/MEDIA_AUDIT_REPORT.generated.md` — readable review report.
- `scripts/media/media-model.mjs` — shared constants, validation, sorting, and normalization.
- `scripts/media/register-catalogue-sources.mjs` — verifies local PDF metadata against the registry when source files are mounted.
- `scripts/media/audit-placement-map.mjs` — validates placement completeness and Figma/code mapping states.
- `scripts/media/audit-product-media.mjs` — reconciles 626 runtime products with generated media records and public assets.
- `scripts/media/build-media-audit-report.mjs` — combines placement and product findings into JSON and Markdown.
- `tests/media-inventory.test.mjs` — source registry and model tests.
- `tests/media-placement-audit.test.mjs` — placement rules and blocked-state tests.
- `tests/media-product-audit.test.mjs` — 626-product reconciliation tests.
- `tests/media-audit-report.test.mjs` — deterministic report tests.

### Modify

- `package.json` — add narrowly scoped media-audit commands.
- `.gitignore` — ignore local mounted catalogue source directory and temporary audit renders, not generated audit manifests.
- `docs/superpowers/specs/2026-08-01-production-imagery-system-design.md` — change status to implementation active and link this plan after the first green audit run.

### Read Only

- `src/data/catalogue.runtime.generated.json`
- `src/data/catalogue.media.generated.json`
- `public/catalogue/manifest.json`
- `public/catalogue/media-manifest.json`
- `public/catalogue/products/*.avif`
- `scripts/prepare-product-media.mjs`
- `PROJECT_STATE.md`
- `docs/content/THROHI_CONTENT_MATRIX.md`

---

### Task 1: Register the Five Supplied Catalogue Sources

**Files:**
- Create: `data/media/catalogue-sources.json`
- Create: `scripts/media/media-model.mjs`
- Create: `scripts/media/register-catalogue-sources.mjs`
- Create: `tests/media-inventory.test.mjs`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `loadCatalogueSources(rootDir): Promise<CatalogueSource[]>`
- Produces: `validateCatalogueSourceRecord(record): string[]`
- Produces CLI: `node scripts/media/register-catalogue-sources.mjs [source-directory]`
- Catalogue records expose `id`, `fileName`, `division`, `category`, `pageCount`, `byteSize`, `sha256`, `pageWidthPt`, `pageHeightPt`, `pdfVersion`, and `availability`.

- [ ] **Step 1: Write the failing source-registry test**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const expected = new Map([
  ["knives", ["Knives Catalog(1).pdf", 15, 4783754, "babb328d97f5dda7cf3903bc716828ddb2589c9cf64de522294973b099b49175"]],
  ["cutters", ["Cutters Catalog(1).pdf", 13, 8796374, "79c0051f5298dea217ea8d99c2feec3a683667e44143dabb920a1d21ba68a6df"]],
  ["scissors", ["Scissors Catalog(1).pdf", 11, 9886964, "d55e98a41ddab4c87b328b8b4750a5a06f904f86f123d7618497a5f4de067901"]],
  ["punches", ["Punches Catalog(1).pdf", 31, 15930907, "124db1af5b108bb1439b76750b23f7dd4aaa050cfe9f5d225bf49426ff0ff09f"]],
  ["chisels", ["Chisels Catalog(1).pdf", 21, 9477868, "52ed46c5e88008566e0ee5c65e87dc853bf6a928e05625f5d382724071c5b3a0"]],
]);

test("catalogue source registry preserves supplied PDF identity", async () => {
  const registry = JSON.parse(await readFile("data/media/catalogue-sources.json", "utf8"));
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.sources.length, 5);
  for (const source of registry.sources) {
    const [fileName, pageCount, byteSize, sha256] = expected.get(source.id);
    assert.equal(source.fileName, fileName);
    assert.equal(source.pageCount, pageCount);
    assert.equal(source.byteSize, byteSize);
    assert.equal(source.sha256, sha256);
    assert.equal(source.division, "surgical");
    assert.equal(source.pageWidthPt, 612);
    assert.equal(source.pageHeightPt, 858);
    assert.equal(source.licenseStatus, "client-owned");
  }
});
```

- [ ] **Step 2: Run the test and verify the missing registry fails**

Run: `node --test tests/media-inventory.test.mjs`

Expected: FAIL with `ENOENT` for `data/media/catalogue-sources.json`.

- [ ] **Step 3: Create the source registry with exact supplied metadata**

Use `availability: "attached-not-mounted"`, `pdfVersion: "1.6"`, and `licenseStatus: "client-owned"` for all five records. Set `sourcePathEnv: "THROHI_CATALOGUE_SOURCE_DIR"`; do not commit absolute `/mnt/data` paths.

- [ ] **Step 4: Add reusable model validation**

`validateCatalogueSourceRecord` must reject missing IDs, non-Surgical division values for this source set, invalid 64-character SHA-256 values, non-positive page counts, non-positive dimensions, and non-client-owned licensing.

- [ ] **Step 5: Implement optional mounted-file verification**

The CLI must hash each mounted file with `node:crypto`, compare byte size and SHA-256, print one JSON result per catalogue, and exit non-zero on mismatch. If no source directory is supplied, it validates registry structure only and reports `attached-not-mounted` without failing.

- [ ] **Step 6: Run the focused test**

Run: `node --test tests/media-inventory.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add .gitignore data/media/catalogue-sources.json scripts/media/media-model.mjs scripts/media/register-catalogue-sources.mjs tests/media-inventory.test.mjs
git commit -m "feat: register supplied catalogue media sources"
```

---

### Task 2: Define the Semantic Placement Map

**Files:**
- Create: `data/media/placement-map.json`
- Create: `scripts/media/audit-placement-map.mjs`
- Create: `tests/media-placement-audit.test.mjs`

**Interfaces:**
- Consumes: model enums and validators from `scripts/media/media-model.mjs`.
- Produces: `auditPlacementMap(placementMap): PlacementAuditResult`.
- Each placement exposes `id`, `route`, `role`, `division`, `figmaFileKey`, `figmaPage`, `figmaNodeId`, `codeOwner`, `desktop`, `tablet`, `mobile`, `cropPolicy`, `priority`, `required`, `assetId`, and `status`.

- [ ] **Step 1: Write failing placement invariants**

Tests must assert:

```js
assert.equal(map.figmaFileKey, "w12E41un4krAwBqlo8fHa6");
assert.deepEqual(
  map.placements.filter((slot) => slot.required).map((slot) => slot.id).sort(),
  [
    "catalogues.dental.cover",
    "catalogues.surgical.cover",
    "company.evolution.static-fallback",
    "company.present-day.primary",
    "company.sialkot.context",
    "home.catalogues.surgical",
    "home.company.primary",
    "home.division.dental",
    "home.division.surgical",
    "home.hero.primary",
    "home.products.featured",
    "products.division.dental",
    "products.division.surgical",
  ]
);
```

Each required slot must define all three responsive records, a crop policy, alt-text policy, and one of these explicit statuses:

- `blocked-figma-node`
- `blocked-code-owner`
- `candidate-needed`
- `candidate-selected`
- `production-approved`

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/media-placement-audit.test.mjs`

Expected: FAIL because the placement map and audit function do not exist.

- [ ] **Step 3: Create truthful initial placements**

Seed the 13 required placements above. Use known page names from the approved Figma structure. Leave `figmaNodeId: null`, `codeOwner: null`, and `assetId: null` where the corresponding production frame or frontend component has not been inspected. Such records must use `status: "blocked-figma-node"` rather than invented mappings.

For product grid cards and Product Detail, define reusable pattern records instead of one placement per product:

- `pattern.product-card.image`
- `pattern.product-detail.primary`
- `pattern.related-product.image`
- `pattern.inquiry-snapshot.image`
- `pattern.search-result.image`

These use `cropPolicy: "contain"` and are not counted as editorial slots.

- [ ] **Step 4: Implement placement validation**

The audit must report:

- duplicate semantic IDs;
- invalid public divisions;
- missing responsive geometry;
- missing crop policy;
- a production-approved record without `figmaNodeId`, `codeOwner`, or `assetId`;
- a required record absent from the map;
- a product pattern using a destructive cover crop.

- [ ] **Step 5: Run focused tests**

Run: `node --test tests/media-placement-audit.test.mjs`

Expected: PASS with initial slots correctly reported as blocked, not approved.

- [ ] **Step 6: Commit**

```bash
git add data/media/placement-map.json scripts/media/audit-placement-map.mjs tests/media-placement-audit.test.mjs
git commit -m "feat: define semantic media placement audit"
```

---

### Task 3: Generate the Existing 626-Product Media Inventory

**Files:**
- Create: `data/media/product-review.decisions.json`
- Create: `scripts/media/audit-product-media.mjs`
- Create: `tests/media-product-audit.test.mjs`
- Generate: `data/media/product-inventory.generated.json`

**Interfaces:**
- Consumes: `src/data/catalogue.runtime.generated.json` and `src/data/catalogue.media.generated.json`.
- Produces: `buildProductMediaInventory({ runtime, media, decisions, publicRoot }): Promise<ProductMediaInventory>`.
- Product records expose stable identity, current media metadata, variant codes, source provenance, quality flags, and review status.

- [ ] **Step 1: Write failing reconciliation tests**

Tests must assert:

```js
assert.equal(inventory.schemaVersion, 1);
assert.equal(inventory.products.length, 626);
assert.equal(new Set(inventory.products.map((product) => product.productId)).size, 626);
assert.equal(inventory.summary.runtimeProducts, 626);
assert.equal(inventory.summary.mediaRecords, 626);
assert.equal(inventory.summary.variantCodes, 1434);
assert.equal(inventory.summary.missingMedia, 0);
assert.equal(inventory.summary.duplicatePaths, 0);
```

Every record must retain:

- `productId`
- `productName`
- `representativeCode`
- `division`
- `familyId`
- `familyLabel`
- `variantCodes`
- `currentAssetPath`
- `width`
- `height`
- `bytes`
- `sourceType: "repository-source-derived"`
- `licenseStatus: "client-owned"`
- `identityConfidence: "unapproved"`
- `silhouetteStatus: "needs-review"`
- `qualityStatus`
- `reviewState: "discovered"`

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/media-product-audit.test.mjs`

Expected: FAIL because the audit module and generated inventory are absent.

- [ ] **Step 3: Implement deterministic reconciliation**

Match media by stable product ID only. Do not fuzzy-match or modify product identities in this task. Sort records by `division`, `familyLabel`, `productName`, then `representativeCode` for deterministic output.

- [ ] **Step 4: Add objective quality flags**

Without judging exact silhouette yet, derive only measurable findings:

- `missing-dimensions`
- `zero-byte-record`
- `unexpected-format`
- `small-source` when width or height is below 480 px;
- `extreme-aspect-ratio` when the longer side is more than eight times the shorter side;
- `duplicate-asset-path`
- `missing-public-file` when local verification is available.

Do not automatically mark identity as verified from filename similarity.

- [ ] **Step 5: Add manual-decision overlay contract**

`product-review.decisions.json` starts as:

```json
{
  "schemaVersion": 1,
  "updatedAt": null,
  "decisions": []
}
```

A decision may change review state or attach catalogue evidence, but it may not change stable product ID, product name, code, division, or family.

- [ ] **Step 6: Generate the inventory**

Run: `node scripts/media/audit-product-media.mjs`

Expected stdout:

```json
{"products":626,"variants":1434,"missingMedia":0,"duplicatePaths":0}
```

- [ ] **Step 7: Run focused tests**

Run: `node --test tests/media-product-audit.test.mjs`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add data/media/product-review.decisions.json data/media/product-inventory.generated.json scripts/media/audit-product-media.mjs tests/media-product-audit.test.mjs
git commit -m "feat: audit existing product media assignments"
```

---

### Task 4: Build the Combined Audit Report

**Files:**
- Create: `scripts/media/build-media-audit-report.mjs`
- Create: `tests/media-audit-report.test.mjs`
- Generate: `data/media/media-audit.generated.json`
- Generate: `docs/media/MEDIA_AUDIT_REPORT.generated.md`

**Interfaces:**
- Consumes: catalogue registry, placement audit, and product inventory.
- Produces: `buildMediaAudit({ sources, placements, products }): MediaAudit`.
- Produces CLI: `node scripts/media/build-media-audit-report.mjs`.

- [ ] **Step 1: Write failing report tests**

The report test must require these sections in this order:

```md
# THROHI Media Audit Report
## Source Catalogues
## Placement Coverage
## Existing Product Media
## Blocking Issues
## Next Review Queue
```

The JSON report must contain `generatedAt`, `sourceCatalogues`, `placementSummary`, `productSummary`, `blockers`, and `nextQueue`.

- [ ] **Step 2: Run and verify failure**

Run: `node --test tests/media-audit-report.test.mjs`

Expected: FAIL because the report builder does not exist.

- [ ] **Step 3: Implement severity rules**

Use only:

- `blocker` — prevents production integration;
- `review` — requires human/Figma/catalogue review;
- `information` — measurable state that does not block.

Initial blockers must include required placements without Figma node IDs and any product missing media. Initial review items must include all products whose identity confidence remains unapproved.

- [ ] **Step 4: Produce a deterministic next queue**

Queue order:

1. required above-the-fold Home placements;
2. Surgical and Dental division imagery;
3. catalogue covers;
4. Company contextual imagery;
5. products with missing or measurable quality failures;
6. remaining products grouped by catalogue family.

- [ ] **Step 5: Generate and test**

Run:

```bash
node scripts/media/build-media-audit-report.mjs
node --test tests/media-audit-report.test.mjs
```

Expected: generator exits zero and test passes.

- [ ] **Step 6: Commit**

```bash
git add data/media/media-audit.generated.json docs/media/MEDIA_AUDIT_REPORT.generated.md scripts/media/build-media-audit-report.mjs tests/media-audit-report.test.mjs
git commit -m "feat: publish deterministic media audit report"
```

---

### Task 5: Add Repeatable Audit Commands and Full Verification

**Files:**
- Modify: `package.json`
- Modify: `docs/superpowers/specs/2026-08-01-production-imagery-system-design.md`

**Interfaces:**
- Produces npm scripts:
  - `media:sources`
  - `media:audit:placements`
  - `media:audit:products`
  - `media:audit:report`
  - `media:audit`
  - `test:media`

- [ ] **Step 1: Add exact package scripts**

```json
{
  "media:sources": "node scripts/media/register-catalogue-sources.mjs",
  "media:audit:placements": "node scripts/media/audit-placement-map.mjs",
  "media:audit:products": "node scripts/media/audit-product-media.mjs",
  "media:audit:report": "node scripts/media/build-media-audit-report.mjs",
  "media:audit": "npm run media:sources && npm run media:audit:placements && npm run media:audit:products && npm run media:audit:report",
  "test:media": "node --test tests/media-*.test.mjs"
}
```

- [ ] **Step 2: Run the complete media audit locally**

Run:

```bash
npm run media:audit
npm run test:media
```

Expected:

- five source records validate structurally;
- 13 required editorial placements and five product patterns are audited;
- blocked Figma/code mappings are reported honestly;
- 626 products and 1,434 variants reconcile;
- no missing current media and no duplicate current asset paths;
- all media tests pass.

- [ ] **Step 3: Run repository-safe verification without browser or Actions**

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected: all commands pass. Do not run GitHub Actions. Browser/Figma rendered review belongs to the next phase after placement nodes are available.

- [ ] **Step 4: Update specification status**

Change the design spec status to `Implementation active — inventory and placement audit complete` and link this plan and the generated report. Do not claim visual approval or image replacement completion.

- [ ] **Step 5: Commit**

```bash
git add package.json docs/superpowers/specs/2026-08-01-production-imagery-system-design.md
git commit -m "chore: wire repeatable media audit verification"
```

---

## Completion Checkpoint

This plan is complete only when the branch contains:

- exact source fingerprints for all five supplied catalogues;
- a truthful semantic map of required Figma/page image placements;
- a generated 626-product media inventory preserving 1,434 variant codes;
- explicit blockers instead of invented node, license, or identity approvals;
- deterministic JSON and Markdown audit reports;
- passing focused media tests and standard repository verification.

No placeholder replacement, external-image download, retouching, Figma upload, or frontend merge is authorized by this plan. Those begin in the next plan after the audit output identifies the exact work queue.
