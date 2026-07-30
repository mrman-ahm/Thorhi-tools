# THROHI Catalogue Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/rebuild/products` into the approved Precision Catalogue Ledger while preserving URL-backed search, filtering, sorting, pagination, product-detail return context, real product media, and Inquiry List behavior.

**Architecture:** Keep catalogue state and data logic in `catalogue-client.tsx`, but extract repeated visual units into focused route-local components. Replace the current oversized intro and generic two-card grid styling with a compact editorial masthead, command search, sticky ledger filters, and responsive instrument records. No new runtime dependency or data model is introduced.

**Tech Stack:** Next.js 15.4.4 App Router, React, TypeScript, CSS Modules, existing `CatalogueMedia`, existing Inquiry provider, Node test runner, Playwright, Axe.

## Global Constraints

- Work only on `design/surgical-precision-archive`.
- Layout and visual design are the primary quality priority.
- Preserve `q`, `division`, `family`, `sort`, and `page` URL state.
- Preserve search scoring, pagination size, product-detail return context, and Inquiry List behavior.
- Use only real source-derived catalogue records and media.
- Do not add Veterinary or Beauty product records until structured data exists.
- Do not add pricing, checkout, accounts, favorites, comparison, or ecommerce language.
- Fix build, type, core interaction, data-integrity, serious accessibility, and responsive failures immediately.
- Defer harmless pre-existing warnings and obsolete syntax-only assertions.
- Do not add a UI or animation library.
- No pull request, merge, deployment, or public cutover without explicit approval.

---

### Task 1: Define the Catalogue Design Contract

**Files:**
- Create: `tests/rebuild-catalogue-design.test.mjs`
- Create: `tests/e2e/rebuild-catalogue-design.spec.ts`

**Interfaces:**
- Consumes: `/rebuild/products`, existing query parameters, existing Inquiry List state.
- Produces: source and browser acceptance contracts for the new masthead, result ledger, mobile filter sheet, responsive behavior, and accessibility.

- [ ] **Step 1: Write source-contract tests**

Require these files:

```js
const files = [
  "src/app/rebuild/products/catalogue-filter-controls.tsx",
  "src/app/rebuild/products/catalogue-product-entry.tsx",
  "src/app/rebuild/products/catalogue-results-toolbar.tsx",
  "src/app/rebuild/products/catalogue-empty-state.tsx",
];
```

Require `catalogue-client.tsx` to import all four components and preserve `PAGE_SIZE = 24`, `scoreRebuildProduct`, `useSearchParams`, and `/rebuild/products/${product.id}?from=`.

Require `catalogue.module.css` to include `.catalogueMasthead`, `.catalogueLedger`, `.productEntry`, `.mobileFilters`, and a reduced-motion media query.

- [ ] **Step 2: Write browser contracts**

Cover:

- one visible `h1` named `Product catalogue`;
- visible catalogue-code/product-name search;
- exact-code search updates the URL and exposes the expected code;
- division and family filters remain URL-backed;
- result records expose code, family, variant count, detail link, and Inquiry List action;
- selected Inquiry List quantity updates visibly;
- pagination preserves filters and moves between pages;
- mobile filter summary exposes active-filter count;
- no horizontal overflow at 320, 390, 768, 1280, and 1440;
- no serious or critical Axe violations;
- reduced motion keeps all results usable.

- [ ] **Step 3: Commit the red contract**

```bash
git add tests/rebuild-catalogue-design.test.mjs tests/e2e/rebuild-catalogue-design.spec.ts
git commit -m "test: define catalogue discovery design contract"
```

---

### Task 2: Extract Focused Catalogue Presentation Components

**Files:**
- Create: `src/app/rebuild/products/catalogue-filter-controls.tsx`
- Create: `src/app/rebuild/products/catalogue-product-entry.tsx`
- Create: `src/app/rebuild/products/catalogue-results-toolbar.tsx`
- Create: `src/app/rebuild/products/catalogue-empty-state.tsx`
- Modify: `src/app/rebuild/products/catalogue-client.tsx`
- Test: `tests/rebuild-catalogue-design.test.mjs`

**Interfaces:**

