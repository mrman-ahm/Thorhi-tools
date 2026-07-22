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
  await expect(page.getByText("1 ITEM SAVED")).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(window.localStorage.getItem("throhi-inquiry-v2") ?? "{}").items?.length)).toBe(1);
  await page.reload();
  await expect(firstProduct.getByRole("button", { name: "Added to inquiry ✓" })).toBeVisible();
  await expect(page.getByText("1 ITEM SAVED")).toBeVisible();
});

test("mobile menu opens, locks background scrolling, and closes with Escape", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only behavior");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const closeMenu = page.getByRole("button", { name: "Close navigation menu" });
  await expect(closeMenu).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
});

test("reduced motion disables smooth scrolling and transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(scrollBehavior).toBe("auto");
});
