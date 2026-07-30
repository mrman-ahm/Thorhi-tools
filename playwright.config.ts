import { defineConfig, devices } from "@playwright/test";

const ci = Boolean(process.env.CI);
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const localPort = process.env.PLAYWRIGHT_PORT ?? "3000";
const localBaseUrl = `http://127.0.0.1:${localPort}`;
const baseURL = externalBaseUrl ?? localBaseUrl;
const reuseExistingServer =
  process.env.PLAYWRIGHT_REUSE_SERVER === undefined
    ? !ci
    : process.env.PLAYWRIGHT_REUSE_SERVER === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  workers: ci ? 2 : undefined,
  reporter: ci
    ? [["list"], ["json", { outputFile: "test-results/results.json" }]]
    : [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL,
    trace: ci ? "off" : "retain-on-failure",
    screenshot: "only-on-failure",
    video: ci ? "off" : "retain-on-failure"
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } }
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: `npm run start -- -p ${localPort}`,
        url: localBaseUrl,
        reuseExistingServer,
        timeout: 120000
      }
});
