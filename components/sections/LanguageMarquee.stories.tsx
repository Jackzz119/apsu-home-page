import { userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LanguageMarquee } from './LanguageMarquee';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/LanguageMarquee',
    component: LanguageMarquee,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.hero.languageRows, ui: homePresentation }
} satisfies Meta<typeof LanguageMarquee>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Paused: Story = {
    play: async ({ canvasElement }) => {
        const button = within(canvasElement).queryByRole('button', { name: homePresentation.pauseLanguages });
        if (button) await userEvent.click(button);
    }
};
