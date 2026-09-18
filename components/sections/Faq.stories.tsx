import { userEvent } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Faq } from './Faq';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/Faq',
    component: Faq,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.faq, ui: homePresentation }
} satisfies Meta<typeof Faq>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const AllExpanded: Story = {
    play: async ({ canvasElement }) => {
        for (const summary of canvasElement.querySelectorAll('details:not([open]) > summary'))
            await userEvent.click(summary);
    }
};
