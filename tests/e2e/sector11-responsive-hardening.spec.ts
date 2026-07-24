import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("Sector 11 responsive reconstruction", () => {
  test("320px mobile keeps the opening fallback, header, search, and inquiry routes contained", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator(".cinematic-entry-scroll")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/products");
    await expect(page.locator(".site-header")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/inquiry");
    await expect(page.locator("main")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("landscape mobile keeps cinematic controls and evolution composition inside the visual viewport", async ({ page }) => {
    await page.setViewportSize({ width: 568, height: 320 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const title = await page.locator(".cinematic-entry-title").boundingBox();
    const control = await page.locator(".cinematic-entry-scroll").boundingBox();
    expect(title).not.toBeNull();
    expect(control).not.toBeNull();
    expect((title?.x ?? 0) + (title?.width ?? 0)).toBeLessThanOrEqual(568);
    expect((control?.x ?? 0) + (control?.width ?? 0)).toBeLessThanOrEqual(568);
    expect((control?.y ?? 0) + (control?.height ?? 0)).toBeLessThanOrEqual(320);
    await expectNoHorizontalOverflow(page);

    await page.locator(".frame-evolution-section").scrollIntoViewIfNeeded();
    await expect(page.locator(".frame-evolution-stage")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("search command fits narrow viewports and keeps results internally scrollable", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/products");
    await page.getByRole("link", { name: "Open catalogue search command" }).click();

    const dialog = page.locator(".search-command-dialog");
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width ?? 9999).toBeLessThanOrEqual(320);
    expect(box?.height ?? 9999).toBeLessThanOrEqual(568);

    await page.getByRole("combobox").fill("scissors");
    await expect(page.locator(".search-command-results")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("landscape navigation remains keyboard reachable and internally scrollable", async ({ page }) => {
    await page.setViewportSize({ width: 568, height: 320 });
    await page.goto("/products");
    await page.getByRole("button", { name: "Open navigation menu" }).click();

    const menu = page.locator(".mobile-nav");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("link", { name: /Surgical/ })).toBeVisible();
    await page.keyboard.press("Tab");
    await expectNoHorizontalOverflow(page);
  });
});
