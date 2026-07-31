# THROHI Rebuild — Project State

This file is the single decision source of truth for the current rebuild. Earlier chats, branches, screenshots, and implementations are reference material unless recorded here.

## Current phase

**Milestone 6: Premium Visual Convergence implementation present, including legal and terminal utility states. Runtime and manual visual verification remain pending.**

Work remains isolated on `design/surgical-precision-archive`, based on `rebuild/surgical-contrast`. Public routes remain unchanged and `/rebuild` remains non-indexed.

Implemented milestones:

1. Surgical Precision Archive homepage and shared shell
2. Company & Trust Spine
3. Precision Catalogue Ledger
4. Instrument Examination & Inquiry Desk
5. Durable Inquiry Backend
6. Premium Visual Convergence

No pull request, merge, deployment, public cutover, or GitHub Actions run is authorized.

## Primary implementation preference

Layout, imagery, visual hierarchy, typography, spacing, responsive composition, trust, and overall design quality are the primary decision criteria.

Important information must remain readable. Microtype is reserved for nonessential technical references only.

Critical blockers:

- build or type-check failure;
- broken search, filters, pagination, routing, catalogue return context, inquiry identity, persistence, validation, or submission;
- serious or critical accessibility violations;
- keyboard traps or unusable controls;
- horizontal overflow;
- silent production data loss or successful responses without durable storage;
- missing approved real imagery;
- invented data, claims, contact details, legal details, recipients, or downloadable documents.

Deferred nonblockers:

- harmless pre-existing lint warnings;
- unrelated toolchain deprecations;
- cosmetic differences that do not damage hierarchy or usability;
- tests that enforce superseded syntax rather than user behavior.

## Approved purpose

THROHI Medical Tools needs a professional corporate and catalogue website that:

- introduces the company and its instrument ranges;
- presents Surgical, Dental and Orthodontic, Veterinary, and Beauty divisions;
- provides a searchable catalogue using real names, codes, images, families, and variants;
- publishes catalogue documents only when real files and metadata exist;
- lets visitors build and submit one structured, non-commerce Inquiry List;
- integrates the supplied cinematic and scissors-evolution media without obstructing practical browsing.

## Approved design system

**Regal Technical Corporate / Surgical Precision Archive**

- Cormorant Garamond: primary titles and major editorial headings.
- Instrument Sans: body, navigation, forms, and controls.
- IBM Plex Mono: catalogue codes, status, and concise technical metadata.
- Core palette: ink `#06131d`, navy `#0a2233`, warm ivory `#f7f3ea`, paper `#fbfaf6`, surgical green `#236b4b`, muted brass `#ad8950`, light brass `#d8bd84`.
- Real instrument imagery is the primary visual material.
- Warm paper/ivory supports reading and comparison.
- Borders, whitespace, precise alignment, restrained brass, and calm depth define grouping.
- Generic SaaS cards, excessive pills, decorative glass, cyberpunk styling, gaming presentation, fake luxury, and design-agency spectacle are rejected.
- Major signature motion remains limited to the cinematic cover and full evolution sequence.
- Buyer tasks use restrained state, line, image, and navigation motion.

## Information architecture

- Home
- Products
  - All Products
  - Surgical Instruments
  - Dental and Orthodontic Instruments
  - Veterinary Instruments
  - Beauty Instruments
  - Product-family and product-detail routes
- Company
  - About THROHI
  - Scissors Through Time
- Catalogues
- Inquiry List
- Contact
- Privacy
- Terms
- Search, loading, error, success, and not-found states

## Implemented Milestone 1 — homepage and shell

- skippable supplied MP4 cinematic cover;
- company-led hero identifying THROHI and Sialkot, Pakistan;
- early catalogue search;
- four truthful division entries;
- selected real product families;
- verified company introduction;
- compact 260-frame evolution preview;
- responsive shared header/footer and mobile navigation;
- catalogue, Inquiry List, and unlisted-instrument utilities;
- verified-contact boundary with no empty controls.

## Implemented Milestone 2 — Company & Trust Spine

Routes:

- `/rebuild/company`
- `/rebuild/company/scissors-through-time`
- `/rebuild/catalogues`
- `/rebuild/contact`

Features include typed verified content, four-division ledger, full evolution route, reduced-motion and media-failure parity, real-files-only catalogue documents, and structured inquiry routing.

## Implemented Milestone 3 — Precision Catalogue Ledger

`/rebuild/products` preserves URL-backed `q`, `division`, `family`, `sort`, and `page` behavior.

- dark editorial masthead with real specimen media;
- product, variant, division, and source-status ledger;
- search by name or exact code;
- sticky desktop and native mobile filters;
- procurement-focused product records with real optimized media;
- visible code, taxonomy, variants, product route, and live Inquiry state;
- context-preserving pagination and recovery.

## Implemented Milestone 4 — Instrument Examination & Inquiry Desk

### Product detail

- preserved catalogue return context;
- large real-media examination stage;
- dark identity and procurement rail;
- code, division, family, source, variant-count, and technical-status ledger;
- independent base-product and variant Inquiry identities;
- structured variant ledger and related-family discovery;
- responsive and reduced-motion-safe states.

### Inquiry List

- procurement masthead and four-stage workflow;
- explicit non-order/non-payment boundary;
- quantity, notes, remove, undo, unlisted references, requirements, attachment selection, buyer details, consent, optional Turnstile, and review desk;
- preserved browser state, migration, validation, submission token, API, and success route.

