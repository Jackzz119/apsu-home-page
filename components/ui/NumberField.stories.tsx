import Image from 'next/image';
import { useState } from 'react';
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
    argTypes: { step: { control: 'text', type: 'string' } },
    args: {
        stepperIcon: <Image {...primitiveMock.numberStepper} alt={primitiveMock.numberStepper.alt} unoptimized />,
        incrementLabel: primitiveMock.incrementLabel,
        decrementLabel: primitiveMock.decrementLabel,
        label: homeMock.bmiCalculator.heightLabel,
        unit: homeMock.bmiCalculator.units[0].heightUnit,
        defaultValue: 0,
        min: 0,
        readOnly: false,
        step: '1'
    }
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Invalid: Story = { args: { defaultValue: -1, error: primitiveMock.error } };
export const ExternalError: Story = {
    args: { 'aria-invalid': true, 'aria-describedby': 'numberfield-external-error' },
    render: (args) => (
        <>
            <NumberField {...args} />
            <p id="numberfield-external-error">{primitiveMock.error}</p>
        </>
    )
};
export const Disabled: Story = { args: { disabled: true } };
export const WithHint: Story = {
    args: { hint: primitiveMock.hint, min: 0, max: 2, step: '0.5' },
    render: function Controlled(args) {
        const [value, setValue] = useState('0');
        return (
            <div data-controlled-value={value}>
                <NumberField
                    {...args}
                    defaultValue={undefined}
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                />
            </div>
        );
    }
};
export const Compact: Story = { args: { size: 'sm' } };
