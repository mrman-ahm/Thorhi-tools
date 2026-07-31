# Premium Utility States Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build premium, trustworthy legal, not-found, runtime-error, and loading surfaces inside `/rebuild` without changing legacy public routes.

**Architecture:** Store legal copy in one verified data module. Use one route-scoped CSS module shared by small declarative route files. Keep the existing rebuild shell, typography variables, navigation, footer, inquiry behavior, and no-index boundary intact.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, CSS Modules, Playwright, Node test runner.

## Global Constraints

- No invented effective dates, privacy contacts, jurisdictions, retention periods, governing law, commercial terms, certifications, materials, capabilities, or company history.
- Important body copy and recovery controls must remain readable.
- No filler text, jokes, fake progress, endless spinner, or decorative spectacle.
- Legacy public routes remain unchanged.
- Reduced-motion and keyboard behavior are mandatory.
- No merge, deployment, public cutover, or GitHub Actions run.

---

### Task 1: Utility-state source contracts

**Files:**
- Create: `tests/rebuild-premium-utility-states.test.mjs`

**Interfaces:**
- Consumes: route paths and stable `data-utility-state` attributes.
- Produces: source-level contract for legal truth, retry behavior, loading semantics, and premium typography.

- [ ] Write source assertions for all route files, the legal data module, one shared CSS module, no invented claims, and semantic loading/error controls.
- [ ] Confirm the test would fail before implementation.
- [ ] Commit the contract.

### Task 2: Verified legal-content module and shared visual system

**Files:**
- Create: `src/rebuild/legal-content.ts`
- Create: `src/app/rebuild/utility-state.module.css`

**Interfaces:**
- Produces: `privacySections`, `termsSections`, and shared classes for legal, missing, error, and loading states.

- [ ] Add typed legal section data limited to implemented application boundaries.
- [ ] Add responsive regal masthead, sticky index, readable article, recovery actions, 404 reference, error panel, and reduced-motion loading ledger.
- [ ] Commit the shared foundation.

### Task 3: Rebuild legal routes

**Files:**
- Create: `src/app/rebuild/privacy/page.tsx`
- Create: `src/app/rebuild/terms/page.tsx`

**Interfaces:**
- Consumes: legal-content arrays and utility-state CSS.
- Produces: non-indexed rebuild-native legal routes with stable section anchors.

- [ ] Build one visible heading, review-status masthead, sticky index, numbered sections, truth boundary, and cross-links.
- [ ] Keep final legal review explicitly pending.
- [ ] Commit the routes.

### Task 4: Rebuild terminal states

**Files:**
- Create: `src/app/rebuild/not-found.tsx`
- Create: `src/app/rebuild/error.tsx`
- Create: `src/app/rebuild/loading.tsx`

**Interfaces:**
- Produces: catalogue-aware recovery, retry action using `reset()`, and semantic loading status.

- [ ] Build the 404 route with catalogue, search, and unlisted-instrument recovery.
- [ ] Build the client error boundary with retry and safe navigation.
- [ ] Build a calm loading ledger with `role="status"` and reduced-motion parity.
- [ ] Commit the terminal states.

### Task 5: Browser verification and project state

**Files:**
- Create: `tests/e2e/rebuild-premium-utility-states.spec.ts`
- Modify: `scripts/verify-design-milestone-6.sh`
- Modify: `tests/design-verification-harness.test.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: route, readability, overflow, recovery, and Axe coverage.

- [ ] Verify legal headings, section index, truth boundaries, 404 recovery, error retry source contract, and loading semantics.
- [ ] Verify body text is at least 16px and controls at least 44px.
- [ ] Verify no horizontal overflow at 320, 390, 768, 1280, and 1440 pixels.
- [ ] Add serious/critical Axe checks.
- [ ] Register the suite in Milestone 6 verification and document source implementation status.
- [ ] Commit verification and state updates.
