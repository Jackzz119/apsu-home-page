import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FinalCta } from './FinalCta';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/FinalCta',
    component: FinalCta,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.finalCta, ui: homePresentation }
} satisfies Meta<typeof FinalCta>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
