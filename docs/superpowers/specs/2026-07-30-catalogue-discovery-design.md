# THROHI Catalogue Discovery Design Specification

## Status

Approved from the user's explicit instruction to proceed with layout and visual design as the primary quality priority. This specification governs Milestone 3 on `design/surgical-precision-archive`.

## Goal

Transform `/rebuild/products` into a polished procurement-grade catalogue that is visually distinctive, fast to scan, and easy to filter without changing the existing product data, URL-backed state, product routes, pagination, or Inquiry List behavior.

## Design direction: Precision Catalogue Ledger

The catalogue combines an editorial instrument archive with the density of a professional procurement ledger.

- Real instrument imagery remains the dominant visual material.
- Product information is presented in calm, structured rows rather than generic ecommerce cards.
- Search, filter state, result count, catalogue code, division, family, variant count, detail navigation, and inquiry action remain visible without opening secondary UI.
- The page uses the approved Surgical Precision Archive colors, typography, border system, and restrained motion.
- Layout quality, hierarchy, spacing, responsive composition, and image staging are the primary decision criteria.

## Quality priority and error policy

Implementation must not stop for harmless warnings or obsolete non-behavioral assertions.

Critical issues that must be fixed immediately:

- production build or type-check failures;
- broken search, filtering, pagination, product-detail routing, or Inquiry List state;
- data loss, invented product records, or unverified claims;
- keyboard traps, inaccessible controls, serious or critical Axe violations;
- broken responsive layout, horizontal overflow, invisible primary actions, or unusable mobile filters;
- missing real product imagery when an approved asset exists.

Non-critical issues may be placed in the deferred register:

- pre-existing unused imports;
- pre-existing deprecation warnings outside the touched surface;
- cosmetic test assertions that enforce superseded implementation syntax rather than user behavior;
- non-blocking animation differences under reduced motion;
- minor copy or spacing differences that do not harm hierarchy or usability.

## Existing behavior to preserve

- Query parameter `q` for search.
- Query parameter `division` for Surgical and Dental/Orthodontic filtering.
- Query parameter `family` for product-family filtering.
- Query parameter `sort` for relevance, name, and catalogue-code sorting.
- Query parameter `page` for pagination.
- Debounced search updates without full page reload.
- Product-detail route with return-context preservation.
- Inquiry List item state, quantity increments, and live announcements.
- Current catalogue data boundary and source-derived product media.
- Pending Veterinary and Beauty states without invented records.
- Reduced-motion and keyboard accessibility behavior.

## Page architecture

### 1. Catalogue masthead

A compact dark editorial masthead replaces the oversized generic introduction.

Desktop composition:

- left: identity marker, large `Product catalogue` title, concise search-oriented description;
- right: one real operating-scissors image framed as an archive specimen, not a decorative illustration;
- bottom ledger strip: live product count, live variant count, structured divisions, and catalogue source status.

Mobile composition:

- title and concise copy first;
- specimen image below at controlled height;
- statistics presented as one horizontal or two-by-two ledger, never oversized cards.

The masthead must end quickly enough that search and results are visible without excessive scrolling.

### 2. Command search

Search becomes the visual command point immediately below the masthead.

- One large search input with catalogue-code and product-name examples.
- Clear action integrated inside the field.
- Result count and current context visible below or beside it.
- Search remains debounced and URL-backed.
- Focus state is strong and professional, using green only as a functional signal.

### 3. Desktop filter rail

The desktop left rail remains sticky but is redesigned as a compact ledger.

Sections:

1. Division segmented rows.
2. Product-family select.
3. Active-filter count and reset action.
4. Source-verification note.

The rail must not resemble a dashboard sidebar or filter card. It uses borders, labels, and spacing only.

### 4. Mobile filter sheet

The existing native `details` control becomes a deliberate full-width filter sheet.

- Large touch target.
- Active-filter count visible in the summary.
- Expanded state uses clear grouped controls and a prominent close/apply path through native collapse behavior.
- Search remains outside the filter sheet.
- The sheet must not create horizontal overflow at 320px.

### 5. Results ledger

Desktop uses a two-column archive ledger, but each product is visually structured as one composed row rather than an isolated rounded card.

Each product entry includes:

