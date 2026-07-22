import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function openCommand(page: import("@playwright/test").Page) {
  await page.getByRole("link", { name: "Open catalogue search command" }).click();
  const dialog = page.getByRole("dialog", { name: "Find an instrument." });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe("Sector 7 global catalogue command", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test("opens from the header, focuses search, closes with Escape, and restores focus", async ({ page }) => {
    const trigger = page.getByRole("link", { name: "Open catalogue search command" });
    const dialog = await openCommand(page);
    const input = dialog.getByRole("combobox");
    await expect(input).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.dataset.searchOpen)).toBe("true");

    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(dialog).toBeHidden();
    await expect.poll(() => page.evaluate(() => document.body.dataset.searchOpen ?? "closed")).toBe("closed");
  });

  test("opens with Control+K and slash outside typing fields", async ({ page }) => {
    await page.keyboard.press("Control+K");
    await expect(page.getByRole("dialog", { name: "Find an instrument." })).toBeVisible();
    await page.keyboard.press("Escape");

    await page.keyboard.press("/");
    await expect(page.getByRole("dialog", { name: "Find an instrument." })).toBeVisible();
  });

  test("shows exact-code ranking and opens the active result with Enter", async ({ page }) => {
    const dialog = await openCommand(page);
    const input = dialog.getByRole("combobox");
    await input.fill("thr sc 001");

    const first = dialog.getByRole("option").first();
    await expect(first).toContainText("Operating Scissors");
    await expect(first).toContainText("exact code");
    await expect(first).toHaveAttribute("aria-selected", "true");

    await input.press("Enter");
    await expect(page).toHaveURL(/\/products\/surgical\/scissors\/operating-scissors$/);
    await expect(page.getByRole("heading", { level: 1, name: "Operating Scissors" })).toBeVisible();
  });

  test("arrow keys move the active suggestion without disturbing input focus", async ({ page }) => {
    const dialog = await openCommand(page);
    const input = dialog.getByRole("combobox");
    await input.fill("surgical");
    const options = dialog.getByRole("option");
    expect(await options.count()).toBeGreaterThan(1);
    await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");

    await input.press("ArrowDown");
    await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(input).toBeFocused();

    await input.press("ArrowUp");
    await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(input).toBeFocused();
  });

  test("command has no serious automated accessibility violations", async ({ page }) => {
    const dialog = await openCommand(page);
    await dialog.getByRole("combobox").fill("scissors");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});

test.describe("Sector 7 full search route", () => {
  test("presents exact and technical match hierarchy", async ({ page }) => {
    await page.goto("/search?q=THR-SC-001");
    await expect(page.getByRole("heading", { level: 1, name: /Find the instrument/ })).toBeVisible();
    const first = page.locator(".search-result-object").first();
    await expect(first).toHaveClass(/match-exact/);
    await expect(first).toContainText("exact code");
    await expect(first).toContainText("Operating Scissors");
  });

  test("preserves URL-driven filters and sorting", async ({ page }) => {
    await page.goto("/search?q=SC-00&division=surgical&family=scissors&sort=code");
    await expect(page.getByLabel("Search query")).toHaveValue("SC-00");
    await expect(page.getByLabel("Division")).toHaveValue("surgical");
    await expect(page.getByLabel("Family")).toHaveValue("scissors");
    await expect(page.getByLabel("Sort")).toHaveValue("code");
    await expect(page.getByRole("heading", { name: "2 matches" })).toBeVisible();
  });

  test("keeps manual inquiry recovery visible when no result matches", async ({ page }) => {
    await page.goto("/search?q=definitely-not-a-product");
    await expect(page.getByRole("heading", { name: "Keep the known reference." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Add unlisted item/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Open manual inquiry/ })).toBeVisible();
  });

  test("search route remains accessible and free of horizontal overflow", async ({ page }, testInfo) => {
    await page.goto("/search?q=scissors");
    const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
    await testInfo.attach(`sector7-search-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
  });
});
