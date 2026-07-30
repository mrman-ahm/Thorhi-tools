# THROHI Website — Execution Plan

## Current objective

Configure and validate **Milestone 5: Durable Inquiry Backend** after its source implementation on `design/surgical-precision-archive`, while catalogue validation continues in parallel.

The homepage/shared shell, Company & Trust Spine, Precision Catalogue Ledger, Instrument Examination & Inquiry Desk, and Cloudflare-native inquiry backend are implementation-present. `/rebuild` remains non-indexed and is not approved for public cutover.

## Cross-phase quality standard

Layout, hierarchy, imagery, spacing, responsive composition, and procurement usability are the primary design criteria.

- Every touched surface must look deliberately designed rather than generated from a generic card or dashboard pattern.
- Real supplied or source-derived instrument imagery is the primary visual material.
- Catalogue, product, form, and inquiry routes remain calm, precise, and procurement-focused.
- Motion clarifies state or navigation and includes reduced-motion parity.
- Critical build, type, data-integrity, core-interaction, accessibility, responsive, and durable-storage failures block public cutover.
- Harmless pre-existing warnings, deprecations, and obsolete syntax-only assertions remain deferred.
- Production must never return success while using process memory or missing its durable service.

## Completed foundations

- project intake, strategy, references, brief, sitemap, and user flows;
- responsive wireframes and Surgical Precision Archive design system;
- Next.js scaffold and non-indexed `/rebuild` surface;
- accessibility and reduced-motion foundations;
- deterministic FineMed importer, catalogue audit, and approval workflow;
- 626 source-derived product records, 1,434 variants, and optimized media;
- shared inquiry schema, local migration, API, and live Inquiry List state;
- URL-backed catalogue filtering, sorting, pagination, and product routes.

## Milestone 1 — homepage and shared shell

- skippable supplied MP4 cinematic cover;
- company-led hero and early catalogue search;
- four divisions and selected real product families;
- verified company introduction;
- 260-frame evolution preview;
- responsive corporate header/footer and Inquiry utility.

## Milestone 2 — Company & Trust Spine

Routes:

- `/rebuild/company`
- `/rebuild/company/scissors-through-time`
- `/rebuild/catalogues`
- `/rebuild/contact`

Includes verified-content boundaries, full evolution route, real-files-only documents, and structured contact/inquiry routing.

## Milestone 3 — Precision Catalogue Ledger

- dark editorial masthead with real specimen media;
- product, variant, division, and source-status ledger;
- URL-backed command search and sorting;
- sticky desktop filters and native mobile filter disclosure;
- procurement product records with real imagery and live Inquiry state;
- pagination, no-results recovery, responsive and reduced-motion parity.

## Milestone 4 — Instrument Examination & Inquiry Desk

### Product detail

- compact return/context rail preserving the full catalogue URL;
- large real-media examination stage;
- dark identity/procurement rail;
- code, division, family, source, variant-count, and technical-status ledger;
- selected quantity feedback in the primary Inquiry action;
- independent base and variant inquiry identities;
- structured variant-code ledger;
- related-family comparison preserving return context;
- responsive and reduced-motion-safe design.

### Inquiry List

- dark procurement masthead and four-stage ledger;
- explicit non-order/non-payment boundary;
- focused product records with quantity, note, remove, and undo;
- unlisted-instrument panel;
- requirements and real attachment selection;
- buyer-details grid and consent validation;
- optional Turnstile UI;
- sticky desktop review desk and mobile flow convergence;
- preserved local state, migration, validation, submission token, and success routing.

The latest full evidence supplied by the user showed lint with zero errors, typecheck and build success, 84 passing unit tests, and 109 passing browser tests. Later user evidence reported one remaining browser failure. That serial corporate Axe aggregation has been split into isolated route checks without reducing accessibility assertions. No fresh runtime-green claim is made after that final test-only change.

## Milestone 5 — Durable Inquiry Backend

### Website boundary

- same-origin `/api/inquiries` accepts multipart and legacy JSON requests;
- actual attachment bytes are validated against sanitized metadata;
- catalogue and buyer validation remains authoritative on the server;
- a privacy-preserving daily fingerprint is derived using an independent secret;
- sanitized requests are forwarded to the Worker with shared-secret authentication;
- production fails closed with HTTP 503 when any required durable setting is absent;
- process-memory storage is restricted to non-production development.

### Cloudflare service

- dependency-free Worker at `workers/inquiry-api/src/index.mjs`;
- D1 migration for inquiries, normalized line items, delivery outbox, and rate limits;
- unique submission-token and reference constraints;
- private R2 attachment objects;
- deletion of uploaded objects when D1 persistence fails;
- optional Turnstile Siteverify enforcement;
- five-submission/ten-minute privacy-preserving limit;
- optional HMAC-signed delivery webhook with durable pending/delivered/retry state;
- health endpoint exposing configuration state without secrets.

### Operator assets

- website `.env.example`;
- Worker secret template;
- placeholder-only Wrangler configuration;
- ignored local Worker IDs/secrets;
- complete operations guide in `docs/backend/INQUIRY_BACKEND.md`;
- source contract command `npm run backend:check`.

## Milestone 5 configuration sequence

1. Create the D1 database and R2 bucket.
2. Copy the example Wrangler file and insert environment-specific resource identifiers.
3. Apply the D1 migration locally, then remotely.
4. Configure the shared API secret and website fingerprint secret.
5. Deploy the Worker and configure the website Worker URL.
6. Configure Turnstile only when both public and secret keys are ready.
7. Configure an approved delivery webhook only after its recipient and retention rules are confirmed.
8. Validate storage, attachments, duplicate retry, rate limiting, anti-spam, delivery state, and cleanup using the matrix in `docs/backend/INQUIRY_BACKEND.md`.

No pull request, merge, deployment, or public cutover occurs automatically.

## Parallel client catalogue validation

1. Review the 175-record audit queue in `/rebuild/review/catalogue`.
2. Confirm identity, taxonomy, codes, source pages, variants, and images.
3. Export signed decisions into `data/working/finemed/`.
4. Run `npm run data:approve` and inspect the publication set.
5. Resolve needs-client records and repeat.
6. Keep `/rebuild` isolated and non-indexed until cutover approval.

## Next implementation phases

1. Real Cloudflare resource configuration and approved inquiry delivery verification
2. Verified contact and catalogue-document completion
3. Veterinary and Beauty content completion after real source data
4. Whole-site visual convergence, legal/error routes, and final logo treatment
5. Accessibility, security, performance, metadata, retention, and Cloudflare production audit
6. Explicit public cutover approval

## Current dependencies

- real D1 and R2 resource identifiers;
- approved website production origin;
- high-entropy environment secrets;
- approved inquiry delivery recipient/endpoint;
- approved data retention and deletion periods;
- validated product taxonomy, names, codes, variants, and imagery;
- approved business facts and final contact formatting;
- real catalogue PDFs and metadata;
- final logo treatment.

Technical product copy remains inside the verified catalogue boundary until confirmed against original sources.
