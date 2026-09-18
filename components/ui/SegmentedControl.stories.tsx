import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SegmentedControl } from './SegmentedControl';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';
import { unitOptions } from './storyFixtures';
import { primitiveMock } from '@/content/mocks/primitives';

const meta = {
    title: 'Primitives/SegmentedControl',
    component: SegmentedControl,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: {
        label: primitiveMock.unitsLabel,
        options: unitOptions,
        defaultValue: homeMock.bmiCalculator.sourcePreview.unit
    }
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: 'input:not(:checked)' } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: 'input:checked' } } };
export const Pressed: Story = { parameters: { pseudo: { active: 'input:not(:checked)' } } };
export const Selected: Story = { args: { defaultValue: unitOptions[1].value } };
export const Disabled: Story = { args: { disabled: true } };
export const Compact: Story = { args: { size: 'sm' } };
