# Rendered Visual QA Refinement Design

## Status

Approved for implementation under the standing Milestone 6 premium-design direction.

A public preview for `design/surgical-precision-archive` is not currently discoverable, and the branch has no deployment workflow run. The implementation therefore uses route-source composition review, explicit viewport contracts, and stable data markers now. Screenshot inspection remains a later runtime gate when a preview exists.

## Goal

Refine the premium rebuild so its typography, vertical composition, information density, and responsive placement remain deliberate at 1440 × 1000, 1280 × 800, 768 × 1024, 390 × 844, and 320 × 700.

## Chosen direction

Use a scoped visual-QA layer attached to `RebuildShell`, supported by stable route markers. This keeps the corrections coherent and avoids risky full rewrites of mature route CSS modules.

## Defects identified by source composition review

1. Several sections still calculate against the former 72px/64px header rather than the current 80px/66px premium shell.
2. Product examination content can exceed a 1280 × 800 first viewport before the core identity/actions become visible.
3. Homepage section titles and family names still use the old display face after the hero switches to the regal system.
4. Important catalogue, product, and inquiry status labels remain at approximately 9–11px.
5. Dense technical labels and helper text do not consistently distinguish essential procurement information from secondary index notation.
6. The catalogue and inquiry mastheads are visually strong but need tighter laptop-scale height discipline.
7. Mobile actions and technical ledgers need more consistent readable sizing without becoming oversized.

## Typography rules

- Cormorant Garamond remains the display face for primary and secondary editorial headings, product names, instrument-family titles, and major empty-state headings.
- Instrument Sans remains the body, form, navigation, and action face.
- IBM Plex Mono remains limited to codes, counters, concise statuses, and technical references.
- Essential labels, states, filter headings, field labels, and action text must render at 12px or larger.
- Secondary index notation may render at 11px only when adjacent content communicates the same meaning.
- Body and helper copy must not render below 14px.

## Composition rules

### Homepage

- Align the hero divider with the 80px desktop header.
- Keep the hero commanding but avoid forcing the search and summary below a laptop viewport unnecessarily.
- Apply the regal hierarchy to division, selected-family, company, and utility headings.
- Make division state, product code, family state, and catalogue helper text comfortably readable.
- Preserve one-column narrow-mobile product records.

### Catalogue

- Preserve the existing masthead and procurement ledger.
- Tighten masthead height on laptop screens while keeping the specimen visible.
- Raise specimen labels, masthead ledger labels, filter labels, source-boundary text, toolbar metadata, and search controls to readable minimums.
- Preserve filter density and 24-item pagination.

### Product examination

- Offset content for the 80px/66px header.
- Keep media and identity/action surfaces inside a disciplined first laptop viewport where possible.
- Raise return context, stage references, source ledger, variant metadata, and action labels.
- Preserve image prominence and the asymmetric examination composition.

### Inquiry desk

- Preserve the four-stage masthead and sticky desktop review desk.
- Raise stage labels, section metadata, product identity labels, field labels, helpers, review ledger labels, and error copy.
- Use the regal face consistently for section and empty-state headings.
- Preserve the current responsive grid and all submission behavior.

## Motion and accessibility

- No new entrance animation.
- Hover movement remains restrained and is disabled in reduced-motion mode.
- Focus outlines, high-contrast mode, forced colors, and minimum control heights remain authoritative.
- No horizontal overflow at the five target viewport sizes.

## Implementation boundary

Allowed:

- stable `data-*` visual markers;
- one route-scoped visual-QA CSS module;
- small corrections to existing route CSS where pseudo-elements or intrinsic layout cannot be safely overridden;
- source and Playwright contracts;
- project-state documentation.

Not allowed:

- catalogue behavior changes;
- inquiry behavior changes;
- invented business copy;
- removal of source/truth boundaries;
- public route changes;
- deployment, PR, merge, or indexing activation.

## Verification

The Milestone 6 gate will add a focused visual-QA browser suite covering:

- 1280 × 800 first-viewport composition;
- heading font families;
- essential label minimum sizes;
- header/content offsets;
- action visibility;
- 320–1440px overflow;
- reduced motion.

Runtime and screenshot success must not be claimed until executed in a real checkout or preview.