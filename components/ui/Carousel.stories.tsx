import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Carousel } from './Carousel';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { carouselArgs } from './storyFixtures';

const meta = {
    title: 'Primitives/Carousel',
    component: Carousel,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: carouselArgs
} satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FirstSlide: Story = { args: { initialIndex: 0 } };
export const LastSlide: Story = { args: { initialIndex: 3 } };
export const Keyboard: Story = { parameters: { pseudo: { focusVisible: '[tabindex="0"]' } } };
export const ReducedMotion: Story = { args: { motion: 'reduced' } };
export const Single: Story = { args: { size: 'single' } };
export const Empty: Story = { args: { items: [] } };
