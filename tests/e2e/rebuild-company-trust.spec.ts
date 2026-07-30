import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/rebuild/company",
  "/rebuild/company/scissors-through-time",
  "/rebuild/catalogues",
  "/rebuild/contact",
] as const;

async function expectNoSeriousAxeViolations(page: Page) {
  const result = await new AxeBuilder({ page }).exclude("canvas").analyze();
  expect(
    result.violations.filter((item) =>
      ["serious", "critical"].includes(item.impact ?? ""),
    ),
  ).toEqual([]);
}

test("all company trust routes expose one visible heading", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("Company presents verified identity, divisions and next routes", async ({ page }) => {
  await page.goto("/rebuild/company");
  await expect(page.getByRole("heading", { level: 1, name: /THROHI Medical Tools/i })).toBeVisible();
  await expect(page.getByText(/Sialkot, Pakistan/i).first()).toBeVisible();

  const ledger = page.getByRole("region", { name: /Instrument divisions/i });
  for (const division of [
    "Surgical Instruments",
    "Dental and Orthodontic Instruments",
    "Veterinary Instruments",
    "Beauty Instruments",
  ]) {
    await expect(ledger.getByText(division, { exact: true })).toBeVisible();
  }

  for (const name of [/Browse products/i, /View catalogues/i, /Scissors through time/i, /Build an inquiry/i]) {
    await expect(page.getByRole("link", { name })).toBeVisible();
  }
});

test("Scissors Through Time exposes full, reduced-motion and failure content", async ({ page }) => {
  await page.goto("/rebuild/company/scissors-through-time");
  await expect(page.getByRole("region", { name: /Scissors through time evolution/i })).toBeVisible();
  await expect(page.getByText(/not presented as THROHI corporate history/i)).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".frame-evolution-copy")).toHaveCount(4);

  await page.route("**/media/sector9d/manifest.json", (route) =>
    route.fulfill({ status: 500, body: "" }),
  );
  await page.reload();
  await expect(page.getByText(/instrument form/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Browse products/i })).toBeVisible();
});

test("Catalogues separates digital discovery from real documents", async ({ page }) => {
  await page.goto("/rebuild/catalogues");
  await expect(page.getByRole("heading", { level: 1, name: /Catalogues/i })).toBeVisible();
  await expect(page.getByRole("region", { name: /Digital catalogue/i })).toBeVisible();
  await expect(page.getByRole("region", { name: /Downloadable documents/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Download/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Browse surgical/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Browse dental/i })).toBeVisible();
});

test("Contact routes product requests through the Inquiry List", async ({ page }) => {
  await page.goto("/rebuild/contact");
  await expect(page.getByRole("heading", { level: 1, name: /Contact THROHI/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open Inquiry List/i })).toHaveAttribute(
    "href",
    "/rebuild/inquiry",
  );
  await expect(page.getByRole("link", { name: /Add an unlisted instrument/i })).toHaveAttribute(
    "href",
    "/rebuild/inquiry?manual=1",
  );
  await expect(page.locator('a[href="mailto:"]')).toHaveCount(0);
  await expect(page.locator('a[href="tel:"]')).toHaveCount(0);
});

test("rebuild navigation converges on real corporate routes", async ({ page }) => {
  await page.goto("/rebuild/company");
  const primary = page.getByRole("navigation", { name: "Primary navigation" });
  for (const route of ["Company", "Catalogues", "Contact"]) {
    await expect(primary.getByRole("link", { name: route, exact: true })).toBeVisible();
  }

  const footer = page.getByRole("navigation", { name: "Footer navigation" });
  for (const route of ["Company", "Scissors Through Time", "Catalogues", "Contact"]) {
    await expect(footer.getByRole("link", { name: route, exact: true })).toBeVisible();
  }
});

test("mobile navigation retains focus behavior on corporate routes", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile-chromium");
  await page.goto("/rebuild/company");
  await page.getByRole("button", { name: "Menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Catalogues", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
});

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`company trust routes have no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of routes) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, route).toBeLessThanOrEqual(1);
    }
  });
}

test("company trust routes have no serious Axe violations", async ({ page }) => {
  for (const route of routes) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await expectNoSeriousAxeViolations(page);
  }
});
