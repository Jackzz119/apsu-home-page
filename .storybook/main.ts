import type { StorybookConfig } from '@storybook/nextjs-vite';

/** Stories live next to their components; no separate stories/ folder. */
const config: StorybookConfig = {
    stories: ['../components/**/*.stories.@(ts|tsx)', '../app/**/*.stories.@(ts|tsx)'],
    addons: ['@storybook/addon-a11y', 'storybook-addon-pseudo-states'],
    framework: '@storybook/nextjs-vite',
    staticDirs: ['../public']
};

export default config;
