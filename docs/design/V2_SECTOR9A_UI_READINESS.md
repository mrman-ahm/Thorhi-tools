# THROHI V2 — Sector 9A UI Readiness Audit

## Purpose

This phase reviews and corrects the complete static interface before Anime.js motion is introduced. Motion is not allowed to compensate for weak hierarchy, inconsistent spacing, unreadable scale, poor color relationships, or unstable responsive layouts.

## Audit scope

- homepage
- products landing
- division routes
- family listings
- product detail
- global search command
- search results
- inquiry
- company
- resources
- contact
- privacy and terms
- success and recovery states
- 404

## Problems identified

1. Several internal-page heroes retained homepage-scale typography.
2. Green was sometimes used simultaneously for display type, controls, borders, and glows, reducing hierarchy.
3. Repeated near-black sections made long routes visually monotonous.
4. Bright editorial intermissions used inconsistent spacing and scale.
5. Product placeholders and technical graphics occasionally competed with content.
6. Utility pages were calmer than catalogue and search routes, creating uneven brand intensity.
7. Excessive uppercase display treatment flattened the voice across functional pages.
8. Existing automated coverage emphasized 1440px and 390px, leaving intermediate widths insufficiently reviewed.

## Corrections

- introduced one final display-size ceiling
- reduced internal-page hero scale
- normalized section spacing
- reserved electric green for emphasis and active state rather than every hierarchy level
- reduced decorative glow and placeholder-grid opacity
- strengthened pale/dark section alternation
- softened controls and panel radii consistently
- changed selected functional headings from uppercase to natural case
- reduced command-search HUD styling
- normalized inquiry and utility density
- added stable transform origins for the future motion layer
- added 1280, 1024, 768, 430, and 360 responsive audit coverage

## Motion-readiness rules

Anime.js may be introduced only after this phase passes.

The future motion layer must:

- animate only approved stable wrappers
- preserve native scrolling
- avoid layout-changing properties
- use transform, opacity, clip, SVG, and color where practical
- retain complete reduced-motion layouts
- avoid motion on legal, error, and dense form content
- avoid increasing the scale of already dominant typography
- preserve keyboard, touch, and screen-reader behavior

## Protected behavior

This phase does not alter:

- catalogue records
- search ranking
- filters or sorting
- inquiry persistence
- quantity and notes
- manual items
- remove and undo
- attachment validation
- API behavior
- migration pipeline

## Validation

Required before approval:

- ESLint
- strict TypeScript
- unit and pipeline tests
- production build
- complete Playwright matrix
- representative routes at 1280, 1024, 768, 430, and 360 widths
- accessibility scans
- overflow checks
- reduced-motion composition
- screenshot inspection

## Status

Static UI readiness work only. Anime.js is intentionally not installed in this phase.
