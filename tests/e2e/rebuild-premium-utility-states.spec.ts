import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const stableRoutes = [
  "/rebuild/privacy",
  "/rebuild/terms",
  "/rebuild/route-that-does-not-exist",
] as const;

async function expectNoSeriousAxeViolations(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
}

test("rebuild legal routes expose readable verified boundaries", async ({ page }) => {
  for (const route of ["/rebuild/privacy", "/rebuild/terms"]) {
    await page.goto(route);
    const main = page.locator("main[data-utility-state]");
    await expect(main).toBeVisible();
    await expect(main.locator("h1")).toHaveCount(1);
    await expect(main.locator("article section")).toHaveCount(5);
    await expect(main.getByText(/legal review|direct review/i).first()).toBeVisible();
    await expect(main.locator('a[href="mailto:"]')).toHaveCount(0);
    await expect(main.locator('a[href="tel:"]')).toHaveCount(0);

    const paragraph = main.locator("article p").first();
    const fontSize = await paragraph.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(fontSize, route).toBeGreaterThanOrEqual(16);
  }
});

test("rebuild not-found state offers catalogue recovery", async ({ page }) => {
  await page.goto("/rebuild/route-that-does-not-exist");
  const main = page.locator('main[data-utility-state="not-found"]');
  await expect(main).toBeVisible();
  await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(main.getByRole("link", { name: "Search catalogue" })).toHaveAttribute(
    "href",
    "/rebuild/products",
  );
  await expect(
    main.getByRole("link", { name: "Add an unlisted instrument" }),
  ).toHaveAttribute("href", "/rebuild/inquiry?manual=1");
});

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`premium utility states have no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of stableRoutes) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, route).toBeLessThanOrEqual(1);
    }
  });
}

test("premium utility states have no serious accessibility violations", async ({ page }) => {
  test.setTimeout(90_000);
  for (const route of stableRoutes) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await expectNoSeriousAxeViolations(page);
  }
});
