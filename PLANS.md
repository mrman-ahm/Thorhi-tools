# THROHI Website — Execution Plan

## Current objective

Complete **Milestone 6: Premium Visual Convergence** review on `design/surgical-precision-archive`, while durable-backend configuration and catalogue validation continue as separate operational tracks.

The homepage/shared shell, Company & Trust Spine, Precision Catalogue Ledger, Instrument Examination & Inquiry Desk, Durable Inquiry Backend, and Premium Visual Convergence are implementation-present. `/rebuild` remains non-indexed and is not approved for public cutover.

## Cross-phase quality standard

Layout, typography, hierarchy, imagery, spacing, responsive composition, trust, and procurement usability are the primary design criteria.

- Every touched surface must look deliberately designed rather than generated from a generic card or dashboard pattern.
- Real supplied or source-derived instrument imagery remains the primary visual material.
- Major headings use the regal display system; body, navigation, controls, and forms remain clean and readable.
- Important information is never hidden in microtype.
- Catalogue, product, form, and inquiry routes remain calm, precise, and procurement-focused.
- Motion clarifies state or navigation and includes reduced-motion parity.
- Critical build, type, data-integrity, interaction, accessibility, responsive, and durable-storage failures block public cutover.
- Harmless pre-existing warnings, deprecations, and obsolete syntax-only assertions remain deferred.
- Production must never return success while using process memory or missing its durable service.

## Completed implementation foundations

- Project intake, strategy, references, brief, sitemap, and user flows
- Responsive wireframes and Surgical Precision Archive foundations
- Next.js scaffold and non-indexed `/rebuild` surface
- Accessibility and reduced-motion foundations
- Deterministic FineMed importer, catalogue audit, and approval workflow
- 626 source-derived product records, 1,434 variants, and optimized media
- Shared inquiry schema, local migration, API, and live Inquiry List state
- URL-backed catalogue filtering, sorting, pagination, and product routes
- Company, Catalogues, Contact, and Scissors Through Time routes
- Procurement catalogue, product examination, and Inquiry Desk layouts
- Cloudflare-native durable inquiry source implementation

## Milestone 6 — Premium Visual Convergence

### Typography and tokens

- Cormorant Garamond exposed as `--font-regal` through `next/font/google`
- Instrument Sans retained for body and interface text
- IBM Plex Mono retained for catalogue codes and technical metadata
- Premium ink, navy, ivory, paper, green, brass, line, spacing, and shadow tokens
- Explicit readable body, control, label, navigation, and mobile sizes

### Shared route convergence

- Premium scope applied through `RebuildShell`
- Original `surgical-precision-archive-v1` regression marker preserved
- New `premium-visual-convergence-v1` marker added
- Regal hierarchy applied to homepage, catalogue, product, inquiry, and corporate route headings
- Warm paper and ivory surfaces replace flat white where appropriate
- Brass accents remain restrained and green remains the principal action/verified color
- Catalogue search, product records, variant sections, inquiry review, and corporate heroes receive one coordinated visual language

### Persistent shell

- 80 px premium desktop header and 66 px mobile header
- Larger readable navigation
- Stronger Inquiry List utility
- Warm editorial search and product panels
- Full-height premium mobile navigation
- Regal footer manufacturer statement
- Clear route columns, verified origin, and restrained preview status

### Verification

- Source contract: `tests/rebuild-premium-convergence.test.mjs`
- Browser contract: `tests/e2e/rebuild-premium-convergence.spec.ts`
- Combined gate: `bash scripts/verify-design-milestone-6.sh`
- Isolated Playwright port: `3104`

No fresh runtime-green claim is made until the combined gate runs in a real checkout. Manual visual review remains required after automated checks.

## Milestone 6 review sequence

1. Run the combined automated gate.
2. Review 1440 × 1000 desktop.
3. Review 1280 × 800 laptop.
4. Review 768 × 1024 tablet.
5. Review 390 × 844 mobile.
6. Review 320 × 700 narrow mobile.
7. Inspect homepage normal/cinematic states.
8. Inspect catalogue default, search, filters, no-results, pagination, and selected inquiry states.
9. Inspect product base and variant states.
10. Inspect inquiry empty, manual, populated, validation, attachment, Turnstile, and review states.
11. Inspect Company, Catalogues, Contact, history, success, and pending states.
12. Refine only visible hierarchy, spacing, typography, or usability defects.

## Durable backend configuration track

1. Create the D1 database and R2 bucket.
2. Copy the example Wrangler file and insert environment-specific resource identifiers.
3. Apply the D1 migration locally, then remotely.
4. Configure the shared API secret and website fingerprint secret.
5. Deploy the Worker and configure the website Worker URL.
6. Configure Turnstile only when both public and secret keys are ready.
7. Configure an approved delivery webhook only after its recipient and retention rules are confirmed.
8. Validate storage, attachments, duplicate retry, rate limiting, anti-spam, delivery state, and cleanup using `docs/backend/INQUIRY_BACKEND.md`.

## Parallel client catalogue validation

1. Review the 175-record audit queue in `/rebuild/review/catalogue`.
2. Confirm identity, taxonomy, codes, source pages, variants, and images.
3. Export signed decisions into `data/working/finemed/`.
4. Run `npm run data:approve` and inspect the publication set.
5. Resolve needs-client records and repeat.
6. Keep `/rebuild` isolated and non-indexed until cutover approval.

## Next implementation phases

1. Premium visual review corrections and remaining legal/error/success route convergence
2. Real Cloudflare resource configuration and approved inquiry delivery verification
3. Verified contact and real catalogue-document completion
4. Veterinary and Beauty content completion after real source data
5. Final logo treatment and client-approved company content
6. Accessibility, security, performance, metadata, retention, and Cloudflare production audit
7. Explicit public cutover approval

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

No pull request, merge, deployment, or public cutover occurs automatically. Technical product copy remains inside the verified catalogue boundary until confirmed against original sources.
