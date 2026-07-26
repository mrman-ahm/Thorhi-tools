import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import catalogueData from "../../src/data/catalogue.generated.json";
import { prepareVisualCapture } from "./helpers/visual";

type GeneratedProduct = {
  id: string;
  slug: string;
  code: string;
  name: string;
  division: string;
  family: string;
  variants: Array<{ id: string; label: string; value: string }>;
};

type GeneratedFamily = {
  slug: string;
  division: string;
  label: string;
  productCount: number;
};

type GeneratedDivision = {
  slug: string;
  label: string;
};

const catalogue = catalogueData as {
  divisions: GeneratedDivision[];
  families: GeneratedFamily[];
  products: GeneratedProduct[];
};

function required<T>(value: T | undefined, message: string): T {
  if (!value) throw new Error(message);
  return value;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const representative = required(
  catalogue.products.find(product => product.variants.length > 0) ?? catalogue.products[0],
  "Generated catalogue requires at least one product"
);
const representativeDivision = required(
  catalogue.divisions.find(item => item.slug === representative.division) ?? catalogue.divisions[0],
  "Generated catalogue requires a matching division"
);
const representativeFamily = required(
  catalogue.families.find(item => item.division === representative.division && item.slug === representative.family) ?? catalogue.families[0],
  "Generated catalogue requires a matching family"
);
const representativeRoute = `/products/${representative.division}/${representative.family}/${representative.slug}`;
const familyRoute = `/products/${representativeFamily.division}/${representativeFamily.slug}`;
const paginatedFamily = catalogue.families.find(item => item.productCount > 36);

const routes = [
  ["products", "/products", /documented variants/i],
  ["division", `/products/${representativeDivision.slug}`, new RegExp(`^${escapeRegExp(representativeDivision.label)}$`, "i")],
  ["family", familyRoute, new RegExp(`^${escapeRegExp(representativeFamily.label)}$`, "i")],
  ["product", representativeRoute, new RegExp(`^${escapeRegExp(representative.name)}$`, "i")],
  ["search", `/search?q=${encodeURIComponent(representative.code)}`, /Find the instrument/i],
  ["company", "/company", /Evidence first/i],
  ["resources", "/resources", /Documents with traceable context/i],
  ["contact", "/contact", /Send the context needed to respond/i]
] as const;

for (const [name, route, heading] of routes) {
  test(`${name} route renders without overflow`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    await prepareVisualCapture(page);
    const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
    await testInfo.attach(`${name}-v3-${testInfo.project.name}.png`, { body: screenshot, contentType: "image/png" });
  });
}

test("products landing preserves every generated catalogue and family route", async ({ page }) => {
  await page.goto("/products");
  for (const division of catalogue.divisions) {
    await expect(page.locator(`.catalogue-division-row[href="/products/${division.slug}"]`)).toBeVisible();
  }
  await expect(page.locator(`.catalogue-family-routes a[href="${familyRoute}"]`)).toBeVisible();
  await expect(page.locator('.manual-recovery-link[href="/inquiry?manual=1"]')).toBeVisible();
});

test("exact generated variant or representative code ranks first", async ({ page }) => {
  const exactCode = representative.variants[0]?.label ?? representative.code;
  await page.goto(`/search?q=${encodeURIComponent(exactCode.toLowerCase())}`);
  const firstResult = page.locator(".search-result-object").first();
  await expect(firstResult).toContainText(representative.name);
  await expect(firstResult).toContainText(/exact code|variant code/i);
});

test("search material finish and catalogue filters preserve query state", async ({ page }) => {
  await page.goto(`/search?q=${encodeURIComponent(representative.code)}&division=${representative.division}&family=${representative.family}&material=surgical%20stainless%20steel&finish=matte`);
  await expect(page.getByLabel("Search query")).toHaveValue(representative.code);
  await expect(page.getByLabel("Catalogue")).toHaveValue(representative.division);
  await expect(page.getByLabel("Family")).toHaveValue(representative.family);
  await expect(page.getByLabel("Material")).toHaveValue("surgical stainless steel");
  await expect(page.getByLabel("Finish")).toHaveValue("matte");
});

