import { expect, test, type Page } from "@playwright/test";
import { clearCinematicCover } from "./helpers/cinematic";

async function expectNoHorizontalOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}

async function expectVisibleHeaderIdentity(page: Page) {
  const logo = page.locator(".brand-image img");
  await expect(logo).toBeVisible();
  const naturalWidth = await logo.evaluate(image => (image as HTMLImageElement).naturalWidth);
  expect(naturalWidth).toBeGreaterThan(100);
  const box = await logo.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(60);
  expect(box?.height ?? 0).toBeGreaterThan(38);
}

test("header identity and touch targets survive narrow and tablet widths", async ({ page }) => {
  const viewports = [
    { width: 320, height: 800 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/products");
    await expectVisibleHeaderIdentity(page);
    await expectNoHorizontalOverflow(page);

    if (viewport.width <= 900) {
      for (const selector of [".icon-button", ".inquiry-button", ".menu-button"]) {
        const box = await page.locator(selector).boundingBox();
        expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    }
  }
});

test("wide layouts preserve the logo and complete catalogue width", async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 1728, height: 960 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/products");
    await expectVisibleHeaderIdentity(page);
    await expectNoHorizontalOverflow(page);
  }
});

test("reduced-height laptop keeps cinematic handoff and evolution controls reachable", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 600 });
  await page.goto("/");
  await clearCinematicCover(page);
  await expect(page.locator(".site-header")).toBeVisible();
  await expect(page.locator("#home-hero h1")).toBeVisible();

  await page.locator(".frame-evolution-section").scrollIntoViewIfNeeded();
  const stage = await page.locator(".frame-evolution-stage").boundingBox();
  expect(stage?.height ?? 0).toBeLessThanOrEqual(600 * .56);
  await expectNoHorizontalOverflow(page);
});

test("two-times text scaling and long headings retain readable flow", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/products");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
    const heading = document.querySelector("main h1");
    if (heading) heading.textContent = "Surgical instrument catalogue discovery and structured inquiry";
  });
  await expect(page.locator("main h1")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
