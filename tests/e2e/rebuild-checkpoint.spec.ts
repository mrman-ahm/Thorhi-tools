import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("isolated rebuild catalogue", () => {
  test("loads without browser runtime errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/rebuild");
    await expect(page.getByRole("heading", { name: "THROHI Medical Tools" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("uses multiple sharp real instruments in the rebuilt homepage hero", async ({ page }) => {
    await page.goto("/rebuild");
    const heroImages = page.locator("main section").first().locator("img[src*='/catalogue/products/']");
    await expect(heroImages).toHaveCount(3);
    await expect(heroImages.first()).toHaveAttribute("fetchpriority", "high");
    expect(
      await heroImages.evaluateAll((images: HTMLImageElement[]) =>
        images.every((image) => image.naturalWidth > 192)
      )
    ).toBe(true);
  });

  test("persists catalogue review decisions locally with explicit confirmations", async ({ page }) => {
    await page.goto("/rebuild/review/catalogue");
    await expect(page.getByRole("heading", { name: "Catalogue review" })).toBeVisible();
    await page.getByLabel("Reviewer name").fill("Review Tester");
    await page.getByRole("button", { name: "approved", exact: true }).click();
    await page.getByLabel(/Representative image matches/).check();
    await page.getByLabel(/variant code records are confirmed/).check();
    await page.getByLabel(/Catalogue file and page reference/).check();

    await expect.poll(() => page.evaluate(() => {
      const draft = JSON.parse(localStorage.getItem("throhi-catalogue-review-v1") ?? "{}");
      return {
        reviewer: draft.reviewer,
        status: draft.decisions?.[0]?.status,
        image: draft.decisions?.[0]?.confirmImage,
      };
    })).toEqual({ reviewer: "Review Tester", status: "approved", image: true });
  });

  test("supports exact-code search and inquiry persistence", async ({ page }) => {
    await page.goto("/rebuild/products?q=04-0101");
    await expect(page.getByText("04-0101", { exact: true }).first()).toBeVisible();

    await page.getByRole("button", { name: "Add to Inquiry" }).first().click();
    await page.getByRole("link", { name: /Inquiry/ }).first().click();
    await expect(page.getByRole("heading", { name: "Selected instruments" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Selected instruments" })).toBeVisible();
    const draft = await page.evaluate(() => JSON.parse(localStorage.getItem("throhi-inquiry-v3") ?? "{}"));
    expect(draft.items).toHaveLength(1);
  });

  test("normalizes product codes and recovers from no results", async ({ page }) => {
    await page.goto("/rebuild/products?q=040101");
    await expect(page.getByText("04-0101", { exact: true }).first()).toBeVisible();

    const search = page.getByRole("searchbox", { name: "Search by product name or code" });
    await search.fill("not-a-real-instrument");
    await expect(page.getByRole("heading", { name: /Nothing matched/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset catalogue" })).toBeVisible();
  });

  test("hydrates catalogue family, sort, and pagination state from the URL", async ({ page }) => {
    await page.goto("/rebuild/products?division=surgical&family=surgical%3Ascissors&sort=code&page=2");

    await expect(page.getByText("Page 2 of", { exact: false })).toBeVisible();
    await expect(page.getByRole("button", { name: /Scissors/ })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Sort" })).toHaveValue("code");
    await expect(page).toHaveURL(/division=surgical/);
    await expect(page).toHaveURL(/family=surgical%3Ascissors/);
  });

  test("uses native mobile disclosure for catalogue filters", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile-chromium", "Mobile-only interaction");

    await page.goto("/rebuild/products");
    await page.getByText("Filters", { exact: true }).click();
    await page.getByRole("radio", { name: "Dental", exact: true }).click();
    await expect(page).toHaveURL(/division=dental/);
    await expect(page.getByText("Dental & Orthodontic", { exact: true }).first()).toBeVisible();
  });

  test("opens and closes the mobile navigation", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile-chromium", "Mobile-only interaction");

    await page.goto("/rebuild");
    const menuButton = page.getByRole("button", { name: "Menu" });
    await menuButton.click();
    await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeHidden();
  });

  test("renders real sprite imagery for supplied divisions", async ({ page }) => {
    await page.goto("/rebuild/products?q=04-0101");
    const operatingSprite = page.locator("[style*='--catalogue-sprite-url']").first();
    await expect(operatingSprite).toBeVisible();
    const operatingPosition = await operatingSprite.evaluate(element =>
      getComputedStyle(element).getPropertyValue("--catalogue-sprite-position")
    );

    const search = page.getByRole("searchbox", { name: "Search by product name or code" });
    await search.fill("SP-84");
    await expect(page.getByText("SP-84", { exact: true }).first()).toBeVisible();
    const oliverSprite = page.locator("[style*='--catalogue-sprite-url']").first();
    const oliverPosition = await oliverSprite.evaluate(element =>
      getComputedStyle(element).getPropertyValue("--catalogue-sprite-position")
    );

    expect(operatingPosition).not.toBe(oliverPosition);
    await expect(page.getByText("Dental & Orthodontic", { exact: false }).first()).toBeVisible();
    const productHeading = page.locator("article h2").first();
    expect(await productHeading.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  });

  test("serves sharp individual product media lazily with sprite fallback", async ({ page }) => {
    await page.goto("/rebuild/products?q=SP-84");
    const cardImage = page.locator("article img[src*='/catalogue/products/']").first();
    await expect(cardImage).toBeVisible();
    await expect(cardImage).toHaveAttribute("loading", "lazy");
    expect(await cardImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(192);

    await page.route("**/catalogue/products/surgical-scissors-04-0101.avif", route =>
      route.abort("failed")
    );
    await page.goto("/rebuild/products/surgical-scissors-04-0101");
    await expect(page.locator("[style*='--catalogue-sprite-url']").first()).toBeVisible();
  });

  test("keeps base products and variants as separate inquiry lines", async ({ page }) => {
    await page.goto("/rebuild/products/surgical-scissors-04-0101");
    await page.getByRole("button", { name: "Add to Inquiry" }).click();
    await page.getByRole("button", { name: "Add variant", exact: true }).first().click();
    await expect(page.getByRole("link", { name: /2 instruments in Inquiry List/ })).toBeVisible();
    await page.getByRole("link", { name: /Review Inquiry/ }).click();
    await expect(page.locator("article", { hasText: "OPERATING Scissors" })).toHaveCount(2);
    await expect(page.getByText("2 lines · quantity 2")).toBeVisible();
  });

  test("migrates the previous rebuild draft into schema v3", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("throhi-rebuild-inquiry-v1", JSON.stringify([{
        key: "surgical-scissors-04-0101",
        productId: "surgical-scissors-04-0101",
        code: "04-0101",
        name: "OPERATING Scissors",
        quantity: 2,
        note: "Preserve this note"
      }]));
    });
    await page.goto("/rebuild/inquiry");
    await expect(page.getByText("2 lines · quantity 2")).not.toBeVisible();
    await expect(page.getByText("1 line · quantity 2")).toBeVisible();
    const storage = await page.evaluate(() => ({
      current: JSON.parse(localStorage.getItem("throhi-inquiry-v3") ?? "{}"),
      previous: localStorage.getItem("throhi-rebuild-inquiry-v1")
    }));
    expect(storage.current.items[0].note).toBe("Preserve this note");
    expect(storage.previous).toBeNull();
  });

  test("submits a real catalogue product through the structured development adapter", async ({ page }) => {
    await page.goto("/rebuild/products?q=04-0101");
    await page.getByRole("button", { name: "Add to Inquiry" }).first().click();
    await page.getByRole("link", { name: /1 instrument in Inquiry List/ }).click();

    await page.getByLabel("Full name").fill("Catalogue Buyer");
    await page.getByLabel("Company name").fill("Example Procurement");
    await page.getByLabel("Country").selectOption("Pakistan");
    await page.getByLabel("Email").fill("buyer@example.com");
    await page.getByText("I confirm that the provided information").click();
    await page.getByRole("button", { name: "Submit inquiry" }).click();

    await expect(page).toHaveURL(/\/rebuild\/inquiry\/success/);
    await expect(page.getByText("Development memory adapter")).toBeVisible();
    await expect(page.getByText("Production delivery is not configured.")).toBeVisible();
    await expect.poll(() => page.evaluate(() => {
      const draft = JSON.parse(localStorage.getItem("throhi-inquiry-v3") ?? "{}");
      return draft.items?.length;
    })).toBe(0);
  });

  test("preserves the inquiry when the API is unreachable", async ({ page }) => {
    await page.goto("/rebuild/products?q=04-0101");
    await page.getByRole("button", { name: "Add to Inquiry" }).first().click();
    await page.getByRole("link", { name: /1 instrument in Inquiry List/ }).click();
    await page.getByLabel("Full name").fill("Catalogue Buyer");
    await page.getByLabel("Company name").fill("Example Procurement");
    await page.getByLabel("Country").selectOption("Pakistan");
    await page.getByLabel("Email").fill("buyer@example.com");
    await page.getByText("I confirm that the provided information").click();
    await page.route("**/api/inquiries", route => route.abort("failed"));
    await page.getByRole("button", { name: "Submit inquiry" }).click();
    await expect(page.getByRole("alert")).toContainText("could not reach the server");
    await expect(page.getByRole("heading", { name: "Review selected instruments" })).toBeVisible();
    await expect(page.getByText("1 line · quantity 1")).toBeVisible();
  });

  test("has no serious or critical automated accessibility violations", async ({ page }) => {
    await page.goto("/rebuild/products?q=04-0101");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(violation =>
      violation.impact === "serious" || violation.impact === "critical"
    )).toEqual([]);
  });

  test("uses complementary blue contrast on rebuild navigation", async ({ page }) => {
    await page.goto("/rebuild/products");
    const background = await page.locator("header").first().evaluate((element) =>
      getComputedStyle(element).backgroundColor
    );
    const channels = background.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    expect(channels[2]).toBeGreaterThan(channels[0]);
  });
});
