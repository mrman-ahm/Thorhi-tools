# THROHI Rebuild — Project State

This file is the single decision source of truth for the current rebuild. Chat discussion,
earlier branches, screenshots, and previous implementations are reference material unless a
decision is recorded here.

## Current phase

**Design Milestone 3: Precision Catalogue Ledger implementation present; combined verification and visual review pending.**

Work remains isolated on `design/surgical-precision-archive`, based on
`rebuild/surgical-contrast`. Public routes remain unchanged and all `/rebuild` routes remain
non-indexed.

Implemented rebuild milestones:

1. Surgical Precision Archive homepage and shared shell
2. Company & Trust Spine
3. Precision Catalogue Ledger

A milestone is not complete until a real checkout passes the critical build, type, unit,
production, desktop/mobile browser, serious accessibility, responsive-overflow, and visual
review gates. Harmless pre-existing warnings, deprecations, and obsolete syntax-only assertions
are deferred rather than allowed to derail layout and visual implementation.

## Approved project purpose

THROHI Medical Tools needs a professional corporate and catalogue website that:

- introduces the company and its instrument ranges to the market;
- presents Surgical, Dental and Orthodontic, Veterinary, and Beauty divisions;
- provides a searchable digital catalogue using real product names, codes, images, families,
  and variants;
- provides downloadable catalogue documents when real files are available;
- lets visitors create a non-commerce Inquiry List and contact THROHI through verified routes;
- integrates the supplied cinematic entry and scissors-evolution media without obstructing
  practical browsing.

## Primary implementation preference

Layout, imagery, visual hierarchy, spacing, responsive composition, and overall design quality
are the primary decision criteria.

Critical issues that block progress:

- build or type-check failure;
- broken search, filters, pagination, routing, inquiry state, or data integrity;
- serious or critical accessibility violations;
- keyboard traps or unusable controls;
- broken responsive layout or horizontal overflow;
- missing approved real imagery;
- invented catalogue records, claims, or contact details.

Non-critical issues may remain in deferred work:

- harmless pre-existing lint warnings;
- toolchain deprecation warnings outside the touched surface;
- cosmetic differences that do not damage hierarchy or usability;
- tests that enforce superseded implementation syntax instead of user behavior.

## Approved design direction

**Surgical Contrast**, with the visual system **Surgical Precision Archive**.

- Dark identity moments use near-black navy, steel, restrained blue, and restrained green.
- Catalogue and form surfaces use lighter paper/steel backgrounds for reading and comparison.
- Real instrument imagery is the primary visual material.
- Strong signature motion is reserved for the cinematic cover and the full evolution sequence.
- Repeated buyer tasks use restrained state and navigation motion only.
- Instrument Sans is the display face, Archivo is the interface/reading face, and IBM Plex Mono
  is reserved for product codes and technical counters.
- Surgical green is the primary action color; steel blue is a supporting interaction accent.
- Borders, whitespace, and moderate radii define grouping.
- Generic SaaS cards, excessive pills, decorative glass panels, cyberpunk effects, and design-
  agency presentation are rejected.

## Approved information architecture

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

Company, About, and general company story content stay on one Company page. Do not create
repetitive Mission, Vision, Why Choose Us, or Our Story pages without unique verified content.

## Approved global navigation

Primary routes:

- Products
- Company
- Catalogues
- Contact

Persistent utilities:

- Search
- Inquiry List with item count
- WhatsApp only after final contact verification

The Products menu exposes the four divisions, Browse All Products, and Search by Name or Code.
Structured divisions are links; pending divisions remain truthful non-links until meaningful
catalogue destinations exist.

## Implemented Milestone 1 — homepage and shell

- Skippable cinematic cover using the supplied MP4
- Company-led hero identifying THROHI, instrument ranges, and Sialkot, Pakistan
- Early catalogue search by instrument name or code
- Four truthful division entries
- Three selected real product families
- Concise verified company introduction
- Compact 260-frame evolution preview
- Catalogue, Inquiry List, and unlisted-instrument utilities
- Verified-contact boundary with no empty direct-contact controls
- Responsive shared header/footer and mobile navigation

## Implemented Milestone 2 — Company & Trust Spine

Routes:

- `/rebuild/company`
- `/rebuild/company/scissors-through-time`
- `/rebuild/catalogues`
- `/rebuild/contact`

Features:

- typed verified company-content boundary;
- four-division ledger;
- customer-facing publication boundary without internal filler;
- full 260-frame evolution route with reduced-motion and media-failure parity;
- real-files-only downloadable catalogue model;
- structured Inquiry List and unlisted-instrument contact routing;
- header/footer navigation converged on real rebuild routes.

## Implemented Milestone 3 — Precision Catalogue Ledger

`/rebuild/products` preserves the existing data and interaction model but now uses a stronger
procurement-focused design.

