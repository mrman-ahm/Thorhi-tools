import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const utilityRoutes = [
  ["inquiry", "/inquiry", /One clear request/],
  ["company", "/company", /Evidence first/],
  ["resources", "/resources", /Documents with traceable context/],
  ["contact", "/contact", /Send the context needed to respond/],
  ["privacy", "/privacy", /Collect less/],
  ["terms", "/terms", /Inquiry first/]
] as const;

for (const [name, route, heading] of utilityRoutes) {
  test(`${name} utility route renders without overflow`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
    await testInfo.attach(`sector8-${name}-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
  });
}

test("inquiry presents the four review stages and non-order boundary", async ({ page }) => {
  await page.goto("/inquiry");
  const progress = page.getByLabel("Inquiry stages");
  await expect(progress).toContainText("Products");
  await expect(progress).toContainText("Requirements");
  await expect(progress).toContainText("Buyer details");
  await expect(progress).toContainText("Review");
  await expect(page.getByText("PRODUCT INQUIRY · NOT AN ONLINE ORDER")).toBeVisible();
});

test("invalid attachment is rejected without clearing the inquiry draft", async ({ page }) => {
  await page.goto("/inquiry?manual=1&reference=KNOWN-REF");
  await page.getByLabel("Known name or description").fill("Reference instrument");
  await page.getByRole("button", { name: "Add to inquiry", exact: true }).click();
  await page.getByLabel("Requirements applying to the full inquiry").fill("Keep this draft");
  await page.getByLabel("Optional reference attachment").setInputFiles({ name: "unsafe.exe", mimeType: "application/x-msdownload", buffer: Buffer.from("not an allowed attachment") });
  await expect(page.getByText("Use PDF, JPG, PNG, or WebP.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reference instrument" })).toBeVisible();
  await expect(page.getByLabel("Requirements applying to the full inquiry")).toHaveValue("Keep this draft");
});

test("server failure preserves products and buyer fields", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Failure preservation runs once");
  await page.goto("/products/surgical/scissors/operating-scissors");
  await page.getByRole("button", { name: "Add to inquiry: Operating Scissors", exact: true }).click();
  await page.goto("/inquiry");

  await page.route("**/api/inquiries", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false, message: "Temporary inquiry service failure." }) }));
  await page.getByLabel("Full name").fill("Preserved Buyer");
  await page.getByLabel("Company name").fill("Preserved Company");
  await page.getByLabel("Country").selectOption("Pakistan");
  await page.getByLabel("Email").fill("preserved@example.com");
  await page.getByText("I confirm that the provided information may be used to respond to this inquiry.").click();
  await page.getByRole("button", { name: "Submit inquiry" }).click();

  await expect(page.getByText("Temporary inquiry service failure.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operating Scissors", exact: true })).toBeVisible();
  await expect(page.getByLabel("Full name")).toHaveValue("Preserved Buyer");
  await expect(page.getByLabel("Company name")).toHaveValue("Preserved Company");
  await expect(page.getByLabel("Email")).toHaveValue("preserved@example.com");
});

test("company and contact pages do not publish unverified direct claims", async ({ page }) => {
  await page.goto("/company");
  await expect(page.getByText("PENDING APPROVAL").first()).toBeVisible();
  await expect(page.getByText(/UNVERIFIED CLAIMS REMAIN UNPUBLISHED/)).toBeVisible();

  await page.goto("/contact");
  await expect(page.getByText("Pending approval").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Open inquiry builder/ })).toBeVisible();
});

test("legal pages expose readable in-page indexes", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("link", { name: /Information collected/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Attachments" })).toBeVisible();
  await page.goto("/terms");
  await expect(page.getByRole("link", { name: /Inquiry status/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Final agreement" })).toBeVisible();
});

test("production 404 offers search, catalogue, and manual recovery", async ({ page }) => {
  const response = await page.goto("/sector8-route-that-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This catalogue route does not exist." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Search products" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse divisions" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add unlisted item" })).toBeVisible();
});

test("utility routes have no serious automated accessibility violations", async ({ page }) => {
  for (const route of ["/inquiry", "/company", "/resources", "/contact", "/privacy", "/terms", "/route-that-does-not-exist"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, `${route}\n${JSON.stringify(serious, null, 2)}`).toEqual([]);
  }
});
