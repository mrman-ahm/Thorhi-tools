import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  ["products", "/products", /Find instruments/],
  ["division", "/products/surgical", /Surgical Instruments/],
  ["family", "/products/surgical/scissors", /Scissors/],
  ["product", "/products/surgical/scissors/operating-scissors", /Operating Scissors/],
  ["search", "/search?q=THR-SC-001", /Search names, families, and product codes/],
  ["company", "/company", /Evidence before claims/],
  ["resources", "/resources", /Documents publish only after verification/],
  ["contact", "/contact", /Send product context/]
] as const;

for (const [name, route, heading] of routes) {
  test(`${name} route renders without overflow`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    if (["products", "family", "product", "search"].includes(name)) {
      const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
      await testInfo.attach(`${name}-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
    }
  });
}

test("exact product code ranks first", async ({ page }) => {
  await page.goto("/search?q=thr+sc+001");
  const firstResult = page.locator(".search-result-wrap").first();
  await expect(firstResult).toContainText("Operating Scissors");
  await expect(firstResult).toContainText("exact code");
});

test("partial code and filters preserve query state", async ({ page }) => {
  await page.goto("/search?q=SC-00&division=surgical&family=scissors");
  await expect(page.getByLabel("Search query")).toHaveValue("SC-00");
  await expect(page.getByLabel("Division")).toHaveValue("surgical");
  await expect(page.getByLabel("Family")).toHaveValue("scissors");
  await expect(page.getByText(/2 matches/)).toBeVisible();
});

test("family no-results recovery is explicit", async ({ page }) => {
  await page.goto("/products/surgical/scissors?q=does-not-exist");
  await expect(page.getByRole("heading", { name: "No products matched this family search." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add unlisted item" })).toBeVisible();
});

test("product addition persists across catalogue routes", async ({ page }) => {
  await page.goto("/products/surgical/scissors/operating-scissors");
  await page.getByRole("button", { name: "Add to inquiry: Operating Scissors", exact: true }).click();
  await expect(page.getByRole("button", { name: "Update inquiry details for: Operating Scissors", exact: true })).toBeVisible();
  await page.goto("/inquiry");
  await expect(page.getByRole("heading", { name: "Operating Scissors" })).toBeVisible();
  await expect(page.getByText("THR-SC-001")).toBeVisible();
});

test("catalogue page has no serious automated accessibility violations", async ({ page }) => {
  await page.goto("/products");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test("unknown routes use the production 404", async ({ page }) => {
  const response = await page.goto("/route-that-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This catalogue route does not exist." })).toBeVisible();
});
