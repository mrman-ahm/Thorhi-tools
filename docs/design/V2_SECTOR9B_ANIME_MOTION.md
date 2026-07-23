# THROHI V2 — Sector 9B Foundational Anime.js Motion

## Purpose

Introduce the website-wide motion language after the static UI readiness audit has passed. This phase creates the movement the approved interface naturally requires. It does not include the later custom signature effects requested by the user.

## Engine

- Anime.js 4.5.0
- exact dependency pin
- scoped React integration
- route-aware initialization
- complete scope reversion on route changes and unmount
- static HTML and CSS remain the fallback

## Motion language

The system is:

- calibrated
- mechanical
- weighted
- restrained
- related to inspection and controlled manufacturing

It avoids:

- elastic or bouncy easing
- game-interface movement
- scroll hijacking
- animated blur and box-shadow
- continuous decorative loops
- per-letter splitting across long headings
- animation on dense legal paragraphs
- motion that delays focus or form input

## Route intensity

### Homepage

Highest approved foundational intensity:

- coordinated hero timeline
- staged typography
- instrument-object entrance
- technical markers on fine pointers
- section and object reveals
- division-state response
- macro readout response
- scissors-chapter response

### Catalogue

Moderate intensity:

- compact hero entrance
- product-object staggering
- filter and result group reveals
- subtle section continuity

### Search

Moderate but immediate:

- command-dialog entrance
- result staggering
- keyboard focus remains immediate
- search results page uses quiet route entrances

### Inquiry

Low intensity:

- compact route entrance
- stage and block continuity
- no animation while typing
- no animated validation text

### Utility and legal

Lowest intensity:

- route introduction
- section continuity
- no paragraph-by-paragraph animation
- failures and recovery remain immediate

## Architecture

`MotionShell` wraps the rendered route inside the existing inquiry provider.

Responsibilities:

- classify the current route
- initialize one Anime.js scope
- run route-specific entrance timelines
- observe approved reveal groups
- react to menu, search, division, macro, and chapter state changes
- disconnect observers and call `scope.revert()` during cleanup

Anime.js never pre-hides content. Every animation uses a `from` value so static content remains visible when JavaScript or the library is unavailable.

## Scroll ownership

Existing scroll-linked containers retain ownership of their transforms.

Anime.js animates internal children rather than writing inline transforms to:

- hero scroll containers
- sticky family controllers
- chapter progress controllers

Native scroll remains untouched.

## Responsive behavior

- desktop receives complete staging
- tablet uses shorter distances and timing
- mobile uses fewer elements and shorter staggers
- coarse pointers omit hero marker staging
- no pointer-only information

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- Anime.js scopes are not created
- all content is visible immediately
- no scroll translation or stagger delay runs
- existing essential state feedback remains

## Protected behavior

This phase does not alter:

- catalogue data
- search ranking
- filters and sorting
- inquiry persistence
- quantities and notes
- manual items
- remove and undo
- attachment validation
- API behavior
- migration pipeline

## Special-effects boundary

Reserved for the following phase:

- user-specified signature sequences
- advanced image-sequence behavior
- bespoke cursor or lens treatments
- unusual SVG transformations
- special closing sequence
- other effects explicitly requested after this foundational review

These effects must extend the motion shell rather than replace it.

## Validation

- dependency version contract
- scope cleanup contract
- production build
- motion initialization
- final animation states
- menu focus during animation
- search focus and keyboard operation
- route remounting
- reduced motion
- horizontal overflow
- console and hydration errors
- complete existing regression suite
- intermediate-width readiness matrix
- screenshot artifact generation
