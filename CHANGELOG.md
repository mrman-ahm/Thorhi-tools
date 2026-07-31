# Changelog

All meaningful project changes are recorded here. Detailed current decisions live in `PROJECT_STATE.md`.

## 2026-07-31

### Added

- Full-site **Precision Heritage House** redesign specification and implementation plan.
- New `precision-heritage-house-v1` redesign contract.
- Archival ivory/paper, surgical ink/navy/green, restrained brass, readable typography, spacing, focus, contrast, forced-colors, and reduced-motion foundation.
- Rebuilt ivory desktop header, cinematic transparent state, editorial catalogue/search overlays, full-screen mobile route index, and live Inquiry List utility.
- Rebuilt dark manufacturer-dossier footer.
- Full homepage replacement covering cinematic handoff, company-led hero, division dossiers, asymmetric selected instruments, verified company introduction, evolution bridge, and closing action path.
- Route-owned catalogue redesign module with compact index masthead, dominant search, filter ledger, alternating procurement records, and native mobile filtering.
- Route-owned product examination redesign with museum-grade media stage, dark procurement dossier, formal variants, and related comparison records.
- Route-owned Inquiry List redesign with formal worksheet sections, editable instrument records, forms, attachment state, and dark review dossier.
- Shared corporate redesign layer covering Company, Catalogues, Contact, division ledgers, truth boundaries, action rails, document records, and contact routing.
- Precision Heritage replacements for Scissors Through Time, Privacy, Terms, loading, error, not-found, and inquiry confirmation routes.
- Stable redesign data contracts across homepage, catalogue, product, inquiry, corporate, and utility surfaces.
- Dedicated full-redesign source and Playwright contracts.
- Isolated `npm run verify:redesign` gate on port `3105`.

### Changed

- Replaced the previous layered premium/visual-QA approach with one authoritative design system.
- Removed `premium-convergence.module.css` and `visual-qa-refinements.module.css`.
- Changed the desktop header from 80px to 78px while retaining the 66px mobile shell.
- Preserved catalogue search, filters, sorting, pagination, product return context, base/variant identity, Inquiry state, validation, attachments, Turnstile hooks, and durable submission behavior during the redesign.
- Preserved supplied cinematic and scissors-evolution media.
- Preserved no-index, security-header, accessibility, reduced-motion, and production-readiness boundaries.
- Kept CSP, HSTS, indexing, canonical URLs, sitemap, social metadata, Cloudflare runtime configuration, and public cutover deferred.

### Earlier 2026-07-31 work retained

- Production Readiness Convergence with fail-closed indexing, safe response headers, forced-colors support, and post-build budgets.
- Rebuild-native Privacy, Terms, loading, error, and not-found routes.
- Durable inquiry configuration and operations documentation.

## 2026-07-30

### Added

- Company & Trust Spine routes and verified-content boundaries.
- Precision Catalogue Ledger with URL-backed search, filters, sorting, pagination, and real catalogue media.
- Product Examination Desk and procurement Inquiry Desk.
- Durable Inquiry Backend with multipart submission, D1, R2, rate limits, optional Turnstile, and delivery outbox.
- Isolated verification gates through Milestone 4.

### Changed

- Preserved search, routing, base/variant identity, local migration, validation, and success behavior.
- Restricted process-memory inquiry storage to non-production.
- Classified harmless pre-existing warnings as deferred.

## 2026-07-29

### Added

- Isolated non-indexed `/rebuild` routes.
- Deterministic FineMed importer and 175-record review queue.
- 626 source-derived products, 1,434 variant codes, and optimized product imagery.
- Shared inquiry schema, API, and live Inquiry List state.

## 2026-07-22

### Added

- Initial repository, project brief, sitemap, user flows, frontend scaffold, design tokens, responsive navigation, accessibility foundations, and quality gate.
