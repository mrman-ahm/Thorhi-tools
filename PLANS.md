# THROHI Website — Execution Plan

## Current objective

Complete **Milestone 8: Rendered Visual QA Refinement** on `design/surgical-precision-archive` without indexing, deploying, or cutting over the rebuild.

A live branch preview is not currently recorded or discoverable. Source refinement and rendered contracts are present; screenshot evidence remains pending until a real preview or checkout exists.

## Implemented milestones

1. Homepage and shared shell
2. Company & Trust Spine
3. Precision Catalogue Ledger
4. Instrument Examination & Inquiry Desk
5. Durable Inquiry Backend
6. Premium Visual Convergence and Utility States
7. Production Readiness Convergence
8. Rendered Visual QA Refinement source implementation

## Current gates

Backend source:

```bash
npm run backend:check
```

Post-build budgets:

```bash
npm run readiness:check
```

Combined design/readiness gate:

```bash
bash scripts/verify-design-milestone-6.sh
```

The combined gate runs lint, typecheck, source tests, production build, static budgets, and desktop/mobile Playwright suites, including `rebuild-rendered-visual-qa.spec.ts`.

No fresh runtime-green or screenshot-quality claim is made until the gate runs in a real checkout or preview.

## Rendered Visual QA coverage

- current 80px desktop and 66px mobile shell offsets;
- continuous regal hierarchy through homepage secondary sections and inquiry/product surfaces;
- 12px minimum for essential procurement labels and states;
- 14px minimum for body/helper copy that affects browsing or inquiry completion;
- product examination constrained for a 1280 × 800 first viewport;
- large product media stage preserved;
- catalogue and inquiry mastheads tightened on laptop-height screens;
- overflow protection at 320, 390, 768, 1280, and 1440 widths;
- reduced-motion continuity;
- stable route markers for future screenshot and regression tooling.

## Next sequence

1. Run the combined gate in a real checkout.
2. Review real screenshots at 1440 × 1000, 1280 × 800, 768 × 1024, 390 × 844, and 320 × 700.
3. Correct only visible hierarchy, spacing, wrapping, image placement, contrast, or overflow defects.
4. Configure the Next.js-compatible Cloudflare Worker/OpenNext website runtime.
5. Configure real D1, R2, secrets, optional Turnstile, and approved inquiry delivery.
6. Validate CSP against Next.js, cinematic media, catalogue media, and Turnstile.
7. Decide HSTS only after final HTTPS origin approval.
8. Measure deployed LCP, INP, and CLS.
9. Complete catalogue, documents, logo, contacts, company facts, legal language, and retention approval.
10. Obtain explicit merge, deployment, indexing, and public cutover approval.

## Current blockers

- runnable repository checkout or live rebuild preview;
- real Cloudflare resource identifiers and secrets;
- approved production origin and inquiry recipient;
- approved retention/deletion rules;
- final catalogue validation and documents;
- complete Beauty and Veterinary source data;
- verified contact and company information;
- final logo, icons, canonical URLs, sitemap, and social metadata;
- fresh runtime and manual visual evidence.

No pull request, merge, deployment, indexing activation, or public cutover occurs automatically.
