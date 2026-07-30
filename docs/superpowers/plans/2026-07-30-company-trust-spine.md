# THROHI Company & Trust Spine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close Design Milestone 1 with reproducible browser evidence, then build rebuild-native Company, Scissors Through Time, Catalogues, and Contact routes inside the approved Surgical Precision Archive system.

**Architecture:** Keep `/rebuild` as the isolated no-index preview shell. Add a small typed corporate-route component layer and route-specific compositions; reuse the existing catalogue, Inquiry List, contact boundary, media pipeline, header, footer, and `FrameEvolutionScene` renderer rather than duplicating them. Execute each route as a separately tested commit and do not begin Milestone 2 feature work until the Milestone 1 browser gate is green.

**Tech Stack:** Next.js 15.4.4 App Router, React, TypeScript, CSS Modules, Anime.js 4.0.0 where already justified, Node test runner, Playwright, `@axe-core/playwright`, existing generated Sector 9D media.

## Global Constraints

- Work only on `design/surgical-precision-archive`.
- `/rebuild` and every new rebuild route remain `robots: { index: false, follow: false }`.
- Do not invent founding year, company age, certifications, materials, manufacturing capability, capacity, export markets, OEM/private-label services, minimum orders, lead times, clients, awards, testimonials, or performance statistics.
- Direct email, phone, WhatsApp, address formatting, maps, hours, and catalogue PDF downloads render only from verified complete data.
- The Inquiry List remains a non-commerce request workflow; do not add pricing, checkout, accounts, or a second inquiry form.
- The supplied 260-frame sequence is general instrument-history editorial content, not THROHI corporate history.
- Do not add another animation library, autoplay video, cursor effects, decorative parallax, moving buttons, universal entrance animation, generic card grids, or fake proof.
- Preserve catalogue search, product routes, Inquiry List state, mobile focus trapping, reduced-motion behavior, media fallbacks, and the generated media pipeline.
- Every production change follows red-green-refactor and ends in an independently reviewable commit.
- No pull request, merge, deployment, public cutover, or intentional GitHub Actions run without explicit user approval.

---

## Locked File Structure

### Shared data boundaries

- `src/rebuild/company-content.ts` — verified Company and editorial copy only.
- `src/rebuild/catalogue-documents.ts` — typed document records and validation helpers.
- `src/rebuild/contact.ts` — existing verified direct-contact boundary; extend only when a verified field is supplied.
- `src/rebuild/navigation.ts` — rebuild-only primary and utility routes.

### Shared corporate components

- `src/components/rebuild/corporate/rebuild-page-hero.tsx`
- `src/components/rebuild/corporate/rebuild-section-heading.tsx`
- `src/components/rebuild/corporate/rebuild-division-ledger.tsx`
- `src/components/rebuild/corporate/rebuild-truth-boundary.tsx`
- `src/components/rebuild/corporate/rebuild-action-rail.tsx`
- `src/components/rebuild/corporate/rebuild-document-ledger.tsx`
- `src/components/rebuild/corporate/rebuild-contact-routes.tsx`
- `src/components/rebuild/corporate/corporate-components.module.css`

### Route compositions

- `src/app/rebuild/company/page.tsx`
- `src/app/rebuild/company/company.module.css`
- `src/app/rebuild/company/scissors-through-time/page.tsx`
- `src/app/rebuild/company/scissors-through-time/scissors-through-time.module.css`
- `src/app/rebuild/catalogues/page.tsx`
- `src/app/rebuild/catalogues/catalogues.module.css`
- `src/app/rebuild/contact/page.tsx`
- `src/app/rebuild/contact/contact.module.css`

### Tests and verification

- `tests/rebuild-company-trust-content.test.mjs`
- `tests/rebuild-catalogue-documents.test.mjs`
- `tests/e2e/rebuild-company-trust.spec.ts`
- `tests/verification-harness.test.mjs`
- `scripts/verify-design-milestone-1.sh`
- `scripts/verify-design-milestone-2.sh`

---

### Task 1: Close Milestone 1 with a Clean, Deterministic Browser Gate

