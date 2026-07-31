# Changelog

All meaningful project changes are recorded here. Detailed current decisions live in `PROJECT_STATE.md`.

## 2026-07-31

### Added

- Regal Technical Corporate visual system with Cormorant Garamond, premium ivory/navy/brass tokens, readable typography, and route-wide convergence.
- Premium header, product/search panels, mobile navigation, footer, and inquiry confirmation.
- Rebuild-native Privacy, Terms, loading, error, and not-found states.
- Typed legal-content boundary without invented dates, jurisdictions, contacts, retention promises, or governing law.
- Production Readiness Convergence specification and plan.
- Fail-closed `robots.ts` and explicit future indexing gate.
- Permanent rebuild/API metadata and HTTP no-index boundaries.
- Expanded safe response headers and API no-store behavior.
- Increased-contrast and forced-colors rebuild support.
- Dependency-free post-build static, JavaScript, CSS, and file-count budgets.
- Readiness source and Playwright contracts.
- `docs/production/PRODUCTION_READINESS.md`.
- Rendered Visual QA Refinement specification and implementation plan.
- Stable homepage, catalogue, product, inquiry, variant, and related-record QA markers.
- Scoped `visual-qa-refinements.module.css` layer and `rendered-visual-qa-v1` shell contract.
- Rendered browser contracts for secondary serif hierarchy, readable procurement labels, laptop-fold product composition, and five-width overflow checks.

### Changed

- Added Privacy and Terms to the premium footer.
- Registered utility-state, production-readiness, and rendered visual-QA suites in the Milestone 6 gate.
- Added `npm run readiness:check` immediately after the production build.
- Aligned homepage and product composition to the 80px desktop and 66px mobile premium headers.
- Extended regal typography through homepage secondary headings, family names, inquiry section headings, and related-product names.
- Raised essential catalogue, product, and inquiry labels to at least 12px and important helper copy to at least 14px.
- Tightened product examination, catalogue masthead, and inquiry masthead composition for 1280 × 800 laptop screens without changing route behavior.
- Kept CSP, HSTS, indexing, canonical URLs, sitemap, and social metadata deferred until real runtime and content approval.
- Recorded Milestone 8 as source implementation present without a runtime or screenshot-quality claim.

## 2026-07-30

### Added

- Company & Trust Spine routes and verified-content boundaries.
- Precision Catalogue Ledger with URL-backed search, filters, sorting, pagination, and real catalogue media.
- Product Examination Desk and procurement Inquiry Desk.
- Durable Inquiry Backend with multipart submission, D1, R2, rate limits, optional Turnstile, and delivery outbox.
- Isolated verification gates through Milestone 4.

### Changed

- Replaced generic layouts with procurement-focused catalogue, product, and inquiry systems.
- Preserved search, routing, base/variant identity, local migration, validation, and success behavior.
- Restricted process-memory inquiry storage to non-production.
- Classified harmless pre-existing warnings as deferred.

## 2026-07-29

### Added

- Isolated non-indexed `/rebuild` routes.
- Deterministic FineMed importer and 175-record review queue.
- 626 source-derived products, 1,434 variant codes, and optimized product imagery.
- Shared inquiry schema, API, and live Inquiry List state.
- Consolidated rebuild header, footer, catalogue, product, and inquiry foundations.

## 2026-07-22

### Added

- Initial repository, project brief, sitemap, user flows, frontend scaffold, design tokens, responsive navigation, accessibility foundations, and quality gate.
