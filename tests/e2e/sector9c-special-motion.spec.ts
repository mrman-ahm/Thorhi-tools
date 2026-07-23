import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function waitForSpecialMotion(page: import("@playwright/test").Page, selector: string) {
  const target = page.locator(selector);
  await expect(target).toHaveAttribute("data-special-motion", /ready|reduced|mobile-static|identity-ready/);
  return target;
}

test("homepage hero now presents the THROHI identity instead of an instrument placeholder", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator(".hero-experience");
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.locator(".hero-brand-stage")).toBeVisible();
  await expect(hero.getByRole("img", { name: "THROHI Medical Tools identity mark" })).toBeVisible();
  await expect(hero.locator(".instrument-half-upper")).toHaveCount(0);
});

test("macro controls draw the matching connector before settling the readout", async ({ page }) => {
  await page.goto("/");
  const section = page.locator(".macro-inspection-scene");
  await section.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Working end/i }).click();
  await expect(section).toHaveAttribute("data-active-region", "0");
  await expect(section.locator('.macro-connector-path[data-region="0"]')).toHaveAttribute("data-active", "true");
  await expect(section.getByRole("heading", { level: 3, name: "Working end" })).toBeVisible();
  await page.getByRole("button", { name: /Handle/i }).focus();
  await expect(section).toHaveAttribute("data-active-region", "2");
  await expect(section.locator('.macro-connector-path[data-region="2"]')).toHaveAttribute("data-active", "true");
});

test("product examination completes without delaying inquiry controls", async ({ page }) => {
  await page.goto("/products/surgical/scissors/operating-scissors");
  const motion = await waitForSpecialMotion(page, ".product-examination-motion");
  await expect(motion.locator(".product-stage-engraving")).toContainText("THR-SC-001");
  const submit = page.locator(".catalogue-detail-submit");
  await expect(submit).toBeVisible();
  await expect(submit).toBeEnabled();
  await expect(submit).toHaveAttribute("aria-label", /Add to inquiry: Operating Scissors/i);
  await submit.click();
  await expect(submit).toHaveAttribute("aria-label", /Update inquiry details for: Operating Scissors/i);
});

test("reduced motion keeps the identity, macro, and product information complete", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-brand-stage")).toBeVisible();
  await expect(page.getByRole("button", { name: /Working end/i })).toBeVisible();
  await page.goto("/products/surgical/scissors/operating-scissors");
  await expect(page.locator(".product-stage-engraving")).toContainText("THR-SC-001");
});

test("remaining special effects remain accessible and do not create overflow", async ({ page }, testInfo) => {
  for (const route of ["/", "/products/surgical/scissors/operating-scissors"]) {
    await page.goto(route);
    await page.waitForTimeout(900);
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth, `${route} on ${testInfo.project.name}`).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, `${route}\n${JSON.stringify(serious, null, 2)}`).toEqual([]);
  }
});
