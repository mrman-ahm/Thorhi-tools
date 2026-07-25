# THROHI V3 — Surgical Editorial Glass Audit

## Branch status

- Branch: `experiment/v3-surgical-editorial-glass`
- Base: `main` at `1347b221cc436b26614cb5b4b7d2da97edadd650`
- Intent: isolated visual experiment
- Merge policy: do not merge, rebase, squash, or cherry-pick this branch into production unless the owner explicitly reverses that decision
- Source media policy: preserve all approved images, the opening MP4, the cleaned THROHI logo, and the complete 260-frame evolution source unchanged

## Current technical foundation

The project is a Next.js 15.4.4 / React 19.1 application with Anime.js 4.5.0, TypeScript, Sharp, Playwright, and Axe. The application already has route-aware motion, catalogue search, product routes, inquiry state, validation, accessibility contracts, and a build-time cinematic media pipeline.

Primary runtime ownership:

- `src/app/layout.tsx`
  - root metadata and fonts
  - `InquiryProvider`
  - global `MotionShell`
  - global `SearchCommand`
  - a long cascade of V2 CSS layers
- `src/app/page.tsx`
  - opening cinematic
  - homepage hero
  - division/function/family discovery
  - macro inspection
  - 260-frame evolution
  - catalogue command
  - catalogue preview
  - inquiry explanation
  - evidence/document section
  - closing contact stage
- `src/components/cinematic-entry.tsx`
  - manifest fetch
  - video playback and fallback
  - native-scroll cover removal
  - body/header handoff event
- `src/components/hero-experience.tsx`
  - hero scroll progress
  - logo-stage animation
  - catalogue search
- `src/components/discovery-experience.tsx`
  - active division observation
  - division mechanism animation
  - function routes
  - horizontally translated family archive
- `src/components/frame-evolution-scene.tsx`
  - lazy sprite loading
  - one-canvas renderer
  - responsive sprite selection
  - rendered-frame-controlled chapter copy
- `src/components/motion-shell.tsx`
  - route-aware entrance and intersection motion
  - menu and search-command motion
  - broad global selector ownership

## Protected functional contract

The following behavior is immutable throughout V3:

- all existing routes
- catalogue records, codes, divisions, families, filters, and sorting
- exact and partial product-code search
- keyboard search shortcuts and focus restoration
- product detail routes and related-product navigation
- quantities, notes, manual items, attachments, and buyer fields
- inquiry persistence, remove, undo, validation, and duplicate-submission protection
- error, recovery, legal, contact, resources, company, and confirmation routes
- keyboard, touch, reduced-motion, and screen-reader behavior
- verified-content restrictions

No visual decision may invent certifications, materials, production capacity, export reach, OEM capability, delivery promises, history, awards, customer counts, regulatory approvals, or contact facts.

## Source-media contract

### Opening cinematic

The current cover is structurally valuable and must remain:

- a 200svh section with a sticky full-viewport cover
- native scrolling only
- no wheel interception
- no opacity fade during removal
- the homepage already present beneath the moving cover
- a complete reduced-motion fallback

V3 may redesign the overlay, edge, copy, and scroll indicator. It must not modify or recompress the source video.

### Evolution sequence

The evolution implementation is protected:

- exactly 260 source frames
- one canvas
- responsive desktop/mobile sprite descriptors
- current frame-to-chapter boundaries
- copy driven by the rendered frame, not raw scroll percentage
- high-quality smoothing
- deferred media loading

V3 may redesign the stage, copy pane, readout, timeline, and responsive composition. It must not replace the renderer with 260 DOM images or fabricate frames.

### Brand identity

`public/brand/throhi-logo-clean.webp` remains the official identity. Decorative abbreviations may appear only as secondary art direction and never replace the official logo.

## Current design-system problems

### 1. CSS layer accumulation

`src/app/layout.tsx` imports a long sequence of V2 sector CSS files. Later files correct earlier files, creating specificity pressure and uncertain ownership. V3 should introduce one explicit layer after all legacy files, then progressively migrate components into V3 primitives instead of adding another chain of patch files.

### 2. Font-token mismatch

The root layout loads Archivo, Instrument Sans, and IBM Plex Mono, but `globals.css` still points display and body tokens toward `--font-manrope`. The browser falls back to Arial in places where the intended fonts should be authoritative.

V3 should define:

- display: Archivo Variable
- body/interface: Instrument Sans
- technical metadata: IBM Plex Mono

### 3. Aggressive typography

The current homepage frequently uses:

- uppercase display copy
- 700–750 weights
- very tight negative tracking
- headings reaching approximately 8–10.5rem
- line heights below 0.8

This creates the game/design-studio character previously rejected. V3 should use sentence case, 500–600 display weights, calmer tracking, and smaller route-specific ceilings.

### 4. Flat darkness

The current interface remains dark for long stretches. Green, blue, orange, grids, axes, and technical lines compete for attention simultaneously. V3 requires intentional alternation among smoked optical chapters, warm-white editorial fields, and pale clinical glass.

### 5. Placeholder geometry competes with real media

Several homepage scenes use abstract blades, rings, axes, grids, and generated product-object geometry. The V3 hierarchy must place approved images and instruments above decorative mechanisms. Geometry becomes annotation rather than the subject.

### 6. Repeated motion ownership

`HeroExperience` animates the hero locally while `MotionShell` also targets hero words, hero object parts, search, and supporting copy. The two systems can overlap or compete. V3 will make component-local motion authoritative for bespoke scenes and reserve `MotionShell` for quiet route/section entrances.

