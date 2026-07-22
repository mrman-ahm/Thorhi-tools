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

  test("uses a complete static family grid before the Anime.js phase", async ({ page }, testInfo) => {
    const section = page.locator(".family-discovery");
    const stage = page.locator(".family-sticky-stage");
    const track = page.locator(".family-track");
    await section.scrollIntoViewIfNeeded();

    expect(await track.evaluate(element => getComputedStyle(element).transform)).toBe("none");
    expect(await stage.evaluate(element => getComputedStyle(element).position)).toBe("relative");
    await expect(page.locator(".family-panel")).toHaveCount(8);

    const columns = await track.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length);
    if (testInfo.project.name === "desktop-chromium") expect(columns).toBe(4);
    else expect(columns).toBe(1);
  });

  test("does not reserve an artificial vertical scroll runway", async ({ page }) => {
    const section = page.locator(".family-discovery");
    const stage = page.locator(".family-sticky-stage");
    const measurements = await section.evaluate(element => ({
      sectionHeight: element.getBoundingClientRect().height,
      viewportHeight: window.innerHeight
    }));
    expect(measurements.sectionHeight).toBeLessThan(measurements.viewportHeight * 3.2);
    expect(await stage.evaluate(element => getComputedStyle(element).minHeight)).not.toBe("100vh");
  });

  test("provides the same complete grid with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const track = page.locator(".family-track");
    await expect(page.locator(".division-discovery-item")).toHaveCount(4);
    await expect(page.locator(".family-panel")).toHaveCount(8);
    expect(await track.evaluate(element => getComputedStyle(element).transform)).toBe("none");
  });
});