```ts
export type CatalogueFilterControlsProps = {
  prefix: string;
  division: string;
  family: string;
  families: RuntimeFamily[];
  onDivision: (division: string) => void;
  onFamily: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export type CatalogueProductEntryProps = {
  product: RuntimeProduct;
  detailHref: string;
  inquiryQuantity: number;
  resultOrder: number;
  onAdd: (product: RuntimeProduct) => void;
};

export type CatalogueResultsToolbarProps = {
  resultCount: number;
  selectedFamilyLabel?: string;
  sort: SortMode;
  query: string;
  division: string;
  onSort: (sort: SortMode) => void;
  onClearQuery: () => void;
  onClearDivision: () => void;
  onClearFamily: () => void;
};
```

- [ ] **Step 1: Extract filter controls without changing behavior**

Move the current division radios and family select into `catalogue-filter-controls.tsx`. Export `familyKey` from that file for consistent option values.

- [ ] **Step 2: Extract product entry**

Move the current `article` composition into `catalogue-product-entry.tsx`. Preserve separate detail links and inquiry button semantics.

- [ ] **Step 3: Extract toolbar and active context**

Move result count, sort select, and removable active filters into `catalogue-results-toolbar.tsx`.

- [ ] **Step 4: Extract empty state**

Move reset and unlisted-reference recovery into `catalogue-empty-state.tsx`.

- [ ] **Step 5: Refactor `catalogue-client.tsx`**

Keep data derivation, URL updates, search debounce, sorting, pagination, and Inquiry List ownership in the client. Replace only visual blocks with the extracted components.

- [ ] **Step 6: Run typecheck and source contracts**

```bash
npm run typecheck
node --test tests/rebuild-catalogue-design.test.mjs
```

- [ ] **Step 7: Commit**

```bash
git add src/app/rebuild/products/catalogue-*.tsx tests/rebuild-catalogue-design.test.mjs
git commit -m "refactor: split catalogue presentation components"
```

---

### Task 3: Build the Compact Editorial Catalogue Masthead

**Files:**
- Modify: `src/app/rebuild/products/page.tsx`
- Modify: `src/app/rebuild/products/catalogue.module.css`
- Test: `tests/e2e/rebuild-catalogue-design.spec.ts`

**Interfaces:**
- Consumes: `rebuildCatalogue.counts`, representative product `04-0101`, existing `CatalogueMedia`.
- Produces: `[data-catalogue-masthead]` and a compact source-ledger summary.

- [ ] **Step 1: Replace intro structure**

Use:

```tsx
<section className={styles.catalogueMasthead} data-catalogue-masthead>
  <div className={styles.mastheadInner}>
    <div className={styles.mastheadCopy}>
      <p>THROHI / Structured instrument archive</p>
      <h1>Product catalogue</h1>
      <p>Search validated Surgical and Dental & Orthodontic instrument families by product name or catalogue code.</p>
    </div>
    <div className={styles.mastheadSpecimen}>...</div>
  </div>
  <dl className={styles.mastheadLedger}>...</dl>
</section>
```

Ledger values:

- indexed products;
- variant codes;
- `2 structured divisions`;
- `Source-derived catalogue`.

- [ ] **Step 2: Implement desktop composition**

Use a dark navy masthead, controlled paper specimen stage, large but restrained title, and shared-border ledger. Keep minimum height below 430px at desktop.

- [ ] **Step 3: Implement deliberate mobile order**

At `max-width: 760px`, show copy, specimen, then a two-column ledger. Keep search visible within the next viewport.

- [ ] **Step 4: Verify masthead browser contract**

```bash
env PLAYWRIGHT_PORT=3102 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-catalogue-design.spec.ts --project=desktop-chromium --grep "masthead|heading"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/rebuild/products/page.tsx src/app/rebuild/products/catalogue.module.css
git commit -m "feat: add precision catalogue masthead"
```

---

### Task 4: Redesign Search, Filters, Toolbar, and Results Ledger

**Files:**
- Modify: `src/app/rebuild/products/catalogue-client.tsx`
- Modify: `src/app/rebuild/products/catalogue-filter-controls.tsx`
- Modify: `src/app/rebuild/products/catalogue-product-entry.tsx`
- Modify: `src/app/rebuild/products/catalogue-results-toolbar.tsx`
- Modify: `src/app/rebuild/products/catalogue.module.css`
- Test: `tests/e2e/rebuild-catalogue-design.spec.ts`

