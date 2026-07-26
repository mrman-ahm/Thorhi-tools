import { expect, test } from "@playwright/test";
import { clearCinematicCover } from "./helpers/cinematic";

test("global search command restores focus after Escape", async ({ page }) => {
  await page.goto("/products");
  const trigger = page.getByRole("link", { name: "Open catalogue search command" });
  await trigger.focus();
  await page.keyboard.press("Control+k");

  const dialog = page.getByRole("dialog", { name: "Find an instrument." });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole("combobox");
  await expect(input).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("division preview follows keyboard focus without false current-page state", async ({ page }) => {
  await page.goto("/");
  await clearCinematicCover(page);

  const section = page.locator(".v3-division-index");
  const navigation = page.getByRole("navigation", { name: "Product divisions" });
  const dental = navigation.getByRole("link", { name: /Dental/ });

  await dental.focus();
  await expect(dental).toBeFocused();
  await expect(dental).not.toHaveAttribute("aria-current", "page");
  await expect(section).toHaveAttribute("data-active-index", "1");
  await expect(section.getByText("/products/dental", { exact: true })).toBeVisible();
});

test("homepage summary includes products selected outside its featured set", async ({ page }) => {
  await page.goto("/products/dental/periodontal/periodontal-curette");
  await page.getByRole("button", { name: "Add to inquiry: Periodontal Curette", exact: true }).click();
  await page.goto("/");
  await clearCinematicCover(page);

  const summary = page.locator(".v3-saved-inquiry-shell");
  await expect(summary.getByText("1 ITEM SAVED", { exact: true })).toBeVisible();
  await expect(summary.getByText("Periodontal Curette", { exact: true })).toBeVisible();
  await expect(summary.getByText("THR-DP-010", { exact: true })).toBeVisible();
});

test("resources publication accordion remains native and keyboard operable", async ({ page }) => {
  await page.goto("/resources");
  const accordion = page.getByLabel("Document publication requirements");
  const firstDisclosure = accordion.locator("details").first();
  const firstSummary = firstDisclosure.locator("summary");

  await expect(firstDisclosure).toHaveAttribute("open", "");
  await firstSummary.focus();
  await expect(firstSummary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(firstDisclosure).not.toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(firstDisclosure).toHaveAttribute("open", "");
});

test("data saver keeps the cinematic static and avoids media requests", async ({ page }) => {
  const mediaRequests: string[] = [];
  page.on("request", request => {
    if (request.resourceType() === "media") mediaRequests.push(request.url());
  });

  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true }
    });
  });

  await page.goto("/");
  const entry = page.locator(".cinematic-entry");
  await expect(entry).toHaveAttribute("data-save-data", "true");
  await expect(entry.locator("video")).toHaveCount(0);
  await expect(entry.getByText("Data saver active")).toBeVisible();
  expect(mediaRequests).toEqual([]);
});

test("evolution remains a one-canvas sequence with no frame-image DOM", async ({ page }) => {
  await page.goto("/");
  await clearCinematicCover(page);
  const evolution = page.locator(".frame-evolution-section");
  await evolution.scrollIntoViewIfNeeded();
  await expect(evolution.locator("canvas")).toHaveCount(1);
  await expect(evolution.locator("img")).toHaveCount(0);

  await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>(".frame-evolution-section");
    if (!section) return;
    window.scrollTo(0, section.offsetTop + Math.max(1, section.offsetHeight - window.innerHeight) * 0.45);
  });

  await expect.poll(async () => Number(await evolution.getAttribute("data-target-frame") ?? "1")).toBeGreaterThan(1);
});

test("V3 mobile primary controls meet the minimum touch target", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Touch target validation runs on the mobile project");
  await page.goto("/");
  await clearCinematicCover(page);

  const controls = [
    page.getByRole("button", { name: "Open navigation menu" }),
    page.getByRole("link", { name: /Explore catalogue/ }),
    page.getByRole("button", { name: /Search/ }).first()
  ];

  for (const control of controls) {
    await expect(control).toBeVisible();
    const box = await control.boundingBox();
    expect(box, "Control must have a measurable box").not.toBeNull();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test("V3 route remains free of horizontal overflow at 200 percent text size", async ({ page }) => {
  await page.goto("/products");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await page.waitForTimeout(100);

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
});
