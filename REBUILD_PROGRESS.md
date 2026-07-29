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

## Milestone 02 — Shared Surgical Contrast foundation

**Status:** completed

### Delivered

- Approved navigation extracted into one shared data source.
- Verified preview catalogue records extracted into one shared data source.
- Reusable production header created without replacing the existing public header.
- Existing InquiryProvider and search command behaviour retained for later integration.
- Preview refactored into focused route components.
- Unified Surgical Contrast visual roles applied to the preview and reusable header.
- Instrument Sans assigned to display typography, Archivo to interface and body copy, and IBM Plex Mono to product codes.
- Restrained charcoal, steel-blue, surgical-green, and light catalogue surfaces established.
- Shared responsive spacing, containers, borders, moderate radii, and interaction states established.
- Hover, focus, active, disabled, loading, invalid, error, success, and reduced-motion states defined.
- Desktop, tablet, and mobile layout rules applied.

### Validation completed

- Replacement styles were reviewed locally for CSS structure and responsive calculations.
- The committed preview stylesheet exactly matches local Git blob `3d6c4c4d02b480b7534f18e12b583ab1b846ad64`.
- The committed reusable-header stylesheet exactly matches local Git blob `a98929cf5e209ebfea9c1dc743e37a4173750d58`.
- GitHub write access was restored and both files were committed to `rebuild/surgical-contrast`.
- No pull request was opened.

## Validation not yet claimed

- Full Next.js production build.
- ESLint, repository typecheck, unit tests, or Playwright suite on the branch.
- Cross-browser production validation.
- Accessibility audit of the integrated real routes.
- Performance measurement.

Those checks will be batched before the first intentional pull request and CI run.

## Milestone 03 — Real-route static integration

**Status:** next

### Scope

- Integrate the reusable rebuild header into the new real-route shell without altering `main`.
- Convert the approved homepage structure from the isolated preview into maintainable production components.
- Connect the existing search command and live Inquiry List count to the new presentation.
- Preserve the existing cinematic and evolution assets but do not add advanced motion yet.
- Keep the current public implementation available until the rebuild routes pass visual and functional review.
- Perform local lint, typecheck, build, and focused browser screenshots before opening any pull request.

### Exit criteria

- New real-route header and homepage static composition are complete on the rebuild branch.
- Desktop, tablet, and mobile compositions are reviewed and corrected.
- Search and Inquiry List entry points use existing working state rather than duplicate implementations.
- No unsupported company claims or fabricated catalogue content are introduced.
- Advanced cinematic and scissors-evolution motion remain deferred until static UX is approved.
