import { defineConfig } from '@playwright/test';

/** Reuse local Storybook and app previews; CI starts Storybook and serves the production build it just made. */
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
    webServer: [
        {
            command: 'npm run storybook -- --ci --no-open',
            url: 'http://127.0.0.1:6006/index.json',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000
        },
        {
            command: process.env.CI ? 'npm run start -- --hostname 127.0.0.1' : 'npm run dev -- --hostname 127.0.0.1',
            url: 'http://127.0.0.1:3000',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000
        }
    ]
});
