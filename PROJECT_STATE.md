# THROHI Rebuild — Project State

This file is the repository source of truth for the current THROHI redesign and implementation.

## Current phase

**Layer 1 — Design source of truth and requirement traceability is active on `implementation/throhi-foundation-layer-1`.**

The approved August 1 foundation specification and implementation plan now supersede the earlier Precision Heritage House direction wherever they conflict.

Authoritative documents:

- `docs/superpowers/specs/2026-08-01-throhi-website-foundation-design.md`
- `docs/superpowers/plans/2026-08-01-throhi-foundation-to-production.md`
- `docs/content/THROHI_CONTENT_MATRIX.md`
- `docs/qa/THROHI_ACCEPTANCE_MATRIX.md`

The previous implementation remains an engineering and regression reference. It is not the approved visual, content, division, inquiry, or page-structure source of truth.

## Execution boundary

- Work is isolated on `implementation/throhi-foundation-layer-1`.
- `/rebuild` remains non-indexed.
- Public routes remain unchanged.
- No pull request, merge, deployment, redirect switch, indexing activation, public cutover, or GitHub Actions run is authorized.
- Local runtime verification has not been performed in the connector-only execution environment.

## Approved business and content direction

THROHI is presented as a Surgical and Dental instrument manufacturer/supplier based in Sialkot, Pakistan.

The website must:

1. establish a credible international-facing company identity;
2. provide practical product discovery by division, family, name, and reference code;
3. support direct guest quotation inquiry and Contact;
4. provide controlled single-owner publishing without inventing business facts.

Only two divisions are public:

- Surgical
- Dental

Beauty and Veterinary may remain in future admin data only as draft, hidden, or archived divisions. They must not appear in public navigation, search, counts, metadata, sitemap, or content until explicitly activated with complete approved material.

## Approved design foundation

### Typography

- DM Serif Display Regular — major H1/H2 only.
- Instrument Sans — H3-H6, body, navigation, product names, forms, filters, buttons, and admin controls.
- IBM Plex Mono — product references, variants, dimensions, quantities, and compact technical metadata.

The serif must never be faux-bold, uppercase, tightly compressed, or spread across practical interface text.

### Color and atmosphere

- warm paper/light surfaces dominate;
- emerald is the primary action color;
- technical blue supports structure and secondary actions;
- deep ink is reserved for text, footer, and selected cinematic/editorial contexts;
- muted brass is rare and must not create a luxury or antique identity.

### Geometry and layout

- 4-8px radii for cards, controls, and media stages;
- pills only for tags, filters, and compact statuses;
- spacing and fine borders establish structure before shadows;
- Home and Company may use controlled editorial asymmetry;
- catalogue, product, inquiry, contact, and admin use strict aligned grids;
- desktop catalogue uses three products per row;
- tablet uses two where practical;
- mobile uses one.

### Product imagery

- contained clinical-specimen stages;
- full instrument silhouette preserved;
- no aggressive crops, fake reflections, excessive glow, or dramatic grading;
- lower-resolution Surgical images remain smaller and sharper;
- higher-resolution Dental images may receive more space without breaking stage consistency.

### Motion

Only two signature experiences are approved:

1. the brief first-visit intro;
2. the Company-page scissors evolution sequence.

All other motion is restrained and functional. Reduced-motion users receive the same content immediately.

## Figma source of truth

File:

```text
THROHI Website & Admin Dashboard — Design System and UX
w12E41un4krAwBqlo8fHa6
```

Production page structure now exists:

- 00 Cover
- 01 Foundations
- 02 Components
- 03 Wireframes
- 04 Desktop
- 05 Tablet
- 06 Mobile
- 07 Prototypes
- 08 Edge Cases
- 09 Handoff
- 10 Archive

Historical pages are explicitly archived:

- Visual Direction Studies — reference only;
- Rejected Public Website Wireframes — do not implement;
- Typography Direction Studies — decision record.

Completed Figma work:

- three local variable collections;
- 72 scoped variables with CSS code syntax;
- Light and Cinematic semantic modes using primitive aliases;
- 15 approved text styles;
- three elevation/focus effect styles;
- desktop, tablet, mobile, and baseline grid styles;
- inspected Cover, Foundations, and Archive pages;
- inspected Button component set: 15 variants;
- inspected Field component set: 16 variants.

Current Figma work:

- completing core controls;
- then feedback/overlay components;
- then catalogue, inquiry, shell, and owner-admin patterns;
- responsive wireframes and high-fidelity pages follow only after component foundations are complete.

## Public experience contract

### Home

Approved hierarchy:

