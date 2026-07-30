# Product Examination & Inquiry Desk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign product detail and Inquiry List into one premium, responsive procurement workflow while preserving every existing catalogue and inquiry behavior.

**Architecture:** Keep data, return-path, inquiry provider, validation, API, and success routing intact. Replace presentation through focused product-detail and inquiry components plus route-scoped CSS modules. Source contracts and Playwright validate visible behavior rather than brittle class placement.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules, Node test runner, Playwright, Axe.

## Global Constraints

- Work only on `design/surgical-precision-archive`.
- Do not merge, deploy, open a pull request, or trigger GitHub Actions.
- Preserve real catalogue media, safe return context, base/variant inquiry identity, local persistence, validation, API submission, and success routing.
- Do not add pricing, stock, ratings, checkout, unsupported specifications, certifications, materials, or manufacturing claims.
- Prioritize layout, visual hierarchy, real imagery, responsive quality, and procurement usability.
- Ignore unrelated nonblocking lint warnings.
- Reduced motion must remove nonessential transforms and transitions.

---

### Task 1: Acceptance contracts

**Files:**
- Create: `tests/rebuild-product-inquiry-design.test.mjs`
- Create: `tests/e2e/rebuild-product-inquiry-design.spec.ts`

**Interfaces:**
- Consumes: `/rebuild/products/[productId]`, `/rebuild/inquiry`, `useInquiry()`.
- Produces: source and browser contracts for examination stage, variant ledger, inquiry product records, review desk, persistence, overflow, and Axe.

- [ ] Write source tests that require product/inquiry design markers, focused inquiry components, preserved safe return path, preserved submission API, and reduced-motion CSS.
- [ ] Write Playwright tests for opening a real product from the catalogue, preserving `from`, adding the base product, adding a variant, reviewing quantities in Inquiry List, empty/manual states, overflow at 320/390/768/1280/1440, and serious Axe violations.
- [ ] Commit the red contracts.

### Task 2: Product action state

**Files:**
- Modify: `src/app/rebuild/products/[productId]/product-actions.tsx`

**Interfaces:**
- Consumes: `useInquiry()` and product/variant identity.
- Produces: `data-product-action`, selected quantity, accessible live feedback, and retained Review Inquiry List link.

- [ ] Expose current quantity and stable design markers without changing add semantics.
- [ ] Keep compact variant action independent from base-product identity.
- [ ] Commit.

### Task 3: Product examination route

**Files:**
- Modify: `src/app/rebuild/products/[productId]/page.tsx`
- Modify: `src/app/rebuild/products/[productId]/product-detail.module.css`

**Interfaces:**
- Consumes: product, source page, related-family products, ProductActions.
- Produces: `data-product-examination`, `data-variant-ledger`, `data-related-products`, and responsive Instrument Examination Desk layout.

- [ ] Recompose top return rail, examination stage, dark identity/procurement rail, source ledger, variant ledger, and related comparison.
- [ ] Preserve exact safe return path and related links.
- [ ] Add 980/700/420/320-safe layouts and reduced-motion parity.
- [ ] Commit.

### Task 4: Inquiry presentation components

**Files:**
- Create: `src/app/rebuild/inquiry/inquiry-item-record.tsx`
- Create: `src/app/rebuild/inquiry/inquiry-review-desk.tsx`
- Create: `src/app/rebuild/inquiry/inquiry.module.css`

**Interfaces:**
- `InquiryItemRecord` consumes `InquiryItem`, update and remove callbacks.
- `InquiryReviewDesk` consumes counts, attachment state, submission state/message.
- Produces stable `data-inquiry-item` and `data-inquiry-review` markers.

- [ ] Build focused, semantic components without owning provider state.
- [ ] Build the dark review desk and responsive product-record styling.
- [ ] Commit.

### Task 5: Inquiry route composition

**Files:**
- Modify: `src/app/rebuild/inquiry/page.tsx`
- Modify: `src/app/rebuild/inquiry/inquiry-client.tsx`

**Interfaces:**
- Consumes: existing validation, provider, API, success route, new presentation components.
- Produces: `data-inquiry-masthead`, `data-inquiry-workspace`, preserved form behavior.

- [ ] Replace compressed legacy layout with procurement masthead and route-scoped module.
- [ ] Use InquiryItemRecord and InquiryReviewDesk while keeping all validation and submission logic unchanged.
- [ ] Preserve manual item, attachment, buyer, consent, undo, server error, and disabled-submit behavior.
- [ ] Commit.

### Task 6: Milestone verification gate and state

**Files:**
- Create: `scripts/verify-design-milestone-4.sh`
- Modify: `tests/design-verification-harness.test.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces one clean local gate on isolated port `3103`.

- [ ] Gate lint, typecheck, unit tests, build, homepage/company/catalogue/product-inquiry browser suites on desktop and mobile.
- [ ] Record implementation-present/runtime-verification-pending accurately.
- [ ] Perform a source-level critical review for type, route, state, accessibility, and responsive mismatches.
- [ ] Commit.
