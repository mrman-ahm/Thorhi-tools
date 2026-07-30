# THROHI Website — Execution Plan

## Current objective

Verify and visually review **Design Milestone 3: Precision Catalogue Ledger** on
`design/surgical-precision-archive` while the client catalogue-validation campaign
continues in parallel.

The homepage/shared shell, Company & Trust Spine, and catalogue discovery redesign
are implementation-present on `/rebuild`. They remain non-indexed and are not
approved for public cutover until the combined local gate and screenshot review pass.

## Cross-phase quality standard

Layout, hierarchy, imagery, spacing, responsive composition, and procurement usability
are the primary design criteria.

- Every touched surface must look deliberately designed rather than generated from a
  generic card or dashboard pattern.
- Real supplied or source-derived instrument imagery is the primary visual material.
- Catalogue, product, form, and inquiry routes remain calm, precise, and
  procurement-focused.
- Motion must clarify hierarchy, state, or navigation and must include reduced-motion
  parity.
- Critical build, type, data-integrity, core-interaction, accessibility, and responsive
  failures block a milestone.
- Harmless pre-existing warnings, deprecations, and obsolete syntax-only assertions are
  recorded in deferred work and do not derail design implementation.
- A milestone cannot be marked complete from static review alone.

## Completed foundations

- Project intake, strategic direction, reference analysis, project brief, sitemap, and
  core user flows
- Responsive wireframes and design-system foundations
- Next.js production scaffold and non-indexed `/rebuild` route
- Accessibility and reduced-motion foundations
- Deterministic FineMed source importer and catalogue audit
- Source-derived runtime catalogue with 626 representative product families and 1,434
  variants
- Real optimized catalogue imagery with deterministic sprite fallback
- Shared inquiry schema, migration, structured API workflow, and live Inquiry List state
- URL-backed catalogue filtering, sorting, pagination, product routes, and inquiry
  feedback
- Product examination routes with variant inquiry state and related-family discovery
- Deterministic approval schema and no-index catalogue review workspace

## Design Milestone 1 — homepage and shared shell implementation present

- Surgical Precision Archive token layer
- Corporate header and footer with Search and live Inquiry List state
- Skippable cinematic cover with reduced-motion and media-failure behavior
- Company-led homepage hero with one real signature instrument
- Early catalogue search
- Truthful four-division index
- Three selected real product families
- Verified company introduction
- 260-frame evolution preview
- Catalogue and structured inquiry utilities

## Design Milestone 2 — Company & Trust Spine implementation present

- `/rebuild/company`
- `/rebuild/company/scissors-through-time`
- `/rebuild/catalogues`
- `/rebuild/contact`
- Shared corporate route components
- Full 260-frame editorial experience
- Verified-content boundary
- Real-files-only catalogue-document boundary
- Structured contact and unlisted-instrument routes
- Header and footer navigation converged on real destinations

## Design Milestone 3 — Precision Catalogue Ledger implementation present

The catalogue route has been redesigned around procurement scanning and real instrument
imagery without changing data or URL behavior.

- Compact dark editorial catalogue masthead
- Real Operating Scissors specimen stage
- Product, variant, division, and source-status ledger
- Large command search by name or catalogue code
- Sticky desktop filter ledger
- Deliberate native mobile filter sheet
- Focused presentation components for filters, product records, toolbar, and empty state
- Two-column desktop instrument ledger and one-column mobile records
- Visible code, division, family, variant count, detail route, and Inquiry List state
- Pagination that restores result context
- Reduced-motion-safe image and line transitions
- New source and Playwright contracts
- Isolated verification on port `3102`

### Milestone 3 verification

Run from the real branch checkout:

```bash
bash scripts/verify-design-milestone-3.sh
```

The script runs lint, typecheck, unit tests, production build, and all rebuild desktop
and mobile Playwright suites. Pre-existing warnings are non-blocking unless they affect
build output or runtime behavior.

Then review:

- 1440 × 1000 desktop
- 1280 × 800 laptop
- 768 × 1024 tablet
- 390 × 844 mobile
- 320 × 700 narrow mobile
- default catalogue
- exact-code search
- active division/family filters
- no-results state
- selected Inquiry List state
- pagination
- reduced motion

No pull request, merge, deployment, or public cutover occurs automatically.

## Parallel phase — client catalogue validation campaign

1. Review the generated 175-record audit queue in `/rebuild/review/catalogue`.
2. Confirm identities, taxonomy, codes, source pages, variants, and images.
3. Export signed review decisions into `data/working/finemed/`.
4. Run `npm run data:approve` and inspect the approved publication set.
5. Resolve needs-client records and repeat.
6. Keep `/rebuild` isolated and non-indexed until cutover approval.

## Next implementation phases

1. Product-detail and Inquiry List visual refinement
2. Durable inquiry storage, attachment storage, and approved delivery integration
3. Verified content completion for contact, catalogues, Veterinary, and Beauty
4. Whole-site visual convergence and legacy-style removal
5. Accessibility, security, performance, and production audit
6. Cloudflare deployment preparation and explicit cutover approval

## Current dependencies

- Combined Milestone 3 local verification and screenshot review
- Validated product taxonomy, names, codes, variants, and imagery
- Approved business facts and final contact formatting
- Real catalogue PDFs and metadata
- Final logo treatment
- Backend and delivery decisions for inquiries and attachments

The current transparent raster logo remains temporary. Technical product copy remains
inside the verified catalogue boundary until confirmed against original sources.
