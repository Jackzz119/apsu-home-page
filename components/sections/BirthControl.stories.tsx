import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BirthControl } from './BirthControl';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/BirthControl',
    component: BirthControl,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.birthControl, ui: homePresentation }
} satisfies Meta<typeof BirthControl>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