1. brief intro handoff;
2. THROHI identity and Sialkot origin;
3. Surgical and Dental entry points;
4. catalogue search by name or reference code;
5. representative source-derived families/products;
6. concise verified company introduction;
7. authentic document access or factual unavailable states;
8. Contact and Inquiry conclusion.

The full scissors evolution must not appear on Home.

### Company

Approved hierarchy:

1. THROHI introduction;
2. concise Sialkot context;
3. general instrument evolution using supplied frames;
4. THROHI today using verified facts only;
5. Contact conclusion.

The evolution sequence must not imply that THROHI invented or manufactured the historical instruments shown.

### Products

- division first;
- family second;
- one searchable catalogue;
- search by product name, product code, and variant code;
- contained product cards with source-derived identity;
- Product Detail with variants, verified specifications, related products, Quick Inquiry, and Add to Inquiry;
- default price state is `Contact for quotation`;
- no fake stock, reviews, ratings, or delivery claims.

### Catalogues

- separate Surgical and Dental groups;
- direct access to authentic supplied PDFs;
- no email gate or account;
- no generated, merged, rewritten, or placeholder PDFs;
- factual unavailable state until real files are supplied.

### Inquiry and Contact

- guest Quick Inquiry for one product;
- guest Inquiry List for multiple products;
- product snapshot keeps name, reference, quantity, and optional notes;
- archived/deleted products cannot erase retained inquiry identity;
- no public file uploads;
- no customer accounts;
- no cart, basket, checkout, payment, or order framing;
- general Contact remains separate from product-based Inquiry;
- email, phone, WhatsApp, address, map, operating hours, and response expectations remain unpublished until verified.

## Owner admin contract

- one owner account;
- no public registration or staff-role system;
- dashboard based on real state only;
- manage approved website content, products, families, variants, media, optional pricing, documents, contact information, division visibility, and latest inquiries;
- Draft → Preview → Publish;
- retain latest five published versions;
- restore creates a new draft;
- archive is the default removal action;
- permanent deletion is separate and strongly confirmed;
- retain latest 20 lightweight inquiry records;
- no CRM status pipeline.

Authentication provider, database, object storage, email delivery, backup, and deployment boundaries remain an architecture-stage decision.

## Current code conflicts to replace deliberately

The existing branch still contains behavior and presentation that conflict with the approved foundation, including:

- Cormorant Garamond and Archivo in the global font stack;
- Precision Heritage House visual contracts and CSS modules;
- four-division public company language;
- homepage evolution preview;
- a separate scissors-history route rather than the approved Company-page placement;
- public inquiry attachments and R2 attachment infrastructure;
- dark-first catalogue/product presentation;
- older page hierarchy and heritage-heavy wording.

These are known red contracts, not accidental discoveries. They will be replaced in isolated implementation tasks after Figma Layer 1 is complete.

## Existing engineering assets to preserve where compatible

- supplied intro media and skip/reduced-motion behavior;
- supplied 260-frame evolution media;
- 626 source-derived products and 1,434 variant codes;
- catalogue search, filtering, sorting, pagination, product context, and Inquiry state where they meet the new contract;
- catalogue and media preparation scripts;
- non-indexed rebuild boundary;
- existing source tests, Playwright infrastructure, and readiness tooling;
- production fail-closed principles for unconfigured inquiry delivery.

Existing attachment-specific behavior is not preserved because the approved public inquiry contract explicitly removes uploads.

## Verification state

A new red source contract exists:

```text
tests/throhi-foundation-contract.test.mjs
```

It intentionally describes the approved future state and is expected to fail against the current conflicting implementation.

It has not been executed in this connector-only environment. No test-pass claim is made.

Later local production verification will include:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
bash scripts/verify-throhi-production.sh
```

GitHub Actions must not be triggered intentionally without explicit permission.

## Release blockers and required client inputs

- final logo master;
- verified email, phone, WhatsApp, exact address, and map;
- inquiry recipient and delivery configuration;
- authentic Surgical and Dental PDFs and metadata;
- final legal/privacy/retention wording;
- approved company history, certifications, materials, capabilities, capacity, markets, OEM information, MOQ, and lead times when available;
- approved response-time statement;
- final pricing policy if public prices are enabled;
- production hosting, authentication, storage, backup, monitoring, and security configuration;
- explicit merge, deployment, indexing, and cutover approval.

A missing release input blocks only that content or feature. It never authorizes an invented substitute.

## Next work

1. Complete Layer 1 component foundations in Figma.
2. Produce responsive public/admin wireframes using only approved components and content boundaries.
3. Complete high-fidelity desktop, tablet, mobile, edge-state, prototype, and handoff pages.
4. Record final Figma-to-code token/component mapping and motion specification.
5. Begin Layer 2 implementation only after the complete Layer 1 checkpoint review.
