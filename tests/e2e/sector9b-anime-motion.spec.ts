import { expect, test } from "@playwright/test";

function collectPageErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

test("Anime.js motion initializes and reaches a stable homepage state", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/");

  const shell = page.locator(".motion-shell");
  await expect(shell).toHaveAttribute("data-motion-route", "home");
  await expect(shell).toHaveAttribute("data-motion-state", "ready");
  await expect(page.locator("html")).toHaveAttribute("data-anime-motion", "active");

  await page.waitForTimeout(1200);
  const heroWords = page.locator(".hero-type > span");
  await expect(heroWords).toHaveCount(3);
  for (const word of await heroWords.all()) {
    const style = await word.evaluate(element => ({
      opacity: Number.parseFloat(getComputedStyle(element).opacity),
      transform: getComputedStyle(element).transform
    }));
    expect(style.opacity).toBeGreaterThan(0.98);
    expect(style.transform).not.toContain("NaN");
  }

  expect(errors).toEqual([]);
});

test("menu animation never delays keyboard focus", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();

  await expect(page.locator(".menu-layer")).toHaveAttribute("data-open", "true");
  await expect(page.getByRole("link", { name: "Surgical", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  expect(errors).toEqual([]);
});

test("search command motion preserves focus and keyboard selection", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/products");
  await page.getByRole("link", { name: "Open catalogue search command" }).click();

  const input = page.getByRole("combobox");
  await expect(input).toBeFocused();
  await input.fill("THR-SC-001");
  await expect(page.getByRole("option").first()).toContainText("Operating Scissors");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("link", { name: "Open catalogue search command" })).toBeFocused();
  expect(errors).toEqual([]);
});

test("route changes revert and reinitialize the scoped motion system", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/");
  await expect(page.locator(".motion-shell")).toHaveAttribute("data-motion-route", "home");

  await page.getByRole("link", { name: "Products", exact: true }).first().click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.locator(".motion-shell")).toHaveAttribute("data-motion-route", "catalogue");
  await expect(page.locator(".motion-shell")).toHaveAttribute("data-motion-state", "ready");

  await page.goto("/search?q=scissors");
  await expect(page.locator(".motion-shell")).toHaveAttribute("data-motion-route", "search");
  await page.goto("/inquiry");
  await expect(page.locator(".motion-shell")).toHaveAttribute("data-motion-route", "inquiry");
  await page.goto("/company");
  await expect(page.locator(".motion-shell")).toHaveAttribute("data-motion-route", "utility");

  expect(errors).toEqual([]);
});

test("reduced motion skips Anime.js transformations and keeps content complete", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = collectPageErrors(page);
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-anime-motion", "reduced");
  await expect(page.locator(".motion-shell")).toHaveAttribute("data-motion-state", "ready");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("searchbox").first()).toBeVisible();

  const inlineTransforms = await page.locator(".hero-type > span").evaluateAll(elements => elements.map(element => (element as HTMLElement).style.transform));
  expect(inlineTransforms.every(transform => transform === "")).toBe(true);
  expect(errors).toEqual([]);
});

test("motion transforms do not introduce horizontal overflow", async ({ page }, testInfo) => {
  for (const route of ["/", "/products", "/products/surgical/scissors", "/products/surgical/scissors/operating-scissors", "/search?q=scissors", "/inquiry", "/company"]) {
    await page.goto(route);
    await page.waitForTimeout(900);
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth, `${route} on ${testInfo.project.name}`).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  }
});
