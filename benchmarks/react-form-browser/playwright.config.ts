import { defineConfig, devices } from '@playwright/test'

const previewPort = 4174

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 10 * 60 * 1000,
  expect: {
    timeout: 5_000,
  },
  reporter: 'line',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://127.0.0.1:${previewPort}`,
    browserName: 'chromium',
    headless: true,
    trace: 'off',
    video: 'off',
    screenshot: 'off',
  },
  webServer: {
    command: 'pnpm run preview',
    url: `http://127.0.0.1:${previewPort}`,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: 'chromium-speed',
      testMatch: /speed\.spec\.ts/,
    },
    {
      name: 'chromium-memory',
      testMatch: /memory\.spec\.ts/,
    },
  ],
})