Latest supplied Milestone 4 evidence showed zero lint errors, successful typecheck/build, 84 passing unit tests, and 109 passing browser tests before one remaining browser failure was isolated into route-specific checks. No fresh runtime-green claim is made after the final test correction.

## Implemented Milestone 5 — Durable Inquiry Backend

### Website proxy

- same-origin multipart and legacy JSON submission;
- server-side catalogue and buyer validation;
- actual attachment-byte verification;
- privacy-preserving daily request fingerprint;
- authenticated forwarding to a dedicated Worker;
- production HTTP 503 when durable configuration is absent;
- memory adapter restricted to non-production;
- duplicate submission references preserved.

### Cloudflare Worker

- D1 inquiry, item, delivery-outbox, and rate-limit storage;
- unique reference and submission-token constraints;
- private R2 attachments and rollback on D1 failure;
- optional mandatory Turnstile verification;
- privacy-preserving rate limiting;
- optional signed delivery webhook;
- durable delivery state and configuration health endpoint.

Operations are documented in `docs/backend/INQUIRY_BACKEND.md`. Source contract: `npm run backend:check`.

## Implemented Milestone 6 — Premium Visual Convergence

### Global system

- Cormorant Garamond exposed as `--font-regal`;
- premium ivory, brass, navy, green, typography, spacing, line, and shadow tokens;
- original `surgical-precision-archive-v1` regression marker preserved;
- new `premium-visual-convergence-v1` marker added;
- shared route convergence applied through `RebuildShell`;
- readable minimum sizing for important body, navigation, form, and action text.

### Main routes

- homepage, catalogue, product examination, Inquiry List, corporate routes, and confirmation state use one regal hierarchy;
- warm editorial surfaces and restrained brass rules converge search, product records, variants, related products, forms, review panels, and corporate heroes;
- desktop and mobile header, product/search panels, full-height mobile navigation, and footer receive one premium shell treatment;
- footer includes product, company, Privacy, and Terms navigation.

### Legal and terminal utility states

Routes and boundaries:

- `/rebuild/privacy`
- `/rebuild/terms`
- rebuild-scoped not-found state with low-priority catch-all routing
- rebuild-scoped runtime error boundary with retry and safe recovery
- rebuild-scoped semantic loading ledger

Implementation details:

- legal copy is typed in `src/rebuild/legal-content.ts` and limited to implemented application boundaries;
- no invented effective date, privacy contact, jurisdiction, retention period, governing law, or commercial promise;
- legal pages use a dark identity masthead, readable sticky index, numbered sections, and explicit pending-review boundary;
- 404 recovery routes to catalogue search, all products, and unlisted-instrument inquiry;
- runtime error preserves catalogue/Inquiry recovery and exposes `reset()` retry;
- loading uses `role="status"`, no fake percentage, no spinner, and reduced-motion-safe placeholders;
- legacy public Privacy, Terms, and root not-found routes remain unchanged until cutover.

### Verification assets

- `tests/rebuild-premium-convergence.test.mjs`
- `tests/rebuild-premium-utility-states.test.mjs`
- `tests/e2e/rebuild-premium-convergence.spec.ts`
- `tests/e2e/rebuild-premium-utility-states.spec.ts`
- `bash scripts/verify-design-milestone-6.sh`
- isolated Playwright port `3104`

Milestone 6 remains implementation-present only. Runtime and manual screenshot review remain pending.

## Catalogue truth boundary

Hierarchy:

`Division → Category / Instrument Family → Product Family → Variant`

Current source-derived data contains approximately:

- 53 families/categories;
- 626 representative products;
- 1,434 variant codes;
- 626 optimized product images.

Surgical and Dental/Orthodontic have the strongest structured data. Beauty and Veterinary remain visible but are not populated with invented records.

## Inquiry boundary

The Inquiry List is not a shopping cart and has no checkout, pricing, or payment. No account is required.

## Verified facts

Safe:

- THROHI Medical Tools is based in Sialkot, Pakistan.
- Public ranges include Surgical, Dental and Orthodontic, Veterinary, and Beauty instruments.
- Validated catalogue identities and imagery may be used.

Pending and absent:

- founding year and operating history;
- certifications;
- materials and steel grades;
- manufacturing capabilities and capacity;
- export markets;
- OEM/private-label services;
- minimum orders and lead times;
- final contact formatting;
- complete Beauty and Veterinary catalogue data;
- real catalogue PDFs and metadata;
- approved inquiry recipient/delivery endpoint;
- approved retention and deletion periods;
- final legal wording and effective dates.

## Current gates

Premium visual convergence:

```bash
bash scripts/verify-design-milestone-6.sh
```

Backend source contract:

```bash
npm run backend:check
```

Real Cloudflare runtime verification remains pending until D1, R2, Worker secrets, website environment variables, and optional delivery/Turnstile settings are configured.

## Next phases

1. Manual premium visual review and targeted refinement at 1440, 1280, 768, 390, and 320 px.
2. Configure and verify real Cloudflare D1/R2/Worker resources and approved inquiry delivery.
3. Client catalogue validation, real catalogue documents, final logo, and verified contact/content completion.
4. Full accessibility, performance, security, metadata, privacy-retention, and Cloudflare production audit.
5. Explicit public cutover approval.

The current public implementation remains available until the rebuild passes review and receives explicit cutover approval.
