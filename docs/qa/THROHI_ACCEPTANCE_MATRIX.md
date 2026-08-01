# THROHI Acceptance and Traceability Matrix

**Authority:** `docs/superpowers/specs/2026-08-01-throhi-website-foundation-design.md`  
**Implementation plan:** `docs/superpowers/plans/2026-08-01-throhi-foundation-to-production.md`  
**Design file:** `w12E41un4krAwBqlo8fHa6`  
**Working branch:** `implementation/throhi-foundation-layer-1`

This matrix gives each approved requirement a stable identifier and maps it to design evidence, implementation scope, and verification. A requirement is not complete merely because a matching screen exists.

## Status legend

- **Defined** — approved requirement exists.
- **Designed** — implementation-ready Figma artifact exists and has been inspected.
- **Implemented** — source behavior exists on the isolated implementation branch.
- **Verified** — prescribed automated and manual evidence has passed.
- **Blocked** — external client input or production configuration is required.

## Brand and visual foundation

| ID | Requirement | Current status | Figma evidence | Implementation target | Verification |
|---|---|---|---|---|---|
| BRAND-01 | Light-first warm paper interface with limited cinematic dark sections. | Designed | `01 Foundations` color roles and semantic modes | `throhi-foundation.module.css` | Token contract + route screenshots |
| BRAND-02 | Emerald primary action and technical blue secondary structure. | Designed | Color roles | Shared UI and route modules | Computed-style checks + visual audit |
| BRAND-03 | Muted brass is a rare editorial accent, not a luxury theme. | Designed | Color swatches and usage notes | Foundation tokens | Source scan + visual audit |
| BRAND-04 | DM Serif Display Regular only for major H1/H2. | Designed | Typography roles | `next/font` and semantic heading classes | Source contract + computed fonts |
| BRAND-05 | Instrument Sans for H3-H6, body, navigation, products, forms, controls. | Designed | Typography roles | Shared UI and route components | Source contract + route audit |
| BRAND-06 | IBM Plex Mono for codes, references, variants, quantities, metadata. | Designed | Typography scale | Catalogue/inquiry/admin components | Computed-font checks |
| BRAND-07 | Low-radius 4-8px geometry; pills only for tags, filters, statuses. | Designed | Geometry and rhythm | Shared UI | Token checks + visual audit |
| BRAND-08 | Fine borders and spacing before shadows. | Designed | Elevation specimens | Shared UI | CSS/source review |
| BRAND-09 | Product imagery uses contained clinical-specimen stages. | Designed | Product imagery rules | Product card/detail media | Screenshot and missing-image tests |
| BRAND-10 | No generic AI filler, unsupported badges, fake trust, or arbitrary decoration. | Defined | Foundations/archive notes | All public routes | Content/source scan + independent review |

## Information architecture and navigation

| ID | Requirement | Current status | Figma evidence | Implementation target | Verification |
|---|---|---|---|---|---|
| IA-01 | Public routes: Home, Company, Products, Product Detail, Catalogues, Inquiry, Contact. | Defined | Future wireframes | App Router routes | Route smoke tests |
| IA-02 | Owner admin is separate from public navigation. | Defined | Future admin wireframes | `/rebuild/admin/**` | Unauthorized-access tests |
| IA-03 | Persistent desktop header contains Company, Products, Catalogues, Contact, Search, Inquiry. | Defined | Future shell component | Public shell | Desktop navigation E2E |
| IA-04 | Products navigation is division first, family second. | Defined | Future shell/catalogue wireframes | Products menu and catalogue query state | Keyboard/pointer navigation E2E |
| IA-05 | Mobile navigation is full height and exposes the same hierarchy. | Defined | Future mobile components | Mobile shell | Focus trap, Escape, body-lock, overflow tests |
| IA-06 | Inquiry count remains visible when products are selected. | Defined | Future shell component | Inquiry provider/shell | State-persistence E2E |
| IA-07 | Essential routes are never gesture-only or hidden behind unclear icons. | Defined | Future shell component | Shared shell | Keyboard and mobile audit |

