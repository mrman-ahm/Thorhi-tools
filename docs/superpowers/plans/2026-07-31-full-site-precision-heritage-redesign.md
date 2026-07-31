# Full-Site Precision Heritage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing layered `/rebuild` visual system with one coherent Precision Heritage House design while preserving catalogue, inquiry, accessibility, media, and backend behavior.

**Architecture:** Introduce a new versioned redesign contract and shared token/shell layer, then replace route-specific presentation page by page. Functional React components, catalogue data, URL state, inquiry state, and API contracts stay stable wherever possible. Superseded premium/refinement layers are removed only after every route has equivalent replacement coverage.

**Tech Stack:** Next.js 15 App Router, React 19, CSS Modules, next/font, Playwright, Node test runner.

## Global Constraints

- Work only on `design/surgical-precision-archive`.
- Do not deploy, merge, open a PR, enable indexing, or change public routes.
- Preserve the supplied cinematic video and scissors-evolution media.
- Preserve catalogue search, filters, sorting, pagination, return context, base/variant identity, and inquiry state.
- Preserve multipart inquiry submission, attachments, validation, Turnstile hooks, durable backend contracts, and production fail-closed behavior.
- Do not invent business facts, certifications, materials, markets, contacts, legal details, or catalogue documents.
- Important body text remains at least 15px mobile and 16px desktop where practical.
- Essential labels and states remain at least 12px.
- No horizontal overflow at 320, 390, 768, 1280, or 1440 widths.
- Reduced-motion parity is mandatory.

---

### Task 1: Redesign contract and global foundation

**Files:**
- Create: `tests/rebuild-full-redesign.test.mjs`
- Create: `src/app/rebuild/precision-heritage.module.css`
- Modify: `src/app/rebuild/rebuild-shell.tsx`
- Modify: `src/app/rebuild/surgical-precision-shell.module.css`

**Produces:** `data-redesign-contract="precision-heritage-house-v1"` and the shared redesign tokens/layout foundation.

- [ ] Write a source contract requiring the new shell marker, new CSS module, approved colors, typography variables, 78px desktop header, 66px mobile header, responsive gutters, and reduced-motion rules.
- [ ] Attach the new redesign module to `RebuildShell` without removing functional providers or route content.
- [ ] Define the replacement palette, typography scales, spacing, focus, selection, reading width, container width, and common editorial surfaces.
- [ ] Remove token duplication from the old shell module only after equivalent variables exist in the new foundation.
- [ ] Commit the foundation.

### Task 2: Header, search navigation, mobile index, and footer

**Files:**
- Modify: `src/components/rebuild/rebuild-header.tsx`
- Replace: `src/components/rebuild/rebuild-header.module.css`
- Modify: `src/components/rebuild/rebuild-footer.tsx`
- Replace: `src/components/rebuild/rebuild-footer.module.css`
- Test: `tests/e2e/rebuild-full-redesign.spec.ts`

**Produces:** one premium shared shell with desktop and mobile navigation.

- [ ] Preserve all current search, menu, focus-trap, Escape, body-lock, and Inquiry List count behavior.
- [ ] Recompose the desktop header into brand, primary navigation, and restrained utilities.
- [ ] Recompose product/search panels as editorial overlays rather than generic dropdown cards.
- [ ] Recompose mobile navigation as a full-screen route index with readable labels and Inquiry List state.
- [ ] Rebuild the footer as a dark manufacturer dossier with product, company, legal, and verified-origin columns.
- [ ] Add browser checks for header height, focus behavior, mobile visibility, and footer overflow.
- [ ] Commit the shared shell.

### Task 3: Homepage replacement

**Files:**
- Modify: `src/app/rebuild/page.tsx`
- Modify: `src/components/rebuild/home/home-hero.tsx`
- Replace: `src/components/rebuild/home/home-hero.module.css`
- Modify: `src/components/rebuild/home/home-division-index.tsx`
- Modify: `src/components/rebuild/home/home-selected-families.tsx`
- Modify: `src/components/rebuild/home/home-company-intro.tsx`
- Modify: `src/components/rebuild/home/home-evolution-preview.tsx`
- Modify: `src/components/rebuild/home/home-utilities-contact.tsx`
- Replace: `src/components/rebuild/home/home-sections.module.css`
- Replace: `src/components/rebuild/home/home-utilities.module.css`

**Produces:** a complete editorial homepage with no filler sections.

- [ ] Preserve cinematic entry behavior and immediate post-dismissal access.
- [ ] Rebuild the hero as an asymmetric two-column composition with one large real instrument specimen, verified company identity, two actions, integrated search, and readable catalogue counts.
- [ ] Rebuild divisions as four horizontal dossiers with structured/pending truth states.
- [ ] Rebuild selected instruments as asymmetric editorial records rather than equal cards.
- [ ] Rebuild company copy as one concise verified introduction.
- [ ] Rebuild the evolution preview as a dark cinematic bridge using the supplied frames.
- [ ] Rebuild the final action section as a three-route decision path.
- [ ] Add rendered checks for hierarchy, first-viewport action visibility, image stage, and responsive stacking.
- [ ] Commit the homepage.

### Task 4: Catalogue replacement

**Files:**
- Modify: `src/app/rebuild/products/page.tsx`
- Modify: `src/app/rebuild/products/catalogue-client.tsx`
- Replace: `src/app/rebuild/products/catalogue.module.css`
- Modify only as needed: catalogue filter, toolbar, entry, media, and empty-state components.

