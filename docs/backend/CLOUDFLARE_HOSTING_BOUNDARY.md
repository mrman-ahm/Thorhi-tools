# Cloudflare Hosting Boundary for Inquiry Submission

The durable inquiry architecture contains two server components:

1. the website's same-origin Next.js route handler at `/api/inquiries`;
2. the dedicated Cloudflare inquiry Worker at `/v1/inquiries`.

The browser must never receive `INQUIRY_API_SECRET`, so it cannot safely replace the Next.js proxy by calling the Worker directly.

## Required website runtime

The production website host must execute Next.js route handlers. A static or assets-only deployment that serves only the `.next`/`dist` files cannot execute `/api/inquiries` and is not sufficient for production inquiry delivery.

Use one of these supported architecture classes:

- deploy the Next.js application through a Cloudflare-compatible Next.js Worker adapter;
- host the Next.js application on another server runtime while keeping the inquiry Worker on Cloudflare;
- move the same-origin proxy logic into an authenticated website Worker that owns the public website route.

Do not enable the public inquiry form with durable-success messaging until an HTTP request to the deployed website's `/api/inquiries` reaches the route handler and then reaches the dedicated Worker.

## Production smoke boundary

Before cutover, verify:

1. `POST https://<website-host>/api/inquiries` does not return a static 404 or asset fallback;
2. missing website backend variables return the intentional HTTP 503 response;
3. configured variables allow the proxy to reach `POST /v1/inquiries`;
4. the browser never receives or embeds `INQUIRY_API_SECRET` or `INQUIRY_FINGERPRINT_SECRET`;
5. the Worker accepts only the configured website origin and shared secret;
6. the final response contains `storageMode: cloudflare-d1-r2` only after D1 persistence succeeds.

The separate Worker health endpoint confirms Worker bindings, but it does not prove that the website's same-origin proxy is executable.
