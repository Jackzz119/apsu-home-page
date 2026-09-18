import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NumberField } from './NumberField';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';
import { primitiveMock } from '@/content/mocks/primitives';

const meta = {
    title: 'Primitives/NumberField',
    component: NumberField,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: {
        label: homeMock.bmiCalculator.heightLabel,
        unit: homeMock.bmiCalculator.units[0].heightUnit,
        defaultValue: 0,
        min: 0,
        step: 1
    }
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Invalid: Story = { args: { defaultValue: -1, error: primitiveMock.error } };
export const Disabled: Story = { args: { disabled: true } };
export const WithHint: Story = { args: { hint: primitiveMock.hint } };
export const Compact: Story = { args: { size: 'sm' } };