**Files:**
- Modify: `src/app/rebuild/rebuild-shell.tsx`
- Modify: `src/app/rebuild/surgical-precision-shell.module.css`
- Modify: `src/components/rebuild/home/home-hero.module.css`
- Modify: `src/components/rebuild/rebuild-header.tsx`
- Modify: `scripts/verify-design-milestone-1.sh`
- Modify: `tests/e2e/rebuild-home-design.spec.ts`
- Modify: `tests/verification-harness.test.mjs`

**Interfaces:**
- Produces: `[data-milestone-contract="surgical-precision-archive-v1"]` on the current rebuild shell.
- Produces: a clean `.next` production build and fresh Playwright result directories on every milestone verification run.
- Preserves: existing `enterRebuild(page: Page)` helper and all current homepage acceptance behavior.

- [ ] **Step 1: Extend the failing browser contract with a build identity assertion**

Add immediately after `await page.goto("/rebuild")` in `enterRebuild`:

```ts
await expect(
  page.locator('[data-milestone-contract="surgical-precision-archive-v1"]'),
).toHaveCount(1);
```

This must fail before the shell attribute exists and prevents browser tests from silently validating an old server output.

- [ ] **Step 2: Extend the verification-harness contract**

Assert that `scripts/verify-design-milestone-1.sh` contains all four clean-build boundaries:

```js
assert.match(script, /rm -rf \.next/);
assert.match(script, /rm -rf playwright-report test-results/);
assert.match(script, /PLAYWRIGHT_PORT=3100/);
assert.match(script, /PLAYWRIGHT_REUSE_SERVER=0/);
```

- [ ] **Step 3: Run the focused red tests**

Run:

```bash
node --test tests/verification-harness.test.mjs
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium --grep "company identity"
```

Expected: the harness or browser contract fails because the clean-build lines and shell attribute are absent.

- [ ] **Step 4: Add the shell identity**

Change the shell root to:

```tsx
<div
  className={`${legacyStyles.root} ${shellStyles.root}`}
  data-rebuild-shell
  data-milestone-contract="surgical-precision-archive-v1"
>
```

- [ ] **Step 5: Make verification clean before lint and build**

Insert before the lint command in `scripts/verify-design-milestone-1.sh`:

```bash
rm -rf playwright-report test-results
rm -rf .next
```

Keep port `3100`, `PLAYWRIGHT_REUSE_SERVER=0`, and both Playwright projects in one invocation.

- [ ] **Step 6: Correct the known AA contrast token**

Change the rebuild token from:

```css
--throhi-green-600: #2e8c63;
```

to:

```css
--throhi-green-600: #2a805a;
```

White text on `#2a805a` exceeds 4.5:1. Keep the hero primary action using the token rather than a new route-specific color.

- [ ] **Step 7: Make mobile focus restoration deterministic**

Inside the `mobileOpen` effect, capture the trigger before moving focus:

```ts
const trigger = mobileTriggerRef.current;
const previousFocus =
  document.activeElement instanceof HTMLElement
    ? document.activeElement
    : trigger;
```

In cleanup, restore focus on the next animation frame:

```ts
window.requestAnimationFrame(() => {
  if (trigger?.isConnected) trigger.focus();
  else if (previousFocus?.isConnected) previousFocus.focus();
});
```

Do not change the Tab loop, Escape handling, body overflow restoration, or `inert` behavior.

- [ ] **Step 8: Run the complete Milestone 1 gate**

Run:

```bash
bash scripts/verify-design-milestone-1.sh
```

Expected: lint has no errors, typecheck passes, all unit tests pass, production build passes, desktop and mobile Playwright pass, and Axe reports no serious or critical violation.

- [ ] **Step 9: Commit the stabilization block**

```bash
git add src/app/rebuild/rebuild-shell.tsx \
  src/app/rebuild/surgical-precision-shell.module.css \
  src/components/rebuild/home/home-hero.module.css \
  src/components/rebuild/rebuild-header.tsx \
  scripts/verify-design-milestone-1.sh \
  tests/e2e/rebuild-home-design.spec.ts \
  tests/verification-harness.test.mjs
git commit -m "fix: close rebuild homepage browser gate"
```

