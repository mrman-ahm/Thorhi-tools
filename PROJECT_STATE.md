# THROHI Rebuild — Project State

This file is the single source of truth for the rebuild.

## Current phase

**Full-site Precision Heritage House redesign source implementation is present on `design/surgical-precision-archive`. Fresh runtime verification and real screenshot review remain pending.**

- `/rebuild` remains non-indexed.
- Public routes remain unchanged.
- No pull request, merge, deployment, redirect switch, indexing activation, public cutover, or GitHub Actions run is authorized.

## Current design direction

**Precision Heritage House**

A restrained instrument-manufacturer system using:

- Cormorant Garamond for major editorial hierarchy;
- Instrument Sans for navigation, body, forms, and controls;
- IBM Plex Mono for codes, counts, status, and concise metadata;
- surgical ink and navy;
- archival ivory and paper;
- surgical green for verified actions;
- muted brass for indexing and rules;
- real catalogue and supplied media as the primary visual material.

Rejected patterns:

- generic SaaS cards and dashboards;
- fake black-and-gold luxury;
- cyberpunk, gaming, glassmorphism, or design-agency spectacle;
- filler slogans and decorative sections;
- tiny important text;
- ecommerce, cart, checkout, price, or payment framing;
- invented company or technical claims.

## Active redesign contract

```text
precision-heritage-house-v1
```

Global foundation:

- `src/app/rebuild/precision-heritage.module.css`
- `src/app/rebuild/corporate-heritage.module.css`
- `data-redesign-contract="precision-heritage-house-v1"`
- 78px desktop header
- 66px mobile header
- fluid 90rem maximum content grid
- readable label/body scales
- forced-colors, increased-contrast, and reduced-motion support

The superseded global files were removed:

- `premium-convergence.module.css`
- `visual-qa-refinements.module.css`

## Redesigned shared shell

### Header

- archival ivory desktop shell;
- transparent cinematic state over the supplied intro;
- balanced brand, navigation, and utility layout;
- editorial catalogue search overlay;
- editorial product-division overlay;
- full-screen mobile route index;
- preserved focus trap, Escape handling, body lock, outside-click handling, search routing, and live Inquiry List count.

### Footer

- dark manufacturer dossier;
- company identity and verified Sialkot origin;
- product, company, and legal route groups;
- explicit preview/indexing status;
- responsive tablet and mobile layouts.

## Redesigned homepage

The route sequence remains:

1. supplied cinematic entry;
2. company-led instrument hero;
3. four division dossiers;
4. selected instrument showcase;
5. verified company introduction;
6. supplied scissors-evolution bridge;
7. catalogue/inquiry decision path.

Key characteristics:

- large real instrument specimen;
- factual Sialkot identity;
- integrated catalogue search;
- readable product and variant counts;
- structured/pending division truth;
- asymmetric selected product records;
- no invented company history or manufacturing claims.

## Redesigned catalogue

- compact dark catalogue index;
- dominant search;
- desktop filter ledger and native mobile disclosure;
- URL-backed `q`, `division`, `family`, `sort`, and `page` behavior preserved;
- alternating procurement records with real media, code, name, family, variants, product route, and Inquiry state;
- empty, loading, active-filter, sorting, and pagination states preserved;
- route-owned redesign module: `catalogue-heritage.module.css`.

## Redesigned product examination

- museum-grade real-media stage;
- dark procurement dossier;
- safe catalogue return context preserved;
- base and variant Inquiry identities preserved;
- readable source/specification ledger;
- formal variant records;
- asymmetric related-product comparison;
- primary Inquiry action designed to remain reachable on a 1280 × 800 first viewport;
- route-owned redesign module: `product-heritage.module.css`.

## Redesigned Inquiry List

- formal procurement worksheet, not a cart;
- four-stage masthead and ledger;
- editable instrument records;
- quantity, notes, remove, undo, manual item, attachment, buyer, consent, and Turnstile behavior preserved;
- dark final review dossier;
- multipart API submission, one-time token, durable-storage contract, error recovery, and success routing preserved;
- route-owned redesign module: `inquiry-heritage.module.css`.

## Redesigned corporate and utility routes

Shared corporate components now expose one editorial system for:

- Company;
- Scissors Through Time;
- Catalogues;
- Contact;
- division ledgers;
- truth boundaries;
- document ledgers;
- action rails;
- contact routes.

Privacy, Terms, not-found, runtime error, loading, and inquiry confirmation also use the Precision Heritage system.

No legal date, jurisdiction, contact, retention period, governing law, certificate, material, market, or manufacturing claim was invented.

## Preserved platform behavior

- supplied cinematic video and skip/reduced-motion behavior;
- supplied 260-frame evolution media;
- 626 source-derived products and 1,434 variant codes;
- catalogue search, filters, sorting, pagination, product context, and Inquiry state;
- local Inquiry migration and browser persistence;
- real attachment bytes and validation;
- production fail-closed durable inquiry proxy;
- D1/R2/Turnstile/delivery source implementation;
- rebuild no-index metadata and response headers;
- static asset, JavaScript, CSS, and file-count budgets.

Backend operations remain documented in:

```text
docs/backend/INQUIRY_BACKEND.md
```

## Verification

Source contract:

```bash
npm run test
```

Backend contract:

```bash
npm run backend:check
```

Post-build budgets:

```bash
npm run readiness:check
```

Complete redesign gate:

```bash
npm run verify:redesign
```

The redesign gate runs lint, typecheck, source tests, production build, readiness budgets, and all representative desktop/mobile Playwright suites on isolated port `3105`.

No fresh runtime-green claim is made in this environment.

## Truth boundary

Verified and safe:

- THROHI Medical Tools is based in Sialkot, Pakistan.
- Public ranges include Surgical, Dental and Orthodontic, Veterinary, and Beauty instruments.
- Validated catalogue identities, codes, references, and imagery may be used.

Pending or absent:

- founding year and operating history;
- certifications;
- materials and steel grades;
- manufacturing capabilities and capacity;
- export markets;
- OEM/private-label services;
- minimum orders and lead times;
- final contact formatting;
- complete Beauty and Veterinary catalogue data;
- real catalogue PDFs and metadata;
- approved inquiry recipient and delivery endpoint;
- retention and deletion periods;
- final legal wording and dates;
- final logo, icons, canonical URLs, sitemap, and social metadata.

## Runtime and cutover blockers

- fresh `npm run verify:redesign` evidence;
- real screenshot review at 1440 × 1000, 1280 × 800, 768 × 1024, 390 × 844, and 320 × 700;
- Next.js-compatible Cloudflare Worker/OpenNext configuration;
- real D1, R2, secrets, optional Turnstile, and approved inquiry delivery;
- CSP validation against Next.js, cinematic media, catalogue media, and Turnstile;
- HSTS decision after final HTTPS origin approval;
- deployed LCP, INP, and CLS measurement;
- approved catalogue, documents, logo, contacts, company facts, legal language, and retention rules;
- explicit merge, deployment, indexing, and public cutover approval.

## Next work

1. Correct only failures found by the full redesign gate.
2. Perform real visual review when a preview or checkout is intentionally enabled.
3. Complete verified catalogue documents, contacts, logo, company facts, and missing division content.
4. Configure the real Cloudflare website and inquiry runtimes later, as requested.
5. Obtain explicit public cutover approval.
