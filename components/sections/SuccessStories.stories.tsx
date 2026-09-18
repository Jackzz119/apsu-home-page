import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SuccessStories } from './SuccessStories';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/SuccessStories',
    component: SuccessStories,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.successStories, ui: homePresentation }
} satisfies Meta<typeof SuccessStories>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
