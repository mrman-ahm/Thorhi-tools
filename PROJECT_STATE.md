# THROHI Rebuild — Project State

This file is the single source of truth for the rebuild.

## Current phase

**Milestone 7: Production Readiness Convergence implementation present. Runtime verification, real Cloudflare configuration, content approval, and public cutover remain pending.**

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

## Quality rules

- Premium, regal, trustworthy, medically appropriate presentation.
- Important information remains readable.
- Real instrument imagery is the primary visual material.
- No filler, generic SaaS presentation, fake luxury, ecommerce framing, or invented claims.
- Build/type failures, broken core interactions, accessibility violations, overflow, silent data loss, security-boundary failures, and deployment-limit violations block cutover.

## Product experience

- Skippable supplied MP4 cinematic cover and 260-frame evolution media.
- Company-led homepage with Sialkot origin and catalogue search.
- Company, Scissors Through Time, Catalogues, and Contact routes.
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

Combined gate:

```bash
bash scripts/verify-design-milestone-6.sh
```

Production register: `docs/production/PRODUCTION_READINESS.md`

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
- manual visual review at 1440, 1280, 768, 390, and 320 px;
- Next.js-compatible Cloudflare Worker/OpenNext configuration;
- real D1, R2, secrets, Turnstile, and delivery configuration;
- CSP validation against Next.js, media, and Turnstile;
- HSTS decision after final HTTPS origin approval;
- deployed LCP, INP, and CLS measurement;
- final catalogue, contact, company, logo, document, legal, and retention approval;
- explicit merge, deployment, indexing, and public cutover approval.

## Next phases

1. Correct any critical issues found by the combined gate.
2. Configure and verify the real Cloudflare website and inquiry runtimes.
3. Complete catalogue validation, documents, logo, contacts, and approved content.
4. Validate CSP, field performance, and final launch controls.
5. Explicit public cutover approval.
