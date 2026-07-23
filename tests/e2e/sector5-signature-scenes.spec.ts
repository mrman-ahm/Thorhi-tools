import { expect, test } from "@playwright/test";

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

  test("presents a complete static scissors storyboard before Anime.js", async ({ page }, testInfo) => {
    const scene = page.locator(".evolution-experience-static");
    await scene.scrollIntoViewIfNeeded();

    await expect(page.locator(".evolution-visual-stage")).toHaveCount(0);
    await expect(page.locator(".evolution-static-card")).toHaveCount(4);
    await expect(page.locator(".evolution-static-visual")).toHaveCount(4);
    await expect(page.locator(".evolution-static-card").first()).toContainText("The cutting form");
    await expect(page.locator(".evolution-static-card").last()).toContainText("The object today");

    const measurements = await scene.evaluate(element => ({
      sceneHeight: element.getBoundingClientRect().height,
      viewportHeight: window.innerHeight
    }));
    const maximumViewportMultiple = testInfo.project.name === "mobile-chromium" ? 6.2 : 4.4;
    expect(measurements.sceneHeight).toBeLessThan(measurements.viewportHeight * maximumViewportMultiple);
  });

  test("provides complete static fallbacks for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator(".inspection-lens")).toBeHidden();
    await expect(page.locator(".inspection-reticle")).toBeHidden();
    await expect(page.locator(".evolution-static-card")).toHaveCount(4);
    await expect(page.locator(".evolution-static-visual")).toHaveCount(4);
  });
});
