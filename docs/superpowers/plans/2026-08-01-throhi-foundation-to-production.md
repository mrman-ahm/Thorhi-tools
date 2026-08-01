# THROHI Foundation-to-Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the approved THROHI website foundation specification into a complete Figma source of truth, then rebuild the public website and owner admin as a tested, accessible, production-ready Surgical and Dental catalogue and inquiry platform.

**Architecture:** Work in gated milestones. First create the Figma foundations, components, responsive wireframes, high-fidelity pages, prototypes, and design audit. Then replace the conflicting `/rebuild` presentation layer while preserving useful catalogue data, media preparation, inquiry contracts, and tested infrastructure. Public content is driven by verified data; unavailable facts remain unpublished. Admin publishing uses draft, preview, versioning, archive, and explicit deletion boundaries.

**Tech Stack:** Figma variables/components/Auto Layout; Next.js 15.4 App Router; React 19.1; TypeScript 5.8; CSS Modules; `next/font`; Anime.js 4.5 only for the two approved signature sequences where needed; Node test runner; Playwright 1.61; axe-core; Sharp; existing catalogue preparation scripts; server-side persistence selected during backend architecture review.

## Global Constraints

- Work only on `design/surgical-precision-archive` until a later explicit branch decision.
- Do not deploy, merge, open a pull request, or intentionally trigger GitHub Actions without explicit permission.
- The approved specification at `docs/superpowers/specs/2026-08-01-throhi-website-foundation-design.md` overrides older conflicting design documents and implementation assumptions.
- Public divisions are Surgical and Dental only.
- Beauty and Veterinary remain hidden future admin divisions until explicitly activated with complete approved content.
- DM Serif Display Regular is reserved for major H1/H2 headings; Instrument Sans carries H3-H6, body, product names, navigation, forms, and controls; IBM Plex Mono carries product references and technical metadata.
- The website is warm-light-first; emerald is primary, technical blue is secondary, and dark treatment is limited to selected cinematic/editorial moments.
- Desktop catalogue grids use three product columns.
- The scissors evolution appears only on Company.
- Inquiry has no customer account and no file uploads.
- Use Inquiry terminology, never cart, checkout, basket, payment, or order language.
- Original catalogue PDFs are never generated, rewritten, merged, or edited by the application.
- Do not publish unsupported company, certification, material, manufacturing, export, pricing, location, legal, contact, or response-time claims.
- Target WCAG 2.2 AA and complete reduced-motion parity.
- Preserve useful existing catalogue source data, generated media, scripts, tests, and backend behavior unless the approved specification explicitly replaces them.
- Prefer focused changes and local verification. Do not use external component libraries merely for visual novelty.

---

## Planned file structure

### Design documentation

- `docs/design/THROHI_FIGMA_FOUNDATIONS.md` — final token and component mapping from Figma to production.
- `docs/design/THROHI_RESPONSIVE_BEHAVIOR.md` — breakpoint-specific layout and interaction decisions.
- `docs/design/THROHI_MOTION_SPEC.md` — intro, scissors evolution, functional motion, reduced-motion, and performance rules.
- `docs/content/THROHI_CONTENT_MATRIX.md` — approved, pending, hidden, and prohibited content by page.
- `docs/architecture/THROHI_APPLICATION_ARCHITECTURE.md` — final public/admin/backend architecture and trade-offs.
- `docs/qa/THROHI_ACCEPTANCE_MATRIX.md` — requirement-to-test traceability.

### Public application

- `src/app/rebuild/layout.tsx` — metadata and route layout integration.
- `src/app/rebuild/rebuild-shell.tsx` — providers and shared shell only.
- `src/app/rebuild/throhi-foundation.module.css` — canonical tokens, typography, grid, surfaces, focus, and responsive primitives.
- `src/components/rebuild/shell/*` — header, desktop navigation, mobile navigation, search, inquiry indicator, footer.
- `src/components/rebuild/home/*` — homepage sections.
- `src/components/rebuild/company/*` — Company narrative and evolution sequence.
- `src/components/rebuild/catalogue/*` — division/family/search/filter/grid/pagination states.
- `src/components/rebuild/product/*` — product media, variants, specifications, related products, inquiry actions.
- `src/components/rebuild/inquiry/*` — inquiry list, item editing, buyer form, submission states.
- `src/components/rebuild/contact/*` — contact methods and general inquiry form.
- `src/components/rebuild/catalogues/*` — authentic document listings and missing-document states.
- `src/components/rebuild/ui/*` — project-owned buttons, links, inputs, drawers, dialogs, states, and technical labels.

