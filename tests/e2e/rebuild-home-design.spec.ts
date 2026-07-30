import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function enterRebuild(page: Page) {
  await page.goto("/rebuild");
  await expect(
    page.locator('[data-milestone-contract="surgical-precision-archive-v1"]'),
  ).toHaveCount(1);
  const enter = page.getByRole("button", {
    name: /enter the THROHI website|slide the opening cover away/i,
  });
  if (await enter.isVisible().catch(() => false)) {
    await enter.click();
  }
  await page
    .getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })
    .scrollIntoViewIfNeeded();
}

test("company identity and catalogue search lead the real homepage", async ({ page }) => {
  await enterRebuild(page);
  const hero = page.locator("[data-home-hero]");
  await expect(
    hero.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i }),
  ).toBeVisible();
  await expect(hero.getByText(/Sialkot, Pakistan/i)).toBeVisible();
  await expect(hero.getByRole("search", { name: /catalogue/i })).toBeVisible();
  await expect(hero.getByRole("link", { name: /Browse instruments/i })).toBeVisible();
  await expect(hero.getByRole("link", { name: /Build an inquiry/i })).toBeVisible();
});

test("homepage search submits the query to the catalogue", async ({ page }) => {
  await enterRebuild(page);
  const search = page
    .locator("[data-home-hero]")
    .getByRole("search", { name: /catalogue/i });
  await search.getByRole("searchbox").fill("04-0101");
  await search.getByRole("button", { name: /Find product/i }).click();
  await expect(page).toHaveURL(/\/rebuild\/products\?q=04-0101/);
});

test("all four truthful divisions are visible", async ({ page }) => {
  await enterRebuild(page);
  const divisions = page.getByRole("region", { name: "Instrument divisions" });
  for (const division of [
    "Surgical Instruments",
    "Dental & Orthodontic Instruments",
    "Veterinary Instruments",
    "Beauty Instruments",
  ]) {
    await expect(divisions.getByText(division, { exact: true })).toBeVisible();
  }
  await expect(
    divisions.getByText("Detailed catalogue not yet published", { exact: true }),
  ).toHaveCount(2);
});

test("homepage avoids unverified promotional claims", async ({ page }) => {
  await enterRebuild(page);
  const body = await page.locator("body").innerText();
  for (const unsupported of [
    "certified",
    "ISO",
    "world-class",
    "premium steel",
    "trusted worldwide",
    "years of experience",
  ]) {
    expect(body.toLowerCase()).not.toContain(unsupported.toLowerCase());
  }
});

test("rebuild shell exposes the approved corporate design tokens", async ({ page }) => {
  await page.goto("/rebuild");
  const tokens = await page.locator("[data-rebuild-shell]").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      ink: style.getPropertyValue("--throhi-ink-950").trim(),
      paper: style.getPropertyValue("--throhi-paper-50").trim(),
      green: style.getPropertyValue("--throhi-green-600").trim(),
    };
  });
  expect(tokens.ink).not.toBe("");
  expect(tokens.paper).not.toBe("");
  expect(tokens.green).not.toBe("");
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
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  const enter = page.getByRole("button", { name: /enter the THROHI website/i });
  await expect(enter).toBeVisible();
  await enter.click();
  await expect(
    page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i }),
  ).toBeVisible();
});

test("hero uses one signature scissors composition", async ({ page }) => {
  await enterRebuild(page);
  const hero = page.locator("[data-home-hero]");
  await expect(hero.getByRole("img", { name: /operating scissors/i })).toHaveCount(1);
  await expect(hero.locator("[data-hero-instrument]")).toHaveCount(1);
});

test("structured divisions link to filtered catalogue and pending divisions do not fake links", async ({ page }) => {
  await enterRebuild(page);
  const divisions = page.getByRole("region", { name: "Instrument divisions" });
  await expect(divisions.getByRole("link", { name: /Surgical Instruments/i })).toHaveAttribute(
    "href",
    /division=surgical/,
  );
  await expect(
    divisions.getByRole("link", { name: /Dental & Orthodontic Instruments/i }),
  ).toHaveAttribute("href", /division=dental/);
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
  await expect(company.getByText(/Surgical/i)).toBeVisible();
  await expect(company.getByText(/Dental and Orthodontic/i)).toBeVisible();
  await expect(company.getByText(/Veterinary/i)).toBeVisible();
  await expect(company.getByText(/Beauty/i)).toBeVisible();
});

test("scissors evolution preview exposes useful fallback semantics", async ({ page }) => {
  await enterRebuild(page);
  const evolution = page.getByRole("region", { name: /Scissors through time/i });
  await expect(evolution).toBeVisible();
  await expect(
    evolution.getByRole("img", { name: /evolution of cutting and surgical instruments/i }),
  ).toBeVisible();
});

test("reduced motion keeps cinematic and evolution content accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  await expect(
    page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i }),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: /Scissors through time/i })).toBeVisible();
});

test("homepage ends with real catalogue and inquiry actions", async ({ page }) => {
  await enterRebuild(page);
  const utilities = page.getByRole("region", { name: /Catalogue and inquiry options/i });
  await expect(
    utilities.getByRole("link", { name: /Browse the digital catalogue/i }),
  ).toHaveAttribute("href", "/rebuild/products");
  await expect(utilities.getByRole("link", { name: /Review Inquiry List/i })).toHaveAttribute(
    "href",
    "/rebuild/inquiry",
  );
  await expect(
    utilities.getByRole("link", { name: /Request an unlisted instrument/i }),
  ).toHaveAttribute("href", /\/rebuild\/inquiry/);
});

test("unverified contact channels are not rendered as empty controls", async ({ page }) => {
  await enterRebuild(page);
  await expect(page.locator('a[href="mailto:"]')).toHaveCount(0);
  await expect(page.locator('a[href="tel:"]')).toHaveCount(0);
});

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/rebuild");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("keyboard users can reach the main content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("media failure never blocks the homepage", async ({ page }) => {
  await page.route("**/media/sector9d/manifest.json", (route) =>
    route.fulfill({ status: 500, body: "" }),
  );
  await page.goto("/rebuild");
  await expect(
    page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i }),
  ).toBeVisible();
  await expect(
    page.locator("[data-home-hero]").getByRole("search", { name: /catalogue/i }),
  ).toBeVisible();
});

test("stable homepage has no serious axe violations", async ({ page }) => {
  await enterRebuild(page);
  const homepage = await new AxeBuilder({ page }).exclude("video").analyze();
  expect(
    homepage.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
