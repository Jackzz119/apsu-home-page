import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButton } from './IconButton';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';
import { Menu } from 'lucide-react';
import { fn } from 'storybook/test';

const meta = {
    title: 'Primitives/IconButton',
    component: IconButton,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: { label: homeMock.header.openMenuLabel, children: <Menu />, onClick: fn() }
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Pressed: Story = { parameters: { pseudo: { active: true } } };
export const Disabled: Story = { args: { disabled: true } };
export const Primary: Story = { args: { variant: 'primary' } };
export const Compact: Story = { args: { size: 'sm' } };