---

### Task 2: Add the Milestone 2 Acceptance Contract Before Route Code

**Files:**
- Create: `tests/rebuild-company-trust-content.test.mjs`
- Create: `tests/rebuild-catalogue-documents.test.mjs`
- Create: `tests/e2e/rebuild-company-trust.spec.ts`

**Interfaces:**
- Consumes: existing `/rebuild` shell, navigation, contact boundary, `FrameEvolutionScene`, catalogue routes, and Inquiry List routes.
- Produces: source, data, desktop, mobile, reduced-motion, failure, overflow, and Axe release contracts for all four routes.

- [ ] **Step 1: Write source-contract tests for route existence and truth boundaries**

Create `tests/rebuild-company-trust-content.test.mjs` with assertions that read source files and require:

```js
const requiredRoutes = [
  "src/app/rebuild/company/page.tsx",
  "src/app/rebuild/company/scissors-through-time/page.tsx",
  "src/app/rebuild/catalogues/page.tsx",
  "src/app/rebuild/contact/page.tsx",
];
```

Require the Company content source to contain `THROHI Medical Tools`, `Sialkot, Pakistan`, `Surgical`, `Dental and Orthodontic`, `Veterinary`, and `Beauty`; reject case-insensitive occurrences of `ISO`, `certified`, `premium steel`, `world-class`, `trusted worldwide`, `years of experience`, `OEM`, and `private label`.

Require the full evolution route source to import `FrameEvolutionScene`, set `variant="full"`, and state that the editorial sequence is not THROHI corporate history.

- [ ] **Step 2: Write document-model tests**

Create `tests/rebuild-catalogue-documents.test.mjs` that imports or source-checks:

```ts
export type RebuildCatalogueDocument = {
  id: string;
  title: string;
  division: "surgical" | "dental" | "veterinary" | "beauty" | "general";
  format: "PDF";
  sizeLabel: string;
  publishedOrUpdated: string;
  href: string;
};

export function isCompleteCatalogueDocument(
  value: Partial<RebuildCatalogueDocument>,
): value is RebuildCatalogueDocument;
```

Test that every required field is mandatory and that an empty collection produces zero download records.

- [ ] **Step 3: Write the browser contract**

Create `tests/e2e/rebuild-company-trust.spec.ts` with one helper:

```ts
async function expectNoSeriousAxeViolations(page: Page) {
  const result = await new AxeBuilder({ page }).exclude("canvas").analyze();
  expect(
    result.violations.filter((item) =>
      ["serious", "critical"].includes(item.impact ?? ""),
    ),
  ).toEqual([]);
}
```

Include tests for:

- all four routes return one visible `h1`;
- Company shows THROHI, Sialkot, and four divisions;
- Company links to Products, Catalogues, Scissors Through Time, and Inquiry List;
- Scissors route uses the full evolution region;
- reduced motion exposes all chapter copy in normal flow;
- manifest failure keeps chapter copy and next actions usable;
- Catalogues distinguishes digital catalogue from downloadable documents;
- no download link exists when document data is empty;
- Contact links to `/rebuild/inquiry` and `/rebuild/inquiry?manual=1`;
- no empty `mailto:`, `tel:`, or WhatsApp controls exist;
- header and footer link to the four real corporate routes;
- mobile menu opens, traps focus, closes with Escape, and restores Menu focus;
- no horizontal overflow at widths 320, 390, 768, 1280, and 1440;
- each route has zero serious or critical Axe violations.

- [ ] **Step 4: Run the red contracts**

Run:

```bash
node --test tests/rebuild-company-trust-content.test.mjs tests/rebuild-catalogue-documents.test.mjs
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium
```

Expected: failures because routes, data files, and components do not yet exist.

- [ ] **Step 5: Commit only the red acceptance contract**

