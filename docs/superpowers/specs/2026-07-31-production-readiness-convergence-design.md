# Production Readiness Convergence Design

## Status

Approved for implementation through the user's standing instruction to continue the next autonomous phase after Premium Visual Convergence.

## Goal

Make the isolated THROHI rebuild measurably safer, more accessible, more metadata-complete, and deployment-aware without indexing it, cutting it over, inventing business data, or introducing security policy that could break Next.js hydration, Turnstile, media, or preview workflows before runtime validation.

## Selected approach: staged cutover guard

Three approaches were considered:

1. **Immediate strict production lock-down** — enable indexing, a strict nonce CSP, HSTS, final canonical URLs, and full Cloudflare OpenNext deployment configuration now. Rejected because final origins, runtime bindings, Turnstile behavior, contact details, and cutover approval are not complete.
2. **Audit documentation only** — record gaps but do not change behavior. Rejected because crawler boundaries, response headers, and build-size limits can be improved safely now.
3. **Staged cutover guard** — selected. Add safe response headers, environment-gated indexing, hard rebuild/API no-index boundaries, metadata and viewport defaults, accessibility resilience, deterministic build budgets, and an explicit deployment-readiness register. Defer strict CSP enforcement, HSTS, public sitemap/canonical publication, and indexing until the actual Worker runtime is configured and tested.

## Current technical state

- Next.js 15.4.4 App Router with React 19.
- Root metadata currently disables indexing globally.
- `/rebuild` has route metadata through child pages but no dedicated hard no-index layout metadata or HTTP `X-Robots-Tag` boundary.
- No `robots.ts` crawler route is present.
- `next.config.ts` already disables `X-Powered-By` and supplies basic content-type, referrer, permissions, and frame headers.
- The website includes a dynamic inquiry Route Handler, so final Cloudflare hosting must be Next.js-compatible rather than assets-only.
- Turnstile is optional and external; a strict CSP cannot be safely enforced until its configured state is exercised in the real runtime.
- Existing catalogue-media tests already protect source-derived image integrity and transfer discipline, but no post-build chunk/static-asset hard-limit gate exists.

## Architecture

### 1. Indexing boundary

- Add `src/app/robots.ts`.
- Default behavior remains `Disallow: /` unless `NEXT_PUBLIC_ALLOW_INDEXING=true` at build time.
- When indexing is explicitly enabled, allow public routes while disallowing `/rebuild/` and `/api/`.
- Root metadata uses the same environment gate.
- `/rebuild/layout.tsx` always exports `robots: { index: false, follow: false }`, independent of the root gate.
- `next.config.ts` adds `X-Robots-Tag: noindex, nofollow, noarchive` for `/rebuild/:path*` and `/api/:path*`.

### 2. Safe response headers

Apply globally through `next.config.ts`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` disabling camera, microphone, geolocation, payment, USB, and browsing topics
- `X-Frame-Options: SAMEORIGIN`
- `X-Permitted-Cross-Domain-Policies: none`
- `X-DNS-Prefetch-Control: off`

Apply to all API routes:

- `Cache-Control: no-store, max-age=0`
- `X-Robots-Tag: noindex, nofollow, noarchive`

Do not add HSTS before public-origin approval. Do not enforce CSP before the Next.js/Turnstile/Cloudflare runtime is tested. Record both as cutover blockers rather than pretending they are complete.

### 3. Metadata and browser chrome

- Add `applicationName` and disable automatic telephone, email, and address detection in root metadata.
- Add a `Viewport` export with light/dark browser theme colors and an explicit light color scheme.
- Preserve the current non-indexed default.
- Do not publish final Open Graph, Twitter, canonical, icon, or sitemap assets until the logo, final public origin, and cutover content are approved.

### 4. Accessibility resilience

Extend the rebuild shell for:

- `prefers-contrast: more` with stronger line and muted-text values.
- `forced-colors: active` with visible borders, focus outlines, and system-color actions.
- No motion or visual spectacle additions.
- Existing semantic, Axe, keyboard, overflow, reduced-motion, and readable-font contracts remain authoritative.

### 5. Deterministic build budgets

Create `scripts/check-production-readiness.mjs`, run only after `next build`.

Hard gates:

- no individual deployed static/public asset above 25 MiB;
- no individual emitted JavaScript chunk above 768 KiB raw;
- no individual emitted CSS file above 512 KiB raw;
- no more than 20,000 static/public files;
- required `.next/static` output must exist.

The thresholds are conservative deployment guards, not claims of Core Web Vitals. Real LCP, INP, and CLS require field or browser measurement after deployment.

### 6. Verification and operations

- Add a source contract for crawler, header, metadata, accessibility, and budget behavior.
- Add a browser contract for `/robots.txt`, `/rebuild` no-index metadata/header behavior, security headers, and API no-store behavior.
- Add the readiness script to `package.json`.
- Register it after `npm run build` in `scripts/verify-design-milestone-6.sh`.
- Add `docs/production/PRODUCTION_READINESS.md` listing implemented safeguards and cutover blockers.
- Update `PROJECT_STATE.md`, `PLANS.md`, and `CHANGELOG.md` without claiming fresh runtime success.

## Explicit non-goals

- No public cutover.
- No indexing activation.
- No final sitemap or canonical URLs.
- No final social metadata or icon set.
- No HSTS before approved production origin.
- No enforced CSP before real runtime and Turnstile validation.
- No analytics or user tracking.
- No change to catalogue, inquiry, or backend business behavior.
- No invented legal, contact, product, or company facts.

## Success criteria

Source implementation is complete when:

- indexing defaults fail closed;
- `/rebuild` and `/api` retain independent no-index boundaries;
- safe headers and API cache policy are declared;
- metadata and viewport defaults are present;
- high-contrast and forced-colors styles exist;
- post-build budgets are deterministic;
- automated contracts cover all above boundaries;
- deployment blockers remain explicit;
- no merge, deployment, indexing, or cutover occurs.