test("family filters and sorting remain server-driven", async ({ page }) => {
  const term = representative.name.split(/\s+/)[0];
  await page.goto(`${familyRoute}?q=${encodeURIComponent(term)}&sort=code`);
  await expect(page.getByLabel(`Search within ${representativeFamily.label}`)).toHaveValue(term);
  await expect(page.getByLabel("Sort results")).toHaveValue("code");
  await expect(page.getByText(`Query: ${term}`, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: representative.name, exact: true }).first()).toBeVisible();
});

test("large family catalogues paginate without losing route context", async ({ page }) => {
  test.skip(!paginatedFamily, "No generated family currently exceeds one page");
  const family = required(paginatedFamily, "Paginated family disappeared after test skip");
  const route = `/products/${family.division}/${family.slug}`;
  await page.goto(`${route}?sort=variants&page=2`);
  await expect(page.getByLabel("Sort results")).toHaveValue("variants");
  await expect(page.getByRole("navigation", { name: `${family.label} result pages` })).toBeVisible();
  await expect(page.getByText(/Page 2 of/i)).toBeVisible();
  await expect(page.getByRole("link", { name: "← Previous" })).toHaveAttribute("href", /sort=variants/);
});

test("mobile family filters use a native disclosure", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile filter disclosure is validated on mobile");
  await page.goto(familyRoute);
  const disclosure = page.locator(".catalogue-filter-shell");
  const summary = disclosure.locator("summary");
  await expect(summary).toBeVisible();
  await expect(disclosure).toHaveAttribute("open", "");
  await summary.click();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await expect(disclosure.locator(".catalogue-filter-panel")).toBeHidden();
});

test("family no-results recovery preserves the catalogue context", async ({ page }) => {
  await page.goto(`${familyRoute}?q=does-not-exist&material=titanium&finish=polished`);
  await expect(page.getByRole("heading", { name: "No instruments matched these family filters." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add unlisted item" })).toHaveAttribute("href", new RegExp(`division=${representativeFamily.division}`));
});

test("configured quantity and note persist on the first product addition", async ({ page }) => {
  await page.goto(representativeRoute);
  await page.getByLabel("Quantity for inquiry").fill("4");
  await page.getByLabel("Product-specific note").fill("Confirm this exact working pattern.");
  await page.getByRole("button", { name: `Add to inquiry: ${representative.name}`, exact: true }).click();

  const saved = await page.evaluate(code => {
    const draft = JSON.parse(window.localStorage.getItem("throhi-inquiry-v2") ?? "{}") as { items?: Array<{ code: string; quantity: number; note: string }> };
    return draft.items?.find(item => item.code === code);
  }, representative.code);
  expect(saved).toMatchObject({
    code: representative.code,
    quantity: 4,
    note: "Confirm this exact working pattern."
  });
});

test("an exact variant enters the inquiry with its source description", async ({ page }) => {
  const variant = required(representative.variants[0], "Generated representative requires a variant");
  await page.goto(representativeRoute);
  await page.getByRole("button", { name: `Add exact variant: ${variant.label} for ${representative.name}`, exact: true }).click();

  const saved = await page.evaluate(code => {
    const draft = JSON.parse(window.localStorage.getItem("throhi-inquiry-v2") ?? "{}") as { items?: Array<{ code: string; name: string; note: string }> };
    return draft.items?.find(item => item.code === code);
  }, variant.label);
  expect(saved).toMatchObject({
    code: variant.label,
    name: `${representative.name} — ${variant.label}`,
    note: variant.value
  });
});

test("catalogue pages have no serious automated accessibility violations", async ({ page }) => {
  for (const route of ["/products", familyRoute, representativeRoute]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(violation => violation.impact === "critical" || violation.impact === "serious");
    expect(serious, `${route}\n${JSON.stringify(serious, null, 2)}`).toEqual([]);
  }
});

test("unknown routes use the production 404", async ({ page }) => {
  const response = await page.goto("/route-that-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This catalogue route does not exist." })).toBeVisible();
});
