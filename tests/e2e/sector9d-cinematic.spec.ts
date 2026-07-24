import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

function syntheticSprite() {
  const width = 12 * 240;
  const height = 22 * 135;
  const cells = Array.from({ length: 260 }, (_, index) => {
    const column = index % 12;
    const row = Math.floor(index / 12);
    const hue = Math.round((index / 260) * 120 + 20);
    return `<rect x="${column * 240}" y="${row * 135}" width="240" height="135" fill="hsl(${hue} 28% 5%)"/><path d="M${column * 240 + 44} ${row * 135 + 94} L${column * 240 + 196} ${row * 135 + 38}" stroke="hsl(${hue} 44% 72%)" stroke-width="8"/><circle cx="${column * 240 + 68}" cy="${row * 135 + 86}" r="18" fill="none" stroke="hsl(${hue} 44% 72%)" stroke-width="6"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${cells}</svg>`;
}

async function installSyntheticMedia(page: import("@playwright/test").Page) {
  await page.route("**/media/sector9d/manifest.json", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      available: true,
      intro: null,
      sprite: "/media/sector9d/evolution-sprite.webp",
      frameCount: 260,
      reason: "playwright-synthetic"
    })
  }));
  await page.route("**/media/sector9d/evolution-sprite.webp", route => route.fulfill({
    status: 200,
    contentType: "image/svg+xml",
    body: syntheticSprite()
  }));
}

async function scrollSequenceTo(page: import("@playwright/test").Page, progress: number) {
  await page.locator(".frame-evolution-section").evaluate((element, value) => {
    const section = element as HTMLElement;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: section.offsetTop + distance * Number(value), behavior: "instant" });
  }, progress);
}

test("opening cinematic is the native-scroll first stage and hands off to the brand hero", async ({ page }) => {
  await installSyntheticMedia(page);
  await page.goto("/");
  const entry = page.locator(".cinematic-entry");
  await expect(entry).toBeVisible();
  await expect(entry.getByRole("button", { name: /Slide the opening cover away/i })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.dataset.cinematicActive)).toBe("true");

  const hero = page.locator("#home-hero");
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.getByRole("img", { name: "THROHI Medical Tools identity mark" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.dataset.cinematicActive ?? "cleared")).toBe("cleared");
  await expect(entry).toHaveAttribute("data-exit-state", "cleared");
  await expect(page.locator(".site-header")).toBeVisible();
});

test("frame sequence chapter copy changes only after analyzed frame boundaries", async ({ page }) => {
  await installSyntheticMedia(page);
  await page.goto("/");
  const section = page.locator(".frame-evolution-section");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-media-state", "ready");

  await scrollSequenceTo(page, 0.18);
  await expect.poll(async () => Number(await section.getAttribute("data-rendered-frame"))).toBeLessThanOrEqual(56);
  await expect(section).toHaveAttribute("data-active-chapter", "0");

  await scrollSequenceTo(page, 0.30);
  await expect.poll(async () => Number(await section.getAttribute("data-rendered-frame"))).toBeGreaterThanOrEqual(57);
  await expect(section).toHaveAttribute("data-active-chapter", "1");

  await scrollSequenceTo(page, 0.58);
  await expect.poll(async () => Number(await section.getAttribute("data-rendered-frame"))).toBeGreaterThanOrEqual(130);
  await expect(section).toHaveAttribute("data-active-chapter", "2");

  await scrollSequenceTo(page, 0.82);
  await expect.poll(async () => Number(await section.getAttribute("data-rendered-frame"))).toBeGreaterThanOrEqual(198);
  await expect(section).toHaveAttribute("data-active-chapter", "3");
});

test("sequence uses one canvas and preserves the black-stage edge feather", async ({ page }) => {
  await installSyntheticMedia(page);
  await page.goto("/");
  const section = page.locator(".frame-evolution-section");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator("canvas")).toHaveCount(1);
  await expect(section.locator("img")).toHaveCount(0);
  const mask = await section.locator("canvas").evaluate(element => {
    const style = getComputedStyle(element);
    return style.maskImage || style.webkitMaskImage;
  });
  expect(mask).toContain("radial-gradient");
  await expect(section.locator(".frame-evolution-feather")).toBeVisible();
});

test("exit segment reaches frames 248 through 260 without introducing a fifth text chapter", async ({ page }) => {
  await installSyntheticMedia(page);
  await page.goto("/");
  const section = page.locator(".frame-evolution-section");
  await section.scrollIntoViewIfNeeded();
  await scrollSequenceTo(page, 0.985);
  await expect.poll(async () => Number(await section.getAttribute("data-rendered-frame"))).toBeGreaterThanOrEqual(248);
  await expect(section).toHaveAttribute("data-active-chapter", "3");
  await expect(section.locator(".frame-evolution-copy")).toHaveCount(4);
});

test("reduced motion shows a static cinematic and all chapter copy", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installSyntheticMedia(page);
  await page.goto("/");
  await expect(page.locator(".cinematic-entry video")).toHaveCount(0);
  const chapters = page.locator(".frame-evolution-copy");
  await expect(chapters).toHaveCount(4);
  for (let index = 0; index < 4; index += 1) await expect(chapters.nth(index)).toBeVisible();
});

test("cinematic routes remain accessible and free of horizontal overflow", async ({ page }, testInfo) => {
  await installSyntheticMedia(page);
  await page.goto("/");
  await page.waitForTimeout(900);
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.scrollWidth, testInfo.project.name).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
