# THROHI Website — Execution Plan

## Current objective

Verify the implemented `Surgical Precision Archive` homepage and shared shell on
`design/surgical-precision-archive`, while the client catalogue-validation
campaign continues in parallel.

The design milestone is not complete until its local quality and visual gates
pass. Catalogue identities remain subject to the existing client approval
workflow.

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
- A milestone cannot be marked complete from static review alone.

## Completed foundations

- Project intake interpretation
- Strategic direction
- International reference analysis
- Project brief
- Sitemap and information architecture
- Core user flows
- Responsive low-fidelity wireframes
- Design-system foundations and reusable components
- Frontend architecture decision
- Production Next.js scaffold
- Accessibility and reduced-motion foundations
- Automated lint, type-check, test, and build quality gate configuration
- Non-indexed `/rebuild` route checkpoint
- Deterministic FineMed source importer and catalogue audit
- Source-derived runtime catalogue with 626 representative product records
- Real catalogue sprite imagery and valid temporary transparent logo
- Shared inquiry schema v3, legacy migration, and structured API workflow
- URL-backed catalogue filtering, sorting, pagination, and inquiry feedback
- Responsive catalogue presentation with native mobile filters and restrained motion
- High-resolution lazy product media with deterministic sprite fallback
- Product examination pages with variant inquiry state and related-family discovery
- Deterministic catalogue approval schema and promotion command
- No-index 175-record catalogue review workspace with local draft and JSON handoff

## Design Milestone 1 — implementation present, verification pending

The following implementation exists on `design/surgical-precision-archive`:

- `Surgical Precision Archive` token layer isolated from legacy route styles
- Corporate shared header and footer with preserved search, focus, mobile-dialog,
  and live Inquiry List behavior
- Skippable cinematic MP4 cover with reduced-motion and media-failure behavior
- Company-led clean-split hero using one real Operating Scissors asset
- Early catalogue search by product name or code
- Truthful four-division index with real Surgical and Dental representatives
- Three selected real product families
- Verified company introduction limited to public-safe facts
- Homepage scissors-evolution preview using the supplied 260-frame sequence
- Complete reduced-motion evolution copy
- Catalogue, Inquiry List, and unlisted-instrument utilities
- Verified-contact boundary that renders no empty email, phone, or WhatsApp controls
- Focused desktop/mobile/accessibility/media-failure Playwright contract

### Required verification before completion

Run from a real branch checkout:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=desktop-chromium
npm run test:e2e -- tests/e2e/rebuild-home-design.spec.ts --project=mobile-chromium
```

Then perform screenshot review at 1440×1000, 1280×800, 390×844, and
320×700. Review reduced motion and failed media separately. Correct every
specific visual, responsive, content, or accessibility issue before moving this
milestone into Completed.

No pull request is opened automatically.

## Parallel phase — client catalogue validation campaign

The review and deterministic promotion tooling is implemented. The remaining
work requires client decisions rather than speculative development:

1. Review the generated 175-record audit queue in `/rebuild/review/catalogue`
2. Confirm identities, taxonomy, codes, source pages, variants, and images
3. Export the signed review decisions into `data/working/finemed/`
4. Run `npm run data:approve` and inspect the partial approved catalogue
5. Resolve needs-client records and repeat until the intended publication set is approved
6. Keep `/rebuild` isolated and non-indexed until cutover approval

## Following design and production phases

- Catalogue discovery redesign after Milestone 1 verification
- Product-detail and Inquiry List visual refinement
- Company, catalogue-document, contact, legal, and error pages
- Durable inquiry storage, attachment storage, and approved delivery integration
- Testing, security, accessibility, and performance review
- Cloudflare deployment preparation and production audit

## Current dependencies

- Successful local verification of Design Milestone 1
- Browser screenshots and independent visual review
- Validated product taxonomy, product names, and product codes
- Approved business facts and contact details
- Approved product and division photography
- Final logo treatment
- Real catalogue PDFs and metadata
- Hosting and backend decisions for search, inquiries, and attachments

The current transparent raster logo is temporary. The supplied source-derived
instrument images support development, but technical copy remains pending
verification against original catalogue pages.
