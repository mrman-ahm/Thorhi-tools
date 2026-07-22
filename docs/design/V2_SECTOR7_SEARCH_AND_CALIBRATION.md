# THROHI V2 — Sector 7 Search and Visual Calibration

## Scope

Sector 7 adds the global catalogue command, redesigns the full search route, and performs a restrained visual calibration across the approved V2 system.

It does not redesign inquiry/utility pages, add Easter eggs, add final photography, or introduce 3D.

## Visual calibration

The approved design remains dark, editorial, green-led, and instrument-focused. This phase reduces the places where that language became too severe or too close to a design/game studio.

### Adjustments

- Selected display headings reduced by approximately 5–8%.
- Tall catalogue and discovery sections shortened slightly.
- Controls receive small professional radii rather than hard zero-radius geometry.
- Major panels receive restrained 10–14px radii and pale top-edge highlights.
- Green-blue reflections brighten instrument and catalogue surfaces.
- Product grids use modest gaps rather than appearing as one hard technical matrix.
- Bright recovery areas use pale mint rather than another black panel.

### Boundaries

- Body copy, codes, forms, and touch targets are not reduced.
- Green remains the dominant signal color.
- Blue remains technical.
- Orange remains rare.
- No glassmorphism, constant neon glow, excessive blur, or consumer-card softness.
- The system must still feel surgical and precise.

## Global catalogue command

The command is available through:

- Header search control
- Search route inside the full-screen menu
- `Ctrl/Command + K`
- `/` when focus is not inside a typing control

### Behavior

- Opens as an accessible modal dialog.
- Search field receives focus immediately.
- Escape closes and restores prior focus.
- Tab stays within the dialog.
- Arrow Up and Arrow Down change the active result.
- Enter opens the active product when the input owns focus.
- Six ranked previews use the existing `searchProducts` implementation.
- Match reasons remain visible.
- Full-search and manual-inquiry recovery remain available.

## Match hierarchy

- Exact code: green
- Code prefix / partial code: blue
- Product name / alias: soft green
- Family / division context: neutral pale tone
- Manual recovery: restrained orange

The colors explain result type; they do not change ranking.

## Full search route

The server-rendered route remains the source of truth for:

- Query
- Division filter
- Family filter
- Relevance sorting
- Product-code sorting
- Result count
- Empty state

The page presents ranked result objects with reason and score metadata while preserving normal product cards and inquiry actions.

## Accessibility

- Semantic dialog and combobox relationships.
- Focus restoration and keyboard operation.
- Live result-count announcement.
- Visible focus states.
- Static reduced-motion behavior.
- No search information is available only through color.
- Manual recovery is always reachable.

## Protected behavior

Sector 7 does not change:

- Search scoring
- Catalogue records
- Exact/partial code normalization
- Filter semantics
- Product routes
- Inquiry persistence
- Quantity and note behavior
- API validation
- Migration pipeline