```bash
git add tests/rebuild-company-trust-content.test.mjs \
  tests/rebuild-catalogue-documents.test.mjs \
  tests/e2e/rebuild-company-trust.spec.ts
git commit -m "test: define company trust spine acceptance contract"
```

---

### Task 3: Create Typed Company, Editorial, and Document Data Boundaries

**Files:**
- Create: `src/rebuild/company-content.ts`
- Create: `src/rebuild/catalogue-documents.ts`
- Test: `tests/rebuild-company-trust-content.test.mjs`
- Test: `tests/rebuild-catalogue-documents.test.mjs`

**Interfaces:**
- Produces: `companyProfile`, `companyDivisionCopy`, `scissorsEditorialCopy`, `RebuildCatalogueDocument`, `rebuildCatalogueDocuments`, and `isCompleteCatalogueDocument`.
- Consumers: Company, Scissors Through Time, Catalogues, shared ledgers, header/footer copy tests.

- [ ] **Step 1: Define public-safe Company content**

Export:

```ts
export const companyProfile = {
  name: "THROHI Medical Tools",
  location: "Sialkot, Pakistan",
  introduction:
    "THROHI Medical Tools presents surgical, dental and orthodontic, veterinary, and beauty instrument ranges through a searchable catalogue and structured inquiry workflow.",
} as const;
```

Export four divisions with the existing structured/pending states and no capability claims.

- [ ] **Step 2: Define editorial chapter framing**

Export route copy that explicitly includes:

```ts
export const scissorsEditorialCopy = {
  title: "Scissors through time",
  disclaimer:
    "This editorial sequence describes the evolution of instrument form. It is not presented as THROHI corporate history.",
} as const;
```

Reuse `EVOLUTION_CHAPTERS` for chapter detail; do not create a conflicting second chapter dataset.

- [ ] **Step 3: Define the verified document model**

Create the exact type from Task 2 and implement:

```ts
export function isCompleteCatalogueDocument(
  value: Partial<RebuildCatalogueDocument>,
): value is RebuildCatalogueDocument {
  return Boolean(
    value.id &&
      value.title &&
      value.division &&
      value.format === "PDF" &&
      value.sizeLabel &&
      value.publishedOrUpdated &&
      value.href,
  );
}

export const rebuildCatalogueDocuments: readonly RebuildCatalogueDocument[] = [];
```

Do not infer metadata from filenames.

- [ ] **Step 4: Run unit contracts**

```bash
node --test tests/rebuild-company-trust-content.test.mjs tests/rebuild-catalogue-documents.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the data boundary**

```bash
git add src/rebuild/company-content.ts src/rebuild/catalogue-documents.ts \
  tests/rebuild-company-trust-content.test.mjs \
  tests/rebuild-catalogue-documents.test.mjs
git commit -m "feat: add verified corporate content boundaries"
```

---

### Task 4: Build the Shared Corporate Route Component Layer

**Files:**
- Create: `src/components/rebuild/corporate/rebuild-page-hero.tsx`
- Create: `src/components/rebuild/corporate/rebuild-section-heading.tsx`
- Create: `src/components/rebuild/corporate/rebuild-division-ledger.tsx`
- Create: `src/components/rebuild/corporate/rebuild-truth-boundary.tsx`
- Create: `src/components/rebuild/corporate/rebuild-action-rail.tsx`
- Create: `src/components/rebuild/corporate/rebuild-document-ledger.tsx`
- Create: `src/components/rebuild/corporate/rebuild-contact-routes.tsx`
- Create: `src/components/rebuild/corporate/corporate-components.module.css`
- Test: `tests/rebuild-company-trust-content.test.mjs`

**Interfaces:**

```ts
export type RebuildPageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  summary: string;
  meta?: readonly string[];
  tone?: "paper" | "steel" | "navy";
  children?: ReactNode;
};

