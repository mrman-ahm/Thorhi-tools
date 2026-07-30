# THROHI Rebuild — Project State

This file is the single decision source of truth for the current rebuild. Earlier chats, branches, screenshots, and implementations are reference material unless recorded here.

## Current phase

**Design Milestone 4: Instrument Examination & Inquiry Desk implementation present; combined runtime verification and visual review pending.**

Work remains isolated on `design/surgical-precision-archive`, based on `rebuild/surgical-contrast`. Public routes remain unchanged and `/rebuild` remains non-indexed.

Implemented milestones:

1. Surgical Precision Archive homepage and shared shell
2. Company & Trust Spine
3. Precision Catalogue Ledger
4. Instrument Examination & Inquiry Desk

No pull request, merge, deployment, public cutover, or GitHub Actions run is authorized.

## Primary implementation preference

Layout, imagery, visual hierarchy, spacing, responsive composition, and overall design quality are the primary decision criteria.

Critical blockers:

- build or type-check failure;
- broken search, filters, pagination, routing, catalogue return context, inquiry identity, persistence, validation, or submission;
- serious or critical accessibility violations;
- keyboard traps or unusable controls;
- desktop/mobile horizontal overflow;
- missing approved real imagery;
- invented data, claims, contact details, or downloadable documents.

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
- requirements and metadata-only attachment section;
- disciplined buyer-details grid;
- sticky desktop `InquiryReviewDesk` and non-sticky mobile review;
- preserved local storage, migration, validation, one-time submission token, `/api/inquiries`, and success routing.

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
- attach validated PDF/JPG/PNG/WebP metadata up to 8 MB in the development build;
- provide buyer and preferred-contact details;
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
- real catalogue PDFs and metadata.

## Current verification gate

Run from the real checkout only at the milestone boundary:

```bash
bash scripts/verify-design-milestone-4.sh
```

The gate performs:

- clean lint, typecheck, unit tests, and production build;
- homepage, Company & Trust, catalogue, product-detail, and Inquiry List browser suites;
- desktop and mobile projects through isolated port `3103`;
- serious accessibility and horizontal-overflow checks.

Harmless warnings do not block. Critical failures must be corrected.

Manual review sizes:

- 1440 × 1000
- 1280 × 800
- 768 × 1024
- 390 × 844
- 320 × 700

Review product base/variant states, Inquiry empty/manual/populated states, validation, selected quantities, reduced motion, and media quality.

## Next phases

1. Durable inquiry and attachment storage plus approved delivery integration
2. Client catalogue validation and real downloadable documents
3. Whole-site visual convergence, legal/error routes, and final logo/contact content
4. Accessibility, performance, security, metadata, and Cloudflare production audit
5. Explicit public cutover approval

The current public implementation remains available until the rebuild passes review and receives explicit cutover approval.
