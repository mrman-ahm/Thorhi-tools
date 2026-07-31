import { expect, test, type Page } from "@playwright/test";

async function waitForFonts(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function enterHomepage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  const enter = page.getByRole("button", { name: /enter the THROHI website/i });
  if (await enter.isVisible().catch(() => false)) await enter.click();
}

async function expectRegalHeading(page: Page, route: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  const heading = page.locator("h1").first();
  await expect(heading).toBeVisible();
  await waitForFonts(page);
  const family = await heading.evaluate((element) => getComputedStyle(element).fontFamily);
  expect(family.toLowerCase()).toContain("cormorant");
}

test("rebuild exposes the premium convergence contract", async ({ page }) => {
  await enterHomepage(page);
  await expect(
    page.locator('[data-premium-contract="premium-visual-convergence-v1"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-milestone-contract="surgical-precision-archive-v1"]'),
  ).toHaveCount(1);
});

test("representative rebuild routes render the regal display hierarchy", async ({ page }) => {
  for (const route of [
    "/rebuild",
    "/rebuild/products",
    "/rebuild/inquiry?manual=1",
    "/rebuild/company",
    "/rebuild/catalogues",
    "/rebuild/contact",
  ]) {
    if (route === "/rebuild") {
      await enterHomepage(page);
      const heading = page.locator("h1").first();
      await waitForFonts(page);
      const family = await heading.evaluate((element) => getComputedStyle(element).fontFamily);
      expect(family.toLowerCase(), route).toContain("cormorant");
    } else {
      await expectRegalHeading(page, route);
    }
  }
});

test("important navigation and form labels remain readable", async ({ page }) => {
  await page.goto("/rebuild/products");

  if (test.info().project.name === "desktop-chromium") {
    const company = page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Company", exact: true });
    const size = await company.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(size).toBeGreaterThanOrEqual(14);
  } else {
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.getByRole("dialog", { name: "Site navigation" });
    await expect(menu).toBeVisible();
  }

  const searchLabel = page.getByText("Search by product name or code", { exact: true });
  const labelSize = await searchLabel.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(labelSize).toBeGreaterThanOrEqual(13);
});
