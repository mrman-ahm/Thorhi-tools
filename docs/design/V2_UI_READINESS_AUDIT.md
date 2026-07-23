# THROHI V2 — UI Readiness Audit Before Anime.js

## Purpose

This phase reviews and corrects the complete approved interface before a heavy Anime.js motion pass. Motion must strengthen an already coherent interface; it must not hide weak composition, poor color choices, excessive scale, clipped content, or inconsistent component styling.

No Anime.js dependency is added in this phase.

## Baseline

The audit begins after the merged completion of:

- V2 static composition
- typography, color, and material identity
- navigation and hero interaction
- division and family discovery
- macro examination and scissors evolution
- catalogue redesign
- command search and visual calibration
- inquiry and utility redesign

Protected logic remains unchanged:

- catalogue records and routes
- search ranking
- filters and sorting
- inquiry persistence
- quantities and notes
- removal and undo
- attachments and consent
- API validation
- duplicate submission handling
- migration pipeline

## Audit findings

### Major — excessive CSS layering

The interface is currently assembled through the original foundation plus multiple sector and correction stylesheets. Rewriting all approved styles would introduce unnecessary regression risk, but adding motion directly on top would make selector ownership unclear.

**Correction:** add one final `v2-motion-readiness.css` layer, loaded last. It defines the authoritative pre-motion scale, spacing, surfaces, radii, clipping, accent restraint, and reduced-motion contract.

### Major — global clipping would hide entrance motion

An earlier review fix applied horizontal clipping to `main`, every `section`, and the footer. That is safe for static overflow, but it would cut off legitimate Anime.js entrance and exit transforms.

**Correction:** clipping is now limited to intentional visual stages. The document root remains horizontally protected while normal sections permit controlled motion outside their own bounds.

### Major — permanent `will-change`

The family track and several interactive objects retained permanent compositor hints. Permanent `will-change` can waste memory and creates stale layers before an animation engine even starts.

**Correction:** all pre-motion `will-change` values return to `auto`. Anime.js may apply compositor promotion only while a scene is active.

### Major — static hierarchy still carrying too much weight

Several display headings and section paddings remained larger than necessary because the static interface had to create all emotional emphasis by itself.

**Correction:** hero, section, division, function, family, macro, evolution, catalogue, product, utility, contact, and footer scales receive a restrained final reduction. Body text, product codes, form text, and touch targets are not reduced.

### Major — inactive content too faint

Inactive division entries used 40% opacity. This is visually dramatic, but information should remain comfortably readable before motion and should never depend on active scroll state.

**Correction:** inactive division opacity increases to 62%. Active state still receives emphasis through color, border, and position.

### Major — dark surfaces carried too many effects simultaneously

Some dark scenes combined grain, multiple radial glows, technical grids, blue reflections, green reflections, and heavy shadows. Adding motion to all of those would make the site feel noisy and closer to a game interface.

**Correction:** persistent body grain is removed, object backgrounds use fewer glow layers, placeholder grids are quieter, and large dark cards use lighter shadows.

### Major — oversaturated bright command scene

The catalogue command scene was an intense saturated green gradient. It worked as a static interruption, but animation would make the saturation overpower adjacent scenes.

**Correction:** the scene moves to a pale mint/green material with dark text. It remains memorable while becoming more professional and motion-friendly.

### Major — utility surfaces needed one consistent light palette

Inquiry, evidence, resources, and legal sections used related but slightly different pale greens and accent values.

**Correction:** light utility surfaces now share one base and raised surface palette. Dark surgical green is used for small labels on pale backgrounds.

### Minor — shape language

Controls and panels had accumulated radii from 0 to 14 pixels.

**Correction:** final motion-ready values are:

- controls: 8 px
- panels: 12 px
- large dialogs/media: 18 px

This remains precise without appearing sharp or game-like.

### Minor — accent competition

Green, blue, orange, and coral were occasionally equally bright in adjacent scenes.

**Correction:** green remains primary, blue remains technical, orange is softened, and coral is slightly warmer. Large display accents use calmer green and blue values than focus and action states.

## Motion-zone map

Only explicit `data-motion-zone` elements are eligible for the Anime.js narrative system.

### Anime.js narrative zones

- `hero`
- `divisions`
- `functions`
- `families`
- `macro-inspection`
- `scissors-evolution`
- `catalogue-command`
- `catalogue-objects`
- `inquiry-intro`
- `evidence`
- `closing`

### CSS or existing React interaction only

- navigation focus and hover
- search command dialog controls
- filters and sort controls
- code-copy feedback
- quantity controls
- inquiry persistence and undo
- form validation
- attachment feedback
- accessible menus and disclosures

### Static or minimal-motion content

- inquiry form fields
- live regions
- error and warning messages
- consent
- legal content
- privacy and terms
- direct contact information
- pending evidence labels
- success references
- 404 recovery actions

## Attribute contract

- `data-motion-zone` identifies a scoped scene.
- `data-motion-policy="anime"` permits the Anime.js scene controller.
- `data-motion-item` identifies presentational children.
- `data-motion-group` identifies a controlled stagger collection.
- `data-motion-static` excludes an interactive or status element from transform-based choreography.

Anime.js must never query broad selectors such as all headings, all sections, or all buttons.

## Reduced-motion contract

When `prefers-reduced-motion: reduce` is active:

- native scrolling remains unsmoothed
- all motion zones and items remain visible
- transforms, opacity changes, and filters are removed
- transition and animation durations collapse to effectively zero
- sticky storytelling scenes fall back to their already validated static/mobile layouts
- no content becomes unavailable

## Mobile contract

- mobile does not inherit desktop pinned timelines mechanically
- pointer-following behavior remains disabled for coarse input
- division and family discovery remain stacked and direct
- scissors evolution remains a chapter sequence
- forms, filters, and inquiry controls do not receive entrance choreography that delays interaction

## Anime.js adoption gate

Anime.js may be installed only after this phase passes:

- lint
- strict TypeScript
- unit tests
- production build
- desktop and mobile browser tests
- motion-zone contract tests
- reduced-motion tests
- accessibility scans
- overflow checks
- final screenshot review

## Known external dependencies

The UI is motion-ready with placeholders, but final visual quality still depends on:

- approved hero instrument image
- division imagery
- macro instrument image
- scissors evolution frames or reconstructions
- final product photography
- approved vector logo
- verified company evidence and real documents
