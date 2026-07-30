# Durable Inquiry Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace production-memory inquiry handling with a Cloudflare-native durable service that stores inquiries in D1, stores validated attachments in R2, validates optional Turnstile tokens, rate-limits submissions, preserves idempotency, and records delivery work in an outbox.

**Architecture:** The browser continues submitting to the same-origin Next.js `/api/inquiries` route. That route parses multipart or legacy JSON requests, validates and sanitizes the inquiry, computes a privacy-preserving client fingerprint, and proxies the sanitized payload plus optional attachment to a dedicated Cloudflare Worker using a shared secret. The Worker owns D1, R2, rate limiting, duplicate detection, reference generation, persistence, and delivery-outbox creation. Local non-production development retains the explicit memory adapter; production fails closed when the Worker URL or shared secret is missing.

**Tech Stack:** Next.js 15 route handlers, React 19, TypeScript, Cloudflare Workers, D1, R2, Turnstile Siteverify, SQL migrations, Node test contracts, Playwright.

## Global Constraints

- Work only on `design/surgical-precision-archive`.
- Do not merge, deploy, open a pull request, or trigger GitHub Actions.
- Preserve the inquiry-led B2B model; never add pricing, checkout, or payment language.
- Preserve real catalogue identity validation and submission-token idempotency.
- Do not invent recipient addresses, phone numbers, CRM endpoints, certifications, or business claims.
- Production must never report successful durable submission when durable storage is unavailable.
- Attachments remain limited to PDF, JPG, PNG, or WebP and 8 MiB.
- Harmless existing lint warnings remain deferred.

---

### Task 1: Close the remaining browser verification instability

**Files:**
- Modify: `tests/e2e/rebuild-company-trust.spec.ts`

**Interfaces:**
- Consumes: existing `expectNoSeriousAxeViolations(page)` helper and corporate route list.
- Produces: one isolated Axe test per corporate route with a 90-second budget.

- [ ] Split the four-route serial Axe loop into independently named tests.
- [ ] Keep the existing serious/critical violation filter unchanged.
- [ ] Do not weaken accessibility assertions or exclude additional page content.
- [ ] Commit the isolated test correction.

### Task 2: Add durable-backend acceptance contracts

**Files:**
- Create: `tests/inquiry-durable-backend.test.mjs`

**Interfaces:**
- Consumes: source files created in Tasks 3–7.
- Produces: source-level contracts for fail-closed production behavior, multipart attachment forwarding, D1/R2 persistence, Turnstile, rate limiting, idempotency, and delivery outbox.

- [ ] Add contracts that initially fail because the durable modules do not exist.
- [ ] Assert the public API route no longer hard-codes `development-memory` success in production.
- [ ] Assert the Worker migration contains unique submission tokens and references.
- [ ] Assert the Worker stores attachments in R2 and writes inquiry/item/outbox records to D1.
- [ ] Assert Turnstile validation and rate limiting are implemented.
- [ ] Commit the red contract.

### Task 3: Create the same-origin backend proxy

**Files:**
- Create: `src/lib/inquiry-request.ts`
- Create: `src/lib/inquiry-backend.ts`
- Modify: `src/app/api/inquiries/route.ts`
- Modify: `src/lib/inquiry-storage.ts`

**Interfaces:**
- Produces: `parseInquiryRequest(request)`, `submitDurableInquiry(input)`, `createClientFingerprint(request)`, and storage modes `development-memory | cloudflare-d1-r2`.
- Consumes: `validateInquiry`, optional attachment bytes, `INQUIRY_API_URL`, `INQUIRY_API_SECRET`, and `INQUIRY_FINGERPRINT_SECRET`.

- [ ] Parse both multipart requests (`payload` JSON plus optional `attachment`) and legacy JSON.
- [ ] Validate attachment metadata against the actual uploaded file.
- [ ] Compute a daily privacy-preserving SHA-256 fingerprint from forwarded IP, user agent, and a secret.
- [ ] Forward sanitized multipart data to the Worker with a shared-secret header and fingerprint header.
- [ ] Return duplicate/reference/storage mode from the Worker.
- [ ] Preserve memory storage only outside production.
- [ ] Return HTTP 503 in production when durable backend configuration is missing.
- [ ] Commit the proxy layer.

