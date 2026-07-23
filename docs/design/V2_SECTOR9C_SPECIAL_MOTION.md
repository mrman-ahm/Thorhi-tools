# THROHI V2 — Sector 9C Bespoke Surgical Motion

## Purpose

Sector 9C extends the approved Anime.js foundation with authored surgical-instrument effects. It does not replace the route-aware motion shell and does not introduce unrelated spectacle.

## Motion vocabulary

- edge
- pivot
- grip
- working end
- measurement
- engraving
- inspection light
- alignment
- controlled opening
- profile transformation

## Hero instrument

The hero SVG is divided into explicit mechanical groups:

- upper blade, shank, and ring
- lower blade, shank, and ring
- fixed pivot
- measurement system
- connector system
- brushed-steel sweep
- engraving layer

The upper and lower halves rotate around the same `447 × 460` SVG pivot. Desktop opening is capped at `4.2°` per half. Mobile opening is capped at `2.4°` per half.

The existing native scroll loop calculates one bounded progress value. Two paused Anime.js animations render the upper and lower blade rotations, and `.seek()` advances both animations to the exact same progress. This replaced the initial `onScroll()` link after browser evidence showed inconsistent SVG-group advancement in this App Router context. The parent hero retains ownership of its existing departure transform.

## Measurement and annotation

Anime.js `svg.createDrawable()` draws:

- generic measurement orbits
- calibration ticks
- axes
- connector paths

Labels are generic only:

- EDGE
- PIVOT
- GRIP
- WORKING END
- PIVOT REGION
- GRIP REGION

No numeric dimensions, materials, tolerances, certifications, or manufacturing claims are introduced.

## Brushed-steel sweep

The inspection sweep uses a clipped linear SVG or CSS gradient. It runs once during entrance or deliberate region selection.

It does not use:

- blur animation
- neon bloom
- continuous looping
- particles
- WebGL

## Division alignment

Every division state remains immediate for keyboard, pointer, and scroll users. The visual stage then assembles in this order:

1. axes
2. blade elements
3. pivot lock
4. index and copy
5. working verbs

No spring, elastic, bounce, or overshoot easing is used.

## Macro examination

Pointer tracking remains direct and is not replaced by an animated cursor.

Keyboard and touch-equivalent controls:

1. move the existing lens target
2. draw the matching connector
3. settle the reticle
4. reveal the readout through clipping and translation
5. run one restrained inspection sweep

## Scissors evolution

The desktop stage now uses one persistent reconstruction mechanism. The active chapter changes its profile rather than replacing the stage with four unrelated DOM objects.

The pivot remains fixed relative to the sticky visual stage while blade angle, overall rotation, and horizontal profile change.

Mobile continues to use complete stacked chapter reconstructions.

## Product examination

Only the dominant product-detail image stage receives:

- one inspection sweep
- one measurement-frame draw
- generic labels
- one engraved code reveal

Catalogue cards and inquiry controls remain utility-first.

## Reduced motion

Reduced-motion users receive:

- closed hero blades
- complete measurement geometry
- fully readable labels and codes
- no inspection sweep
- no scroll-linked transforms
- static evolution reconstructions
- unchanged task behavior

## Prohibited effects

- 3D assets
- WebGL
- magnetic buttons
- cursor trails
- particles
- liquid distortion
- glitch text
- typewriter codes
- elastic easing
- bouncing
- animated blur
- continuous decorative loops
- scroll hijacking

## Ownership

Component-owned Anime.js scopes:

- `HeroExperience`
- `DiscoveryExperience`
- `MacroInspectionScene`
- `ScissorsEvolutionScene`
- `ProductExaminationMotion`

The global `MotionShell` no longer observes division, macro, or evolution state changes. This prevents competing timelines.

Every scope uses `scope.revert()` during cleanup.

## Evidence-backed corrections

1. The initial `onScroll()` SVG-group link did not advance reliably in Chromium. It was replaced with deterministic Anime.js `.seek()` synchronization driven by the existing native scroll loop.
2. Evolution pivot validation originally used viewport coordinates while the sticky stage was engaging. The invariant is now measured relative to the visual stage.
3. Browser contracts now read Anime.js individual CSS `rotate` properties as well as combined transform matrices.
4. Independent keyboard-shortcut checks wait for the previous dialog close state before testing the next shortcut.

## Validation

- source contracts
- small-angle limit
- pivot transform stability
- generic annotation language
- engraving completion
- macro connector state
- one persistent evolution mechanism
- product inquiry immediacy
- reduced motion
- mobile intensity
- accessibility
- overflow
- successful review video and motion-state stills
- complete existing test suite
