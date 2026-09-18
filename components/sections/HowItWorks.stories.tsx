import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HowItWorks } from './HowItWorks';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/HowItWorks',
    component: HowItWorks,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.howItWorks, ui: homePresentation }
} satisfies Meta<typeof HowItWorks>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
