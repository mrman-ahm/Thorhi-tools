import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function addOperatingScissors(page: import("@playwright/test").Page) {
  await page.goto("/products/surgical/scissors/operating-scissors");
  await page.getByRole("button", { name: "Add to inquiry: Operating Scissors", exact: true }).click();
  await page.goto("/inquiry");
}

test.describe("Sector 8 inquiry workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("empty inquiry exposes catalogue and manual recovery", async ({ page }) => {
    await page.goto("/inquiry");
    await expect(page.getByRole("heading", { level: 1, name: /One clear request/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your inquiry is empty." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse products" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add unlisted item" }).first()).toBeVisible();
  });

  test("preserves product quantity and notes and supports remove and undo", async ({ page }) => {
    await addOperatingScissors(page);
    const item = page.locator(".inquiry-row").filter({ hasText: "Operating Scissors" });
    await expect(item.getByRole("heading", { name: "Operating Scissors" })).toBeVisible();
    const quantity = item.getByLabel("Quantity", { exact: true });
    await quantity.fill("4");
    const note = item.getByLabel("Product-specific note", { exact: true });
    await note.fill("Curved reference requested");
    await page.reload();
    await expect(quantity).toHaveValue("4");
    await expect(note).toHaveValue("Curved reference requested");
    await item.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("Operating Scissors removed.")).toBeVisible();
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.getByRole("heading", { name: "Operating Scissors" })).toBeVisible();
  });

  test("adds a manual item and keeps it distinct", async ({ page }) => {
    await page.goto("/inquiry?manual=1&reference=REF-778");
    await expect(page.getByRole("heading", { name: "Add an unlisted product" })).toBeVisible();
    await page.getByLabel("Known name or description").fill("Reference scissors from buyer catalogue");
    await page.getByLabel("Known code or reference").fill("REF-778");
    await page.getByRole("button", { name: "Add to inquiry" }).click();
    const manualItem = page.locator(".inquiry-row").filter({ hasText: "Reference scissors from buyer catalogue" });
    await expect(manualItem.getByText("UNLISTED ITEM", { exact: true })).toBeVisible();
    await expect(manualItem.getByText("REF-778", { exact: true })).toBeVisible();
  });

  test("shows buyer validation without losing inquiry contents", async ({ page }) => {
    await addOperatingScissors(page);
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await expect(page.getByText("Enter the company or organization name.")).toBeVisible();
    await expect(page.getByText("Country is required.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Consent is required before submission.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Operating Scissors" })).toBeVisible();
  });

  test("server failure preserves products and entered buyer data", async ({ page }) => {
    await page.route("**/api/inquiries", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false, message: "Temporary submission failure." }) }));
    await addOperatingScissors(page);
    await page.getByLabel("Full name").fill("Test Buyer");
    await page.getByLabel("Company name").fill("Test Company");
    await page.getByLabel("Country").selectOption({ label: "Pakistan" });
    await page.getByLabel("Email").fill("buyer@example.com");
    await page.getByLabel(/I confirm that the provided information/).check();
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByText("Temporary submission failure.")).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveValue("Test Buyer");
    await expect(page.getByRole("heading", { name: "Operating Scissors" })).toBeVisible();
  });

  test("success route clears the saved inquiry and avoids a response-time promise", async ({ page }) => {
    await addOperatingScissors(page);
    await page.goto("/inquiry/success?reference=THR-TEST-001&storage=development-memory");
    await expect(page.getByRole("heading", { level: 1, name: /Your inquiry has been accepted/ })).toBeVisible();
    await expect(page.getByText("THR-TEST-001")).toBeVisible();
    await expect(page.getByText("No response-time promise is shown until THROHI approves one.")).toBeVisible();
    await page.goto("/inquiry");
    await expect(page.getByRole("heading", { name: "Your inquiry is empty." })).toBeVisible();
  });
});

test.describe("Sector 8 utility routes", () => {
  const routes = [
    ["company", "/company", /Evidence before claims/],
    ["resources", "/resources", /document archive built on verification/],
    ["contact", "/contact", /Send product context/],
    ["privacy", "/privacy", /Data minimization/],
    ["terms", "/terms", /supports inquiries, not online orders/]
  ] as const;

  for (const [name, route, heading] of routes) {
    test(`${name} route is readable, accessible, and free of horizontal overflow`, async ({ page }, testInfo) => {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
      expect(serious, `${route}\n${JSON.stringify(serious, null, 2)}`).toEqual([]);
      const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
      await testInfo.attach(`sector8-${name}-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
    });
  }

  test("404 remains recoverable", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This catalogue route does not exist." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Search products" })).toBeVisible();
  });
});
