# THROHI Rebuild — Project State

This file is the single source of truth for the rebuild.

## Current phase

**Milestone 8: Rendered Visual QA Refinement source implementation present. A live rebuild preview, full runtime gate, and manual screenshot review remain pending.**

Work remains isolated on `design/surgical-precision-archive`.

- `/rebuild` remains non-indexed.
- Public routes remain unchanged.
- No pull request, merge, deployment, redirect switch, indexing activation, public cutover, or GitHub Actions run is authorized.

## Implemented milestones

1. Surgical Precision Archive homepage and shared shell
2. Company & Trust Spine
3. Precision Catalogue Ledger
4. Instrument Examination & Inquiry Desk
5. Durable Inquiry Backend
6. Premium Visual Convergence and Utility States
7. Production Readiness Convergence
8. Rendered Visual QA Refinement source implementation

## Quality rules

- Premium, regal, trustworthy, medically appropriate presentation.
- Important information remains readable.
- Real instrument imagery is the primary visual material.
- No filler, generic SaaS presentation, fake luxury, ecommerce framing, or invented claims.
- Build/type failures, broken core interactions, accessibility violations, overflow, silent data loss, security-boundary failures, and deployment-limit violations block cutover.

## Product experience

- Skippable supplied MP4 cinematic cover and 260-frame evolution media.
- Company-led homepage with Sialkot origin and catalogue search.
- Company, Scissors Through Time, Catalogues, Contact, Privacy, and Terms routes.
- URL-backed catalogue search, filtering, sorting, pagination, real imagery, codes, taxonomy, variants, and Inquiry state.
- Product examination with return context, base/variant identities, variant ledger, and related-family discovery.
- Non-commerce Inquiry List with quantities, notes, attachments, buyer details, optional Turnstile, review, and confirmation.
- Premium header, panels, mobile navigation, footer, legal pages, loading, error, success, and rebuild-specific not-found states.

## Durable inquiry backend

- Same-origin multipart proxy with server validation and real attachment bytes.
- Production fails closed when durable settings are absent.
- D1 stores inquiry, item, delivery, and rate-limit records.
- R2 stores private attachments.
- Optional Turnstile and signed delivery webhook.
- Memory storage is development-only.

Operations: `docs/backend/INQUIRY_BACKEND.md`

```bash
npm run backend:check
```

## Production Readiness Convergence

### Indexing and metadata

- `NEXT_PUBLIC_ALLOW_INDEXING` is the explicit indexing gate.
- Default `robots.txt` disallows all crawling.
- An indexing-enabled build still disallows `/rebuild/` and `/api/`.
- `/rebuild` always exports `index: false, follow: false` metadata.
- Rebuild and API responses use `X-Robots-Tag: noindex, nofollow, noarchive`.
- Root metadata includes application name, contact-detection protection, and browser theme colors.

### Response safety

Global responses declare content-type, referrer, permissions, frame, cross-domain-policy, and DNS-prefetch protections.

API responses additionally declare:

```text
Cache-Control: no-store, max-age=0
```

### Accessibility resilience

- `prefers-contrast: more` strengthens muted text and boundaries.
- `forced-colors: active` uses system colors for text, actions, fields, selection, and focus.
- Existing Axe, keyboard, readable-size, overflow, and reduced-motion contracts remain active.

### Deterministic build budgets

```bash
npm run readiness:check
```

The command requires `.next/static` and fails on:

- any deployed static/public file above 25 MiB;
- any emitted JavaScript chunk above 768 KiB raw;
- any emitted CSS file above 512 KiB raw;
- more than 20,000 static/public files.

Production register: `docs/production/PRODUCTION_READINESS.md`

## Rendered Visual QA Refinement

A public rebuild preview is not currently recorded or discoverable, and the branch has no deployment workflow run. The completed pass therefore uses route-source composition review, stable visual markers, and rendered Playwright contracts without claiming screenshot evidence.

Implemented corrections:

- new `rendered-visual-qa-v1` shell contract;
- stable markers across homepage, catalogue, product, and inquiry surfaces;
- homepage divider aligned to the current 80px desktop header;
- product pages offset to 80px desktop and 66px mobile header heights;
- laptop-height product examination constrained to keep the primary inquiry action reachable while retaining a large media stage;
- laptop-height catalogue and inquiry mastheads tightened without changing route behavior;
- regal typography extended through homepage secondary headings, family names, inquiry section headings, and related products;
- essential procurement labels raised to at least 12px;
- body and helper copy raised to at least 14px where the information affects navigation, comparison, or inquiry completion;
- overflow-wrap and narrow-mobile safeguards added;
- no new entrance motion introduced.

Verification assets:

- `tests/rebuild-rendered-visual-qa.test.mjs`
- `tests/e2e/rebuild-rendered-visual-qa.spec.ts`
- `src/app/rebuild/visual-qa-refinements.module.css`

The Milestone 6 combined gate now includes the rendered visual-QA suite:

```bash
bash scripts/verify-design-milestone-6.sh
```

Internally checked in the available environment:

- all selectors in `visual-qa-refinements.module.css` compile through `cssselect2`;
- the new Playwright suite transpiles with zero TypeScript diagnostics.

Not yet proven:

- Next.js production build after this refinement;
- Playwright runtime results;
- screenshot appearance at the five target viewports;
- deployed font/media behavior.

## Truth boundary

Safe facts:

- THROHI Medical Tools is based in Sialkot, Pakistan.
- Public ranges include Surgical, Dental and Orthodontic, Veterinary, and Beauty instruments.
- Validated catalogue identities and imagery may be used.

Pending and absent:

- founding year and operating history;
- certifications, materials, capacity, export markets, and OEM claims;
- minimum orders and lead times;
- final contact formatting;
- complete Beauty and Veterinary catalogue data;
- real catalogue PDFs and metadata;
- approved inquiry recipient and delivery endpoint;
- retention and deletion periods;
- final legal wording and dates;
- final logo, icons, canonical URLs, sitemap, and social metadata.

## Runtime and cutover blockers

- fresh combined runtime evidence;
- a live rebuild preview or local rendered checkout;
- manual screenshot review at 1440 × 1000, 1280 × 800, 768 × 1024, 390 × 844, and 320 × 700;
- Next.js-compatible Cloudflare Worker/OpenNext configuration;
- real D1, R2, secrets, Turnstile, and delivery configuration;
- CSP validation against Next.js, media, and Turnstile;
- HSTS decision after final HTTPS origin approval;
- deployed LCP, INP, and CLS measurement;
- final catalogue, contact, company, logo, document, legal, and retention approval;
- explicit merge, deployment, indexing, and public cutover approval.

## Next phases

1. Correct any critical issues from the combined gate or first available screenshots.
2. Configure and verify the real Cloudflare website and inquiry runtimes.
3. Complete catalogue validation, documents, logo, contacts, and approved content.
4. Validate CSP, field performance, and final launch controls.
5. Explicit public cutover approval.
