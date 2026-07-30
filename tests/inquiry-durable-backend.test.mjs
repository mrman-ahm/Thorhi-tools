import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("production inquiry route proxies multipart submissions and fails closed", async () => {
  const [route, requestParser, backend, storage] = await Promise.all([
    read("src/app/api/inquiries/route.ts"),
    read("src/lib/inquiry-request.ts"),
    read("src/lib/inquiry-backend.ts"),
    read("src/lib/inquiry-storage.ts"),
  ]);

  assert.match(route, /parseInquiryRequest/);
  assert.match(route, /submitDurableInquiry/);
  assert.match(route, /process\.env\.NODE_ENV === "production"/);
  assert.match(route, /status: 503/);
  assert.doesNotMatch(route, /Durable production delivery is not configured yet/);
  assert.match(requestParser, /request\.formData\(\)/);
  assert.match(requestParser, /formData\.get\("payload"\)/);
  assert.match(requestParser, /formData\.get\("attachment"\)/);
  assert.match(backend, /INQUIRY_API_URL/);
  assert.match(backend, /INQUIRY_API_SECRET/);
  assert.match(backend, /x-throhi-client-fingerprint/);
  assert.match(backend, /cloudflare-d1-r2/);
  assert.match(storage, /"development-memory" \| "cloudflare-d1-r2"/);
});

test("inquiry client sends the actual attachment in multipart form data", async () => {
  const client = await read("src/app/rebuild/inquiry/inquiry-client.tsx");

  assert.match(client, /useRef<HTMLInputElement>/);
  assert.match(client, /new FormData\(\)/);
  assert.match(client, /formData\.set\(\s*"payload"/);
  assert.match(client, /formData\.set\("attachment", selectedAttachment\)/);
  assert.match(client, /attachmentInputRef\.current\?\.files\?\.\[0\]/);
  assert.doesNotMatch(client, /headers:\s*\{\s*"Content-Type": "application\/json"/);
});

test("Cloudflare inquiry worker persists D1 records, R2 attachments, and delivery outbox", async () => {
  const [worker, migration, config] = await Promise.all([
    read("workers/inquiry-api/src/index.ts"),
    read("workers/inquiry-api/migrations/0001_inquiry_backend.sql"),
    read("workers/inquiry-api/wrangler.example.jsonc"),
  ]);

  assert.match(worker, /env\.DB\.prepare/);
  assert.match(worker, /env\.DB\.batch/);
  assert.match(worker, /env\.ATTACHMENTS\.put/);
  assert.match(worker, /env\.ATTACHMENTS\.delete/);
  assert.match(worker, /challenges\.cloudflare\.com\/turnstile\/v0\/siteverify/);
  assert.match(worker, /inquiry_rate_limits/);
  assert.match(worker, /inquiry_delivery_outbox/);
  assert.match(worker, /submission_token/);
  assert.match(worker, /ctx\.waitUntil/);
  assert.match(migration, /submission_token TEXT NOT NULL UNIQUE/);
  assert.match(migration, /reference TEXT NOT NULL UNIQUE/);
  assert.match(migration, /CREATE TABLE inquiry_items/);
  assert.match(migration, /CREATE TABLE inquiry_delivery_outbox/);
  assert.match(migration, /CREATE TABLE inquiry_rate_limits/);
  assert.match(config, /"binding": "DB"/);
  assert.match(config, /"binding": "ATTACHMENTS"/);
});

test("backend documentation exposes setup without committing real secrets or resource ids", async () => {
  const [docs, vars, config] = await Promise.all([
    read("docs/backend/INQUIRY_BACKEND.md"),
    read("workers/inquiry-api/.dev.vars.example"),
    read("workers/inquiry-api/wrangler.example.jsonc"),
  ]);

  assert.match(docs, /D1/i);
  assert.match(docs, /R2/i);
  assert.match(docs, /Turnstile/i);
  assert.match(docs, /production fails closed/i);
  assert.match(vars, /INQUIRY_API_SECRET=/);
  assert.match(vars, /FINGERPRINT_SECRET=/);
  assert.match(config, /REPLACE_WITH_D1_DATABASE_ID/);
  assert.doesNotMatch(`${docs}\n${vars}`, /sk_live_|AIza|BEGIN PRIVATE KEY/);
});
