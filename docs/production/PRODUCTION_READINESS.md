# THROHI Production Readiness Register

## Purpose

This document separates safeguards that are implemented in source from launch controls that still require a real Cloudflare runtime, approved business content, or explicit cutover authorization.

The rebuild remains isolated under `/rebuild`, non-indexed, and unapproved for public cutover.

## Implemented safeguards

### Crawler and metadata boundaries

- Indexing fails closed unless `NEXT_PUBLIC_ALLOW_INDEXING=true` is present at build time.
- Default `robots.txt` disallows all crawling.
- A future indexing-enabled build still disallows `/rebuild/` and `/api/`.
- `/rebuild` exports its own permanent `index: false, follow: false` metadata.
- `/rebuild/:path*` and `/api/:path*` receive `X-Robots-Tag: noindex, nofollow, noarchive`.
- Automatic telephone, email, and address detection is disabled until verified public details are approved.
- Browser theme colors are defined for light and dark browser chrome.

### Response safety

Global responses declare:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` disabling camera, microphone, geolocation, payment, USB, and browsing topics
- `X-Frame-Options: SAMEORIGIN`
- `X-Permitted-Cross-Domain-Policies: none`
- `X-DNS-Prefetch-Control: off`

API responses additionally declare:

- `Cache-Control: no-store, max-age=0`
- `X-Robots-Tag: noindex, nofollow, noarchive`

### Accessibility resilience

- Existing keyboard, focus, Axe, readable-size, reduced-motion, and overflow contracts remain active.
- `prefers-contrast: more` strengthens text and boundaries.
- `forced-colors: active` uses system colors for text, actions, fields, selection, and focus.

### Build and deployment budgets

After `next build`, run:

```bash
npm run readiness:check
```

The command fails when:

- `.next/static` is missing;
- any deployed static/public file exceeds 25 MiB;
- any emitted JavaScript chunk exceeds 768 KiB raw;
- any emitted CSS file exceeds 512 KiB raw;
- static/public file count exceeds 20,000.

These are deterministic deployment budgets. They are not a claim that real-user Core Web Vitals pass.

### Combined gate

```bash
bash scripts/verify-design-milestone-6.sh
```

The gate performs lint, typecheck, unit/source tests, production build, readiness budgets, and desktop/mobile Playwright suites.

## Cloudflare hosting boundary

The inquiry endpoint is a Next.js Route Handler. An assets-only deployment cannot execute it. Final hosting must use a Next.js-compatible Cloudflare Worker runtime such as the OpenNext adapter, with Node.js compatibility enabled and all route handlers verified.

The durable inquiry Worker remains a separate service using D1 and R2.

## Cutover blockers

### Runtime security

- Validate a Content Security Policy against Next.js hydration, cinematic media, catalogue images, and configured Turnstile.
- Enforce CSP only after that validation.
- Enable HSTS only after the final HTTPS production origin is approved and rollback implications are accepted.
- Confirm security headers are preserved by the deployed Worker and any Cloudflare routing layer.

### Hosting and backend

- Configure and verify the Next.js Cloudflare Worker/OpenNext deployment.
- Create and bind real D1 and R2 resources.
- Configure the inquiry Worker URL, shared secret, and fingerprint secret.
- Configure Turnstile only when both site and secret keys are ready.
- Configure an approved inquiry delivery endpoint and signing secret.
- Approve retention, deletion, access, backup, and incident procedures.

### Metadata and indexing

- Approve the final public origin.
- Approve canonical routes and redirects.
- Add a sitemap only after the final public information architecture is locked.
- Add Open Graph, social images, icons, and manifest only after the final logo and imagery are approved.
- Activate `NEXT_PUBLIC_ALLOW_INDEXING=true` only during explicit public cutover.

### Performance evidence

- Measure LCP, INP, and CLS on the deployed production runtime.
- Review filmstrip and network behavior for cinematic and catalogue routes.
- Verify caching for generated media and hashed Next.js assets.
- Confirm no Worker CPU, subrequest, asset-count, or file-size platform limit is exceeded.

### Content and legal approval

- Final company facts and contact details.
- Catalogue identity review and real catalogue documents.
- Veterinary and Beauty source data.
- Final logo treatment.
- Final Privacy and Terms language, jurisdiction, retention, and contact details.

## Cutover rule

No indexing, merge, production deployment, redirect switch, or public cutover occurs without explicit approval after the runtime, content, legal, accessibility, security, and performance gates are reviewed.
