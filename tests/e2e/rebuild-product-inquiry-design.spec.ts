import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function openProduct(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild/products?q=04-0101");
  const firstEntry = page.locator("[data-product-entry]").first();
  await expect(firstEntry).toBeVisible();
  await firstEntry.getByRole("link", { name: /View .* catalogue code/i }).click();
  await expect(page.locator("[data-product-examination]")).toBeVisible();
  await expect(page).toHaveURL(/\/rebuild\/products\/[^?]+\?from=/);
}

test("product examination preserves return context and inquiry state", async ({ page }) => {
  await openProduct(page);

  const back = page.getByRole("link", { name: "Back to catalogue" });
  await expect(back).toHaveAttribute("href", /\/rebuild\/products.*q=04-0101/);
  await expect(page.locator("[data-variant-ledger]")).toBeVisible();

  const primaryAction = page.locator("[data-product-action]").first();
  await expect(primaryAction).toContainText(/Add to Inquiry/i);
  await primaryAction.getByRole("button").click();
  await expect(primaryAction).toContainText(/1 in list|Add another · 1/i);

  const variantAction = page.locator("[data-variant-ledger] [data-product-action]").first();
  if (await variantAction.count()) {
    await variantAction.getByRole("button").click();
    await expect(variantAction).toContainText(/Add another · 1/i);
  }

  await page.getByRole("link", { name: "Review Inquiry List" }).click();
  await expect(page.locator("[data-inquiry-workspace]")).toBeVisible();
  await expect(page.locator("[data-inquiry-item]").first()).toBeVisible();
  await expect(page.locator("[data-inquiry-review]")).toContainText(/Product lines/i);
});

test("inquiry product records preserve quantity, note, remove, and undo", async ({ page }) => {
  await openProduct(page);
  await page.locator("[data-product-action]").first().getByRole("button").click();
  await page.getByRole("link", { name: "Review Inquiry List" }).click();

  const item = page.locator("[data-inquiry-item]").first();
  await item.getByLabel("Quantity").fill("4");
  await item.getByLabel("Item note").fill("Quote equivalent sizes where available");
  await expect(page.locator("[data-inquiry-review]")).toContainText("4");

  await item.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByRole("status")).toContainText(/removed/i);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator("[data-inquiry-item]").first()).toBeVisible();
});

test("manual instrument and buyer validation remain available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild/inquiry?manual=1");
  await expect(page.locator("[data-inquiry-masthead]")).toBeVisible();

  await page.getByLabel("Known name or description").fill("Custom clamp reference");
  await page.getByLabel("Known code or reference").fill("CLIENT-REF-7");
  await page.getByRole("button", { name: "Add to inquiry" }).click();
  await expect(page.locator("[data-inquiry-item]")).toContainText("Custom clamp reference");

  await page.getByRole("button", { name: "Submit inquiry" }).click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await expect(page.getByText("Enter the company or organization name.")).toBeVisible();
  await expect(page.getByText("Country is required.")).toBeVisible();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Consent is required before submission.")).toBeVisible();
});

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`product and inquiry routes have no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await openProduct(page);
    let overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await page.goto("/rebuild/inquiry?manual=1");
    overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("product and inquiry routes have no serious accessibility violations", async ({ page }) => {
  await openProduct(page);
  let result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);

  await page.goto("/rebuild/inquiry?manual=1");
  result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
