import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Chip } from './Chip';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';
import { useState } from 'react';
import type { ChipProps } from './Chip';
/** Exercise a genuine toggle without changing the source informational default. */
function ToggleChip(args: ChipProps) {
    const [selected, setSelected] = useState(args.selected ?? false);
    return <Chip {...args} selected={selected} onClick={() => setSelected(!selected)} />;
}

const meta = {
    title: 'Primitives/Chip',
    component: Chip,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: { label: homeMock.hero.languageRows[0][0].label }
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true, label: homeMock.hero.languageRows[0][1].label } };
export const Interactive: Story = { render: (args) => <ToggleChip {...args} /> };
export const Hover: Story = { ...Interactive, parameters: { pseudo: { hover: true } } };
export const Focus: Story = { ...Interactive, parameters: { pseudo: { focusVisible: true } } };
export const Pressed: Story = { ...Interactive, parameters: { pseudo: { active: true } } };
export const Disabled: Story = { ...Interactive, args: { disabled: true } };
export const Compact: Story = { args: { size: 'sm' } };
export const MixedDirection: Story = { args: { label: homeMock.hero.languageRows[1][0].label, direction: 'auto' } };