## Division and catalogue truth

| ID | Requirement | Current status | Figma evidence | Implementation target | Verification |
|---|---|---|---|---|---|
| DIV-01 | Surgical and Dental are the only public divisions. | Defined | Foundations cover | Catalogue normalization and public shell | Source contract + public route scans |
| DIV-02 | Beauty and Veterinary remain hidden admin divisions until explicit activation. | Defined | Archive/content matrix | Data state and admin controls | Public leakage tests |
| CAT-01 | Search supports product name and reference/variant code. | Existing behavior; redesign pending | Future catalogue wireframe | Catalogue query library/client | Unit ranking tests + E2E |
| CAT-02 | Family selection filters one unified catalogue. | Existing behavior; redesign pending | Future catalogue wireframe | Catalogue URL state | Filter/back-navigation tests |
| CAT-03 | Desktop uses three product columns. | Designed rule | Foundations responsive/image rules | Catalogue grid | Viewport layout assertion |
| CAT-04 | Tablet uses two columns where space permits; mobile uses one. | Designed rule | Foundations responsive rules | Catalogue grid | 768/390/320 screenshots |
| CAT-05 | Product cards show contained image, name, code, useful context, details, Add to Inquiry. | Defined | Future Product Card component | Catalogue components | Component and route tests |
| CAT-06 | Low-resolution Surgical images remain controlled in size. | Designed | Product imagery rules | Media component | Rendered visual audit |
| CAT-07 | Product Detail includes media, variants, verified specifications, related products, Quick Inquiry, Add to Inquiry. | Defined | Future detail wireframe | Product route | Product journey E2E |
| CAT-08 | Default price state is `Contact for quotation`. | Defined | Future product component | Product data/UI | Source scan + route assertions |
| CAT-09 | Exact/range price and currency appear only when owner configures approved values. | Defined | Future admin/product designs | Admin/product contracts | Authorization and display tests |
| CAT-10 | No fake stock, ratings, reviews, delivery promises, or ecommerce framing. | Defined | Content matrix | Public product routes | Content scan |

## Home and Company

| ID | Requirement | Current status | Figma evidence | Implementation target | Verification |
|---|---|---|---|---|---|
| HOME-01 | First-visit intro is brief, skippable, returning-visitor aware, and reduced-motion safe. | Existing asset/behavior; redesign pending | Future prototype | Cinematic entry | Visit-state and reduced-motion E2E |
| HOME-02 | Home prioritizes identity, Surgical/Dental access, search, families, verified company intro, documents, Contact/Inquiry. | Defined | Future wireframe | Home route | Section-order assertions + visual audit |
| HOME-03 | Full scissors evolution does not appear on Home. | Defined | Archive/content matrix | Home route | Source and DOM absence tests |
| COMPANY-01 | Company order: introduction, Sialkot context, evolution, THROHI today, contact conclusion. | Defined | Future wireframe | Company route | DOM order and screenshot review |
| COMPANY-02 | Evolution explains general instrument development and disclaims THROHI authorship of history. | Defined | Future motion prototype | Company evolution | Content assertion + manual review |
| COMPANY-03 | Reduced-motion evolution exposes the same information statically. | Defined | Future prototype | Company evolution | Emulated reduced-motion test |
| COMPANY-04 | No fabricated timeline, factory tour, certifications, founder story, or capability claims. | Defined | Content matrix | Company content | Content/source scan |

## Catalogue documents

| ID | Requirement | Current status | Figma evidence | Implementation target | Verification |
|---|---|---|---|---|---|
| DOC-01 | Separate Surgical and Dental document groups. | Defined | Future Catalogues wireframe | Catalogues route/admin | Route assertions |
| DOC-02 | Authentic client PDFs open/download directly without a gate. | Blocked by real files | Future document component | Document data/storage | File route and metadata tests |
| DOC-03 | Combined catalogue appears only if THROHI supplies one. | Defined | Content matrix | Document data | Source contract |
| DOC-04 | Application never edits, generates, rewrites, or merges original PDFs. | Defined | Content matrix | Admin/document backend | API and source review |
| DOC-05 | Missing documents show factual unavailable/contact state. | Defined | Future edge state | Catalogues route | Empty-state E2E |

