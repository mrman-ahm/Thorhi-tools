# Production Readiness Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add fail-closed crawler controls, safe response headers, metadata defaults, accessibility resilience, deterministic build budgets, and explicit Cloudflare cutover blockers without indexing or deploying the rebuild.

**Architecture:** Root metadata and `robots.ts` share one environment-gated indexing rule, while `/rebuild` and `/api` receive independent no-index HTTP boundaries. A dependency-free post-build script audits emitted chunk and asset limits. Accessibility resilience stays inside the shared rebuild shell. Browser and source contracts verify declared behavior without changing catalogue, inquiry, or backend business logic.

**Tech Stack:** Next.js 15.4.4 App Router, React 19, TypeScript, Node test runner, Playwright, Cloudflare Workers/OpenNext deployment target.

## Global Constraints

- Keep `design/surgical-precision-archive` isolated and non-indexed by default.
- Do not merge, deploy, create a pull request, activate indexing, or cut over public routes.
- Do not enforce strict CSP or HSTS before real Next.js Worker and Turnstile runtime verification.
- Do not add analytics or tracking.
- Do not invent origins, icons, contact details, business facts, legal terms, or social metadata.
- Preserve all catalogue, product, inquiry, media, and backend behavior.
- Treat build/type, accessibility, routing, durable-storage, security-boundary, and platform-limit failures as critical.

---

### Task 1: Production readiness source contract

**Files:**
- Create: `tests/rebuild-production-readiness.test.mjs`

**Interfaces:**
- Consumes: `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/rebuild/layout.tsx`, `next.config.ts`, `src/app/rebuild/surgical-precision-shell.module.css`, `scripts/check-production-readiness.mjs`, `package.json`.
- Produces: source-level assertions for every readiness boundary.

- [ ] **Step 1: Add failing source assertions**

Assert that:

- `robots.ts` defaults to `disallow: "/"` and uses `NEXT_PUBLIC_ALLOW_INDEXING`;
- rebuild layout always disables indexing;
- root metadata and viewport expose gated robots, application name, format detection, and theme colors;
- global, rebuild, and API headers exist;
- API cache is `no-store`;
- contrast and forced-colors media queries exist;
- the build-budget script contains 25 MiB, 768 KiB JS, 512 KiB CSS, and 20,000-file limits;
- `package.json` exposes `readiness:check`.

- [ ] **Step 2: Commit the red contract**

```bash
git add tests/rebuild-production-readiness.test.mjs
git commit -m "test: define production readiness contract"
```

### Task 2: Crawler and metadata boundaries

