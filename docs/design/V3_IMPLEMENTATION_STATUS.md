# THROHI V3 — Implementation Status

> **DO NOT MERGE.** This branch is an isolated visual experiment. It must not be merged, rebased, squashed, or cherry-picked into production unless the repository owner explicitly changes that instruction.

## Branch

- Branch: `experiment/v3-surgical-editorial-glass`
- Base branch: `main`
- Base commit: `1347b221cc436b26614cb5b4b7d2da97edadd650`
- Pull request: intentionally not created
- Production impact: none

## Completed phases

### Phase 0 — Audit and reference decisions

Completed:

- repository and architecture audit
- protected behavior inventory
- source-media contract
- visual risk inventory
- proposed route architecture
- component-reference matrix
- explicit rejection of globes, WebGL/WebGPU cursor effects, theme-toggle gimmicks, avatar systems, production 3D carousel, and duplicate motion engines

Primary documents:

- `docs/design/V3_GLASS_EDITORIAL_AUDIT.md`
- `docs/design/V3_COMPONENT_REFERENCE_MATRIX.md`

### Phase 1 — Optical Precision design system

Completed:

- Archivo / Instrument Sans / IBM Plex Mono ownership correction
- optical, smoked, clear, and clinical glass materials
- restrained raised and inset machined surfaces
- surgical green, technical blue, clinical mint, warm white, steel, orange, and coral tokens
- accessible field, button, readout, section-index, and surface primitives
- reduced-motion and reduced-transparency fallbacks
- mobile blur and shadow reductions
- global smooth scrolling removed

Primary files:

- `src/app/v3-optical-system.css`
- `src/components/v3/optical-primitives.tsx`

### Phase 2 — Navigation, cinematic, and hero

Completed:

- smoked floating navigation
- official THROHI identity retained
- existing opening video source retained
- existing rigid cover-slide interaction retained
- Save-Data static cinematic path
- lighter sentence-case editorial hero
- optical identity chamber
- direct catalogue and inquiry actions
- recessed catalogue-command field
- no wheel interception
- no cursor replacement

Primary files:

- `src/app/v3-cinematic-hero.css`
- `src/components/cinematic-entry.tsx`
- `src/components/hero-experience.tsx`

### Phase 3 — Complete homepage reconstruction

Completed:

- precision division index
- working-function archive
- family archive in normal document flow
- artificial horizontal-scroll runway removed
- macro inspection restyled as optical examination
- protected 260-frame evolution restyled
- catalogue command
- catalogue object preview
- structured inquiry explanation
- verification/document archive
- surgical-light closing scene
- quiet evidence-led footer

Primary files:

- `src/components/discovery-experience.tsx`
- `src/components/v3/homepage-utility-chapters.tsx`
- `src/app/page.tsx`
- `src/app/v3-home-chapters.css`
- `src/components/site-footer.tsx`

### Phase 4 — Catalogue, search, and product detail

Completed:

- products landing visual system
- division route visual system
- family listing and filters
- product examination layout
- product-code hierarchy
- ranked search results
- global search-command redesign
- manual-inquiry recovery
- accessible typed quantity input with increment and decrement controls
- document verification states
- responsive native mobile filter disclosure

Primary files:

- `src/app/v3-catalogue-system.css`
- `src/components/catalogue-ui.tsx`
- existing products, division, family, product, and search routes remain functionally intact

### Phase 5 — Inquiry and supporting routes

Completed:

- clinical inquiry workspace
- product rows, quantities, notes, removal, and undo
- manual items
- requirements and attachment metadata
- buyer details and consent
- sticky final review
- company evidence page
- resources archive
- contact guidance
- readable legal pages
- truthful development confirmation page

Primary file:

- `src/app/v3-utility-routes.css`

### Phase 6 — Responsive, motion, and performance hardening

Completed:

- duplicate homepage motion ownership removed from `MotionShell`
- Save-Data detection
- document-visibility restraint
- offscreen evolution rendering pause
- rAF-batched evolution updates
- smaller evolution sprite and lower DPR under Save-Data
- conditional compositor hints
- content visibility and containment
- mobile blur reduction
- reduced-motion static scenes
- reduced-transparency solid surfaces