## Inquiry and Contact

| ID | Requirement | Current status | Figma evidence | Implementation target | Verification |
|---|---|---|---|---|---|
| INQ-01 | Guest Quick Inquiry supports one product. | Defined | Future product/inquiry components | Product route/inquiry state | Product-to-inquiry E2E |
| INQ-02 | Guest Inquiry List supports multiple products. | Existing behavior; redesign pending | Future inquiry wireframe | Inquiry provider/page | Add/edit/remove/refresh E2E |
| INQ-03 | Each item snapshot stores name, reference, quantity, optional notes. | Defined | Future inquiry component | Inquiry contracts/storage | Unit and API tests |
| INQ-04 | Archived/deleted products do not erase retained name/reference snapshots. | Defined | Content matrix | Persistence model | Archive-retention integration test |
| INQ-05 | Inquiry has no account requirement. | Defined | Future inquiry wireframe | Public inquiry route | Authentication absence assertion |
| INQ-06 | Inquiry has no file upload. | Defined | Content matrix | Provider, page, API, backend | Source contract + DOM/API tests |
| INQ-07 | Approved terms: Add to Inquiry, Inquiry List, Quick Inquiry, Request quotation, Submit inquiry. | Defined | Button usage notes | Public routes | Content scan |
| INQ-08 | Prohibited terms: cart, basket, checkout, payment, place order. | Defined | Content matrix | Public routes | Source/content scan |
| INQ-09 | Submission is delivered to configured THROHI email and stored as a lightweight record. | Blocked by recipient/provider decision | Future architecture | Inquiry backend | Integration test against configured service |
| INQ-10 | Only latest 20 lightweight admin inquiry records are retained. | Defined | Future admin design | Persistence layer | Retention test inserting record 21 |
| INQ-11 | No CRM status pipeline. | Defined | Content matrix | Admin inquiries | Data/UI absence test |
| CONTACT-01 | Contact is the primary conversion page. | Defined | Future Contact wireframe | Contact route | Navigation and CTA audit |
| CONTACT-02 | General contact remains separate from product-based inquiry. | Defined | Future Contact/Inquiry designs | Separate form contracts | E2E routing and payload tests |
| CONTACT-03 | Phone, WhatsApp, email, address, map, hours, response-time appear only after verification. | Blocked by client inputs | Content matrix | Contact configuration | Publication-boundary tests |

## Owner admin

| ID | Requirement | Current status | Figma evidence | Implementation target | Verification |
|---|---|---|---|---|---|
| ADMIN-01 | Exactly one owner account; no public registration or staff roles. | Defined | Future admin design | Auth/authorization | Unauthorized and account-creation tests |
| ADMIN-02 | Owner manages content, products, families, variants, media, optional price, documents, contact, inquiries. | Defined | Future admin screens | Admin routes/actions | Authorized CRUD tests |
| ADMIN-03 | Workflow is Draft → Preview → Publish. | Defined | Future admin components | Publishing service | State-transition tests |
| ADMIN-04 | Latest five published versions are retained. | Defined | Future version component | Version persistence | Publish-six-times retention test |
| ADMIN-05 | Restore creates a new draft, not an immediate public overwrite. | Defined | Future restore flow | Version service | Restore integration test |
| ADMIN-06 | Archive is default removal. | Defined | Future admin patterns | Product/document/content lifecycle | Archive tests |
| ADMIN-07 | Permanent deletion is separate and strongly confirmed. | Defined | Future destructive dialog | Owner-only action | Confirmation and authorization tests |
| ADMIN-08 | Division states: draft, active, hidden, archived. | Defined | Future admin patterns | Division model | State and public-visibility tests |
| ADMIN-09 | Dashboard uses real state only, not fabricated analytics. | Defined | Future dashboard | Admin dashboard | Data-source assertions |
| ADMIN-10 | Password reset, session security, rate protection, audit logging, and provider-supported 2FA are architecture requirements. | Architecture decision pending | Future architecture | Auth platform | Security review and integration tests |

