import { defineConfig } from '@playwright/test';

/** Reuse the local Storybook preview; CI starts the same command when no preview is running. */
export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.spec.ts',
    fullyParallel: true,
    workers: 2,
    timeout: 120_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL: 'http://127.0.0.1:6006',
        browserName: 'chromium',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure'
    },
    projects: [
        { name: 'mobile-375', use: { viewport: { width: 375, height: 812 } } },
        { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900 } } }
    ],
    webServer: {
        command: 'npm run storybook -- --ci --no-open',
        url: 'http://127.0.0.1:6006/index.json',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
    }
});
