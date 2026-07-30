# THROHI Durable Inquiry Backend

## Purpose

The rebuild inquiry flow uses a same-origin Next.js route as a secure proxy and a separate Cloudflare Worker as the durable service.

- D1 stores inquiry headers, normalized product lines, delivery state, and rate-limit windows.
- R2 stores optional reference attachments privately.
- Turnstile is optional until both its public site key and Worker secret are configured.
- A signed delivery webhook is optional and provider-neutral.
- Local non-production development can use the explicit memory adapter.
- **Production fails closed** when `INQUIRY_API_URL` or `INQUIRY_API_SECRET` is missing. It never reports a successful durable submission from memory.

No recipient address, CRM endpoint, Cloudflare resource ID, or secret is committed to the repository.

## Request path

1. The browser validates the form and sends multipart `FormData` to `/api/inquiries`.
2. The Next.js route validates catalogue identities, buyer fields, consent, and attachment metadata.
3. The route computes a daily privacy-preserving request fingerprint.
4. The route forwards the sanitized payload and optional file to the Cloudflare Worker using a shared secret.
5. The Worker verifies origin, optional Turnstile, duplicate token, and rate limit.
6. The Worker writes the attachment to R2, then writes the inquiry, line items, and delivery outbox to D1.
7. If D1 persistence fails after an upload, the R2 object is removed.
8. If a delivery webhook is configured, the Worker attempts it asynchronously and records success or retry state.

## 1. Create Cloudflare resources

Run from the repository root with a Cloudflare-authenticated terminal:

```bash
npx wrangler@latest d1 create throhi-inquiries
npx wrangler@latest r2 bucket create throhi-inquiry-attachments
```

Copy the Worker configuration template:

```bash
cp workers/inquiry-api/wrangler.example.jsonc workers/inquiry-api/wrangler.jsonc
```

In `workers/inquiry-api/wrangler.jsonc`:

- replace `REPLACE_WITH_D1_DATABASE_ID` with the D1 ID returned by Cloudflare;
- replace `REPLACE_WITH_R2_BUCKET_NAME` with the created R2 bucket name;
- replace `https://REPLACE_WITH_WEBSITE_HOST` with the exact rebuild/production website origin;
- use a comma-separated `ALLOWED_ORIGINS` value only when more than one exact origin is required.

Do not commit the completed `wrangler.jsonc` if it contains environment-specific identifiers that should remain private to operations.

## 2. Apply the D1 migration

Local preview database:

```bash
npx wrangler@latest d1 migrations apply throhi-inquiries \
  --local \
  --config workers/inquiry-api/wrangler.jsonc
```

Remote production database:

```bash
npx wrangler@latest d1 migrations apply throhi-inquiries \
  --remote \
  --config workers/inquiry-api/wrangler.jsonc
```

The migration creates:

- `inquiries`;
- `inquiry_items`;
- `inquiry_delivery_outbox`;
- `inquiry_rate_limits`.

`submission_token` and `reference` are unique, so retries cannot create duplicate inquiries.

## 3. Configure Worker secrets

Generate independent high-entropy values. The website and Worker must share the same `INQUIRY_API_SECRET`.

```bash
npx wrangler@latest secret put INQUIRY_API_SECRET \
  --config workers/inquiry-api/wrangler.jsonc
```

Optional Turnstile server secret:

```bash
npx wrangler@latest secret put TURNSTILE_SECRET_KEY \
  --config workers/inquiry-api/wrangler.jsonc
```

Do not set `TURNSTILE_SECRET_KEY` until `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is also configured for the website. When the secret exists, the Worker requires a valid single-use token.

Optional delivery endpoint:

```bash
npx wrangler@latest secret put INQUIRY_DELIVERY_WEBHOOK_URL \
  --config workers/inquiry-api/wrangler.jsonc
npx wrangler@latest secret put INQUIRY_DELIVERY_WEBHOOK_SECRET \
  --config workers/inquiry-api/wrangler.jsonc
```

The Worker sends:

- `Content-Type: application/json`;
- `Idempotency-Key: <inquiry-reference>`;
- `X-THROHI-Signature: sha256=<HMAC-SHA256>`.

The delivery receiver must verify the HMAC over the exact request body and treat the inquiry reference as an idempotency key.

## 4. Run and deploy the Worker

Local Worker:

```bash
npx wrangler@latest dev \
  --config workers/inquiry-api/wrangler.jsonc
```

Deploy:

```bash
npx wrangler@latest deploy \
  --config workers/inquiry-api/wrangler.jsonc
```

Health endpoint:

```text
GET /health
```

The response reports whether D1, R2, allowed origins, Turnstile, and delivery settings are present. It does not expose secret values.

## 5. Configure website environment variables

Use `.env.example` as the source template.

Required for durable submissions:

```text
INQUIRY_API_URL=https://<deployed-worker-host>
INQUIRY_API_SECRET=<same value stored on Worker>
INQUIRY_FINGERPRINT_SECRET=<independent random secret>
```

Optional Turnstile client key:

```text
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<public site key>
```

The fingerprint secret is used only by the website proxy. The Worker receives a daily SHA-256 fingerprint, not the original IP address.

## 6. Storage and privacy behavior

- R2 objects use non-public keys scoped by date and inquiry reference.
- The public success response exposes only the inquiry reference and storage mode.
- D1 stores the validated buyer information and product request needed to respond.
- The delivery payload includes attachment metadata but not a public R2 URL.
- The current code does not expose an attachment download endpoint.
- Retention and deletion periods must be approved before public cutover.
- Direct database/R2 access must remain restricted to authorized operators.

## 7. Rate limiting and duplicate behavior

- Maximum accepted new submissions: five per privacy-preserving fingerprint per ten-minute window.
- A duplicate `submissionToken` returns the original reference without inserting new rows or uploading a second attachment.
- Old rate-limit windows are removed asynchronously.

## 8. Failure behavior

- Missing production backend configuration: HTTP 503, browser state preserved.
- Invalid payload or file: HTTP 422 with field errors.
- Invalid origin or shared secret: HTTP 401/403.
- Failed Turnstile: HTTP 403.
- Rate limit exceeded: HTTP 429.
- R2 upload followed by D1 failure: uploaded object is deleted.
- Delivery webhook failure: inquiry remains stored and outbox moves to retry state.

## 9. Verification

Source contracts:

```bash
npm run backend:check
```

Full website gate remains separate from Worker deployment. Before public cutover, verify against real Cloudflare resources with:

1. one inquiry without an attachment;
2. one inquiry with each allowed attachment type;
3. duplicate submission-token retry;
4. invalid file type and oversized file;
5. rate-limit response;
6. Turnstile success, expiration, and replay rejection;
7. delivery webhook success and retry behavior;
8. D1 rows and private R2 object presence;
9. removal of test buyer data after validation.
