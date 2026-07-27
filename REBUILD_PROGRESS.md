# THROHI Rebuild — Progress Ledger

This file records implementation progress only. Approved decisions remain in `PROJECT_STATE.md`.

## Branch

`rebuild/surgical-contrast`

No pull request is open. The Quality workflow currently runs for pull requests and pushes to `main` or the former production branch, so ordinary pushes to this rebuild branch do not trigger GitHub Actions.

## Milestone 01 — Structural browser prototype

**Status:** completed and reviewed

### Delivered

- Isolated `/rebuild-preview` route that does not replace or modify the current public homepage.
- Responsive Surgical Contrast homepage study.
- Early catalogue search and four-division entry structure.
- Catalogue hub study with desktop filters and a mobile filter entry point.
- Product-family study using Operating Scissors and twelve verified variants.
- Responsive header and mobile navigation study.
- Real THROHI logo and existing catalogue image assets.

### Corrections made during review

- Moved the primary mobile actions before the hero instrument so they remain visible in the first viewport.
- Removed unrelated product imagery from Veterinary and Beauty routes.
- Replaced unsupported Veterinary and Beauty catalogue depth with truthful contact routes.
- Added a visible mobile filter control.
- Replaced illustrative product variants with verified Operating Scissors records.
- Removed public-looking internal placeholder and verification language.
- Checked the static browser study for horizontal overflow at desktop and mobile widths.

### Validation completed

- Static desktop and mobile browser rendering.
- Visual review of homepage, catalogue, and product-family compositions.
- TypeScript/TSX syntax transpilation with zero syntax diagnostics.
- Re-read committed preview files from GitHub after creation.

### Not yet claimed

- Full Next.js production build.
- ESLint, repository typecheck, unit tests, or Playwright suite on the branch.
- Cross-browser production validation.
- Accessibility audit of the integrated route.
- Performance measurement.

Those checks will be batched before the first intentional pull request and CI run.

## Milestone 02 — Shared rebuild foundation

**Status:** active

### Scope

- Extract approved navigation into one shared data source.
- Extract verified preview catalogue records into one shared data source.
- Build the reusable production header without changing the existing site header yet.
- Preserve the existing InquiryProvider and search command behaviours while restyling them later.
- Define the reusable Surgical Contrast visual tokens and responsive rules.
- Refactor the isolated preview to consume the shared foundation.

### Exit criteria

- No duplicated navigation labels or division routes.
- No duplicated verified sample product data.
- Header supports keyboard access, Escape, focus restoration, mobile navigation, search, Inquiry List count, and Products division routes.
- Preview remains isolated from production pages.
- All new TS/TSX files pass local syntax validation before the first CI batch.