**Interfaces:**
- Produces: `[data-catalogue-search]`, `[data-catalogue-ledger]`, and one `[data-product-entry]` per result.

- [ ] **Step 1: Mark stable browser boundaries**

Add:

```tsx
<div className={styles.primarySearch} data-catalogue-search>
<div className={styles.catalogueLedger} data-catalogue-ledger>
<article className={styles.productEntry} data-product-entry>
```

- [ ] **Step 2: Restyle command search**

Use a 64px desktop input, 52px mobile input, persistent visible label, strong bottom rule, and green focus signal. Keep debounce behavior unchanged.

- [ ] **Step 3: Restyle desktop filter rail**

Use compact ledger rows with clear selected state. Keep rail width between 230px and 260px and sticky offset below the shared header.

- [ ] **Step 4: Restyle mobile filter sheet**

Make the summary at least 52px tall. Expanded controls use full-width rows and no nested rounded card.

- [ ] **Step 5: Restyle product entries**

Desktop:

- two columns;
- shared borders;
- 330–370px image stage;
- aligned copy heights;
- mono code at top-left;
- inquiry action aligned to the bottom edge.

Mobile:

- one column;
- 260–300px image stage;
- metadata and action remain readable at 320px.

- [ ] **Step 6: Remove universal delayed entrance animation**

Delete per-card staggered animation. Retain only short image and line transitions, disabled under reduced motion.

- [ ] **Step 7: Make pagination restore result context**

After page change, request animation frame and scroll `[data-catalogue-ledger]` into view with `block: "start"` when motion is allowed; use instant behavior under reduced motion.

- [ ] **Step 8: Run browser interaction tests**

```bash
env PLAYWRIGHT_PORT=3102 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-catalogue-design.spec.ts --project=desktop-chromium --project=mobile-chromium
```

- [ ] **Step 9: Commit**

```bash
git add src/app/rebuild/products tests/e2e/rebuild-catalogue-design.spec.ts
git commit -m "feat: redesign catalogue discovery ledger"
```

---

### Task 5: Add Milestone 3 Verification and Documentation

**Files:**
- Create: `scripts/verify-design-milestone-3.sh`
- Modify: `tests/design-verification-harness.test.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: one isolated verification command on port `3102`.

- [ ] **Step 1: Add verification script**

Run:

```bash
rm -rf playwright-report test-results .next
npm run lint
npm run typecheck
npm run test
npm run build
env PLAYWRIGHT_PORT=3102 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- \
  tests/e2e/rebuild-home-design.spec.ts \
  tests/e2e/rebuild-company-trust.spec.ts \
  tests/e2e/rebuild-catalogue-design.spec.ts \
  --project=desktop-chromium \
  --project=mobile-chromium
```

- [ ] **Step 2: Extend verification-harness source test**

Require clean build directories, port `3102`, reuse disabled, all three E2E files, and both browser projects.

- [ ] **Step 3: Update project documentation**

Record Milestone 3 implementation present, verification pending. Keep minor lint/deprecation warnings in the deferred register rather than blocking the milestone.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-design-milestone-3.sh tests/design-verification-harness.test.mjs PROJECT_STATE.md PLANS.md CHANGELOG.md
git commit -m "docs: add catalogue discovery verification gate"
```

---

### Task 6: Final Review Gate

**Files:**
- Review all Milestone 3 changes.

- [ ] **Step 1: Source review**

Confirm:

- no product-data logic moved into visual components;
- no new dependency;
- no ecommerce language;
- no Veterinary or Beauty records introduced;
- product links preserve return context;
- inquiry buttons remain separate from detail links;
- media loading policy is unchanged.

- [ ] **Step 2: Automated verification**

```bash
bash scripts/verify-design-milestone-3.sh
```

Critical failures block completion. Harmless pre-existing warnings do not.

- [ ] **Step 3: Visual review**

Capture and inspect 1440×1000, 1280×800, 768×1024, 390×844, and 320×700 for default, filtered, no-results, and selected-inquiry states.

- [ ] **Step 4: Completion decision**

Do not merge or deploy. Mark implementation present only after critical automated failures are resolved and visual findings are corrected.
