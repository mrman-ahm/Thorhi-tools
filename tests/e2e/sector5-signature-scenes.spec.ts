import { expect, test } from "@playwright/test";

async function scrollSequenceTo(page: import("@playwright/test").Page, progress: number) {
  await page.locator(".frame-evolution-section").evaluate((element, value) => {
    const section = element as HTMLElement;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: section.offsetTop + distance * Number(value), behavior: "instant" });
  }, progress);
}

test.describe("Sector 5 signature visual scenes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("selects macro examination regions with accessible controls", async ({ page }) => {
    const scene = page.locator(".macro-inspection-scene");
    const handle = page.getByRole("button", { name: /03 Handle/i });

    await scene.scrollIntoViewIfNeeded();
    await handle.click();

    await expect(scene).toHaveAttribute("data-active-region", "2");
    await expect(handle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".inspection-readout").getByRole("heading", { name: "Handle" })).toBeVisible();
  });

  test("moves the macro inspection lens with a fine pointer", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Fine-pointer lens behavior is desktop-only");
    const canvas = page.locator(".inspection-canvas");
    const scene = page.locator(".macro-inspection-scene");
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width * 0.76, box.y + box.height * 0.24);
    await expect(scene).toHaveAttribute("data-inspecting", "true");
    await expect(scene).toHaveAttribute("data-active-region", "0");
    const x = await scene.evaluate(element => getComputedStyle(element).getPropertyValue("--inspection-x").trim());
    expect(x).not.toBe("50%");
  });

  test("activates evolution chapters through normal page scrolling", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Pinned chapter progression is desktop-only");
    const scene = page.locator(".frame-evolution-section");
    await scene.scrollIntoViewIfNeeded();
    await scrollSequenceTo(page, 0.60);
    await expect.poll(() => scene.getAttribute("data-active-chapter")).toBe("2");
    await expect(scene.locator('.frame-evolution-copy[data-chapter="2"]')).toHaveAttribute("data-active", "true");
  });

  test("keeps one canvas and all four chapter records on mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile sequence is validated in the mobile project");
    const scene = page.locator(".frame-evolution-section");
    await scene.scrollIntoViewIfNeeded();

    await expect(scene.locator("canvas")).toHaveCount(1);
    await expect(scene.locator(".frame-evolution-copy")).toHaveCount(4);
    await expect(scene.locator('.frame-evolution-copy[data-active="true"]')).toHaveCount(1);
  });

  test("provides complete static fallbacks for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator(".inspection-lens")).toBeHidden();
    await expect(page.locator(".inspection-reticle")).toBeHidden();
    await expect(page.locator(".frame-evolution-copy")).toHaveCount(4);
    for (const chapter of await page.locator(".frame-evolution-copy").all()) await expect(chapter).toBeVisible();
  });
});
