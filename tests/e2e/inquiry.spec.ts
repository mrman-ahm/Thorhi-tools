import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

function validPayload(projectName: string) {
  return {
    submissionToken: `test-submission-token-${projectName}`,
    items: [{ code: "THR-SC-001", name: "Operating Scissors", quantity: 2, note: "Seed test", manual: false }],
    buyer: { fullName: "Test Buyer", companyName: "Test Company", country: "Pakistan", email: "buyer@example.com", phone: "", preferredContact: "email" },
    generalRequirements: "Browser integration test",
    consent: true
  };
}

test("inquiry API rejects invalid data with field errors", async ({ request }) => {
  const response = await request.post("/api/inquiries", { data: { submissionToken: "short", items: [], buyer: {}, consent: false } });
  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body.ok).toBe(false);
  expect(body.errors.items).toBeTruthy();
  expect(body.errors["buyer.email"]).toBeTruthy();
});

test("inquiry API validates a request and prevents duplicate submission", async ({ request }, testInfo) => {
  const payload = validPayload(testInfo.project.name);
  const first = await request.post("/api/inquiries", { data: payload });
  expect(first.status()).toBe(201);
  const firstBody = await first.json();
  expect(firstBody.ok).toBe(true);
  expect(firstBody.duplicate).toBe(false);
  expect(firstBody.storageMode).toBe("development-memory");
  expect(firstBody.reference).toMatch(/^THR-\d{8}-[A-Z0-9]{8}$/);
  const duplicate = await request.post("/api/inquiries", { data: payload });
  expect(duplicate.status()).toBe(200);
  const duplicateBody = await duplicate.json();
  expect(duplicateBody.duplicate).toBe(true);
  expect(duplicateBody.reference).toBe(firstBody.reference);
});

test("inquiry basket supports quantities, notes, removal, and undo", async ({ page }) => {
  await page.goto("/products/surgical/scissors/operating-scissors");
  await page.getByRole("button", { name: "Add to inquiry: Operating Scissors", exact: true }).click();
  await page.goto("/inquiry");
  const quantity = page.getByRole("spinbutton", { name: "Quantity", exact: true });
  await expect(quantity).toHaveValue("1");
  await page.getByRole("button", { name: "Increase quantity for Operating Scissors", exact: true }).click();
  await expect(quantity).toHaveValue("2");
  await page.getByLabel("Product-specific note", { exact: true }).fill("Specific requirement");
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.getByText("Operating Scissors removed.")).toBeVisible();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Operating Scissors", exact: true })).toBeVisible();
});

test("manual item and attachment validation preserve the draft", async ({ page }) => {
  await page.goto("/inquiry?manual=1&reference=KNOWN-REF");
  await expect(page.getByLabel("Known code or reference")).toHaveValue("KNOWN-REF");
  await page.getByLabel("Known name or description").fill("Unlisted reference product");
  await page.getByRole("button", { name: "Add to inquiry", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Unlisted reference product" })).toBeVisible();
  await page.getByLabel("Requirements applying to the full inquiry").fill("Preserved requirements");
  await page.reload();
  await expect(page.getByText("Unlisted reference product")).toBeVisible();
  await expect(page.getByLabel("Requirements applying to the full inquiry")).toHaveValue("Preserved requirements");
});

test("full inquiry form submits and routes to explicit development confirmation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Full form submission runs once");
  await page.goto("/products/surgical/scissors/operating-scissors");
  await page.getByRole("button", { name: "Add to inquiry: Operating Scissors", exact: true }).click();
  await page.goto("/inquiry");
  await page.getByLabel("Full name").fill("Test Buyer");
  await page.getByLabel("Company name").fill("Test Company");
  await page.getByLabel("Country").selectOption("Pakistan");
  await page.getByLabel("Email").fill("buyer@example.com");
  await page.getByLabel("Preferred contact").selectOption("email");
  await page.getByText("I confirm that the provided information may be used to respond to this inquiry.").click();
  await page.getByRole("button", { name: "Submit inquiry" }).click();
  await expect(page).toHaveURL(/\/inquiry\/success\?reference=/);
  await expect(page.getByRole("heading", { name: /accepted by the current application workflow/ })).toBeVisible();
  await expect(page.getByText("Development memory adapter")).toBeVisible();
  const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
  await testInfo.attach("inquiry-success.png", { body: screenshot, contentType: "image/png" });
});

test("inquiry page has no serious automated accessibility violations", async ({ page }) => {
  await page.goto("/inquiry");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
