import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OnlineCare } from './OnlineCare';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/OnlineCare',
    component: OnlineCare,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.onlineCare, ui: homePresentation }
} satisfies Meta<typeof OnlineCare>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
