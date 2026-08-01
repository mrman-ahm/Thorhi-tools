# THROHI Website — Layered Execution Plan

## Authority

- Design specification: `docs/superpowers/specs/2026-08-01-throhi-website-foundation-design.md`
- Master implementation plan: `docs/superpowers/plans/2026-08-01-throhi-foundation-to-production.md`
- Content truth: `docs/content/THROHI_CONTENT_MATRIX.md`
- Acceptance traceability: `docs/qa/THROHI_ACCEPTANCE_MATRIX.md`
- Active isolated branch: `implementation/throhi-foundation-layer-1`

Older Precision Heritage House plans remain historical engineering records. They do not override the August 1 approvals.

## Execution model

Work proceeds inline in five clean layers. Each layer has internal phases and one meaningful checkpoint. Minor design and engineering decisions are resolved within the approved system instead of repeatedly stopping for micro-approval.

### Layer 1 — Design source of truth

**Goal:** Finish a complete, inspected Figma system before implementation changes begin.

Phases:

1. Requirement traceability and content boundaries
2. Figma variables, styles, grid, and file organization
3. Reusable public/admin components and all relevant states
4. Responsive public/admin wireframes
5. High-fidelity desktop, tablet, mobile, and narrow-mobile pages
6. Intro/evolution prototypes and motion specification
7. Edge cases, handoff mapping, subtractive review, independent visual audit

Current progress:

- content matrix created;
- acceptance matrix created;
- red foundation source contract created;
- PROJECT_STATE reset to approved authority;
- Figma production pages created;
- Cover, Foundations, and Archive created and inspected;
- 72 variables, 15 text styles, three effect styles, and responsive grids created;
- Button component set created and inspected;
- Field component set created and inspected;
- remaining core, feedback, catalogue, inquiry, shell, and admin components are active work.

Layer 1 exit gate:

- all required Figma pages complete;
- component and state inventory complete;
- desktop/tablet/mobile/narrow-mobile frames complete;
- motion and reduced-motion behavior specified;
- creator and independent design reviews corrected;
- Figma-to-code token/component mapping documented;
- no unresolved conflict with approved specification.

### Layer 2 — Public frontend foundation

**Goal:** Replace conflicting global presentation and rebuild the shared public experience without stacking another temporary CSS override layer.

Phases:

1. canonical font/token foundation;
2. project-owned accessible UI primitives;
3. shared header, Products navigation, Search entry, Inquiry indicator, mobile navigation, footer;
4. Home implementation;
5. Company implementation with Company-only evolution;
6. removal of superseded visual contracts after selector coverage is proven.

Exit gate:

- approved typography, color, geometry, navigation, Home, and Company contracts implemented;
- two public divisions only;
- no Home evolution preview;
- keyboard, reduced motion, zoom, and 320px behavior verified locally.

### Layer 3 — Catalogue and conversion

**Goal:** Complete product discovery, Product Detail, Inquiry, Contact, and authentic Catalogues behavior.

Phases:

1. typed catalogue/query contracts;
2. division/family/search/filter/grid/pagination experience;
3. Product Detail media, variants, specifications, related products;
4. Quick Inquiry and multi-product Inquiry List;
5. remove public upload/attachment behavior;
6. general Contact form;
7. authentic Surgical/Dental document states.

Exit gate:

- product identity remains source-derived;
- guest inquiry snapshots persist name/reference/quantity/notes;
- no upload, account, or ecommerce language;
- failure, refresh, back-navigation, no-results, missing-image, and mobile-keyboard states verified.

### Layer 4 — Owner admin and backend alignment

**Goal:** Implement secure single-owner content/product/document/contact/inquiry management and controlled publishing.

Phases:

1. architecture decision for authentication, database, storage, email, backup, deployment;
2. single-owner authentication/authorization;
3. content, catalogue, media, document, contact, and optional-price management;
4. latest-20 inquiry retention;
5. Draft → Preview → Publish;
6. latest-five versions and restore-to-draft;
7. archive default and strongly confirmed permanent deletion;
8. hidden Beauty/Veterinary division states.

Exit gate:

- unauthorized mutation is impossible;
- owner flows and failure recovery verified;
- no fabricated dashboard data;
- production fails clearly when required delivery/configuration is absent.

### Layer 5 — Verification and release candidate

**Goal:** Produce a locally verified, reviewable, reversible release candidate without automatically deploying or merging it.

Phases:

1. source/unit/integration tests;
2. production build and readiness budgets;
3. desktop/tablet/mobile/narrow-mobile Playwright journeys;
4. axe, keyboard, focus, zoom, forced-colors, reduced-motion review;
5. visual audit and corrections;
6. performance and security review;
7. client-input/release-blocker check;
8. cutover and rollback proposal.

Exit gate:

- `scripts/verify-throhi-production.sh` passes in a real checkout;
- exact evidence and known limitations recorded;
- final logo, contact, documents, legal text, and delivery configuration either supplied or explicitly blocking release;
- explicit user approval obtained before PR, merge, deployment, indexing, or public cutover.

## Working constraints

- Work only on the isolated implementation branch until a later explicit branch decision.
- Do not deploy, merge, open a PR, enable indexing, or intentionally run GitHub Actions without explicit permission.
- Prefer local checks to hosted Actions.
- Preserve existing catalogue data, media preparation, and proven behavior where compatible.
- Do not preserve attachment behavior because the approved inquiry contract removes uploads.
- Do not publish unsupported company, product, certification, material, market, contact, pricing, legal, or response-time claims.
- Public divisions are Surgical and Dental only.
- Beauty and Veterinary remain hidden until explicit activation.

## Current verification status

`tests/throhi-foundation-contract.test.mjs` is a deliberate red contract describing the approved future state. It has not been executed in the connector-only environment and is expected to fail until Layers 2 and 3 replace the known conflicts.

No runtime-green, build-green, deployment, or production-readiness claim is currently made.
