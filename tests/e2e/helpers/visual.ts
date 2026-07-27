import type { Page } from "@playwright/test";

export async function prepareVisualCapture(page: Page) {
  await page.addStyleTag({
    content: `
      main > section,
      .utility-section,
      .family-listing-section,
      .related-object-section,
      .division-product-preview,
      .division-family-routes,
      .search-results-section,
      .legal-reading-section {
        content-visibility: visible !important;
      }
    `
  });

  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
}
