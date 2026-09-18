import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer } from './Footer';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/Footer',
    component: Footer,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.footer, ui: homePresentation }
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
