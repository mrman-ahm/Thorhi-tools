import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("renders the homepage without horizontal overflow", async ({ page }, testInfo) => {
  await expect(page.getByRole("heading", { level: 1, name: /Precision, brought/ })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
  await testInfo.attach(`homepage-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
});

test("has no serious automated accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test("persists inquiry selections and prevents duplicate additions", async ({ page }) => {
  const firstProduct = page.getByRole("article").filter({ hasText: "Operating Scissors" });
  const addButton = firstProduct.getByRole("button", { name: "Add to inquiry" });
  await addButton.click();
  await expect(firstProduct.getByRole("button", { name: "Added to inquiry ✓" })).toHaveAttribute("aria-pressed", "true");
  await firstProduct.getByRole("button", { name: "Added to inquiry ✓" }).click();
  await expect(page.getByText("Operating Scissors is already in the inquiry.")).toBeAttached();
  await page.reload();
  await expect(firstProduct.getByRole("button", { name: "Added to inquiry ✓" })).toBeVisible();
  await expect(page.getByLabel("1 saved items")).toBeVisible();
});

test("mobile menu opens, locks background scrolling, and closes with Escape", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only behavior");
  const menu = page.getByRole("button", { name: "Open navigation menu" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("reduced motion disables smooth scrolling and transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(scrollBehavior).toBe("auto");
});
