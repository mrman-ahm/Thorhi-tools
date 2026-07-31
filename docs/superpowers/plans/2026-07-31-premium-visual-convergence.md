# THROHI Premium Visual Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge every `/rebuild` route on one premium, regal, medically trustworthy visual system while preserving all existing behavior and truthful content boundaries.

**Architecture:** Add one approved serif display font and expand the shared rebuild token layer. Apply route-wide visual convergence through the `RebuildShell` class and stable `data-*` attributes, while keeping header/footer ownership in their existing CSS modules. Use focused source contracts and browser acceptance assertions rather than brittle hashed-class checks.

**Tech Stack:** Next.js 15 App Router, React, CSS Modules, next/font/google, Playwright, Node test runner.

## Global Constraints

- No filler copy or invented business facts.
- Important body, navigation, form, and action text must remain readable.
- No pricing, checkout, cart, or unsupported catalogue content.
- Preserve catalogue URL state, inquiry identity, attachments, durable-backend hooks, accessibility, and reduced motion.
- Do not merge, deploy, create a pull request, or trigger GitHub Actions.

---

### Task 1: Premium typography and design tokens

**Files:**
- Create: `tests/rebuild-premium-convergence.test.mjs`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/rebuild/surgical-precision-shell.module.css`

**Interfaces:**
- Consumes: existing `--font-instrument`, `--font-archivo`, and rebuild color variables.
- Produces: `--font-regal`, premium brass/ivory/navy tokens, readable type-size tokens, and elevated spacing/shadow tokens.

- [ ] Add a source contract asserting the regal font variable, premium tokens, readable minimum sizes, and preserved focus behavior.
- [ ] Confirm the contract is red against the pre-convergence source.
- [ ] Import `Cormorant_Garamond` through `next/font/google` and expose `--font-regal` on `<html>`.
- [ ] Expand the shell token layer with premium color, type, spacing, border, and shadow variables.
- [ ] Commit the typography/token foundation.

### Task 2: Shared premium convergence layer

**Files:**
- Create: `src/app/rebuild/premium-convergence.module.css`
- Modify: `src/app/rebuild/rebuild-shell.tsx`
- Modify: `tests/rebuild-premium-convergence.test.mjs`

**Interfaces:**
- Consumes: shared token variables and stable route attributes such as `data-home-hero`, `data-catalogue-masthead`, `data-product-examination`, `data-inquiry-masthead`, and `data-corporate-hero`.
- Produces: one scoped class applied by `RebuildShell` that standardizes typography, body size, headings, actions, forms, surfaces, editorial rules, and reduced-motion behavior.

- [ ] Extend the source contract to require stable route selectors and no universal entrance animation.
- [ ] Add the premium convergence stylesheet with scoped serif hierarchy, readable body/control sizing, warm paper surfaces, brass accents, and responsive safeguards.
- [ ] Apply its root class in `RebuildShell` and update the milestone contract to `premium-visual-convergence-v1`.
- [ ] Commit the route-wide convergence layer.

### Task 3: Header and footer refinement

**Files:**
- Modify: `src/components/rebuild/rebuild-header.module.css`
- Modify: `src/components/rebuild/rebuild-footer.module.css`
- Modify: `tests/rebuild-premium-convergence.test.mjs`

**Interfaces:**
- Consumes: premium tokens and existing header/footer component markup.
- Produces: 80 px premium desktop header, 66 px mobile header, readable navigation, editorial panels, stronger Inquiry List utility, and a regal closing footer.

- [ ] Add source assertions for readable navigation, premium header height, serif footer statement styling, and mobile menu sizing.
- [ ] Refine header spacing, panel surfaces, nav typography, inquiry utility, and mobile menu hierarchy.
- [ ] Refine footer composition, identity copy, route columns, status line, and narrow-mobile layout.
- [ ] Commit shared-shell polish.

### Task 4: Cross-route visual application

**Files:**
- Modify: `src/app/rebuild/premium-convergence.module.css`
- Modify: `tests/e2e/rebuild-home-design.spec.ts`
- Modify: `tests/e2e/rebuild-catalogue-design.spec.ts`
- Modify: `tests/e2e/rebuild-product-inquiry-design.spec.ts`
- Modify: `tests/e2e/rebuild-company-trust.spec.ts`

**Interfaces:**
- Consumes: stable page data attributes and the shared visual tokens.
- Produces: premium hierarchy across homepage, catalogue, product detail, Inquiry List, Company, Catalogues, Contact, and history routes.

- [ ] Add browser assertions for the premium milestone contract and computed regal display font on representative headings.
- [ ] Apply page-specific convergence rules for hero composition, catalogue controls/records, product examination, inquiry forms/review, and corporate ledgers.
- [ ] Preserve all existing functional and accessibility assertions.
- [ ] Commit cross-route convergence.

### Task 5: State, verification gate, and documentation

**Files:**
- Create: `scripts/verify-design-milestone-6.sh`
- Modify: `tests/design-verification-harness.test.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: existing isolated verification pattern.
- Produces: one Milestone 6 gate covering lint, typecheck, unit tests, build, and all rebuild browser suites on an isolated port.

- [ ] Add the isolated Milestone 6 verification script.
- [ ] Extend the harness source contract.
- [ ] Record Milestone 6 as implementation-present and runtime-verification pending.
- [ ] Record design decisions and changed surfaces in the changelog.
- [ ] Perform a final source scope, accessibility, responsive, and content-boundary review.
