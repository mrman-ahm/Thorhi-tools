# THROHI Website — Execution Plan

## Current objective

Review and refine **Milestone 6: Premium Visual Convergence** on `design/surgical-precision-archive`. The premium system now includes main routes, shared navigation, inquiry confirmation, legal pages, and rebuild-scoped loading, error, and not-found states.

`/rebuild` remains non-indexed and is not approved for public cutover.

## Quality standard

- Regal, trustworthy, medically appropriate hierarchy.
- Cormorant Garamond for primary titles, Instrument Sans for readable body/UI text, and IBM Plex Mono for codes/status.
- Important information is never hidden in microtype.
- Real instrument imagery remains the primary visual material.
- No filler sections, fake luxury, generic SaaS cards, ecommerce language, or invented claims.
- Critical build, interaction, accessibility, responsive, and durable-storage failures block cutover.

## Implemented milestones

1. Homepage and shared shell
2. Company & Trust Spine
3. Precision Catalogue Ledger
4. Instrument Examination & Inquiry Desk
5. Durable Inquiry Backend
6. Premium Visual Convergence

## Milestone 6 coverage

- premium typography and shared visual tokens;
- homepage, catalogue, product, inquiry, corporate, and confirmation routes;
- premium desktop/mobile header, panels, mobile navigation, and footer;
- `/rebuild/privacy` and `/rebuild/terms`;
- rebuild-scoped 404 with explicit catch-all routing;
- rebuild-scoped retry error boundary;
- semantic reduced-motion-safe loading state;
- Privacy and Terms footer navigation;
- legacy public utility routes unchanged until cutover.

## Verification

Source contracts:

- `tests/rebuild-premium-convergence.test.mjs`
- `tests/rebuild-premium-utility-states.test.mjs`

Browser contracts:

- `tests/e2e/rebuild-premium-convergence.spec.ts`
- `tests/e2e/rebuild-premium-utility-states.spec.ts`

Combined gate:

```bash
bash scripts/verify-design-milestone-6.sh
```

No fresh runtime-green claim is made until the combined gate runs in a real checkout.

## Visual review sequence

1. Review 1440 × 1000, 1280 × 800, 768 × 1024, 390 × 844, and 320 × 700.
2. Inspect homepage normal and cinematic states.
3. Inspect catalogue default, search, filters, no-results, pagination, and selected states.
4. Inspect product base and variant states.
5. Inspect inquiry empty, manual, populated, validation, attachment, review, and confirmation states.
6. Inspect Company, Catalogues, Contact, history, Privacy, Terms, 404, error, and loading states.
7. Correct only visible hierarchy, spacing, typography, contrast, overflow, or usability defects.

## Parallel tracks

- Configure and verify the real Cloudflare inquiry resources and approved delivery.
- Complete catalogue validation and real catalogue documents.
- Add verified contact and company information only after approval.
- Complete Veterinary and Beauty content only from real source data.

## Next phases

1. Premium visual review corrections
2. Real backend configuration and delivery verification
3. Verified contact, catalogue documents, final logo, and approved company content
4. Accessibility, security, performance, metadata, retention, and production audit
5. Explicit public cutover approval

No pull request, merge, deployment, or public cutover occurs automatically.
