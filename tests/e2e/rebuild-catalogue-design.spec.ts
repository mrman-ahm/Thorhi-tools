import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function openCatalogue(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild/products");
  await expect(page.locator("[data-catalogue-masthead]")).toBeVisible();
  await expect(page.locator("[data-catalogue-search]")).toBeVisible();
}

test("catalogue masthead and command search lead discovery", async ({ page }) => {
  await openCatalogue(page);
  await expect(page.getByRole("heading", { level: 1, name: "Product catalogue" })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: /Search by product name or code/i })).toBeVisible();
  await expect(page.getByText(/indexed products/i)).toBeVisible();
  await expect(page.getByText("Variant codes", { exact: true })).toBeVisible();
});

test("exact catalogue-code search remains URL-backed", async ({ page }) => {
  await openCatalogue(page);
  const search = page.getByRole("searchbox", { name: /Search by product name or code/i });
  await search.fill("04-0101");
  await expect(page).toHaveURL(/q=04-0101/);
  const ledger = page.locator("[data-catalogue-ledger]");
  await expect(ledger.getByText("04-0101", { exact: true }).first()).toBeVisible();
});

test("division and family filters remain URL-backed", async ({ page }) => {
  await openCatalogue(page);
  const filters = test.info().project.name === "mobile-chromium"
    ? page.locator("details").filter({ hasText: "Filters" })
    : page.getByRole("complementary", { name: "Catalogue filters" });

  if (test.info().project.name === "mobile-chromium") {
    await filters.locator("summary").click();
  }

  await filters.getByText("Surgical", { exact: true }).click();
  await expect(page).toHaveURL(/division=surgical/);

  const family = filters.getByLabel("Product family");
  const optionValue = await family.locator("option").nth(1).getAttribute("value");
  expect(optionValue).toBeTruthy();
  await family.selectOption(optionValue!);
  await expect(page).toHaveURL(/family=/);
});

test("product entries expose procurement context and inquiry state", async ({ page }) => {
  await openCatalogue(page);
  const first = page.locator("[data-product-entry]").first();
  await expect(first).toBeVisible();
  await expect(first.getByText(/variant code|Single catalogue code/i)).toBeVisible();
  await expect(first.getByRole("link", { name: /View .* catalogue code/i })).toBeVisible();

  const add = first.getByRole("button", { name: /Add to Inquiry/i });
  await add.click();
  await expect(first.getByRole("button", { name: /Add another · 1/i })).toBeVisible();
  await first.getByRole("button", { name: /Add another · 1/i }).click();
  await expect(first.getByRole("button", { name: /Add another · 2/i })).toBeVisible();
});

test("pagination preserves catalogue context", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild/products?division=surgical");
  const pagination = page.getByRole("navigation", { name: "Catalogue pagination" });
  await expect(pagination).toBeVisible();
  await pagination.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/division=surgical/);
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator("[data-catalogue-ledger]")).toBeVisible();
});

test("mobile filters expose active context", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile-chromium");
  await openCatalogue(page);
  const details = page.locator("details").filter({ hasText: "Filters" });
  await details.locator("summary").click();
  await details.getByText("Dental", { exact: true }).click();
  await expect(page).toHaveURL(/division=dental/);
  await expect(details.locator("summary")).toContainText("1 active");
});

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`catalogue has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await openCatalogue(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("catalogue has no serious accessibility violations", async ({ page }) => {
  await openCatalogue(page);
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