export type RebuildAction = {
  href: string;
  label: string;
  description: string;
  emphasis?: "primary" | "secondary";
};
```

`RebuildDivisionLedger` consumes the four division objects from `company-content.ts`. `RebuildDocumentLedger` consumes only complete `RebuildCatalogueDocument` records. `RebuildContactRoutes` consumes `VerifiedContactConfig` and always exposes structured inquiry actions.

- [ ] **Step 1: Add source-contract assertions for component boundaries**

Require every listed component file to exist and reject duplicated hard-coded company facts inside visual component files.

- [ ] **Step 2: Implement semantic components**

Use `section`, `header`, `nav`, `ol`, `dl`, and real links. Each component receives content through props. Do not add an eyebrow automatically; the route must supply it deliberately.

- [ ] **Step 3: Implement one shared visual vocabulary**

In `corporate-components.module.css` use existing rebuild tokens only:

```css
var(--throhi-ink-950)
var(--throhi-navy-900)
var(--throhi-steel-100)
var(--throhi-paper-50)
var(--throhi-green-600)
var(--throhi-blue-600)
```

Use ledger rows, split editorial layouts, borders, reading widths, and moderate radii. Do not implement a generic repeated card grid.

- [ ] **Step 4: Verify focus and contrast statically**

Every interactive element must inherit the shell focus ring, use a minimum practical 44px target, and avoid white normal-size text on any background lighter than `#2a805a`.

- [ ] **Step 5: Run source tests and typecheck**

```bash
node --test tests/rebuild-company-trust-content.test.mjs
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit the component layer**

```bash
git add src/components/rebuild/corporate tests/rebuild-company-trust-content.test.mjs
git commit -m "feat: add rebuild corporate route components"
```

---

### Task 5: Converge Rebuild Navigation on Real Corporate Routes

**Files:**
- Modify: `src/rebuild/navigation.ts`
- Modify: `src/components/rebuild/rebuild-header.tsx`
- Modify: `src/components/rebuild/rebuild-footer.tsx`
- Modify: `src/components/rebuild/rebuild-footer.module.css`
- Test: `tests/rebuild-company-trust-content.test.mjs`
- Test: `tests/e2e/rebuild-company-trust.spec.ts`

**Interfaces:**
- Produces primary routes:

```ts
[
  { label: "Products", href: "/rebuild/products", productsMenu: true },
  { label: "Company", href: "/rebuild/company" },
  { label: "Catalogues", href: "/rebuild/catalogues" },
  { label: "Contact", href: "/rebuild/contact" },
]
```

- Preserves: Search, Inquiry List count, Products panel, pending divisions, mobile dialog behavior.

- [ ] **Step 1: Make navigation source tests fail on homepage anchors**

Assert that `navigation.ts` and `rebuild-footer.tsx` contain no `/rebuild#company` or `/rebuild#contact` strings and contain all four real routes.

- [ ] **Step 2: Update primary navigation**

Replace homepage anchors with the exact route array above. Keep `isRebuildRouteActive` path-based behavior.

- [ ] **Step 3: Update the footer route groups**

Expose:

- Browse products;
- Company;
- Scissors Through Time;
- Catalogues;
- Contact;
- Inquiry List.

Do not link rebuild users to legacy `/company`, `/resources`, `/contact`, or `/precision-through-time`.

- [ ] **Step 4: Keep mobile focus behavior intact**

Do not duplicate route links outside the existing `rebuildPrimaryNavigation` mapping. Verify Catalogues appears in desktop and mobile navigation.

- [ ] **Step 5: Run focused tests**

```bash
node --test tests/rebuild-company-trust-content.test.mjs
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=mobile-chromium --grep "navigation"
```

Expected: navigation tests pass once route files from later tasks exist; source contract passes immediately.

- [ ] **Step 6: Commit navigation convergence**

```bash
git add src/rebuild/navigation.ts \
  src/components/rebuild/rebuild-header.tsx \
  src/components/rebuild/rebuild-footer.tsx \
  src/components/rebuild/rebuild-footer.module.css \
  tests/rebuild-company-trust-content.test.mjs
git commit -m "feat: route rebuild navigation to corporate pages"
```

---

### Task 6: Build the Rebuild-Native Company Page

