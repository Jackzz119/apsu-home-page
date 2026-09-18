import { userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './Header';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/Header',
    component: Header,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Native page anchors scroll smoothly for pointer input. Keyboard and reduced-motion navigation remain instant; full-page travel is covered by browser tests. The close button shares the hamburger target, while scroll locking preserves background geometry.'
            }
        }
    },
    args: { content: homeMock.header, ui: homePresentation }
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const MenuOpen: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const trigger = canvas.getByRole('button', { name: homeMock.header.openMenuLabel, hidden: true });
        if (trigger.getBoundingClientRect().width) await userEvent.click(trigger);
    }
};
