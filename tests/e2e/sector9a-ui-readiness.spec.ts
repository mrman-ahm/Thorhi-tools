import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const representativeRoutes = [
  ["home", "/"],
  ["products", "/products"],
  ["family", "/products/surgical/scissors"],
  ["product", "/products/surgical/scissors/operating-scissors"],
  ["search", "/search?q=scissors"],
  ["inquiry", "/inquiry"],
  ["company", "/company"]
] as const;

const auditViewports = [
  ["laptop", 1280, 800],
  ["tablet-landscape", 1024, 768],
  ["tablet-portrait", 768, 1024],
  ["large-mobile", 430, 932],
  ["narrow-mobile", 360, 800]
] as const;

for (const [viewportName, width, height] of auditViewports) {
  test(`readiness matrix ${viewportName}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "The readiness matrix runs once with explicit viewport sizes");
    await page.setViewportSize({ width, height });

    for (const [routeName, route] of representativeRoutes) {
      await page.goto(route);
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      expect(dimensions.scrollWidth, `${routeName} at ${viewportName}`).toBeLessThanOrEqual(dimensions.clientWidth + 1);

      const main = page.locator("main");
      await expect(main).toBeVisible();
      const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
      await testInfo.attach(`sector9a-${routeName}-${viewportName}.png`, { body: screenshot, contentType: "image/png" });
    }
  });
}

test("internal page display scale stays below the motion-readiness ceiling", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Computed scale audit runs once");

  for (const route of ["/products", "/products/surgical", "/products/surgical/scissors", "/products/surgical/scissors/operating-scissors", "/search?q=scissors", "/inquiry", "/company"]) {
    await page.goto(route);
    const heading = page.locator("main h1").first();
    await expect(heading).toBeVisible();
    const fontSize = await heading.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize));
    const viewportWidth = page.viewportSize()?.width ?? 1440;
    expect(fontSize, `${route} heading`).toBeLessThanOrEqual(Math.min(110, viewportWidth * 0.09));
  }
});

test("representative routes remain accessible after readiness calibration", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Extended accessibility audit runs once");

  for (const [, route] of representativeRoutes) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, `${route}\n${JSON.stringify(serious, null, 2)}`).toEqual([]);
  }
});

test("readiness layer exposes stable reduced-motion composition", async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("searchbox").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Search", exact: true }).first()).toBeVisible();
  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflowX);
  expect(["visible", "hidden", "clip"]).toContain(bodyOverflow);
  await context.clearCookies();
});
