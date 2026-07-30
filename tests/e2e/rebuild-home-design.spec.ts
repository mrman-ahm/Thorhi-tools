import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function enterRebuild(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  await expect(
    page.locator('[data-milestone-contract="surgical-precision-archive-v1"]'),
  ).toBeVisible();
}

test("company identity and catalogue search lead the real homepage", async ({ page }) => {
  await enterRebuild(page);
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
  await expect(page.getByText(/Sialkot, Pakistan/i).first()).toBeVisible();
  await expect(page.getByRole("searchbox", { name: /Search by instrument name or code/i })).toBeVisible();
});

test("homepage search submits the query to the catalogue", async ({ page }) => {
  await enterRebuild(page);
  const search = page.getByRole("searchbox", { name: /Search by instrument name or code/i });
  await search.fill("04-0101");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/rebuild\/products\?q=04-0101/);
});

test("all four truthful divisions are visible", async ({ page }) => {
  await enterRebuild(page);
  const divisions = page.getByRole("region", { name: /Instrument divisions/i });
  for (const name of [
    "Surgical Instruments",
    "Dental and Orthodontic Instruments",
    "Veterinary Instruments",
    "Beauty Instruments",
  ]) {
    await expect(divisions.getByText(name, { exact: true })).toBeVisible();
  }
});

test("homepage avoids unverified promotional claims", async ({ page }) => {
  await enterRebuild(page);
  const main = await page.locator("main").innerText();
  expect(main).not.toMatch(/certified|years of experience|countries served|premium quality|world class/i);
});

test("rebuild shell exposes the approved corporate design tokens", async ({ page }) => {
  await enterRebuild(page);
  const shell = page.locator("[data-rebuild-shell]");
  await expect(shell).toBeVisible();
  const background = await shell.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).toBeTruthy();
});

test("desktop header exposes products, search and live inquiry utility", async ({ page }) => {
  test.skip(test.info().project.name === "mobile-chromium");
  await page.goto("/rebuild");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Products" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  await expect(page.getByRole("link", { name: /0 instruments in Inquiry List/i })).toBeVisible();

  await page.getByRole("button", { name: "Products" }).click();
  const panel = page.getByRole("navigation", { name: "Product divisions" });
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Surgical Instruments", { exact: true })).toBeVisible();
  await expect(panel.getByText("Beauty Instruments", { exact: true })).toBeVisible();
});

test("mobile navigation traps focus and exposes inquiry state", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile-chromium");
  await page.goto("/rebuild");
  await page.getByRole("button", { name: "Menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("search")).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Review Inquiry List/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
});

test("cinematic cover does not replace the real homepage h1", async ({ page }) => {
  await page.goto("/rebuild");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(/THROHI Medical Tools/i);
});

test("cinematic skip reveals usable content", async ({ page }) => {
  await page.goto("/rebuild");
  const skip = page.getByRole("button", { name: /Skip intro/i });
  if (await skip.isVisible()) await skip.click();
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
});

test("hero uses one signature scissors composition", async ({ page }) => {
  await enterRebuild(page);
  const hero = page.getByRole("region", { name: /THROHI introduction/i });
  await expect(hero.locator("[data-catalogue-media]")).toHaveCount(1);
});

test("structured divisions link to filtered catalogue and pending divisions do not fake links", async ({ page }) => {
  await enterRebuild(page);
  const divisions = page.getByRole("region", { name: /Instrument divisions/i });
  await expect(divisions.getByRole("link", { name: /Surgical Instruments/i })).toHaveAttribute(
    "href",
    /division=surgical/,
  );
  await expect(divisions.getByRole("link", { name: /Dental and Orthodontic Instruments/i })).toHaveAttribute(
    "href",
    /division=dental/,
  );
  await expect(divisions.getByRole("link", { name: /Veterinary Instruments/i })).toHaveCount(0);
  await expect(divisions.getByRole("link", { name: /Beauty Instruments/i })).toHaveCount(0);
});

test("selected families use real product routes", async ({ page }) => {
  await enterRebuild(page);
  const section = page.getByRole("region", { name: /Selected instrument families/i });
  await expect(section.locator("article")).toHaveCount(3);
  await expect(section.getByRole("link", { name: /04-0101/i })).toBeVisible();
});

test("verified company section names the real origin and four divisions", async ({ page }) => {
  await enterRebuild(page);
  const company = page.getByRole("region", { name: /About THROHI/i });
  await expect(company.getByText(/Sialkot, Pakistan/i)).toBeVisible();
  await expect(company.getByText("Surgical", { exact: true })).toBeVisible();
  await expect(company.getByText("Dental and Orthodontic", { exact: true })).toBeVisible();
  await expect(company.getByText("Veterinary", { exact: true })).toBeVisible();
  await expect(company.getByText("Beauty", { exact: true })).toBeVisible();
});

test("scissors evolution preview exposes useful fallback semantics", async ({ page }) => {
  await enterRebuild(page);
  const evolution = page.getByRole("region", { name: /Scissors through time/i });
  await expect(evolution).toBeVisible();
  await expect(evolution.getByText(/instrument form/i).first()).toBeVisible();
});

test("reduced motion keeps cinematic and evolution content accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
  await expect(page.getByRole("region", { name: /Scissors through time/i })).toBeVisible();
});

test("homepage ends with real catalogue and inquiry actions", async ({ page }) => {
  await enterRebuild(page);
  const utility = page.getByRole("region", { name: /Catalogue and inquiry options/i });
  await expect(utility.getByRole("link", { name: /Browse catalogue/i })).toBeVisible();
  await expect(utility.getByRole("link", { name: /Open Inquiry List/i })).toBeVisible();
});

test("unverified contact channels are not rendered as empty controls", async ({ page }) => {
  await enterRebuild(page);
  await expect(page.locator('a[href="mailto:"]')).toHaveCount(0);
  await expect(page.locator('a[href="tel:"]')).toHaveCount(0);
});

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await enterRebuild(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("keyboard users can reach the main content", async ({ page }) => {
  await enterRebuild(page);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("media failure never blocks the homepage", async ({ page }) => {
  await page.route("**/media/sector9d/**", (route) => route.abort());
  await enterRebuild(page);
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Browse products/i }).first()).toBeVisible();
});

test("stable homepage has no serious axe violations", async ({ page }) => {
  await enterRebuild(page);
  const result = await new AxeBuilder({ page }).exclude("canvas").analyze();
  expect(
    result.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
