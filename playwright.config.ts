import { defineConfig } from "@playwright/test";
const external = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: external ?? "http://127.0.0.1:3200",
    channel: "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: external
    ? undefined
    : {
        command: "npm run start -- --hostname 127.0.0.1 --port 3200",
        url: "http://127.0.0.1:3200",
        reuseExistingServer: false,
        timeout: 60000,
      },
});