Primary files:

- `src/components/motion-shell.tsx`
- `src/components/frame-evolution-scene.tsx`
- `src/app/v3-performance-hardening.css`

### Phase 7 — Canonical data and final interaction polish

Completed:

- homepage product objects now come from the canonical `src/lib/catalogue.ts` records
- homepage product cards now open real division/family/product routes
- duplicate homepage-only product definitions removed
- saved inquiry summary remains connected to the same canonical product codes
- temporary homepage card assumptions neutralized after canonical `ProductCard` adoption
- active division preview no longer uses false `aria-current="page"` semantics
- active division changes on mouse hover and keyboard focus, not touch hover
- noisy hover-driven live-region announcements removed
- consistent visible focus treatment across V3 routes
- higher-contrast and forced-colour fallbacks
- hover elevation disabled on non-hover devices
- route anchors receive header-safe scroll margins
- final card behavior hardened at desktop, tablet, and mobile breakpoints

Primary files:

- `src/components/catalogue-preview.tsx`
- `src/app/page.tsx`
- `src/components/discovery-experience.tsx`
- `src/app/v3-final-polish.css`

## Protected source media

The branch does not modify the approved source-media files.

Protected behavior and references remain:

- `/brand/throhi-logo-clean.webp`
- `/media/sector9d/manifest.json`
- approved opening video
- 260-frame scissors-evolution source
- desktop and mobile sprite descriptors
- one-canvas evolution renderer
- rendered-frame-driven chapter synchronization

## Test coverage added

Static contract tests:

- `tests/v3-optical-system.test.mjs`
- `tests/v3-cinematic-hero.test.mjs`
- `tests/v3-home-chapters.test.mjs`
- `tests/v3-catalogue-system.test.mjs`
- `tests/v3-utility-routes.test.mjs`
- `tests/v3-performance-hardening.test.mjs`

Browser review updates:

- homepage assertions updated for V3 copy
- canonical homepage product-route verification
- canonical inquiry-state persistence verification
- desktop, tablet, and mobile Playwright projects
- full-page screenshots for homepage and principal catalogue/utility routes
- native mobile filter disclosure
- product quantity boundaries
- search-command focus restoration
- Save-Data cinematic path
- one-canvas evolution contract
- minimum mobile touch targets
- 200% text-size overflow check

## Continuous validation

The branch is included in `.github/workflows/quality.yml` for push-based validation.

The workflow runs:

1. dependency installation
2. ESLint
3. strict TypeScript
4. Node contract tests
5. production build
6. Chromium installation
7. Playwright desktop, tablet, and mobile tests
8. browser artifact upload

Concurrency cancels superseded runs on the same branch so only the latest V3 commit continues.

## Validation honesty

This environment cannot currently resolve `github.com` from the local container, so the repository could not be cloned locally and the commands have not been executed inside this chat runtime.

The GitHub connector available here exposes commit status records but not the push-triggered Actions check-run stream used by this workflow. Do not claim a successful build until the branch workflow itself reports completion in GitHub Actions.

The branch contains the validation workflow and tests required to expose failures rather than conceal them.

## Final review gate

Before calling the experiment visually complete, review the generated artifacts for:

- glass contrast over the brightest and darkest video frames
- mobile header and menu geometry
- hero balance at 1024 × 768
- canonical homepage cards at 390 × 844
- catalogue cards at 390 × 844
- family filter disclosure
- product quantity control
- inquiry form at 200% text size
- evolution-frame sharpness and copy synchronization
- unexpected horizontal overflow
- excessive empty scroll distance
- heavy blur on mobile hardware
- visual resemblance to a component showcase
- unsupported company or product claims

## Merge status

**Blocked by instruction.**

Even after all tests pass, this branch remains a standalone experiment. No pull request should be opened and no merge action should be taken without a new explicit instruction from the repository owner.