**Produces:** compact masthead, dominant search, narrow filter rail, and wide product ledger.

- [ ] Preserve all URL parameters and sorting/filtering behavior.
- [ ] Replace the oversized masthead with a compact dark catalogue index.
- [ ] Keep search visible and dominant.
- [ ] Rebuild desktop filters as a restrained ledger rail and mobile filters as a native disclosure sheet.
- [ ] Rebuild product records into readable horizontal procurement entries with image, code, name, family, variants, route, and Inquiry state.
- [ ] Rebuild empty, loading, toolbar, active-filter, and pagination states.
- [ ] Add browser checks for filter behavior, readable labels, product density, overflow, and selected state.
- [ ] Commit the catalogue.

### Task 5: Product examination replacement

**Files:**
- Modify: `src/app/rebuild/products/[productId]/page.tsx`
- Replace: `src/app/rebuild/products/[productId]/product-detail.module.css`
- Modify only as needed: `product-actions.tsx`

**Produces:** museum-grade media stage and dark procurement dossier.

- [ ] Preserve safe return context and related-family routing.
- [ ] Preserve stable base and variant Inquiry identities.
- [ ] Rebuild the examination into a large media stage with an adjacent dark identity dossier.
- [ ] Keep the main Inquiry action visible on 1280×800.
- [ ] Rebuild the specification/source ledger with readable labels.
- [ ] Rebuild variants as formal catalogue records.
- [ ] Rebuild related products as asymmetric comparison records.
- [ ] Add browser checks for return context, action visibility, label sizing, variant state, and overflow.
- [ ] Commit the product route.

### Task 6: Inquiry worksheet replacement

**Files:**
- Modify: `src/app/rebuild/inquiry/page.tsx`
- Modify: `src/app/rebuild/inquiry/inquiry-client.tsx`
- Modify: `src/app/rebuild/inquiry/inquiry-item-record.tsx`
- Modify: `src/app/rebuild/inquiry/inquiry-review-desk.tsx`
- Replace: `src/app/rebuild/inquiry/inquiry.module.css`
- Modify only as needed: success and Turnstile presentation.

**Produces:** a formal procurement worksheet, not a cart.

- [ ] Preserve item editing, quantity, notes, remove, undo, manual items, attachment validation, buyer validation, Turnstile token, submission token, API call, and success routing.
- [ ] Rebuild the masthead and four-stage ledger.
- [ ] Rebuild item records as editable procurement lines.
- [ ] Rebuild requirements and buyer forms with clear labels, errors, and grouping.
- [ ] Keep the review dossier sticky on desktop and sequential on mobile.
- [ ] Rebuild empty, validation, submission-error, and attachment states.
- [ ] Add browser checks for manual entry, validation, item state, review totals, and mobile stacking.
- [ ] Commit the Inquiry List.

### Task 7: Corporate, legal, and terminal route replacement

**Files:**
- Modify route modules and shared corporate/utility components for Company, history, Catalogues, Contact, Privacy, Terms, success, error, loading, and not-found.
- Replace: `src/app/rebuild/utility-state.module.css`
- Replace or consolidate corporate page CSS modules.

**Produces:** one editorial route framework for all secondary pages.

- [ ] Preserve verified-content and pending-content boundaries.
- [ ] Rebuild corporate heroes, section indexes, document ledgers, contact routing, legal reading layouts, confirmation, recovery, and loading states.
- [ ] Ensure legal routes remain explicit about pending legal review.
- [ ] Ensure not-found and error recovery preserve catalogue and Inquiry routes.
- [ ] Add browser checks for headings, readability, recovery links, accessibility, and overflow.
- [ ] Commit corporate and utility routes.

### Task 8: Remove superseded visual layers

**Files:**
- Modify: `src/app/rebuild/rebuild-shell.tsx`
- Delete after coverage review:
  - `src/app/rebuild/premium-convergence.module.css`
  - `src/app/rebuild/visual-qa-refinements.module.css`
- Simplify or delete obsolete route visual overrides where replacement modules cover them.
- Update tests that intentionally reference the old visual contracts.

**Produces:** one active redesign system instead of stacked corrective layers.

- [ ] Confirm every selector in the old premium/refinement modules is replaced or intentionally dropped.
- [ ] Remove old modules from `RebuildShell`.
- [ ] Delete old files.
- [ ] Preserve the original functional milestone marker for regression history while making the new redesign marker authoritative.
- [ ] Commit visual-layer cleanup.

### Task 9: Responsive, accessibility, and verification convergence

**Files:**
- Create: `scripts/verify-full-redesign.sh`
- Expand: `tests/e2e/rebuild-full-redesign.spec.ts`
- Update: `tests/design-verification-harness.test.mjs`
- Update: `PROJECT_STATE.md`, `PLANS.md`, `CHANGELOG.md`

**Produces:** one isolated full-redesign gate.

- [ ] Run lint, typecheck, source tests, production build, readiness budget, and desktop/mobile browser suites.
- [ ] Verify 320, 390, 768, 1280, and 1440 widths.
- [ ] Verify reduced motion, forced colors, focus, mobile navigation, search, catalogue, product, inquiry, legal, loading, error, success, and not-found routes.
- [ ] Record the exact runtime evidence without overstating screenshot quality.
- [ ] Commit the verification and state documentation.
