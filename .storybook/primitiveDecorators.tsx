import type { Decorator } from '@storybook/nextjs-vite';

/** Keep stories in a landmark, with realistic source copy and room for focus outlines. */
export const primitiveDecorators: Decorator[] = [
    (Story) => (
        <main className="container-page p-content-gap">
            <Story />
        </main>
    )
];
