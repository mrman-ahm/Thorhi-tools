# THROHI V2 — Phase 8.5 Static UI Readiness Audit

## Purpose

This phase reviews and corrects the complete static interface before Anime.js becomes part of the motion system. It deliberately adds no new animation.

Motion must enhance an interface that already works visually, structurally, responsively, and accessibly.

## Routes reviewed

- homepage
- header and full-screen menu
- products landing
- division template
- family listing
- product detail
- global search command
- search results
- inquiry workflow
- confirmation
- company
- resources
- contact
- privacy
- terms
- 404 and recovery states

## System-wide findings

### 1. Display typography was overused

Many routes repeated the same large uppercase campaign-poster treatment. This weakened hierarchy because every page appeared equally theatrical.

Corrections:

- reduced homepage and catalogue display ceilings
- reduced division, function, family, history, product, and footer scale
- converted utility headings to sentence case
- reduced heading weight and aggressive letter spacing on utility routes
- preserved small body, code, form, and metadata sizes

### 2. Dark-green atmosphere became visually repetitive

The repeated green fog, scanlines, grid overlays, and near-identical dark backgrounds made unrelated routes feel like the same scene.

Corrections:

- removed the persistent body scanline background
- reduced decorative grid opacity inside product placeholders
- introduced more neutral graphite surfaces
- kept green lighting local to the relevant object or section
- retained blue as a technical secondary signal

### 3. Full-width green bands were too fluorescent

The homepage command section, catalogue recovery, division evidence, product documents, and final calls to action used high-energy electric green across large surfaces.

Corrections:

- replaced fluorescent green bands with sterile pale mint surfaces
- preserved dark surgical-green text and actions
- retained brighter green for small controls, active states, and instrument highlights

### 4. Header felt like a design-system demonstration

The vertical index, oversized white logo block, square counter, and hard control geometry added unnecessary control-panel character.

Corrections:

- removed the decorative vertical index from visual presentation
- reduced the temporary logo block without making the logo illegible
- softened header control radii and borders
- reduced header height
- retained search, inquiry, and menu access

### 5. Footer repeated a second hero on every page

The giant THROHI letter field made already-long routes significantly longer and diluted the impact of homepage typography.

Corrections:

- reduced footer display height and letter scale
- removed the display field on small mobile screens
- retained brand identity, navigation, and verification metadata
- replaced the outdated “V2 static skeleton” label with “Pre-production review build”

### 6. Catalogue pages contained more theatre than necessary

Catalogue routes must remain faster and calmer than the homepage.

Corrections:

- reduced catalogue hero height
- reduced division and family heading scale
- shortened catalogue sections
- reduced product-placeholder visual height
- tightened product-detail spacing
- retained direct search, filters, product codes, and inquiry controls

### 7. Utility routes required a calmer professional tone

Inquiry, company, resources, contact, legal, confirmation, and failure routes should not resemble campaign landing pages.

Corrections:

- sentence-case utility headings
- compact utility hero height
- reduced form-section heading scale
- reduced evidence, resource, contact, legal, success, and 404 heading scale
- retained pale reading surfaces and explicit recovery paths

### 8. Existing scroll scenes reserved space before motion was finalized

The family passage and scissors-history sequence still relied on sticky layouts and long scroll runways. That made the static page feel incomplete and would have forced Anime.js to inherit competing motion logic.

Corrections:

- converted the family passage into a complete responsive grid
- converted the scissors sequence into a complete four-card reconstruction storyboard
- removed the native scissors scroll observer and active-chapter state
- removed artificial vertical runway from both scenes
- retained every family route, history chapter, label, and reconstruction disclaimer
- preserved the macro examination as a direct accessible interaction

## Motion-readiness rules established

- Anime.js is not installed in this phase.
- No new motion is added.
- Static composition remains complete with all animation disabled.
- Native scrolling remains untouched.
- Motion tokens are defined for the next phase but not yet used.
- Transform targets are not required for access to content.
- Reduced-motion behavior remains mandatory.
- Utility, legal, form, and failure routes remain low-motion zones.
- Anime.js will own future family and scissors choreography rather than layering over old scroll observers.

## Protected behavior

This phase does not change:

- catalogue records
- search ranking
- exact or partial code behavior
- filters or sorting
- inquiry persistence
- quantities or notes
- manual items
- remove and undo
- attachment validation
- buyer validation and consent
- API validation
- duplicate-submission handling
- migration pipeline

## Final validation

The complete code and browser matrix passed on workflow run `29999247898`. The documentation-only follow-up also passed on workflow run `29999625780`.

Validated:

- ESLint
- strict TypeScript
- unit and catalogue-pipeline tests
- production build
- desktop and mobile Chromium
- all primary route overflow checks
- automated accessibility scans
- typography ceilings
- reviewed header proportions
- clinical intermission palette
- footer-height limits
- family and scissors runway limits
- deterministic search-command hydration
- catalogue, search, inquiry, API, and migration regressions
- screenshot generation

## Exit condition

The interface is ready for the Anime.js motion phase. Pull request #13 remains a review checkpoint and should be merged before the Anime.js branch is created from `main`.
