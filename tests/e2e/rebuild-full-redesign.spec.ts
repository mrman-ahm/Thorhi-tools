import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function enterHomepage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  const enter = page.getByRole("button", {
    name: /enter the THROHI website|slide the opening cover away/i,
  });
  if (await enter.isVisible().catch(() => false)) await enter.click();
  await expect(page.locator("[data-redesign-hero]")).toBeVisible();
}

async function openProduct(page: Page) {
  await page.goto("/rebuild/products?q=04-0101");
  const entry = page.locator("[data-catalogue-record]").first();
  await expect(entry).toBeVisible();
  await entry.getByRole("link", { name: /View .* catalogue code/i }).click();
  await expect(page.locator("[data-product-dossier]")).toBeVisible();
}

function seriousViolations(result: Awaited<ReturnType<AxeBuilder["analyze"]>>) {
  return result.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );
}

test("whole rebuild uses one precision heritage contract", async ({ page }) => {
  await enterHomepage(page);
  await expect(
    page.locator('[data-redesign-contract="precision-heritage-house-v1"]'),
  ).toHaveCount(1);
  await expect(page.locator("[data-redesign-header]")).toBeVisible();
  await expect(page.locator("[data-redesign-footer]")).toBeAttached();
});

test("homepage follows the complete editorial sequence", async ({ page }) => {
  await enterHomepage(page);

  for (const selector of [
    "[data-redesign-hero]",
    "[data-home-divisions]",
    "[data-home-selected]",
    "[data-home-company]",
    "[data-home-evolution]",
    "[data-home-utilities]",
  ]) {
    await expect(page.locator(selector)).toHaveCount(1);
  }

  await expect(page.locator("[data-hero-instrument]")).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse instruments" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Build an inquiry" })).toBeVisible();
});

test("catalogue keeps search, filters, records, and inquiry state", async ({ page }) => {
  await page.goto("/rebuild/products");
  await expect(page.locator("[data-redesign-catalogue]")).toBeVisible();
  await expect(page.locator("[data-catalogue-search]")).toBeVisible();
  await expect(page.locator("[data-catalogue-record]").first()).toBeVisible();

  const search = page.getByLabel("Search by product name or code");
  await search.fill("04-0101");
  await expect(page.locator("[data-catalogue-record]").first()).toContainText("04-0101");

  const add = page.locator("[data-catalogue-record-footer] button").first();
  await add.click();
  await expect(add).toContainText(/Add another|1/);
});

test("product examination preserves procurement behavior", async ({ page }) => {
  await openProduct(page);
  await expect(page.locator("[data-product-media-stage]")).toBeVisible();
  await expect(page.locator("[data-product-identity] h1")).toBeVisible();
  await expect(page.locator("[data-product-spec-ledger]")).toBeVisible();
  await expect(page.locator("[data-variant-ledger]")).toBeVisible();

  const action = page.locator("[data-product-action]").first();
  await action.getByRole("button").click();
  await expect(action).toContainText(/1 in list|Add another/);
});

test("inquiry remains a four-stage procurement worksheet", async ({ page }) => {
  await page.goto("/rebuild/inquiry?manual=1");
  await expect(page.locator("[data-redesign-inquiry]")).toBeVisible();
  await expect(page.locator("[data-inquiry-stages] span")).toHaveCount(4);
  await expect(page.locator("[data-inquiry-review]")).toBeVisible();

  await page.getByLabel("Known name or description").fill("Custom clamp reference");
  await page.getByRole("button", { name: "Add to inquiry" }).click();
  await expect(page.locator("[data-inquiry-item]")).toContainText("Custom clamp reference");
});

test("corporate and utility routes use shared editorial boundaries", async ({ page }) => {
  for (const route of [
    "/rebuild/company",
    "/rebuild/catalogues",
    "/rebuild/contact",
    "/rebuild/privacy",
    "/rebuild/terms",
    "/rebuild/missing-route",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, route).toBeLessThanOrEqual(1);
  }
});

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`full redesign has no horizontal overflow at ${width}px`, async ({ page }) => {
    const height = width <= 390 ? 844 : width === 768 ? 1024 : width === 1280 ? 800 : 1000;
    await page.setViewportSize({ width, height });

    for (const route of ["/rebuild/products", "/rebuild/inquiry?manual=1", "/rebuild/company"]) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} at ${width}`).toBeLessThanOrEqual(1);
    }
  });
}

test("representative redesigned routes have no serious accessibility violations", async ({ page }) => {
  for (const route of [
    "/rebuild/products",
    "/rebuild/inquiry?manual=1",
    "/rebuild/company",
    "/rebuild/privacy",
  ]) {
    await page.goto(route);
    const result = await new AxeBuilder({ page }).analyze();
    expect(seriousViolations(result), route).toEqual([]);
  }
});
