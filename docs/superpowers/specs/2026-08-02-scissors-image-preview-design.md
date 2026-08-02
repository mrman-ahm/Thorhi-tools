# Scissors Image Batch 01 — Real Catalogue Preview Design

## Goal

Show the first 15 cleaned Scissors images inside the website's real product cards and product-detail pages so their visual quality can be judged in context.

## Scope

- Create an isolated preview branch from `implementation/throhi-foundation-layer-1`.
- Add only the 15 approved review images from catalogue pages 2–4.
- Add the matching Iris, Stevens, Operating, Mayo, and Metzenbaum product groups in regular, Super Cut, and TC finishes.
- Use the existing product-card, family-listing, routing, and product-detail components.
- Render a real `<img>` only when a product has an explicit preview asset; all other products retain the current placeholder behavior.
- Keep every preview record non-published and visibly marked as review data.

## Image presentation

- Preserve the instrument shape exactly.
- Use the cleaned light neutral background already produced in batch 01.
- Fit the full instrument within the existing media stage using `object-fit: contain`.
- Do not add decorative shadows, generated reflections, or shape-changing edits.
- Use descriptive alt text based on the source product name and finish.

## Data and routing

- Extend the product type with an optional `imagePath` field.
- Add the 15 review products to the Scissors family on the isolated preview branch.
- Existing family and detail routes should work normally.
- Existing inquiry behavior remains unchanged.

## Safety

- No merge, pull request, deployment, indexing change, or GitHub Actions run.
- The current frontend branch remains untouched.
- The media-production branch remains untouched.
- Preview images remain unapproved until the visual review is accepted.

## Verification

- Unit test: all 15 records have unique IDs, exact source codes, available image state, and valid preview paths.
- Component test: products with `imagePath` render an image while other products still render placeholders.
- Run focused tests, lint/typecheck for changed files where available, and a production build only if it can be performed locally without triggering GitHub Actions.