### 7. Artificial family travel

The current family archive calculates a tall vertical runway and translates a horizontal track. Although native scroll is preserved, the interaction reserves substantial travel and can feel like a portfolio device. V3 should replace it with an accessible editorial archive using normal document flow, layered shelves, or a controlled sticky index without an artificial spacer.

### 8. Global smooth scrolling

`html { scroll-behavior: smooth; }` applies motion to all anchor and programmatic navigation. V3 should return the global document to native `auto` behavior and use explicit, reduced-motion-aware smooth behavior only for the cinematic entry control where appropriate.

### 9. Permanent compositor hint

The cinematic refinement applies permanent `will-change: transform` to the sticky cover. V3 should apply compositor hints only while the cover is active and remove them after clearing.

### 10. Blur and glass discipline

The header already uses backdrop blur, but no systematic material model exists. V3 must distinguish smoked navigation glass, optical media glass, pale clinical glass, and recessed machined controls. Blur cannot become a default card effect.

## V3 visual thesis

### Name

**THROHI Optical Precision System**

### Character

- surgical editorial glass
- physically plausible optical depth
- polished steel and clinical translucency
- restrained machined neumorphism
- elegant typography
- asymmetric editorial composition
- real product imagery as the authority
- motion connected to instrument mechanics

### Rejection criteria

The result must not resemble:

- crypto or AI startup UI
- gaming HUD
- generic SaaS dashboard
- design-agency component showcase
- neon cyberpunk
- claymorphism
- retail checkout
- WebGL experiment

## Proposed information architecture

### Homepage

0. Opening cinematic cover
1. Optical editorial handoff hero
2. Precision division index
3. Working-function archive
4. Instrument-family archive
5. Macro examination
6. 260-frame scissors evolution
7. Catalogue command
8. Structured-inquiry path
9. Verification and documents
10. Surgical-light closing composition
11. Quiet footer

### Catalogue routes

- calm products landing
- division pages with restrained atmosphere
- efficient family listings
- product examination pages led by real imagery
- one coherent product-code search language
- direct manual-inquiry recovery

### Inquiry and supporting routes

- pale clinical work surfaces
- shallow machined controls
- restrained glass summary panels
- evidence-first company/resources/contact pages
- typography-first legal pages
- immediate and honest success/error recovery

## Proposed V3 primitives

- `OpticalPanel`
- `SmokedGlassPanel`
- `ClinicalGlassPanel`
- `MachinedField`
- `TechnicalReadout`
- `ProductCode`
- `SurgicalButton`
- `LiquidPrimaryAction`
- `QuietSecondaryAction`
- `CatalogueObject`
- `ProductMediaStage`
- `SectionIndex`
- `VerificationStatus`
- `InquiryQuantityControl`
- `TechnicalAccordion`
- `InstrumentAnnotation`
- `GlassNavigation`
- `RouteIntroduction`

These must use semantic variants rather than many boolean props.

## Token direction

V3 will introduce dedicated variables without immediately deleting legacy tokens:

- carbon and graphite surfaces
- warm white and clinical mint
- surgical green and technical blue
- precision steel neutrals
- rare orange/coral signals
- optical borders and internal highlights
- shallow raised and inset shadows
- dark, pale, clear, and smoked glass materials
- route-specific heading scales
- responsive blur and shadow reductions

## Motion architecture decision

- Anime.js remains the sole authored animation engine.
- Bespoke scenes own their local timelines and cleanup.
- `MotionShell` becomes a quiet route/reveal layer only.
- No Framer Motion, GSAP, WebGL, WebGPU, magnetic cursor, or scroll-hijacking dependency.
- Decorative motion pauses when hidden or outside the viewport.
- Save-Data, coarse-pointer, constrained-device, and reduced-motion paths receive simplified static compositions.

## Performance risks to control

- simultaneous backdrop-filter layers
- large translucent surfaces over video
- permanent canvas animation
- excessive device-pixel ratio
- repeated media requests
- broad MutationObserver ownership
- permanent `will-change`
- large mobile shadows
- unnecessary client components
- source image upscaling beyond catalogue quality

## Accessibility risks to control

- contrast variability over video and imagery
- neumorphic controls relying on shadows alone
- inactive-state opacity
- focus rings disappearing over translucent surfaces
- floating labels at 200% text zoom
- hover-only inspection controls
- unlabelled quantity buttons
- reduced-motion content becoming incomplete

## Phased implementation

### Phase 0 — Audit and reference decisions

This document plus `V3_COMPONENT_REFERENCE_MATRIX.md`.

### Phase 1 — Tokens and primitives

Add the V3 material system, typography corrections, semantic panel/button/field primitives, responsive degradation, and reduced-motion foundation without restructuring pages.

### Phase 2 — Navigation, cinematic, and hero

Preserve source media while rebuilding the visual handoff and editorial hero.

### Phase 3 — Homepage chapters

Reconstruct division, function, family, macro, evolution, command, inquiry, evidence, closing, and footer chapters.

### Phase 4 — Catalogue and search

Apply the same system to products, divisions, families, product detail, search command, and search results.

### Phase 5 — Inquiry and utility routes

Complete the procurement workflow and supporting pages.

### Phase 6 — Responsive, motion, and performance hardening

Simplify mobile materials, verify Save-Data/reduced-motion behavior, eliminate ownership overlap, and protect media performance.

### Phase 7 — Final review gate

Complete screenshots, accessibility, performance, regression, and source-media verification. The branch remains experimental and unmerged.
