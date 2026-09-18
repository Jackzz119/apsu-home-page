import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WeightLoss } from './WeightLoss';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/WeightLoss',
    component: WeightLoss,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.weightLoss, ui: homePresentation }
} satisfies Meta<typeof WeightLoss>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
