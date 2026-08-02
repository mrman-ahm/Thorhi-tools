# Scissors Image Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the first 15 cleaned Scissors images inside the real product cards and product-detail pages on an isolated preview branch.

**Architecture:** Create `preview/scissors-image-batch-01` from `implementation/throhi-foundation-layer-1`. Add review-only product records and exact catalogue images, then teach `ProductImage` to render a real image only when `imagePath` exists. Existing placeholders and inquiry behavior remain unchanged.

**Tech Stack:** Next.js 15, React 19, TypeScript, Node test runner, static public assets.

## Global Constraints

- No merge, pull request, deployment, indexing change, or GitHub Actions run.
- Preserve instrument geometry exactly.
- All preview records remain non-approved review data.
- Only the first 15 Scissors groups from catalogue pages 2–4 are included.

---

### Task 1: Isolated preview branch and failing contracts

**Files:**
- Create: `tests/scissors-image-preview.test.mjs`
- Create: `docs/superpowers/specs/2026-08-02-scissors-image-preview-design.md`

**Interfaces:**
- Produces: source contracts for 15 unique preview products and real-image rendering.

- [ ] Create `preview/scissors-image-batch-01` from commit `70779c1019b49d9c8ddfc1406160f0e6eb808440`.
- [ ] Add tests asserting exactly 15 preview product IDs, exact catalogue codes, `/media/scissors-preview/*.svg` paths, `imageState: "available"`, and a conditional real `<img>` branch in `ProductImage`.
- [ ] Run `node --test tests/scissors-image-preview.test.mjs` and confirm failure because preview products and image rendering do not exist.
- [ ] Commit the failing contract.

### Task 2: Add the 15 exact review assets

**Files:**
- Create: `public/media/scissors-preview/scissors-iris-regular.svg`
- Create: `public/media/scissors-preview/scissors-iris-super-cut.svg`
- Create: `public/media/scissors-preview/scissors-iris-tc.svg`
- Create: `public/media/scissors-preview/scissors-stevens-regular.svg`
- Create: `public/media/scissors-preview/scissors-stevens-super-cut.svg`
- Create: `public/media/scissors-preview/scissors-stevens-tc.svg`
- Create: `public/media/scissors-preview/scissors-operating-regular.svg`
- Create: `public/media/scissors-preview/scissors-operating-super-cut.svg`
- Create: `public/media/scissors-preview/scissors-operating-tc.svg`
- Create: `public/media/scissors-preview/scissors-mayo-regular.svg`
- Create: `public/media/scissors-preview/scissors-mayo-super-cut.svg`
- Create: `public/media/scissors-preview/scissors-mayo-tc.svg`
- Create: `public/media/scissors-preview/scissors-metzenbaum-regular.svg`
- Create: `public/media/scissors-preview/scissors-metzenbaum-super-cut.svg`
- Create: `public/media/scissors-preview/scissors-metzenbaum-tc.svg`

**Interfaces:**
- Produces: browser-renderable review assets preserving the exact cleaned PNG pixels inside SVG wrappers.

- [ ] Add each image as a static SVG wrapper containing the exact cleaned PNG crop.
- [ ] Keep the neutral background and full instrument framing.
- [ ] Commit the assets.

### Task 3: Add preview product records

**Files:**
- Modify: `src/lib/catalogue.ts`

**Interfaces:**
- Produces: optional `imagePath?: string` on `Product` and 15 routed review products.

- [ ] Add `imagePath?: string` to `Product`.
- [ ] Add 15 Scissors records with source codes `04-0800`, `05-0802`, `06-0802`, `04-0901`, `05-0901`, `06-0901`, `04-0101`, `05-0101`, `06-0101`, `04-0401`, `05-0401`, `06-0401`, `04-1901`, `05-1901`, and `06-1901`.
- [ ] Mark each record `status: "draft"`, `imageState: "available"`, and include its exact image path.
- [ ] Run the focused test and confirm the data assertions pass while the component assertion still fails.
- [ ] Commit the data change.

### Task 4: Render real images in existing cards and detail pages

**Files:**
- Modify: `src/components/catalogue-ui.tsx`

**Interfaces:**
- Consumes: `Product.imagePath`.
- Produces: real `<img>` rendering in all existing `ProductImage` consumers.

- [ ] In `ProductImage`, return the current placeholder unchanged when `imagePath` is absent.
- [ ] When `imagePath` exists, render a real image inside the existing `.catalogue-image` stage with `objectFit: "contain"`, a neutral background, and alt text from `product.name`.
- [ ] Keep the existing card, family route, detail route, examination overlay, and inquiry controls unchanged.
- [ ] Run `node --test tests/scissors-image-preview.test.mjs` and confirm all focused tests pass.
- [ ] Commit the component change.

### Task 5: Verification

**Files:**
- No production changes.

- [ ] Verify all 15 asset paths exist and are unique.
- [ ] Run the focused preview test again.
- [ ] Run `npm run typecheck` and `npm run build` only in a local checkout if dependencies and network-free execution are available.
- [ ] Record any verification limitation honestly.
