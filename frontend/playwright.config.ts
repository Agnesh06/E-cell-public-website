import { defineConfig } from '@playwright/test'

const viewports = [
  { name: 'mobile-320', viewport: { width: 320, height: 568 } },
  { name: 'mobile', viewport: { width: 375, height: 667 } },
  { name: 'mobile-414', viewport: { width: 414, height: 896 } },
  { name: 'tablet', viewport: { width: 768, height: 1024 } },
  { name: 'laptop', viewport: { width: 1024, height: 768 } },
  { name: 'desktop-short', viewport: { width: 1280, height: 500 } },
  { name: 'desktop', viewport: { width: 1280, height: 720 } },
  { name: 'wide-hd', viewport: { width: 1600, height: 900 } },
  { name: 'wide', viewport: { width: 1920, height: 1080 } },
]

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: viewports.map(({ name, viewport }) => ({
    name,
    use: { browserName: 'chromium', viewport },
  })),
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
