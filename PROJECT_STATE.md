# THROHI Rebuild — Project State

This file is the single decision source of truth for the current rebuild. Earlier chats, branches, screenshots, and implementations are reference material unless recorded here.

## Current phase

**Milestone 5: Durable Inquiry Backend implementation present; real Cloudflare resource configuration and runtime verification pending.**

Work remains isolated on `design/surgical-precision-archive`, based on `rebuild/surgical-contrast`. Public routes remain unchanged and `/rebuild` remains non-indexed.

Implemented milestones:

1. Surgical Precision Archive homepage and shared shell
2. Company & Trust Spine
3. Precision Catalogue Ledger
4. Instrument Examination & Inquiry Desk
5. Durable Inquiry Backend

No pull request, merge, deployment, public cutover, or GitHub Actions run is authorized.

## Primary implementation preference

Layout, imagery, visual hierarchy, spacing, responsive composition, and overall design quality are the primary decision criteria.

Critical blockers:

- build or type-check failure;
- broken search, filters, pagination, routing, catalogue return context, inquiry identity, persistence, validation, or submission;
- serious or critical accessibility violations;
- keyboard traps or unusable controls;
- desktop/mobile horizontal overflow;
- silent production data loss or successful responses without durable storage;
- missing approved real imagery;
- invented data, claims, contact details, recipients, or downloadable documents.

Deferred nonblockers:

- harmless pre-existing lint warnings;
- unrelated toolchain deprecations;
- cosmetic differences that do not damage hierarchy or usability;
- tests that enforce superseded implementation syntax instead of user behavior.

## Approved purpose

THROHI Medical Tools needs a professional corporate and catalogue website that:

- introduces the company and its instrument ranges;
- presents Surgical, Dental and Orthodontic, Veterinary, and Beauty divisions;
- provides a searchable catalogue using real product names, codes, images, families, and variants;
- provides real catalogue downloads only when files and metadata exist;
- lets visitors build a non-commerce Inquiry List and submit one structured request;
- integrates the supplied cinematic and scissors-evolution media without obstructing practical browsing.

## Approved design system

**Surgical Contrast / Surgical Precision Archive**

- Dark identity moments use near-black navy, steel, restrained blue, and restrained green.
- Catalogue and form surfaces use paper/steel backgrounds for reading and comparison.
- Real instrument imagery is the primary visual material.
- Instrument Sans is the display face, Archivo is the interface face, and IBM Plex Mono is used for codes and technical counters.
- Borders, whitespace, and precise alignment define grouping.
- Generic SaaS cards, excessive pills, decorative glass, cyberpunk styling, gaming presentation, and design-agency spectacle are rejected.
- Major signature motion is reserved for the cinematic cover and full evolution sequence.
- Repeated buyer tasks use only restrained state, line, image, and navigation motion.

## Information architecture

- Home
- Products
  - All Products
  - Surgical Instruments
  - Dental and Orthodontic Instruments
  - Veterinary Instruments
  - Beauty Instruments
  - Product-family and product-detail routes
- Company
  - About THROHI
  - Scissors Through Time
- Catalogues
- Inquiry List
- Contact
- Search and utility/error routes

Company, About, and general story content remain consolidated on one Company page.

## Implemented Milestone 1 — homepage and shell

- skippable supplied MP4 cinematic cover;
- company-led hero identifying THROHI and Sialkot, Pakistan;
- early catalogue search;
- four truthful division entries;
- three selected real product families;
- verified company introduction;
- compact 260-frame evolution preview;
- catalogue, Inquiry List, and unlisted-instrument utilities;
- responsive shared header/footer and mobile navigation;
- verified-contact boundary with no empty controls.

## Implemented Milestone 2 — Company & Trust Spine

Routes:

- `/rebuild/company`
- `/rebuild/company/scissors-through-time`
- `/rebuild/catalogues`
- `/rebuild/contact`

Features:

- typed verified company-content boundary;
- four-division ledger;
- full 260-frame evolution route;
- reduced-motion and media-failure parity;
- real-files-only catalogue documents;
- structured Inquiry List and unlisted-instrument routing;
- rebuild navigation converged on real destinations.

## Implemented Milestone 3 — Precision Catalogue Ledger

`/rebuild/products` preserves URL-backed catalogue behavior while using a procurement-focused layout.

- dark editorial masthead with real Operating Scissors specimen;
- live product, variant, division, and source-status ledger;
- search by name or exact catalogue code;
- sticky desktop filters and native mobile filter disclosure;
- two-column desktop and one-column mobile product records;
- visible code, division, family, variant count, detail route, and Inquiry state;
- pagination with context restoration;
- real optimized catalogue media;
- focused components for filters, product entries, toolbar, and empty recovery.

Preserved URL parameters: `q`, `division`, `family`, `sort`, `page`.

## Implemented Milestone 4 — Instrument Examination & Inquiry Desk

### Product detail

