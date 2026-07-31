import { expect, test, type Page } from "@playwright/test";

async function enterHomepage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild");
  const enter = page.getByRole("button", {
    name: /enter the THROHI website|slide the opening cover away/i,
  });
  if (await enter.isVisible().catch(() => false)) await enter.click();
  await expect(page.locator("[data-home-hero]")).toBeVisible();
}

async function openProduct(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rebuild/products?q=04-0101");
  const firstEntry = page.locator("[data-product-entry]").first();
  await expect(firstEntry).toBeVisible();
  await firstEntry.getByRole("link", { name: /View .* catalogue code/i }).click();
  await expect(page.locator("[data-product-examination]")).toBeVisible();
}

function numericStyle(value: string) {
  return Number.parseFloat(value);
}

test("homepage secondary hierarchy continues the regal display system", async ({ page }) => {
  await enterHomepage(page);

  for (const selector of [
    "[data-home-divisions] h2",
    "[data-home-selected] h2",
    "[data-home-company] h2",
    "[data-home-utilities] h2",
  ]) {
    const heading = page.locator(selector);
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    const family = await heading.evaluate((element) =>
      getComputedStyle(element).fontFamily.toLowerCase(),
    );
    expect(family, selector).toContain("cormorant");
  }
});

test("essential procurement labels meet the redesign minimums", async ({ page }) => {
  await enterHomepage(page);
  const divisionState = page.locator("[data-division-state]").first();
  await divisionState.scrollIntoViewIfNeeded();
  expect(
    numericStyle(await divisionState.evaluate((element) => getComputedStyle(element).fontSize)),
  ).toBeGreaterThanOrEqual(12);

  await page.goto("/rebuild/products");
  const catalogueLabel = page.locator("[data-catalogue-search] label");
  expect(
    numericStyle(await catalogueLabel.evaluate((element) => getComputedStyle(element).fontSize)),
  ).toBeGreaterThanOrEqual(13);

  await openProduct(page);
  const specificationLabel = page.locator("[data-product-spec-ledger] dt").first();
  expect(
    numericStyle(
      await specificationLabel.evaluate((element) => getComputedStyle(element).fontSize),
    ),
  ).toBeGreaterThanOrEqual(12);

  await page.goto("/rebuild/inquiry?manual=1");
  const inquiryStage = page.locator("[data-inquiry-stages] span").first();
  expect(
    numericStyle(await inquiryStage.evaluate((element) => getComputedStyle(element).fontSize)),
  ).toBeGreaterThanOrEqual(12);
});

test("product examination respects the heritage header and laptop fold", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openProduct(page);

  const returnRail = await page.locator("[data-product-return]").boundingBox();
  expect(returnRail).not.toBeNull();
  expect(returnRail?.y ?? 0).toBeGreaterThanOrEqual(77);

  const action = page.locator("[data-product-action]").first();
  await expect(action).toBeVisible();
  const actionBox = await action.boundingBox();
  expect(actionBox).not.toBeNull();
  expect((actionBox?.y ?? 0) + (actionBox?.height ?? 0)).toBeLessThanOrEqual(800);

  const mediaStage = await page.locator("[data-product-media-stage]").boundingBox();
  expect(mediaStage).not.toBeNull();
  expect(mediaStage?.height ?? 0).toBeGreaterThanOrEqual(500);
});

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`precision heritage routes avoid horizontal overflow at ${width}px`, async ({ page }) => {
    const height = width <= 390 ? 844 : width === 768 ? 1024 : width === 1280 ? 800 : 1000;
    await page.setViewportSize({ width, height });

    await enterHomepage(page);
    let overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await page.goto("/rebuild/products");
    overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await page.goto("/rebuild/inquiry?manual=1");
    overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