**Files:**
- Create: `src/app/rebuild/company/page.tsx`
- Create: `src/app/rebuild/company/company.module.css`
- Modify: `tests/e2e/rebuild-company-trust.spec.ts`

**Interfaces:**
- Consumes: `companyProfile`, division content, `RebuildPageHero`, `RebuildDivisionLedger`, `RebuildTruthBoundary`, `RebuildActionRail`.
- Produces: one customer-facing Company route with verified facts and links to Products, Catalogues, Scissors Through Time, and Inquiry List.

- [ ] **Step 1: Run the Company-only red tests**

```bash
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --grep "Company"
```

Expected: 404 or missing Company content.

- [ ] **Step 2: Create metadata and page structure**

Use:

```ts
export const metadata: Metadata = {
  title: "Company | THROHI Medical Tools",
  description:
    "Learn how THROHI Medical Tools presents surgical, dental and orthodontic, veterinary, and beauty instrument ranges from Sialkot, Pakistan.",
  robots: { index: false, follow: false },
};
```

Page order:

1. identity hero;
2. concise verified company profile;
3. four-division ledger;
4. evidence-first publication boundary stated in customer language;
5. Scissors Through Time editorial preview;
6. Products, Catalogues, and Inquiry actions.

- [ ] **Step 3: Implement route-specific composition**

Do not publish a pending-evidence checklist as the main page. Use one compact truth-boundary section explaining that public detail expands only when verified.

- [ ] **Step 4: Implement deliberate mobile order**

At `max-width: 760px`, render identity, primary catalogue action, company copy, divisions, editorial preview, then final actions. Avoid merely stacking a desktop two-column grid without reordering.

- [ ] **Step 5: Run Company tests and Axe**

```bash
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --project=mobile-chromium --grep "Company|axe"
```

Expected: Company tests pass with no serious or critical Axe violations.

- [ ] **Step 6: Commit Company**

```bash
git add src/app/rebuild/company tests/e2e/rebuild-company-trust.spec.ts
git commit -m "feat: add rebuild company experience"
```

---

### Task 7: Build the Full Scissors Through Time Route

**Files:**
- Create: `src/app/rebuild/company/scissors-through-time/page.tsx`
- Create: `src/app/rebuild/company/scissors-through-time/scissors-through-time.module.css`
- Modify: `src/components/frame-evolution-scene.tsx`
- Test: `tests/e2e/rebuild-company-trust.spec.ts`

**Interfaces:**
- Consumes: `FrameEvolutionScene`, `EVOLUTION_CHAPTERS`, `scissorsEditorialCopy`, shared hero/action components.
- Produces: full sequence route with motion, reduced-motion, loading, failure, and final release parity.

- [ ] **Step 1: Run the evolution-only red tests**

```bash
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --grep "Scissors|manifest|reduced motion"
```

Expected: missing route and full-scene assertions fail.

- [ ] **Step 2: Add route metadata and editorial frame**

Use one `h1` outside the canvas scene. State visibly:

```text
This editorial sequence describes the evolution of instrument form. It is not THROHI corporate history.
```

- [ ] **Step 3: Reuse the renderer in full mode**

Render:

```tsx
<FrameEvolutionScene
  variant="full"
  eyebrow="SCISSORS THROUGH TIME"
  title={<>Form changes as use becomes more specific.</>}
  accessibleLabel="Evolution of scissors and cutting instrument forms"
/>
```

Do not fork the canvas implementation.

- [ ] **Step 4: Improve semantic media state without changing visual mechanics**

Add a visually readable status element to `FrameEvolutionScene`:

```tsx
<p className="visually-hidden" aria-live="polite">
  {mediaState === "loading"
    ? "Evolution media loading."
    : mediaState === "error"
      ? "Evolution media unavailable. All chapter text remains available."
      : "Evolution media ready."}
</p>
```

Keep the canvas `aria-hidden` and the stage role/label. All chapter copy remains in the DOM.

- [ ] **Step 5: Add final practical actions**

End with links to `/rebuild/products` and `/rebuild/inquiry`; no autoplay video or unrelated history content.