- Compact dark editorial masthead
- Real Operating Scissors specimen stage
- Live product, variant, structured-division, and source-status ledger
- Large URL-backed command search
- Sticky desktop filter ledger
- Deliberate native mobile filter sheet
- Two-column desktop instrument ledger
- One-column mobile instrument records
- Visible catalogue code, division, family, variant count, product route, and Inquiry action
- Separate detail and Inquiry controls
- Pagination with result-context restoration
- Reduced-motion-safe image and steel-line responses
- Focused visual components for filters, product entries, toolbar, and no-results recovery

Preserved URL parameters:

- `q`
- `division`
- `family`
- `sort`
- `page`

Preserved behaviors:

- debounced search;
- scoring and sorting;
- page size of 24;
- product-detail return context;
- real optimized catalogue media;
- Inquiry List quantity increments and live announcements;
- pending Veterinary and Beauty truth boundary.

## Approved catalogue model

Hierarchy:

`Division → Category / Instrument Family → Product Family → Variant`

Current supplied structured data contains approximately:

- 53 categories
- 626 representative product families
- 1,434 variants

The product family is the normal listing unit. Near-identical variants remain consolidated
inside the product route.

Search priority:

1. exact product code;
2. code prefix;
3. product-family name;
4. alias;
5. category;
6. broader text match.

Surgical and Dental/Orthodontic have the strongest structured data. Beauty and Veterinary remain
visible but are not populated with invented product records.

## Approved Inquiry List behavior

The Inquiry List is not a shopping cart and has no checkout or public pricing.

Visitors may:

- add product families or selected variants;
- set quantities;
- add notes or an unlisted instrument reference;
- provide contact details;
- submit one structured inquiry or continue through WhatsApp after verification.

No account is required.

## Motion allocation

Major motion:

1. cinematic cover and slide-away reveal;
2. complete scissors-evolution experience.

Supporting motion is limited to navigation, search, filters, inquiry feedback, product-image
responses, and controlled steel-line feedback.

Do not use universal fade-up entrances, cursor trails, constant tilting, excessive parallax,
moving buttons, auto-scrolling product carousels, or animation that delays access to content.

## Anti-AI design rules

- Every section answers a unique visitor question.
- Every visible component performs a real function or communicates unique information.
- Ordinary text is not placed in cards by default.
- Eyebrow labels are not placed above every heading.
- Messages are not repeated across labels, headings, paragraphs, cards, and CTAs.
- Facts, testimonials, certifications, customers, metrics, awards, markets, materials,
  manufacturing capabilities, minimum orders, and company history are never invented.
- Empty space is allowed; decoration must earn its place.
- Mobile is designed deliberately rather than produced by stacking desktop sections.
- The website remains understandable when animation or media fails.

## Verified facts and public-safe content

Safe:

- THROHI Medical Tools is based in Sialkot, Pakistan.
- The public range includes Surgical, Dental and Orthodontic, Veterinary, and Beauty instruments.
- Validated catalogue/product data may be used.

Pending client confirmation:

- founding year and operating history;
- certifications;
- materials and steel grades;
- manufacturing capabilities and capacity;
- export markets;
- OEM or private-label services;
- minimum order quantities and lead times;
- final approved company description;
- final contact formatting;
- complete Beauty and Veterinary catalogue data;
- real catalogue PDFs and metadata.

Pending facts remain absent from production.

## Production workflow

1. static responsive composition;
2. visual foundation and design tokens;
3. browser screenshot review;
4. responsive corrections;
5. component and catalogue functionality;
6. restrained motion integration;
7. accessibility, performance, security, and QA;
8. production audit and deployment.

Work is batched locally where possible. Pull requests, CI, merges, deployment, and public cutover
occur only with explicit user approval.

## Current verification gate

Run from the real checkout:

```bash
bash scripts/verify-design-milestone-3.sh
```

This runs lint, typecheck, all unit tests, production build, and homepage, Company & Trust, and
catalogue design Playwright suites on desktop and mobile through an isolated port `3102` server.

Critical failures must be corrected. Harmless pre-existing warnings do not block.

Then review at minimum:

- 1440 × 1000
- 1280 × 800
- 768 × 1024
- 390 × 844
- 320 × 700
- default catalogue
- exact-code search
- active division/family filters
- no-results state
- selected Inquiry List state
- pagination
- reduced motion

## Next milestone

After Milestone 3 critical verification and visual corrections, design and implement the
**Product Examination & Inquiry Conversion** milestone:

- product-detail visual refinement;
- clearer base-product and variant hierarchy;
- stronger product image examination;
- sticky but non-ecommerce Inquiry controls;
- improved mobile quantity/notes interaction;
- Inquiry List visual convergence and unlisted-instrument flow;
- preservation of catalogue return context and verified-data boundaries.

The current public implementation remains available until the rebuild passes review and receives
explicit cutover approval.