## Responsive, accessibility, motion, and quality

| ID | Requirement | Current status | Figma evidence | Implementation target | Verification |
|---|---|---|---|---|---|
| RESP-01 | Mobile is reordered by task priority, not mechanically stacked. | Designed rule | Foundations responsive rules | All route CSS/layout | Multi-viewport visual audit |
| RESP-02 | No horizontal overflow at 320, 390, 768, 1024, 1280, 1440, large desktop. | Defined | Grid styles | All routes | Playwright width loop |
| RESP-03 | Mobile filters use a focused drawer/sheet with apply, reset, close. | Defined | Future catalogue components | Catalogue UI | Touch/keyboard E2E |
| RESP-04 | Product silhouettes remain stable without layout shift. | Designed | Product imagery rules | Media components | CLS and screenshot checks |
| A11Y-01 | Target WCAG 2.2 AA. | Defined | Foundations focus/contrast | Entire application | axe + manual checklist |
| A11Y-02 | Full keyboard operation for navigation, search, filters, galleries, dialogs, inquiry, admin publishing. | Defined | Component states | Shared interactions | Keyboard E2E |
| A11Y-03 | Visible focus and non-color-only states. | Designed | Focus style and components | Shared UI | Computed focus + manual review |
| A11Y-04 | Semantic headings, labelled forms, useful alt text, clear errors/status. | Defined | Future page/component designs | Public/admin components | DOM/accessibility-tree checks |
| A11Y-05 | Zoom and touch targets remain usable. | Designed target | 44px touch token | Shared UI | 200% zoom and target-size checks |
| MOTION-01 | Signature motion is limited to intro and Company evolution. | Defined | Future motion spec | Motion components | Source/visual review |
| MOTION-02 | Ordinary navigation, filters, feedback, drawers, and state changes use restrained functional motion. | Defined | Future motion spec | Shared UI | Timing/source review |
| MOTION-03 | Reduced motion bypasses or simplifies nonessential movement without hiding content. | Defined | Future prototype | Motion CSS/components | Emulated media tests |
| PERF-01 | Intro, frame sequence, product images, fonts, JS, and layout shifts have explicit budgets. | Plan-defined | Future motion/handoff docs | Asset pipeline/build | Readiness script and profiling |
| SEC-01 | Secrets remain server-side; validation/authorization are server-enforced. | Defined | Architecture pending | API/admin backend | Security tests/review |
| SEC-02 | Rate limits, safe errors, output encoding, CSP/security headers are reviewed before release. | Defined | Architecture pending | Backend/deployment | Security checklist and integration tests |
| QA-01 | Every important state includes default, focus, disabled, loading, empty, error, success, long content, missing image where relevant. | In design progress | Components and Edge Cases pages | All features | Component/state inventory + E2E |
| QA-02 | Design receives creator review and independent art-direction review. | In progress | Figma audit records | Figma/public UI | Two documented review passes |
| QA-03 | Engineering receives local lint, typecheck, source tests, production build, E2E, accessibility, readiness gate. | Planned | Handoff | `scripts/verify-throhi-production.sh` | Exact command output |

## Release blockers

The following are not design ambiguities and must not be guessed:

- final logo master;
- verified phone, email, WhatsApp, address, map, hours, and response expectations;
- inquiry recipient and delivery provider;
- authentic Surgical and Dental PDFs and metadata;
- final legal/privacy/retention text;
- approved company history, certifications, materials, capabilities, capacity, markets, OEM, MOQ, and lead times;
- final public pricing policy;
- admin authentication/database/storage/email/deployment choices after architecture review.

## Completion rule

A row reaches **Verified** only when its specified evidence exists. Design completion does not imply implementation completion; implementation completion does not imply production approval; and production approval never occurs without explicit user authorization.
