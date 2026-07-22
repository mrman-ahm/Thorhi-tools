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
    await page.evaluate(() => window.scrollTo(0, 520));
    await expect.poll(() => header.getAttribute("data-scrolled")).toBe("true");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => header.getAttribute("data-scrolled")).toBe("false");
    await expect.poll(() => header.getAttribute("data-hidden")).toBe("false");
  });

  test("traps menu focus, closes with Escape, and restores the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.click();

    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("link", { name: /Surgical/ }).first()).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.dataset.menuOpen)).toBe("true");

    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("link", { name: /Review inquiry/ })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect.poll(() => page.evaluate(() => document.body.dataset.menuOpen ?? "closed")).toBe("closed");
  });

  test("updates the hero inspection position on fine pointers", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Fine-pointer interaction is validated on desktop");
    const hero = page.locator(".hero-experience");
    const box = await hero.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width * 0.22, box.y + box.height * 0.35);
    await expect(hero).toHaveAttribute("data-inspecting", "true");
    const position = await hero.evaluate(element => getComputedStyle(element).getPropertyValue("--hero-x").trim());
    expect(position).not.toBe("72%");

    await page.mouse.move(2, 2);
    await expect(hero).not.toHaveAttribute("data-inspecting", "true");
  });

  test("removes hero and header movement when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 520));

    const headingTransform = await page.locator(".hero-type").evaluate(element => getComputedStyle(element).transform);
    const headerTransform = await page.locator(".site-header").evaluate(element => getComputedStyle(element).transform);
    expect(headingTransform).toBe("none");
    expect(headerTransform).toBe("none");
    await expect(page.locator(".hero-inspection-light")).toBeHidden();
  });
});
