import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Marquee } from './Marquee';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { marqueeArgs } from './storyFixtures';

const meta = {
    title: 'Primitives/Marquee',
    component: Marquee,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: marqueeArgs
} satisfies Meta<typeof Marquee>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Running: Story = { args: { autoPlay: true } };
export const Paused: Story = { args: { autoPlay: true, defaultPaused: true } };
export const ReducedMotion: Story = { args: { autoPlay: true, motion: 'reduced' } };

export const Compact: Story = { args: { size: 'sm' } };
