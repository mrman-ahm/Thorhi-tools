import { expect, test } from "@playwright/test";

test.describe("Sector 4 division and family discovery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("updates the active division when a division route receives focus", async ({ page }) => {
    const section = page.locator(".division-discovery");
    const dental = page.locator('.division-discovery-item[href="/products/dental"]');

    await expect(section).toHaveAttribute("data-active-index", "0");
    await dental.focus();
    await expect(section).toHaveAttribute("data-active-index", "1");
    await expect(dental).toHaveAttribute("aria-current", "true");
  });

  test("keeps every family as a direct catalogue link", async ({ page }) => {
    await expect(page.locator('.family-panel[href="/products/surgical/scissors"]')).toHaveAttribute("href", "/products/surgical/scissors");
    await expect(page.locator('.family-panel[href="/products/dental/extraction"]')).toHaveAttribute("href", "/products/dental/extraction");
    await expect(page.locator('.family-panel[href="/products/beauty/nail-cuticle"]')).toHaveAttribute("href", "/products/beauty/nail-cuticle");
  });

  test("advances the family track through normal page scrolling on desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Horizontal family progression is desktop-only");
    const section = page.locator(".family-discovery");
    const track = page.locator(".family-track");

    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const target = document.querySelector<HTMLElement>(".family-discovery");
      if (target) window.scrollTo(0, target.offsetTop + window.innerHeight * 0.8);
    });

    await expect.poll(async () => Number(await section.evaluate(element => getComputedStyle(element).getPropertyValue("--family-progress")))).toBeGreaterThan(0);
    const transform = await track.evaluate(element => getComputedStyle(element).transform);
    expect(transform).not.toBe("none");
  });

  test("uses a stacked family archive on mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile stacking is validated in the mobile project");
    const section = page.locator(".family-discovery");
    const track = page.locator(".family-track");
    await section.scrollIntoViewIfNeeded();

    await expect.poll(() => section.evaluate(element => element.style.height || "auto")).toBe("auto");
    expect(await track.evaluate(element => getComputedStyle(element).transform)).toBe("none");
    await expect(page.locator(".family-panel")).toHaveCount(8);
  });

  test("provides a static reduced-motion discovery layout", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const section = page.locator(".family-discovery");
    const track = page.locator(".family-track");
    await section.scrollIntoViewIfNeeded();

    expect(await track.evaluate(element => getComputedStyle(element).transform)).toBe("none");
    await expect(page.locator(".division-discovery-item")).toHaveCount(4);
    await expect(page.locator(".family-panel")).toHaveCount(8);
  });
});