### Data and backend

- `src/lib/catalogue/*` — typed public catalogue querying and product identity.
- `src/lib/inquiry/*` — inquiry item/value contracts and retention-safe snapshots.
- `src/lib/admin/*` — owner authentication, authorization, content state, versions, archive, and deletion boundaries.
- `src/app/api/rebuild/inquiry/route.ts` — validated general/product inquiry submission.
- `src/app/api/rebuild/admin/*` — owner-only server routes or server actions after architecture approval.
- `data/approved/*` — publishable catalogue/content inputs only.
- `data/working/*` — source-derived and pending review material.

### Tests

- `tests/throhi-foundation-contract.test.mjs`
- `tests/throhi-content-boundaries.test.mjs`
- `tests/throhi-catalogue-contract.test.mjs`
- `tests/throhi-inquiry-contract.test.mjs`
- `tests/throhi-admin-contract.test.mjs`
- `tests/e2e/throhi-public.spec.ts`
- `tests/e2e/throhi-responsive-accessibility.spec.ts`
- `tests/e2e/throhi-admin.spec.ts`
- `scripts/verify-throhi-production.sh`

---

### Task 1: Establish traceability and freeze conflicting assumptions

**Files:**
- Create: `docs/content/THROHI_CONTENT_MATRIX.md`
- Create: `docs/qa/THROHI_ACCEPTANCE_MATRIX.md`
- Create: `tests/throhi-foundation-contract.test.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: approved foundation specification.
- Produces: authoritative requirement IDs such as `BRAND-01`, `CAT-01`, `INQ-01`, `ADMIN-01`, `A11Y-01` used by design and test documentation.

- [ ] Write a requirement matrix mapping every specification section to a stable requirement ID, public route, admin module, Figma artifact, implementation task, and verification method.
- [ ] Mark every company fact as `approved`, `pending verification`, `hidden`, or `prohibited`.
- [ ] Write a failing source-contract test requiring two public divisions, Company-only evolution, no inquiry attachments, and approved typography variables.
- [ ] Run `node --test tests/throhi-foundation-contract.test.mjs`; expect failure because the current implementation still contains conflicting assumptions.
- [ ] Update project-state documentation to identify the new specification and this plan as authoritative while retaining old files as historical records.
- [ ] Commit with `docs: freeze approved THROHI foundation contract`.

### Task 2: Build the Figma foundations page

**Files:**
- Create: `docs/design/THROHI_FIGMA_FOUNDATIONS.md`
- Figma: reorganize/create `01 Foundations` in file `w12E41un4krAwBqlo8fHa6`.

**Interfaces:**
- Produces: named Figma variables/styles matching production token names.

- [ ] Create color variables for emerald, technical blue, paper, white, ink, muted text, restrained brass, semantic success/warning/error, focus, borders, and disabled states.
- [ ] Create typography styles for restrained serif H1/H2, Instrument Sans H3-H6/body/UI, and IBM Plex Mono references/metadata.
- [ ] Create spacing, radius, border, shadow, grid, container, icon, image-stage, and motion variables.
- [ ] Build desktop, tablet, mobile, and narrow-mobile layout grids using Auto Layout and constraints.
- [ ] Add examples proving serif restraint, practical body sizes, technical labels, focus visibility, and contrast.
- [ ] Inspect the full page at 100% and zoomed detail; correct optical alignment, inconsistent naming, and accidental duplicate values.
- [ ] Record the final variable/style names and values in `THROHI_FIGMA_FOUNDATIONS.md`.
- [ ] Commit documentation only with `docs: record THROHI Figma foundations`.

### Task 3: Build the Figma component system and states

**Files:**
- Figma: create/rebuild `02 Components`.
- Modify: `docs/design/THROHI_FIGMA_FOUNDATIONS.md`.

**Interfaces:**
- Consumes: Task 2 variables.
- Produces: reusable components with explicit variants used by all later frames.

- [ ] Build buttons, text links, icon buttons, inputs, textareas, selects, checkboxes, quantity controls, search, tags, filter controls, pagination, alerts, toasts, drawers, dialogs, accordions, skeletons, and empty/error states.
- [ ] Build shared header, desktop Products menu, full-height mobile navigation, inquiry count, and footer components.
- [ ] Build product card, image stage, product code label, family selector, division selector, filter row, active-filter token, variant row, specification row, document row, and inquiry item components.
- [ ] Build admin navigation, table/record row, status control, draft/published indicator, version row, archive confirmation, and destructive confirmation components.
- [ ] Include default, hover, focus-visible, active, selected, disabled, loading, error, and success variants where relevant.
- [ ] Validate long names, long codes, missing images, zero results, and narrow container behavior.
- [ ] Perform a subtractive review and remove decorative variants that do not support a real state.

### Task 4: Produce responsive wireframes from the approved information architecture

**Files:**
- Figma: archive the rejected page `02 — Public Website Wireframes`; create a new clearly named wireframe page.
- Create: `docs/design/THROHI_RESPONSIVE_BEHAVIOR.md`.

**Interfaces:**
- Consumes: approved components and page foundations.
- Produces: desktop/mobile structure for Home, Company, Products, Product Detail, Catalogues, Inquiry, Contact, and Admin.

- [ ] Wireframe Home with intro handoff, identity, division access, search, representative families, concise company section, catalogue documents, and final Contact/Inquiry decision point.
- [ ] Wireframe Company with introduction, Sialkot context, evolution, THROHI today, and contact conclusion.
- [ ] Wireframe Products as division-first, family-second unified catalogue with three-column desktop product grid and focused mobile filter drawer.
- [ ] Wireframe Product Detail with contained media, variants, verified specifications, related products, Quick Inquiry, and Add to Inquiry.
- [ ] Wireframe authentic Catalogues states for available Surgical/Dental PDFs and unavailable-document fallback.
- [ ] Wireframe multi-product Inquiry and general Contact separately.
- [ ] Wireframe admin dashboard, content, products, documents, contact, inquiries, preview, version restore, archive, and deletion confirmation.
- [ ] Design desktop, tablet, mobile, and narrow-mobile ordering; do not treat mobile as a mechanical stack.
- [ ] Review every section against the subtractive decision gate and remove duplicated information or CTAs.

### Task 5: Create high-fidelity public and admin designs

**Files:**
- Figma: `04 Desktop`, `05 Tablet`, `06 Mobile`, `08 Edge Cases`.
- Modify: `docs/design/THROHI_RESPONSIVE_BEHAVIOR.md`.

**Interfaces:**
- Produces: implementation-ready frames and edge states.

- [ ] Apply the approved warm-light emerald/blue direction, low-radius geometry, specimen image stages, and restrained serif hierarchy.
- [ ] Use real source-derived product names, codes, and representative images; clearly mark unverified company copy as design-only pending content.
- [ ] Complete every public page at desktop, tablet, mobile, and narrow mobile.
- [ ] Complete owner admin screens and destructive/publishing flows.
- [ ] Design loading, empty, missing-image, no-results, validation, submission-error, success, unauthorized, expired-session, and network-failure states.
- [ ] Verify that no public frame exposes Beauty or Veterinary.
- [ ] Verify no frame introduces unsupported badges, testimonials, statistics, certificates, prices, or contact facts.
- [ ] Run two visual audits: creator self-review, then independent art-direction review; correct every in-scope issue before handoff.

### Task 6: Specify and prototype the two signature motion experiences

**Files:**
- Create: `docs/design/THROHI_MOTION_SPEC.md`.
- Figma: `07 Prototypes`.

**Interfaces:**
- Produces: exact triggers, durations, interruption rules, mobile fallbacks, and reduced-motion behavior.

- [ ] Prototype the first-visit intro, slide-away reveal, returning-visitor skip/shorten behavior, and immediate bypass control.
- [ ] Prototype Company-page scissors evolution using the supplied 260-frame sequence, ending in modern scissors and transitioning to THROHI today.
- [ ] Define functional motion vocabulary for navigation, filters, inquiry feedback, drawers, dialogs, and page-state transitions.
- [ ] Define reduced-motion substitutes that reveal all content immediately.
- [ ] Set media budgets and loading rules so neither signature sequence blocks navigation, catalogue, or contact.
- [ ] Reject custom cursors, constant floating, repeated parallax, glow loops, and animations applied to every section.

### Task 7: Audit the existing code and lock the replacement architecture

**Files:**
- Create: `docs/architecture/THROHI_APPLICATION_ARCHITECTURE.md`.
- Inspect: `src/app/rebuild/**`, `src/components/rebuild/**`, `src/lib/**`, `tests/**`, `scripts/**`, `data/**`, `public/**`.

**Interfaces:**
- Produces: keep/replace/delete map and stable TypeScript contracts.

- [ ] Map current routes, providers, catalogue loaders, inquiry state, API behavior, media pipelines, CSS layers, and tests.
- [ ] Identify behavior that must be preserved and visual/content behavior that must be replaced.
- [ ] Define typed interfaces for `Division`, `Family`, `Product`, `ProductVariant`, `CatalogueDocument`, `InquiryItemSnapshot`, `InquirySubmission`, `PublishedContentVersion`, and `AdminContentState`.
- [ ] Select the owner authentication, database, object storage, email, backup, and deployment boundaries using existing infrastructure where viable.
- [ ] Record migration and rollback strategy without changing production systems.
- [ ] Confirm whether the current `/rebuild` route remains the implementation namespace until final cutover.
- [ ] Review the architecture for least privilege, owner-only authorization, rate limiting, data retention, and version restoration.

### Task 8: Implement the canonical design foundation and shared UI

**Files:**
- Create: `src/app/rebuild/throhi-foundation.module.css`.
- Create/modify: `src/components/rebuild/ui/*`.
- Modify: `src/app/rebuild/rebuild-shell.tsx`.
- Test: `tests/throhi-foundation-contract.test.mjs`.

**Interfaces:**
- Produces: canonical CSS variables/classes and accessible project-owned primitives.

- [ ] Extend the failing contract test to assert exact font roles, color tokens, radii, container width, focus treatment, reduced-motion rules, and absence of superseded public-division labels.
- [ ] Run the test and confirm the expected failures.
- [ ] Implement canonical tokens and font wiring without stacking another temporary override layer.
- [ ] Implement accessible primitives with semantic elements and complete interaction states.
- [ ] Run `npm run lint`, `npm run typecheck`, and the foundation contract test.
- [ ] Remove obsolete visual modules only after selector-by-selector coverage is proven.
- [ ] Commit with `feat: establish approved THROHI design foundation`.

### Task 9: Implement the shared shell, navigation, search entry, and footer

**Files:**
- Modify/create: `src/components/rebuild/shell/*`.
- Modify: `src/app/rebuild/rebuild-shell.tsx`.
- Test: `tests/e2e/throhi-public.spec.ts`.

**Interfaces:**
- Produces: shared public shell with two-division Products navigation and visible inquiry state.

- [ ] Write Playwright tests for desktop navigation, mobile full-height navigation, focus trapping and release, Escape behavior, body scroll lock, Search access, and Inquiry count.
- [ ] Run the tests and confirm current failures against the approved structure.
- [ ] Implement the persistent desktop header and full-height mobile navigation.
- [ ] Implement division-first Products navigation with Surgical and Dental only.
- [ ] Preserve catalogue/search URL state and inquiry state through navigation.
- [ ] Rebuild the footer using only verified company/contact content.
- [ ] Verify keyboard, 200% zoom, reduced motion, 320px width, and no horizontal overflow.
- [ ] Commit with `feat: rebuild THROHI shared shell`.

### Task 10: Implement Home and Company

**Files:**
- Modify: `src/app/rebuild/page.tsx`.
- Modify/create: `src/components/rebuild/home/*`.
- Modify: Company route and `src/components/rebuild/company/*`.
- Test: `tests/e2e/throhi-public.spec.ts`.

**Interfaces:**
- Consumes: shared shell, product query interfaces, motion spec.
- Produces: approved Home and Company experiences.

- [ ] Write failing browser assertions for exact section order, first-viewport identity/actions, two public divisions, search entry, catalogue documents, and absence of evolution on Home.
- [ ] Implement the brief first-visit intro with persistent returning-visitor bypass and reduced-motion skip.
- [ ] Implement the homepage hierarchy using real products and no filler sections.
- [ ] Implement Company introduction, Sialkot context, scissors evolution, THROHI today, and Contact conclusion.
- [ ] Ensure the evolution copy never attributes historical instruments to THROHI.
- [ ] Test intro interruption, returning visit, reduced motion, slow media, keyboard navigation, and mobile ordering.
- [ ] Commit with `feat: implement approved THROHI Home and Company`.

### Task 11: Implement catalogue discovery and product detail

**Files:**
- Modify: `src/app/rebuild/products/page.tsx`.
- Modify/create: `src/components/rebuild/catalogue/*`.
- Modify: `src/app/rebuild/products/[productId]/page.tsx`.
- Modify/create: `src/components/rebuild/product/*`.
- Create/modify: `src/lib/catalogue/*`.
- Test: `tests/throhi-catalogue-contract.test.mjs`, `tests/e2e/throhi-public.spec.ts`.

**Interfaces:**
- Produces: typed division/family/name/code discovery and stable product identity.

- [ ] Write contract tests for Surgical/Dental visibility, family filtering, name/code search, three-column desktop grid, base/variant identities, and missing-image fallback.
- [ ] Preserve approved source-derived catalogue records and media mappings.
- [ ] Implement division-first and family-second catalogue entry.
- [ ] Implement URL-backed search/filter/pagination state and mobile filter drawer.
- [ ] Implement contained specimen product cards and product detail media.
- [ ] Implement variants, verified specifications, related products, optional configured pricing, Quick Inquiry, and Add to Inquiry.
- [ ] Test no-results, invalid query, missing image, long product name/code, back navigation, refresh, and mobile behavior.
- [ ] Commit with `feat: implement THROHI catalogue and product detail`.

### Task 12: Implement inquiry, contact, and catalogue documents

**Files:**
- Modify/create: `src/components/rebuild/inquiry/*`, `src/components/rebuild/contact/*`, `src/components/rebuild/catalogues/*`.
- Modify: Inquiry, Contact, and Catalogues routes.
- Create/modify: `src/lib/inquiry/*`.
- Modify: `src/app/api/rebuild/inquiry/route.ts`.
- Test: `tests/throhi-inquiry-contract.test.mjs`, `tests/e2e/throhi-public.spec.ts`.

**Interfaces:**
- Produces: guest Quick Inquiry, multi-product Inquiry List, general Contact inquiry, and authentic PDF listings.

- [ ] Write failing tests for product snapshots, quantity/notes editing, no uploads, buyer validation, duplicate-submission protection, retention of archived product names/codes, and approved terminology.
- [ ] Remove attachment behavior from the public inquiry contract and interface.
- [ ] Implement Quick Inquiry and multi-product Inquiry List with persistent product context.
- [ ] Implement server-side validation, rate protection, configured email delivery, and latest-20 lightweight retention.
- [ ] Implement general Contact separately from product-based Inquiry.
- [ ] Implement Surgical/Dental document groups using only supplied authentic PDFs; render a factual unavailable state otherwise.
- [ ] Test invalid input, failed email, failed persistence, duplicate action, refresh, mobile keyboard, success, and recovery.
- [ ] Commit with `feat: implement THROHI inquiry contact and catalogues`.

### Task 13: Implement owner admin, publishing, versions, and safe deletion

**Files:**
- Create/modify: `src/app/rebuild/admin/**`.
- Create/modify: `src/lib/admin/**`.
- Create/modify: owner-only API routes/server actions.
- Test: `tests/throhi-admin-contract.test.mjs`, `tests/e2e/throhi-admin.spec.ts`.

**Interfaces:**
- Produces: single-owner authenticated content, catalogue, document, contact, inquiry, and publishing controls.

- [ ] Write failing tests proving unauthenticated and non-owner requests cannot read or mutate admin data.
- [ ] Implement one-owner authentication with secure reset, session, 2FA where provider support permits, rate protection, and audit logging.
- [ ] Implement dashboard summaries without fabricated analytics.
- [ ] Implement content, products, families, variants, media, optional price, division state, catalogue document, contact, and latest-20 inquiry management.
- [ ] Implement Draft → Preview → Publish.
- [ ] Retain latest five published versions and make restore create a new draft.
- [ ] Implement archive as default and a separate strongly confirmed permanent deletion path.
- [ ] Ensure Beauty/Veterinary remain hidden until explicitly activated.
- [ ] Test expired session, unauthorized mutation, validation failure, concurrent edit, archive, restore, permanent deletion, and rollback.
- [ ] Commit with `feat: implement THROHI owner admin publishing`.

### Task 14: Responsive, accessibility, performance, security, and production verification

**Files:**
- Create: `tests/e2e/throhi-responsive-accessibility.spec.ts`.
- Create: `scripts/verify-throhi-production.sh`.
- Modify: Playwright config only as needed.
- Modify: `docs/qa/THROHI_ACCEPTANCE_MATRIX.md`, `PROJECT_STATE.md`, `CHANGELOG.md`.

**Interfaces:**
- Produces: one local production-readiness command and evidence mapped to every requirement.

- [ ] Add viewport coverage for 320, 390, 768, 1024, 1280, 1440, and large desktop.
- [ ] Add keyboard, focus, zoom, forced-colors, reduced-motion, touch, long-content, missing-image, and network-failure tests.
- [ ] Add axe checks for every public route and representative admin routes.
- [ ] Add performance assertions/budgets for intro video, evolution frames, product imagery, fonts, JavaScript, and layout shifts.
- [ ] Review security headers, CSP, secrets, authorization, rate limits, input validation, output encoding, error leakage, and admin route boundaries.
- [ ] Implement `scripts/verify-throhi-production.sh` to run catalogue/media preparation checks, lint, typecheck, source tests, production build, Playwright desktop/mobile suites, accessibility checks, and readiness checks locally.
- [ ] Run `bash scripts/verify-throhi-production.sh`; record exact pass/fail output without intentionally invoking GitHub Actions.
- [ ] Perform a rendered visual audit on all primary routes and correct every in-scope issue.
- [ ] Update requirement traceability and known limitations.
- [ ] Commit with `test: complete THROHI production verification`.

### Task 15: Delivery checkpoint and cutover proposal

**Files:**
- Create/update: `docs/production/THROHI_CUTOVER_CHECKLIST.md`.
- Modify: `PROJECT_STATE.md`, `CHANGELOG.md`.

**Interfaces:**
- Produces: reviewable release candidate and reversible cutover instructions; does not itself deploy or merge.

- [ ] Confirm final logo, real contact details, inquiry recipient, physical address/map, original PDFs, legal text, and all intended public claims are supplied and approved.
- [ ] Document unresolved items as explicit release blockers or intentionally hidden features.
- [ ] Record local verification evidence, screenshots, accessibility results, performance results, security review, and migration/rollback steps.
- [ ] Present the release candidate for user review.
- [ ] Do not deploy, merge, open a PR, activate production data, or run GitHub Actions until the user separately authorizes that action.

---

## Self-review result

- **Specification coverage:** All approved sections map to design, implementation, backend, admin, responsive, accessibility, motion, content, and verification tasks.
- **Conflict handling:** Earlier four-division, homepage-evolution, attachment-inquiry, dark-first, and heritage-heavy assumptions are explicitly replaced.
- **Placeholder handling:** Unknown company facts are represented as release inputs or hidden states, never production filler.
- **Type and interface consistency:** Product and inquiry identity are snapshot-based; archive/delete cannot erase names or references from retained inquiries.
- **Execution boundary:** This plan authorizes planning only until the user approves execution. It does not authorize code, deployment, merge, PR creation, or GitHub Actions usage.
