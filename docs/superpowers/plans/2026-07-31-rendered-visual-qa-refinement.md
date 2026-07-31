# Rendered Visual QA Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct header offsets, laptop-fold composition, regal typography continuity, and procurement-label readability across the premium rebuild.

**Architecture:** Add stable data markers to the existing routes and apply one scoped `visual-qa-refinements.module.css` layer from `RebuildShell`. Use direct edits only where a module-owned pseudo-element or intrinsic route layout cannot be safely corrected through the shared layer.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS Modules, Playwright, Node test runner.

## Global Constraints

- Preserve catalogue search, URL state, filters, pagination, product routing, and Inquiry List behavior.
- Preserve the original rebuild and premium contract markers.
- Do not invent business facts, specifications, contact details, legal terms, or documents.
- Do not touch public routes, deployment, indexing, PRs, merges, or GitHub Actions.
- Important labels and procurement states render at 12px or larger.
- Body and helper copy render at 14px or larger.
- Reduced-motion, forced-colors, focus, and overflow protections remain intact.

---

### Task 1: Visual QA source contract

**Files:**
- Create: `tests/rebuild-rendered-visual-qa.test.mjs`

**Interfaces:**
- Consumes: approved design specification.
- Produces: source assertions for route markers, shared refinement import, readable-size tokens, header offsets, and laptop-height rules.

- [ ] Write assertions that fail until the new CSS module and route markers exist.
- [ ] Assert the shared layer contains `12px`, `14px`, `80px`, `66px`, `1280px`, and reduced-motion handling.
- [ ] Assert homepage, catalogue, product, and inquiry sources expose stable visual markers.
- [ ] Commit the failing contract.

### Task 2: Stable route markers

**Files:**
- Modify: `src/components/rebuild/home/home-division-index.tsx`
- Modify: `src/components/rebuild/home/home-selected-families.tsx`
- Modify: `src/components/rebuild/home/home-company-intro.tsx`
- Modify: `src/components/rebuild/home/home-utilities-contact.tsx`
- Modify: `src/app/rebuild/products/catalogue-client.tsx`
- Modify: `src/app/rebuild/products/[productId]/page.tsx`
- Modify: `src/app/rebuild/inquiry/page.tsx`

**Interfaces:**
- Produces: `data-home-divisions`, `data-home-selected`, `data-home-company`, `data-home-utilities`, `data-catalogue-workspace`, `data-product-page`, `data-product-return`, `data-product-media-stage`, `data-product-spec-ledger`, `data-variant-record`, `data-related-record`, and `data-inquiry-stages`.

- [ ] Add semantic visual markers without changing component behavior.
- [ ] Preserve existing ARIA and route contracts.
- [ ] Commit markers.

### Task 3: Shared visual QA refinement layer

**Files:**
- Create: `src/app/rebuild/visual-qa-refinements.module.css`
- Modify: `src/app/rebuild/rebuild-shell.tsx`

**Interfaces:**
- Consumes: stable markers from Task 2 and premium tokens.
- Produces: one rebuild-scoped refinement layer.

- [ ] Import and apply the refinement class after `premium-convergence.module.css`.
- [ ] Apply Cormorant Garamond to homepage secondary headings, family names, product names, inquiry section headings, and empty-state headings.
- [ ] Raise essential labels, statuses, field labels, filter labels, ledger labels, and action text to at least 12px.
- [ ] Raise helper/body copy to at least 14px.
- [ ] Align product route content with the 80px desktop and 66px mobile header.
- [ ] Tighten product examination height for 1280 × 800 while preserving image prominence.
- [ ] Tighten catalogue and inquiry masthead spacing at laptop heights.
- [ ] Preserve mobile stacking at 390px and 320px.
- [ ] Preserve reduced-motion behavior.
- [ ] Commit the refinement layer.

### Task 4: Intrinsic homepage correction

**Files:**
- Modify: `src/components/rebuild/home/home-hero.module.css`

**Interfaces:**
- Produces: divider aligned to the premium header and laptop-height hero rhythm.

- [ ] Change the desktop divider origin from 72px to 80px.
- [ ] Reduce laptop-height hero minimum/padding only under `max-height: 850px` and `min-width: 821px`.
- [ ] Keep tablet/mobile composition unchanged.
- [ ] Commit intrinsic corrections.

### Task 5: Browser visual-QA contract

**Files:**
- Create: `tests/e2e/rebuild-rendered-visual-qa.spec.ts`
- Modify: `scripts/verify-design-milestone-6.sh`
- Modify: `tests/design-verification-harness.test.mjs`

**Interfaces:**
- Produces: rendered checks for representative routes and five target viewport widths.

- [ ] Verify premium secondary headings use Cormorant.
- [ ] Verify essential labels render at 12px or larger.
- [ ] Verify product content starts below the fixed header.
- [ ] Verify product primary inquiry action is within a 1280 × 800 first viewport after navigation to the product examination area.
- [ ] Verify no horizontal overflow at 320, 390, 768, 1280, and 1440 widths.
- [ ] Verify reduced-motion mode remains stable.
- [ ] Register the suite in the Milestone 6 gate.
- [ ] Commit browser coverage.

### Task 6: Project state and scope review

**Files:**
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: one clean statement that visual-QA source refinement is present and runtime screenshot verification remains pending.

- [ ] Record identified defects and implemented corrections.
- [ ] Keep real preview/screenshot review as a remaining gate.
- [ ] Compare branch scope from the prior head.
- [ ] Do not claim tests or screenshots passed without fresh runtime evidence.
- [ ] Commit documentation.

## Self-review

- Every approved defect maps to a task.
- No placeholder tasks or invented content exist.
- Route behavior is out of scope and preserved.
- The plan distinguishes source implementation from rendered proof.