- real instrument image on a controlled paper/steel stage;
- catalogue code in mono typography;
- division and family;
- product name with maximum readable line length;
- variant count;
- full-card detail link through the image/name while preserving separate inquiry control;
- `Add to Inquiry` control with selected quantity state.

Visual behavior:

- image stage is approximately 55–60% of entry height;
- copy stage is compact and aligned across neighboring products;
- no rounded-card shell;
- borders create one continuous catalogue ledger;
- hover/focus reveals a subtle steel-blue line and image scale of no more than 1.02;
- no universal fade-up animation; initial result motion is removed or reduced to a short opacity transition for newly filtered results only.

Mobile results become one-column instrument records:

- image first;
- code and division in one metadata line;
- name, family, variant count, and inquiry action below;
- minimum 44px controls;
- no side-by-side copy that compresses text.

### 6. Toolbar and active context

- Result count is the primary toolbar element.
- Sort remains secondary and compact.
- Active filters render as removable ledger tags with square corners and no excessive pill styling.
- Clear-all appears only when useful.
- Pagination uses Previous / page position / Next and scrolls the user back to the result toolbar after navigation.

### 7. Empty and pending states

No-results state:

- states the exact query or filter context;
- offers reset and unlisted-instrument inquiry actions;
- uses one restrained editorial block, not a generic empty-state illustration.

Veterinary and Beauty:

- remain visible in global navigation and company surfaces;
- are not added to the working catalogue filters until real structured records exist;
- no fake disabled product grid is introduced.

## Visual system

Use only approved rebuild tokens:

- near-black navy and ink for authority;
- paper and steel surfaces for product comparison;
- surgical green for primary actions and selected state;
- steel blue for supporting focus or hover lines;
- red only for destructive or error states.

Typography:

- Instrument Sans for masthead and product names;
- Archivo for interface and readable body copy;
- IBM Plex Mono for catalogue codes and technical counters.

Spacing:

- desktop content width remains close to 1400px;
- masthead vertical space is reduced from the current 500px minimum;
- result ledger gaps are removed in favor of shared borders;
- mobile uses 16px outer gutters at 390px and 10–12px at 320px where necessary.

## Component boundaries

Keep URL/data logic inside `catalogue-client.tsx`, but split repeated visual units so the main client remains readable:

- `catalogue-filter-controls.tsx` — division and family controls;
- `catalogue-product-entry.tsx` — product image, detail links, metadata, and inquiry action;
- `catalogue-results-toolbar.tsx` — count, sort, and active context;
- `catalogue-empty-state.tsx` — zero-results recovery;
- `catalogue.module.css` — one route-specific visual system.

Do not move product scoring, data access, or Inquiry List ownership into presentation components.

## Accessibility

- One visible `h1`.
- Search has a persistent visible label.
- Filter fieldset and selects have explicit accessible names.
- Product detail and inquiry actions have distinct accessible names.
- Selected inquiry state is announced and reflected in button text.
- Focus styles meet contrast requirements on light and dark surfaces.
- No serious or critical Axe violations.
- Reduced motion removes result entrance animation and image scaling.

## Performance

- Preserve current optimized `CatalogueMedia` behavior.
- Keep only the masthead specimen image eager.
- Result media remains lazy.
- Do not add a new animation or UI library.
- No client-side duplication of the catalogue dataset.
- Keep current page size unless measured rendering evidence requires a change.

## Verification

Automated:

- lint: no new errors;
- typecheck passes;
- unit catalogue contracts pass;
- production build passes;
- desktop and mobile Playwright verify search, filtering, URL state, sorting, pagination, Inquiry List state, return context, no overflow, and Axe;
- reduced-motion test confirms static results and no required animation.

Visual review:

- 1440 × 1000 desktop;
- 1280 × 800 laptop;
- 768 × 1024 tablet;
- 390 × 844 mobile;
- 320 × 700 narrow mobile;
- search with no query;
- exact product-code search;
- active division and family filters;
- no-results state;
- selected Inquiry List state.

## Non-goals

- No product-detail redesign in this milestone.
- No Inquiry List form redesign in this milestone.
- No new catalogue records or technical specifications.
- No backend search service.
- No public pricing, checkout, accounts, favorites, comparison basket, or ecommerce behavior.
- No merge, deployment, or public cutover without explicit approval.
