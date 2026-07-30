# THROHI Company & Trust Spine Plan Review

**Parent plan:** `docs/superpowers/plans/2026-07-30-company-trust-spine.md`

This review is authoritative where it corrects sequencing or clarifies a test instruction in the parent plan.

## Review result

- Spec coverage: complete. Milestone 1 closure, truth boundaries, shared components, all four routes, navigation convergence, motion/reduced-motion/failure parity, documents, contact rendering, accessibility, performance, verification, screenshots, and documentation each map to a task.
- Placeholder scan: no `TBD`, `TODO`, `implement later`, or unresolved product decision remains.
- Type consistency: `RebuildCatalogueDocument`, `RebuildPageHeroProps`, `RebuildAction`, `VerifiedContactConfig`, `companyProfile`, `scissorsEditorialCopy`, `rebuildCatalogueDocuments`, and `isCompleteCatalogueDocument` are used consistently.
- Scope: the plan does not redesign catalogue discovery, product details, Inquiry List, legal pages, storage, delivery integration, public routes, or deployment.

## Required sequencing correction

The parent plan numbers navigation convergence as Task 5, before the four destination routes exist. That would create temporary navigation to 404 pages and prevents the task from ending with a fully green browser contract.

Execute tasks in this corrected order:

1. Parent Task 1 — close Milestone 1.
2. Parent Task 2 — commit red Milestone 2 contracts.
3. Parent Task 3 — typed content and document boundaries.
4. Parent Task 4 — shared corporate components.
5. Parent Task 6 — Company route.
6. Parent Task 7 — Scissors Through Time route.
7. Parent Task 8 — Catalogues route.
8. Parent Task 9 — Contact route.
9. Parent Task 5 — navigation and footer convergence, now with all destinations present.
10. Parent Task 10 — full convergence and verification.

When executing parent Task 5, run both its source test and browser navigation test. Both must pass before commit.

## Precise source-test implementation

`tests/rebuild-company-trust-content.test.mjs` must use Node source reads, not runtime TypeScript imports:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
```

Use `read(path)` for route existence/content assertions and exact regular expressions for prohibited claims.

`tests/rebuild-catalogue-documents.test.mjs` must source-check the TypeScript contract and validate behavior through a small test-local mirror of the completeness predicate. It must not add a runtime transpiler solely for tests.

## Milestone 1 debugging correction

Parent Task 1 must not treat the five missing-element failures as proof that production copy is absent. The current source already contains the company text and catalogue action. The task must first prove that the clean production server contains the milestone identity attribute.

After adding the identity attribute and clean-build boundaries, run the seven previously failing tests with one worker:

```bash
env PLAYWRIGHT_PORT=3100 PLAYWRIGHT_REUSE_SERVER=0 \
  npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts \
  --project=desktop-chromium --project=mobile-chromium \
  --workers=1 \
  --grep "verified company|homepage ends|mobile navigation|axe"
```

Only apply the documented contrast and focus fixes when the fresh production run reproduces those failures. Do not change company or utility copy merely to satisfy a stale-render symptom.

## File-list correction

Parent Task 1 does not need a direct edit to `src/components/rebuild/home/home-hero.module.css` if the contrast fix is made through `--throhi-green-600` in `src/app/rebuild/surgical-precision-shell.module.css`. Remove `home-hero.module.css` from the Task 1 commit unless fresh Axe evidence identifies a separate selector-level problem.

## Execution gate

The plan and this review are approved for execution. Begin with parent Task 1. Do not start parent Task 2 until the Milestone 1 automated gate passes and screenshot review results are recorded.