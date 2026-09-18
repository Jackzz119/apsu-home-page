import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sleep } from './Sleep';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/Sleep',
    component: Sleep,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.sleep, ui: homePresentation }
} satisfies Meta<typeof Sleep>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
