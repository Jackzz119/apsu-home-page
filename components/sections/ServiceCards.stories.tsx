import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ServiceCards } from './ServiceCards';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/ServiceCards',
    component: ServiceCards,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.serviceCards, ui: homePresentation }
} satisfies Meta<typeof ServiceCards>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
