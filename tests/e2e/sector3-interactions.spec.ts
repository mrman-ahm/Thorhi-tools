import { expect, test } from "@playwright/test";

test.describe("Sector 3 navigation and hero interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test("compresses the header after scrolling and restores its initial state", async ({ page }) => {
    const header = page.locator(".site-header");
    await expect(header).toHaveAttribute("data-scrolled", "false");
    await page.evaluate(() => window.scrollTo(0, 620));
    await expect.poll(() => header.getAttribute("data-scrolled")).toBe("true");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => header.getAttribute("data-scrolled")).toBe("false");
    await expect.poll(() => header.getAttribute("data-hidden")).toBe("false");
  });

  test("traps menu focus, closes with Escape, and restores the trigger", async ({ page }) => {
    await page.locator("#home-hero").scrollIntoViewIfNeeded();
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.click();

    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /Surgical/ }).first()).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.dataset.menuOpen)).toBe("true");

    await page.keyboard.press("Shift+Tab");
    await expect(menu.getByRole("link", { name: /Review inquiry/ })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect.poll(() => page.evaluate(() => document.body.dataset.menuOpen ?? "closed")).toBe("closed");
  });

  test("replaces the removed hero inspection object with the THROHI identity", async ({ page }) => {
    const hero = page.locator("#home-hero");
    await hero.scrollIntoViewIfNeeded();
    await expect(hero.locator(".hero-brand-stage")).toBeVisible();
    await expect(hero.getByRole("img", { name: "THROHI Medical Tools identity mark" })).toBeVisible();
    await expect(hero.locator(".instrument-half-upper")).toHaveCount(0);
    await expect(hero).toHaveAttribute("data-special-motion", "identity-ready");
  });

  test("removes hero and header movement when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 620));

    const headingTransform = await page.locator(".hero-type").evaluate(element => getComputedStyle(element).transform);
    const headerTransform = await page.locator(".site-header").evaluate(element => getComputedStyle(element).transform);
    expect(headingTransform).toBe("none");
    expect(headerTransform).toBe("none");
    await expect(page.locator(".hero-inspection-light")).toBeHidden();
  });
});
