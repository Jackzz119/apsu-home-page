import type { Preview } from '@storybook/nextjs-vite';
import '../app/globals.css';

/** The two Figma boards every component is judged against. */
const viewports = {
    'mobile-375': { name: 'Mobile 375', styles: { width: '375px', height: '812px' } },
    'desktop-1440': { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' } }
};

const preview: Preview = {
    parameters: {
        viewport: { options: viewports },
        a11y: { test: 'error' }
    }
};

export default preview;