**Files:**
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/rebuild/layout.tsx`

**Interfaces:**
- Produces: environment-gated public indexing and permanent rebuild no-index behavior.

- [ ] **Step 1: Add gated `robots.ts`**

Use `MetadataRoute.Robots`. Default to `Disallow: /`. When `NEXT_PUBLIC_ALLOW_INDEXING=true`, allow `/` and disallow `/rebuild/` and `/api/`.

- [ ] **Step 2: Upgrade root metadata**

Add:

- `applicationName: "THROHI Medical Tools"`;
- `formatDetection: { telephone: false, email: false, address: false }`;
- robots from the same environment gate;
- `Viewport` with light and dark theme colors and `colorScheme: "light"`.

- [ ] **Step 3: Harden rebuild layout metadata**

Export `Metadata` with `robots: { index: false, follow: false }` while preserving `RebuildShell`.

- [ ] **Step 4: Commit crawler and metadata boundaries**

```bash
git add src/app/robots.ts src/app/layout.tsx src/app/rebuild/layout.tsx
git commit -m "feat: add fail-closed indexing boundaries"
```

### Task 3: Safe response headers

**Files:**
- Modify: `next.config.ts`

**Interfaces:**
- Produces: global hardening plus route-specific no-index and cache behavior.

- [ ] **Step 1: Expand global headers**

Keep current headers and add:

- `X-Permitted-Cross-Domain-Policies: none`;
- `X-DNS-Prefetch-Control: off`;
- expanded `Permissions-Policy` disabling payment, USB, and browsing topics.

- [ ] **Step 2: Add rebuild headers**

For `/rebuild/:path*`, send `X-Robots-Tag: noindex, nofollow, noarchive`.

- [ ] **Step 3: Add API headers**

For `/api/:path*`, send:

- `Cache-Control: no-store, max-age=0`;
- `X-Robots-Tag: noindex, nofollow, noarchive`.

- [ ] **Step 4: Commit response boundaries**

```bash
git add next.config.ts
git commit -m "feat: harden rebuild and api response headers"
```

### Task 4: Accessibility resilience

**Files:**
- Modify: `src/app/rebuild/surgical-precision-shell.module.css`

**Interfaces:**
- Produces: high-contrast and forced-colors behavior scoped to `/rebuild`.

- [ ] **Step 1: Add increased-contrast token overrides**

Under `@media (prefers-contrast: more)`, strengthen muted text, lines, and focus outline width.

- [ ] **Step 2: Add forced-colors support**

Under `@media (forced-colors: active)`, use system colors for links, buttons, inputs, borders, focus outlines, and selection while preserving semantic visibility.

- [ ] **Step 3: Commit accessibility resilience**

```bash
git add src/app/rebuild/surgical-precision-shell.module.css
git commit -m "feat: add high contrast rebuild resilience"
```

### Task 5: Deterministic build budgets

**Files:**
- Create: `scripts/check-production-readiness.mjs`
- Modify: `package.json`
- Modify: `scripts/verify-design-milestone-6.sh`

**Interfaces:**
- Produces: `npm run readiness:check`, executed after `next build`.

- [ ] **Step 1: Implement dependency-free build scanner**

Recursively inspect `.next/static` and `public`.

Fail when:

- `.next/static` is absent;
- a deployed file exceeds 25 MiB;
- an emitted JS file exceeds 768 KiB;
- an emitted CSS file exceeds 512 KiB;
- total static/public file count exceeds 20,000.

Print concise counts and largest-file summaries on success.

- [ ] **Step 2: Register package script**

Add:

```json
"readiness:check": "node scripts/check-production-readiness.mjs"
```

- [ ] **Step 3: Register the post-build gate**

Run `npm run readiness:check` immediately after `npm run build` in Milestone 6 verification.

- [ ] **Step 4: Commit build budgets**

```bash
git add scripts/check-production-readiness.mjs package.json scripts/verify-design-milestone-6.sh
git commit -m "feat: add deterministic production budgets"
```

### Task 6: Browser readiness contract

**Files:**
- Create: `tests/e2e/rebuild-production-readiness.spec.ts`
- Modify: `scripts/verify-design-milestone-6.sh`
- Modify: `tests/design-verification-harness.test.mjs`

**Interfaces:**
- Produces: rendered verification for crawler, metadata, headers, and API cache boundaries.

- [ ] **Step 1: Add browser tests**

Verify:

- `/robots.txt` disallows crawling by default;
- `/rebuild` has no-index metadata and `X-Robots-Tag`;
- global security headers are present;
- `/api/inquiries` returns `Cache-Control: no-store` on an invalid POST;
- rebuild pages expose a theme-color meta element;
- no horizontal overflow is introduced.

- [ ] **Step 2: Add suite to Milestone 6 gate**

Register `rebuild-production-readiness.spec.ts` for desktop and mobile Chromium.

- [ ] **Step 3: Update harness contract**

Assert the gate includes the new suite and `npm run readiness:check`.

- [ ] **Step 4: Commit browser coverage**

```bash
git add tests/e2e/rebuild-production-readiness.spec.ts scripts/verify-design-milestone-6.sh tests/design-verification-harness.test.mjs
git commit -m "test: cover production readiness boundaries"
```

### Task 7: Deployment readiness register

**Files:**
- Create: `docs/production/PRODUCTION_READINESS.md`
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: one explicit record of implemented safeguards and remaining cutover blockers.

- [ ] **Step 1: Document implemented safeguards**

Record indexing gate, security headers, API no-store, build budgets, metadata, accessibility resilience, and current commands.

- [ ] **Step 2: Record blockers**

Keep explicit:

- strict CSP runtime validation;
- HSTS after production-origin approval;
- OpenNext Worker configuration;
- real D1/R2/Turnstile/delivery settings;
- final origin/canonical/sitemap/social metadata/icons;
- field performance measurement;
- catalogue/contact/legal/content approval;
- public cutover approval.

- [ ] **Step 3: Update project state and changelog**

Represent the phase as source implementation present only, with no runtime-green claim.

- [ ] **Step 4: Commit documentation**

```bash
git add docs/production/PRODUCTION_READINESS.md PROJECT_STATE.md PLANS.md CHANGELOG.md
git commit -m "docs: record production readiness safeguards"
```

### Task 8: Final source review

**Files:**
- Review all files changed by Tasks 1–7.

- [ ] **Step 1: Check scope**

Confirm no catalogue data, inquiry business behavior, public cutover route, deployment resource ID, secret, or invented content changed.

- [ ] **Step 2: Check build-sensitive syntax**

Review Next.js `MetadataRoute.Robots`, `Viewport`, header source patterns, ESM script imports, Playwright request usage, and CSS media queries.

- [ ] **Step 3: Check plan coverage**

Confirm every selected specification requirement has a source or test implementation and strict CSP/HSTS/indexing remain deferred.

- [ ] **Step 4: Record current head**

Use a branch comparison and report source implementation without claiming runtime verification.
