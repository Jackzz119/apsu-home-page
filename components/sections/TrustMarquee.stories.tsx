import { userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrustMarquee } from './TrustMarquee';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/TrustMarquee',
    component: TrustMarquee,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.trustMarquee, ui: homePresentation }
} satisfies Meta<typeof TrustMarquee>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Paused: Story = {
    play: async ({ canvasElement }) => {
        const button = within(canvasElement).queryByRole('button', { name: homePresentation.pauseTrust });
        if (button) await userEvent.click(button);
    }
};
