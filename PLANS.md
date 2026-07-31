# THROHI Website — Execution Plan

## Current objective

Verify and refine the **Precision Heritage House full-site redesign** on `design/surgical-precision-archive` without deploying, indexing, merging, or cutting over the rebuild.

The redesign replaces the previous layered premium/QA approach and now covers every `/rebuild` route at source level.

## Active visual system

- `precision-heritage-house-v1`
- 78px desktop header
- 66px mobile header
- regal editorial typography
- archival ivory and paper
- surgical ink, navy, and green
- restrained brass indexing
- real instrument imagery
- no filler, fake luxury, SaaS cards, or ecommerce framing

## Redesigned areas

1. Shared header, overlays, full-screen mobile navigation, and footer
2. Homepage cinematic handoff, hero, divisions, selected instruments, company, history, and closing actions
3. Catalogue masthead, search, filters, records, empty/loading states, and pagination
4. Product media examination, procurement dossier, variant ledger, and related comparisons
5. Inquiry worksheet, editable records, forms, attachment state, review dossier, and confirmation
6. Company, history, Catalogues, Contact, Privacy, Terms, loading, error, success, and not-found routes

Functional catalogue, Inquiry List, media, accessibility, backend, no-index, and production-readiness contracts remain preserved.

## Verification commands

Source tests:

```bash
npm run test
```

Backend source:

```bash
npm run backend:check
```

Post-build budgets:

```bash
npm run readiness:check
```

Complete full-redesign gate:

```bash
npm run verify:redesign
```

The redesign gate uses isolated port `3105` and runs:

- lint;
- typecheck;
- source tests;
- production build;
- readiness budgets;
- representative desktop and mobile Playwright suites;
- the dedicated `rebuild-full-redesign.spec.ts` contract.

No fresh runtime-green claim is made until that command runs in a real checkout.

## Immediate sequence

1. Run `npm run verify:redesign` in a real checkout.
2. Fix only critical build, interaction, accessibility, overflow, or data-integrity failures.
3. Review screenshots at 1440 × 1000, 1280 × 800, 768 × 1024, 390 × 844, and 320 × 700 when preview work is intentionally resumed.
4. Complete verified catalogue documents, final logo, contact details, company facts, and missing division data.
5. Configure Cloudflare/OpenNext, D1, R2, Turnstile, and inquiry delivery later, as requested.
6. Validate CSP, HSTS, Core Web Vitals, metadata, and final launch controls.
7. Obtain explicit merge, deployment, indexing, and public cutover approval.

## Current blockers

- fresh full-redesign runtime evidence;
- real screenshot review;
- final catalogue validation and documents;
- complete Beauty and Veterinary source data;
- verified contact and company details;
- final logo and metadata assets;
- approved inquiry recipient and retention rules;
- real Cloudflare resource identifiers and secrets;
- explicit cutover approval.

No pull request, merge, deployment, indexing activation, or public cutover occurs automatically.
