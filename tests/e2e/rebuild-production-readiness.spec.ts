import { expect, test } from "@playwright/test";

test("crawler policy remains fail closed by default", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain("User-Agent: *");
  expect(body).toContain("Disallow: /");
});

test("rebuild responses remain independently non-indexed", async ({ page, request }) => {
  const response = await request.get("/rebuild");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");

  await page.goto("/rebuild");
  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/i);
  await expect(page.locator('meta[name="theme-color"]').first()).toHaveCount(1);
});

test("global security headers are present", async ({ request }) => {
  const response = await request.get("/rebuild/products");
  const headers = response.headers();

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["x-permitted-cross-domain-policies"]).toBe("none");
  expect(headers["x-dns-prefetch-control"]).toBe("off");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["permissions-policy"]).toContain("payment=()");
});

test("inquiry api responses are never cacheable or indexable", async ({ request }) => {
  const response = await request.post("/api/inquiries", { data: {} });
  const headers = response.headers();

  expect(response.status()).toBeGreaterThanOrEqual(400);
  expect(headers["cache-control"]).toContain("no-store");
  expect(headers["x-robots-tag"]).toContain("noindex");
});

test("readiness safeguards introduce no narrow viewport overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild/privacy");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
