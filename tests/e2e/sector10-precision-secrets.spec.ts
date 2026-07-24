import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function waitForSecrets(page: import("@playwright/test").Page) {
  await expect(page.locator(".precision-secret-layer")).toHaveAttribute("data-ready", "true");
}

async function activateWithKeyboard(page: import("@playwright/test").Page) {
  await waitForSecrets(page);
  await page.keyboard.type("THROHI", { delay: 35 });
  await expect(page.locator("html")).toHaveAttribute("data-precision-secret", "active");
}

test.describe("Sector 10 restrained precision secrets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
    await waitForSecrets(page);
  });

  test("THROHI key sequence activates the temporary layer and Escape closes it", async ({ page }, testInfo) => {
    await activateWithKeyboard(page);
    await expect(page.locator(".precision-secret-layer")).toBeVisible();
    await expect(page.getByRole("status")).toContainText("precision layer active");

    const screenshot = await page.screenshot({ animations: "disabled" });
    await testInfo.attach(`sector10-precision-layer-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });

    await page.keyboard.press("Escape");
    await expect.poll(() => page.locator("html").getAttribute("data-precision-secret")).toBeNull();
    await expect(page.locator(".precision-secret-layer")).toBeHidden();
  });

  test("typing THROHI inside the catalogue command never activates the secret", async ({ page }) => {
    await page.getByRole("link", { name: "Open catalogue search command" }).click();
    const input = page.getByRole("combobox");
    await expect(input).toBeFocused();
    await input.pressSequentially("THROHI", { delay: 35 });
    await expect.poll(() => page.locator("html").getAttribute("data-precision-secret")).toBeNull();
    await expect(page.locator(".precision-secret-layer")).toBeHidden();
  });

  test("holding the brand suppresses only the generated click and preserves later navigation", async ({ page }) => {
    const brand = page.locator(".brand").first();
    await brand.dispatchEvent("pointerdown", { button: 0, pointerType: "mouse", isPrimary: true });
    await page.waitForTimeout(780);
    await expect(page.locator("html")).toHaveAttribute("data-precision-secret", "active");
    await brand.dispatchEvent("pointerup", { button: 0, pointerType: "mouse", isPrimary: true });

    await brand.click();
    await expect(page).toHaveURL(/\/products$/);

    await brand.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("reduced motion uses a static accessible state", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await activateWithKeyboard(page);

    const animationName = await page.locator(".precision-secret-layer").evaluate(element => getComputedStyle(element).animationName);
    expect(animationName).toBe("none");

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