- compact catalogue return rail preserving the full `from` URL;
- large real-media examination stage;
- dark product identity and procurement rail;
- catalogue code, division, family, source, variant-count, and technical-status ledger;
- primary Inquiry action with current selected quantity;
- independent base-product and variant inquiry identities;
- structured variant-code ledger;
- same-family related instruments preserving return context;
- 1100, 980, 700, and 420 responsive layouts;
- reduced-motion-safe media and interaction states.

### Inquiry List

- dark procurement masthead with four-stage ledger;
- explicit non-order/non-payment boundary;
- focused `InquiryItemRecord` product rows;
- quantity, item note, remove, and undo behavior;
- unlisted instrument panel;
- requirements and real attachment selection up to 8 MiB;
- disciplined buyer-details grid;
- optional Turnstile field activated only when a public site key exists;
- sticky desktop `InquiryReviewDesk` and non-sticky mobile review;
- preserved local browser state, migration, validation, one-time submission token, `/api/inquiries`, and success routing.

Milestone 4 verification history:

- lint completed with zero errors and three deferred warnings;
- typecheck passed;
- all 84 unit tests passed;
- production build passed;
- browser verification was reduced to one remaining failure before the final serial Axe test was split into isolated route checks;
- no additional rerun is required before continuing implementation, per user instruction;
- Milestone 4 is not represented as freshly runtime-green after that final test-only correction.

## Implemented Milestone 5 — Durable Inquiry Backend

### Website proxy

- same-origin `/api/inquiries` accepts multipart form data and legacy JSON;
- catalogue and buyer validation remains server-side;
- uploaded file metadata is checked against actual file bytes;
- a daily SHA-256 client fingerprint is derived from forwarded IP, user agent, and an independent secret;
- sanitized inquiries are forwarded to a dedicated Worker using a shared secret;
- production returns HTTP 503 when durable configuration is absent;
- the memory adapter remains available only outside production;
- duplicate responses preserve the original inquiry reference.

### Cloudflare Worker

- dependency-free Worker entry under `workers/inquiry-api`;
- D1 tables for inquiries, normalized line items, delivery outbox, and rate limits;
- unique `submission_token` and `reference` constraints;
- private R2 attachment storage with reference-scoped object keys;
- attachment rollback when D1 persistence fails;
- optional mandatory Turnstile Siteverify validation when the secret is configured;
- five-new-submissions-per-ten-minute privacy-preserving rate limit;
- optional signed delivery webhook using HMAC-SHA256 and inquiry-reference idempotency;
- pending/delivered/retry delivery state stored durably;
- health endpoint reports configuration state without exposing secret values.

### Operations

- example website and Worker environment files contain no real values;
- example Wrangler config contains placeholder resource IDs only;
- local Worker configuration and secrets are ignored by Git;
- exact D1/R2 creation, migration, secrets, deployment, health, privacy, and failure procedures are documented in `docs/backend/INQUIRY_BACKEND.md`;
- source contract command: `npm run backend:check`.

## Catalogue truth boundary

Hierarchy:

`Division → Category / Instrument Family → Product Family → Variant`

Current source-derived data contains approximately:

- 53 families/categories;
- 626 representative product records;
- 1,434 variant codes;
- 626 optimized product images.

Surgical and Dental/Orthodontic have the strongest structured data. Beauty and Veterinary remain visible but are not populated with invented records.

## Inquiry behavior

The Inquiry List is not a shopping cart and has no checkout, pricing, or payment.

Visitors may:

- add product families or selected variants;
- set quantities;
- add item notes and general requirements;
- add an unlisted reference;
- attach PDF/JPG/PNG/WebP files up to 8 MiB;
- provide buyer and preferred-contact details;
- complete optional anti-spam verification when configured;
- submit one structured inquiry.

No account is required.

## Verified facts

Safe:

- THROHI Medical Tools is based in Sialkot, Pakistan.
- Public ranges include Surgical, Dental and Orthodontic, Veterinary, and Beauty instruments.
- Validated catalogue identities and imagery may be used.

Pending and therefore absent:

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
- approved inquiry recipient/delivery endpoint;
- approved retention and deletion periods.

## Current backend gate

Source contract:

```bash
npm run backend:check
```

Real Cloudflare runtime verification remains pending until D1, R2, Worker secrets, website environment variables, and optional delivery/Turnstile settings are configured.

The operational verification matrix is defined in `docs/backend/INQUIRY_BACKEND.md` and includes storage, attachments, duplicate retries, invalid files, rate limits, Turnstile, delivery state, and test-data cleanup.

## Next phases

1. Configure and verify real Cloudflare D1/R2/Worker resources and approved inquiry delivery.
2. Client catalogue validation and real downloadable documents.
3. Whole-site visual convergence, legal/error routes, and final logo/contact content.
4. Accessibility, performance, security, metadata, retention, and Cloudflare production audit.
5. Explicit public cutover approval.

The current public implementation remains available until the rebuild passes review and receives explicit cutover approval.
