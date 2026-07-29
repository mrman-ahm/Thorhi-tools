# THROHI Website — Execution Plan

## Current objective

Operate the client catalogue-validation workflow and promote only explicitly
approved identity records while the next public content surfaces are prepared.

## Cross-phase quality standard

Every implementation phase must improve both the working system and the visual
quality of the surfaces it touches. UI refinement is continuous rather than a
single final polish pass.

- The homepage remains the flagship brand experience and should grow more
  distinctive as approved assets become available.
- Catalogue, product, form, and inquiry routes stay calm, precise, and
  procurement-focused.
- Motion must clarify hierarchy, state, or navigation. Decorative movement
  stays away from repeated buyer tasks.
- Every animation requires reduced-motion parity and must not delay access to
  content or actions.
- New visual work must use real supplied or approved assets and remain inside
  the verified claims boundary.

## Completed

- Project intake interpretation
- Strategic direction
- International reference analysis
- Project brief
- Sitemap and information architecture
- Core user flows
- Responsive low-fidelity wireframes
- Design-system foundations and reusable components
- Audited high-fidelity homepage for desktop and mobile
- Frontend architecture decision
- Production Next.js scaffold
- Responsive homepage implementation
- Temporary logo and replaceable instrument visual zones
- Accessibility and reduced-motion foundations
- Automated lint, type-check, test, and build quality gate
- Non-indexed `/rebuild` route checkpoint
- Deterministic FineMed source importer and catalogue audit
- Source-derived runtime catalogue with 626 representative product records
- Real catalogue sprite imagery and valid temporary transparent logo
- Shared inquiry schema v3, legacy migration, and structured API workflow
- Shared rebuild navigation, catalogue search, and footer
- Source-led rebuild homepage with real representative instrument imagery
- URL-backed catalogue filtering, sorting, pagination, and inquiry feedback
- Responsive catalogue presentation with native mobile filters and restrained motion
- High-resolution lazy product media with deterministic sprite fallback
- Blue-contrast rebuild grading across shared, homepage, catalogue, and inquiry surfaces
- Product examination pages with variant inquiry state and related-family discovery
- Deterministic catalogue approval schema and promotion command
- No-index 175-record catalogue review workspace with local draft and JSON handoff
- Multi-instrument homepage visual convergence using high-resolution real media
- Shared rebuild typography and evidence-led blue visual system

## Active phase

### Phase 11 — Client catalogue validation campaign

The review and deterministic promotion tooling is implemented. The remaining
work requires client decisions rather than speculative development:

1. Review the generated 175-record audit queue in `/rebuild/review/catalogue`
2. Confirm identities, taxonomy, codes, source pages, variants, and images
3. Export the signed review decisions into `data/working/finemed/`
4. Run `npm run data:approve` and inspect the partial approved catalogue
5. Resolve needs-client records and repeat until the intended publication set is approved
6. Keep `/rebuild` isolated and non-indexed until cutover approval

## Following phases

- Company, resource, contact, legal, and error pages
- Durable inquiry storage, attachment storage, and approved delivery integration
- Testing, security, accessibility, and performance review
- Cloudflare deployment preparation and production audit

## Current dependencies

- Validated product taxonomy, product names, and product codes
- Approved business facts and contact details
- Approved product and division photography
- Final hero or macro instrument asset
- Real catalogue PDFs and metadata
- Hosting and backend decisions for search, inquiries, and attachments

The current transparent raster logo is temporary. The supplied source-derived
instrument images support development, but technical copy remains pending
verification against original catalogue pages.