- [ ] **Step 6: Run motion, reduced-motion, failure, overflow, and Axe tests**

```bash
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --project=mobile-chromium --grep "Scissors|manifest|reduced motion|overflow|axe"
```

Expected: PASS.

- [ ] **Step 7: Commit the editorial route**

```bash
git add src/app/rebuild/company/scissors-through-time \
  src/components/frame-evolution-scene.tsx \
  tests/e2e/rebuild-company-trust.spec.ts
git commit -m "feat: add full scissors through time experience"
```

---

### Task 8: Build the Honest Catalogues Route

**Files:**
- Create: `src/app/rebuild/catalogues/page.tsx`
- Create: `src/app/rebuild/catalogues/catalogues.module.css`
- Modify: `tests/e2e/rebuild-company-trust.spec.ts`
- Test: `tests/rebuild-catalogue-documents.test.mjs`

**Interfaces:**
- Consumes: `rebuildCatalogueDocuments`, `isCompleteCatalogueDocument`, `RebuildDocumentLedger`, division navigation, Inquiry List routes.
- Produces: distinct digital-catalogue and downloadable-document surfaces with no fake Download controls.

- [ ] **Step 1: Run Catalogues red tests**

```bash
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --grep "Catalogues|download"
```

Expected: missing route.

- [ ] **Step 2: Create route metadata and structure**

Use:

```ts
export const metadata: Metadata = {
  title: "Catalogues | THROHI Medical Tools",
  description:
    "Search THROHI instrument records online and access verified catalogue documents when available.",
  robots: { index: false, follow: false },
};
```

Separate sections:

1. searchable digital catalogue;
2. four-division availability ledger;
3. downloadable document archive;
4. unlisted reference and Inquiry List actions.

- [ ] **Step 3: Filter documents at the route boundary**

```ts
const documents = rebuildCatalogueDocuments.filter(isCompleteCatalogueDocument);
```

When empty, render explanatory text and real catalogue/inquiry links. Do not render a disabled Download button.

- [ ] **Step 4: Keep division behavior truthful**

Surgical and Dental/Orthodontic link to filtered catalogue results. Veterinary and Beauty show a pending detailed-record state and route visitors to an unlisted inquiry, not fake catalogue pages.

- [ ] **Step 5: Run document, browser, overflow, and Axe tests**

```bash
node --test tests/rebuild-catalogue-documents.test.mjs
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --project=mobile-chromium --grep "Catalogues|download|overflow|axe"
```

Expected: PASS.

- [ ] **Step 6: Commit Catalogues**

```bash
git add src/app/rebuild/catalogues \
  tests/e2e/rebuild-company-trust.spec.ts \
  tests/rebuild-catalogue-documents.test.mjs
git commit -m "feat: add verified rebuild catalogues route"
```

---

### Task 9: Build the Contact Routing Experience

**Files:**
- Create: `src/app/rebuild/contact/page.tsx`
- Create: `src/app/rebuild/contact/contact.module.css`
- Modify: `tests/e2e/rebuild-company-trust.spec.ts`

**Interfaces:**
- Consumes: `verifiedContact`, `RebuildContactRoutes`, shared hero, section heading, truth boundary, action rail.
- Produces: structured Inquiry List and unlisted-instrument routes plus verified direct-contact controls only.

- [ ] **Step 1: Run Contact red tests**

```bash
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --grep "Contact|unlisted|direct contact"
```

Expected: missing route.

- [ ] **Step 2: Create route metadata and primary routing**

Use:

```ts
export const metadata: Metadata = {
  title: "Contact | THROHI Medical Tools",
  description:
    "Send THROHI a structured instrument request using product references, quantities, requirements, and buyer details.",
  robots: { index: false, follow: false },
};
```

Primary actions:

```ts
[
  { href: "/rebuild/inquiry", label: "Build an Inquiry List" },
  { href: "/rebuild/inquiry?manual=1", label: "Request an unlisted instrument" },
]
```

- [ ] **Step 3: Render direct channels only from complete verified values**

Rules:

