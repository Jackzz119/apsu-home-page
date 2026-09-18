import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Hero } from './Hero';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/Hero',
    component: Hero,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.hero, ui: homePresentation }
} satisfies Meta<typeof Hero>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
