import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const reviewRoutes = [
  ["homepage", "/"],
  ["products", "/products"],
  ["division", "/products/surgical"],
  ["family", "/products/surgical/scissors"],
  ["product", "/products/surgical/scissors/operating-scissors"],
  ["search", "/search?q=scissors"],
  ["inquiry", "/inquiry"],
  ["company", "/company"],
  ["resources", "/resources"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
  ["terms", "/terms"]
] as const;

for (const [name, route] of reviewRoutes) {
  test(`${name} is statically ready for motion`, async ({ page }, testInfo) => {
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, `${route}\n${JSON.stringify(serious, null, 2)}`).toEqual([]);

    if (["homepage", "products", "product", "inquiry", "company", "resources", "contact"].includes(name)) {
      const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
      await testInfo.attach(`phase8-5-${name}-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
    }
  });
}

test("header is quieter and no longer resembles a control-panel masthead", async ({ page }) => {
  await page.goto("/");
  const measurements = await page.evaluate(() => {
    const header = document.querySelector<HTMLElement>(".header-inner");
    const logo = document.querySelector<HTMLElement>(".brand-image");
    const index = document.querySelector<HTMLElement>(".brand-index");
    const menu = document.querySelector<HTMLElement>(".menu-button");
    if (!header || !logo || !index || !menu) throw new Error("Header audit targets are missing");
    return {
      headerHeight: header.getBoundingClientRect().height,
      logoWidth: logo.getBoundingClientRect().width,
      indexDisplay: getComputedStyle(index).display,
      menuRadius: Number.parseFloat(getComputedStyle(menu).borderRadius)
    };
  });

  expect(measurements.headerHeight).toBeLessThanOrEqual(74);
  expect(measurements.logoWidth).toBeLessThanOrEqual(96);
  expect(measurements.indexDisplay).toBe("none");
  expect(measurements.menuRadius).toBeGreaterThanOrEqual(6);
});

test("display typography is bold without becoming viewport-filling", async ({ page }, testInfo) => {
  await page.goto("/");
  const homepageSize = Number.parseFloat(await page.locator(".hero-type").evaluate(element => getComputedStyle(element).fontSize));

  await page.goto("/products");
  const catalogueSize = Number.parseFloat(await page.locator(".catalogue-hub-copy h1").evaluate(element => getComputedStyle(element).fontSize));

  await page.goto("/inquiry");
  const utility = await page.locator(".utility-hero h1").evaluate(element => ({
    fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
    textTransform: getComputedStyle(element).textTransform
  }));

  if (testInfo.project.name === "desktop-chromium") {
    expect(homepageSize).toBeLessThanOrEqual(128);
    expect(catalogueSize).toBeLessThanOrEqual(112);
    expect(utility.fontSize).toBeLessThanOrEqual(90);
  } else {
    expect(homepageSize).toBeLessThanOrEqual(80);
    expect(catalogueSize).toBeLessThanOrEqual(68);
    expect(utility.fontSize).toBeLessThanOrEqual(62);
  }
  expect(utility.textTransform).toBe("none");
});

test("bright intermissions use sterile mint rather than fluorescent green", async ({ page }) => {
  await page.goto("/products/surgical/scissors/operating-scissors");
  const background = await page.locator(".product-document-band").evaluate(element => ({
    color: getComputedStyle(element).color,
    image: getComputedStyle(element).backgroundImage
  }));
  expect(background.image).toContain("rgb(223, 243, 231)");
  expect(background.image).not.toContain("rgb(120, 255, 186)");
  expect(background.color).toBe("rgb(10, 26, 18)");
});

test("the site background no longer applies a persistent scanline pattern", async ({ page }) => {
  await page.goto("/");
  const background = await page.locator("body").evaluate(element => getComputedStyle(element).backgroundImage);
  expect(background).not.toContain("repeating-linear-gradient");
});

test("footer signature no longer adds another full-screen scene", async ({ page }, testInfo) => {
  await page.goto("/company");
  const footerDisplay = page.locator(".footer-display");
  const display = await footerDisplay.evaluate(element => getComputedStyle(element).display);
  if (testInfo.project.name === "mobile-chromium") {
    expect(display).toBe("none");
  } else {
    const height = await footerDisplay.evaluate(element => element.getBoundingClientRect().height);
    expect(height).toBeLessThanOrEqual(232);
  }
  await expect(page.getByText("PRE-PRODUCTION REVIEW BUILD")).toBeVisible();
});
