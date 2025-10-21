import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Configure the base URL (host) for the tests
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  // Optionally, launch the development server before running tests
  webServer: {
    command: 'npm run dev',
    // Playwright will wait until this specific URL is ready before running tests
    url: 'http://localhost:3000/escape_room', 
    reuseExistingServer: !process.env.CI,
  },
});
