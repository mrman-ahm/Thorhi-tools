# THROHI Website — Execution Plan

## Current objective

Verify and visually review **Design Milestone 4: Instrument Examination & Inquiry Desk** on `design/surgical-precision-archive` while catalogue validation continues in parallel.

The homepage/shared shell, Company & Trust Spine, Precision Catalogue Ledger, product examination, and Inquiry List redesign are implementation-present on `/rebuild`. They remain non-indexed and are not approved for public cutover until the combined local gate and screenshot review pass.

## Cross-phase quality standard

Layout, hierarchy, imagery, spacing, responsive composition, and procurement usability are the primary design criteria.

- Every touched surface must look deliberately designed rather than generated from a generic card or dashboard pattern.
- Real supplied or source-derived instrument imagery is the primary visual material.
- Catalogue, product, form, and inquiry routes remain calm, precise, and procurement-focused.
- Motion clarifies state or navigation and includes reduced-motion parity.
- Critical build, type, data-integrity, core-interaction, accessibility, and responsive failures block a milestone.
- Harmless pre-existing warnings, deprecations, and obsolete syntax-only assertions remain deferred.
- A milestone cannot be marked complete from static review alone.

## Completed foundations

- project intake, strategy, references, brief, sitemap, and user flows;
- responsive wireframes and Surgical Precision Archive design system;
- Next.js scaffold and non-indexed `/rebuild` surface;
- accessibility and reduced-motion foundations;
- deterministic FineMed importer, catalogue audit, and approval workflow;
- 626 source-derived product records, 1,434 variants, and optimized media;
- shared inquiry schema, migration, API, and live Inquiry List state;
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
- requirements and attachment metadata section;
- buyer-details grid and consent validation;
- sticky desktop review desk and mobile flow convergence;
- preserved local persistence, migration, validation, API submission, token, and success routing.

## Milestone 4 verification

Run once from the real checkout at the milestone boundary:

```bash
bash scripts/verify-design-milestone-4.sh
```

The gate runs lint, typecheck, all unit tests, production build, and all rebuild browser suites on desktop and mobile through isolated port `3103`.

Manual review:

- 1440 × 1000
- 1280 × 800
- 768 × 1024
- 390 × 844
- 320 × 700
- base product selected/unselected
- true variant selected/unselected
- Inquiry empty/manual/populated
- quantity, notes, remove/undo
- buyer validation and submission error state
- reduced motion

No pull request, merge, deployment, or public cutover occurs automatically.

## Parallel client catalogue validation

1. Review the 175-record audit queue in `/rebuild/review/catalogue`.
2. Confirm identity, taxonomy, codes, source pages, variants, and images.
3. Export signed decisions into `data/working/finemed/`.
4. Run `npm run data:approve` and inspect the publication set.
5. Resolve needs-client records and repeat.
6. Keep `/rebuild` isolated and non-indexed until cutover approval.

## Next implementation phases

1. Durable inquiry and attachment storage with approved delivery integration
2. Verified contact and catalogue-document completion
3. Veterinary and Beauty content completion after real source data
4. Whole-site visual convergence, legal/error routes, and final logo treatment
5. Accessibility, security, performance, metadata, and Cloudflare production audit
6. Explicit public cutover approval

## Current dependencies

- combined Milestone 4 local verification and screenshot review;
- validated product taxonomy, names, codes, variants, and imagery;
- approved business facts and final contact formatting;
- real catalogue PDFs and metadata;
- final logo treatment;
- backend and delivery decisions for inquiries and attachments.

Technical product copy remains inside the verified catalogue boundary until confirmed against original sources.