```ts
const showPhone = Boolean(verifiedContact.phoneDisplay && verifiedContact.phoneHref);
const showEmail = Boolean(verifiedContact.email);
const showWhatsApp = Boolean(verifiedContact.whatsappHref);
```

Always render the verified location `Sialkot, Pakistan`. Render no `Pending approval` pseudo-controls.

- [ ] **Step 4: Add concise request guidance and safety**

Explain four useful inputs: instrument/reference, quantity, requirements, buyer details. Add one safety notice telling users not to submit passwords, payment credentials, or one-time codes.

- [ ] **Step 5: Run Contact, overflow, mobile, and Axe tests**

```bash
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --project=mobile-chromium --grep "Contact|unlisted|direct contact|overflow|axe"
```

Expected: PASS.

- [ ] **Step 6: Commit Contact**

```bash
git add src/app/rebuild/contact tests/e2e/rebuild-company-trust.spec.ts
git commit -m "feat: add rebuild contact routing experience"
```

---

### Task 10: Converge, Review, and Verify Milestone 2

**Files:**
- Create: `scripts/verify-design-milestone-2.sh`
- Modify: `tests/verification-harness.test.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `PLAN.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/superpowers/plans/2026-07-30-company-trust-spine.md`

**Interfaces:**
- Produces: one reproducible command for source, type, unit, build, desktop/mobile, reduced-motion, media-failure, overflow, and Axe verification.
- Preserves: no PR, merge, deployment, or Actions run.

- [ ] **Step 1: Write the failing verification-harness contract**

Require `scripts/verify-design-milestone-2.sh` to contain:

```bash
rm -rf playwright-report test-results .next
npm run lint
npm run typecheck
npm run test
npm run build
env PLAYWRIGHT_PORT=3101 PLAYWRIGHT_REUSE_SERVER=0 npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts tests/e2e/rebuild-company-trust.spec.ts --project=desktop-chromium --project=mobile-chromium
```

- [ ] **Step 2: Create the verification script**

Use `set -euo pipefail`, print each command before running it, and stop at the first failure. Do not call GitHub, Wrangler, or deployment commands.

- [ ] **Step 3: Run the complete automated gate**

```bash
bash scripts/verify-design-milestone-2.sh
```

Expected: all commands pass. Record actual counts from the output; do not pre-write pass numbers.

- [ ] **Step 4: Perform required screenshot review**

Capture and inspect:

- Company: 1440×1000, 1280×800, 390×844, 320×700;
- Scissors: opening, middle chapter, final release, reduced motion, and failed manifest;
- Catalogues: no-approved-PDF state at desktop and mobile;
- Contact: no-direct-channel state at desktop and mobile;
- mobile navigation open on each route.

Reject horizontal overflow, clipped headings, tiny controls, repeated filler labels, excessive empty cards, low contrast, or motion that delays actions.

- [ ] **Step 5: Update project documentation using evidence only**

Move Milestone 1 to complete only if its full gate and screenshot review passed. Record Milestone 2 as complete only after the complete automated and visual gates pass. Document remaining client dependencies separately.

- [ ] **Step 6: Run final verification again after documentation or visual corrections**

```bash
bash scripts/verify-design-milestone-2.sh
```

Expected: PASS with fresh evidence.

- [ ] **Step 7: Commit convergence and verification**

```bash
git add scripts/verify-design-milestone-2.sh \
  tests/verification-harness.test.mjs \
  PROJECT_STATE.md PLAN.md CHANGELOG.md \
  docs/superpowers/plans/2026-07-30-company-trust-spine.md
git commit -m "chore: verify company trust spine milestone"
```

---

## Review Gates Between Tasks

After every implementation commit:

1. compare the changed files to the task requirements;
2. verify no prohibited claim or unrelated redesign entered the diff;
3. run the task-focused test command;
4. inspect TypeScript and accessibility semantics;
5. confirm existing catalogue and Inquiry List behavior was not changed;
6. only then advance to the next task.

If three attempted fixes fail for the same issue, stop implementation and reassess the architecture before making a fourth attempt.