### Task 4: Send actual attachment bytes from the Inquiry List

**Files:**
- Modify: `src/app/rebuild/inquiry/inquiry-client.tsx`

**Interfaces:**
- Consumes: existing client validation and `File` selection.
- Produces: multipart `FormData` with `payload`, optional `attachment`, and optional Turnstile token.

- [ ] Retain the selected `File` in component state while keeping serializable metadata in the inquiry provider.
- [ ] Clear both file bytes and metadata when the attachment is removed.
- [ ] Submit `FormData` instead of JSON.
- [ ] Preserve all current validation, error recovery, and success routing.
- [ ] Commit the client transport change.

### Task 5: Build the Cloudflare Worker and SQL migration

**Files:**
- Create: `workers/inquiry-api/src/index.ts`
- Create: `workers/inquiry-api/migrations/0001_inquiry_backend.sql`
- Create: `workers/inquiry-api/tsconfig.json`
- Create: `workers/inquiry-api/wrangler.example.jsonc`
- Create: `workers/inquiry-api/.dev.vars.example`

**Interfaces:**
- Worker bindings: `DB: D1Database`, `ATTACHMENTS: R2Bucket`.
- Worker variables/secrets: `INQUIRY_API_SECRET`, `FINGERPRINT_SECRET`, optional `TURNSTILE_SECRET_KEY`, optional `INQUIRY_DELIVERY_WEBHOOK_URL`, optional `INQUIRY_DELIVERY_WEBHOOK_SECRET`, `ALLOWED_ORIGINS`.
- Endpoints: `GET /health`, `POST /v1/inquiries`.

- [ ] Authenticate the proxy shared secret with constant-time comparison.
- [ ] Enforce allowed origin and multipart size/type limits.
- [ ] Validate optional Turnstile tokens through Siteverify when the secret is configured.
- [ ] Apply a D1-backed five-submissions-per-ten-minutes fingerprint limit.
- [ ] Return the existing inquiry for duplicate submission tokens.
- [ ] Generate `THR-YYYYMMDD-XXXXXXXX` references.
- [ ] Store attachment bytes in R2 under a non-public reference-scoped key.
- [ ] Insert inquiry, item rows, and one delivery-outbox row in D1.
- [ ] Attempt an optional signed delivery webhook through `ctx.waitUntil` and update outbox status.
- [ ] Delete an uploaded R2 object if D1 persistence fails.
- [ ] Commit Worker and migration.

### Task 6: Add deployment and operational documentation

**Files:**
- Create: `docs/backend/INQUIRY_BACKEND.md`
- Modify: `package.json`
- Modify: `PROJECT_STATE.md`
- Modify: `PLANS.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: exact D1/R2 creation, migration, Worker deployment, secret, and website environment steps without real resource IDs.

- [ ] Add a `backend:check` source-contract script.
- [ ] Document creation of D1 and R2 resources and copying the example Wrangler file.
- [ ] Document required secrets and optional Turnstile/delivery settings.
- [ ] Document local memory behavior and production fail-closed behavior.
- [ ] Record the milestone as implementation-present but configuration/real-runtime verification pending.
- [ ] Commit documentation and state.

### Task 7: Source review and milestone handoff

**Files:**
- Review all files changed in Tasks 1–6.

**Interfaces:**
- Produces: a narrow branch diff with no deployment, merge, or Actions run.

- [ ] Confirm no real secret, resource ID, recipient, or contact detail was committed.
- [ ] Confirm no checkout/payment terminology was introduced.
- [ ] Confirm current JSON clients remain accepted for backward compatibility.
- [ ] Confirm production cannot silently fall back to memory.
- [ ] Confirm attachment rollback and duplicate behavior are represented in code and tests.
- [ ] Compare the final branch scope and report runtime verification honestly.
