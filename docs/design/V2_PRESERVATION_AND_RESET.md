# THROHI V2 — Preservation and Reset Contract

Status: Active for `redesign/v2-static-skeleton`

V1 archive: `archive/v1-validated`

Validated V1 baseline: `main` after merged pull request #3.

## Purpose

THROHI V2 is a complete visual redesign. The existing visual language may be rewritten, but the working catalogue, search, inquiry, validation, API, migration, and testing behavior must not regress.

## Protected production routes

- `/`
- `/products`
- `/products/[division]`
- `/products/[division]/[family]`
- `/products/[division]/[family]/[product]`
- `/search`
- `/inquiry`
- `/inquiry/success`
- `/company`
- `/resources`
- `/contact`
- `/precision-through-time`
- `/privacy`
- `/terms`
- production 404 behavior
- `/api/inquiries`

## Protected business and data logic

The following modules are behavior-critical and must not be visually rewritten without explicit reason and regression coverage:

- `src/lib/catalogue.ts`
  - typed divisions, families, and products
  - product route generation
  - seed/approval status boundaries
- `src/lib/search.ts`
  - exact and partial product-code normalization
  - ranking order
  - filters and sorting
- `src/components/inquiry-provider.tsx`
  - cross-route persistence
  - quantities and notes
  - manual products
  - remove and undo
  - legacy storage migration
- `src/lib/inquiry-validation.ts`
  - server and client validation rules
  - attachment metadata allowlist and size boundary
- `src/lib/inquiry-storage.ts`
  - development adapter
  - duplicate-submission behavior
  - production storage boundary
- `src/app/api/inquiries/route.ts`
  - validated request handling
  - safe responses
  - inquiry reference generation
- `scripts/process-catalogue.mjs`
  - deterministic raw/approved/rejected/redirect outputs

## Protected regression coverage

- `tests/homepage.test.mjs`
- `tests/catalogue-pipeline.test.mjs`
- `tests/e2e/homepage.spec.ts`
- `tests/e2e/catalogue.spec.ts`
- `tests/e2e/inquiry.spec.ts`
- `.github/workflows/quality.yml`

The redesign must continue to pass:

1. dependency installation
2. ESLint
3. strict TypeScript
4. unit and catalogue-pipeline tests
5. Next.js production build
6. desktop Chromium
7. mobile Chromium
8. accessibility scans
9. overflow checks
10. search, catalogue, inquiry, API, persistence, quantity, notes, remove, and undo tests

## Visually rewritable surface

These files may be substantially redesigned while preserving their public behavior and accessible names where tests rely on them:

- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/interaction.css`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/components/instrument-visual.tsx`
- `src/components/catalogue-ui.tsx`
- route page markup under `src/app/products/**`
- `src/components/inquiry-workflow.tsx`
- supporting public page compositions

## Asset policy

- No 3D assets.
- Current logo remains temporary.
- Instrument images remain isolated replaceable placeholders.
- Historical/evolution images are concept placeholders until approved.
- No placeholder is presented as verified product photography.
- No unsupported material, specification, certification, manufacturing, export, or company claim may be introduced.

## V2 static-skeleton review gate

The first redesign checkpoint includes:

- homepage
- products landing
- surgical division
- scissors family
- operating-scissors detail
- inquiry page

Advanced motion, image sequences, Easter eggs, smooth scrolling, and pointer effects are excluded from this checkpoint.

The static composition must be visually convincing before motion work begins.
