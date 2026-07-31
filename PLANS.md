# THROHI Website — Execution Plan

## Current objective

Complete **Milestone 7: Production Readiness Convergence** on `design/surgical-precision-archive` without indexing, deploying, or cutting over the rebuild.

## Implemented milestones

1. Homepage and shared shell
2. Company & Trust Spine
3. Precision Catalogue Ledger
4. Instrument Examination & Inquiry Desk
5. Durable Inquiry Backend
6. Premium Visual Convergence and Utility States
7. Production Readiness Convergence source implementation

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

The combined gate runs lint, typecheck, source tests, production build, static budgets, and desktop/mobile Playwright suites. No fresh runtime-green claim is made until it runs in a real checkout.

## Readiness coverage

- fail-closed crawler policy;
- explicit future indexing gate;
- permanent rebuild/API no-index boundaries;
- safe global response headers;
- API no-store behavior;
- metadata and browser theme defaults;
- increased-contrast and forced-colors support;
- 25 MiB static-file limit;
- 768 KiB JavaScript chunk limit;
- 512 KiB CSS file limit;
- 20,000-file limit;
- browser checks for crawler, metadata, headers, API cache, and overflow.

## Next sequence

1. Correct any critical combined-gate failures.
2. Perform manual visual review at 1440, 1280, 768, 390, and 320 px.
3. Configure the Next.js-compatible Cloudflare Worker/OpenNext website runtime.
4. Configure real D1, R2, secrets, optional Turnstile, and approved inquiry delivery.
5. Validate CSP against Next.js, cinematic media, catalogue media, and Turnstile.
6. Decide HSTS only after final HTTPS origin approval.
7. Measure deployed LCP, INP, and CLS.
8. Complete catalogue, documents, logo, contacts, company facts, legal language, and retention approval.
9. Obtain explicit merge, deployment, indexing, and public cutover approval.

## Current blockers

- real Cloudflare resource identifiers and secrets;
- approved production origin and inquiry recipient;
- approved retention/deletion rules;
- final catalogue validation and documents;
- complete Beauty and Veterinary source data;
- verified contact and company information;
- final logo, icons, canonical URLs, sitemap, and social metadata;
- fresh runtime and manual visual evidence.

No pull request, merge, deployment, indexing activation, or public cutover occurs automatically.
