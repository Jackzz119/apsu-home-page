import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RadioGroup } from './RadioGroup';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';
import { sexOptions } from './storyFixtures';

const meta = {
    title: 'Primitives/RadioGroup',
    component: RadioGroup,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: {
        label: homeMock.bmiCalculator.sexLabel,
        options: sexOptions,
        defaultValue: homeMock.bmiCalculator.sourcePreview.sexOptionId
    }
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { parameters: { pseudo: { focusVisible: 'input:checked' } } };
export const Checked: Story = { args: { defaultValue: sexOptions[0].value } };
export const Disabled: Story = { args: { disabled: true } };
export const OptionDisabled: Story = { args: { options: [{ ...sexOptions[0], disabled: true }, sexOptions[1]] } };
export const Compact: Story = { args: { size: 'sm' } };
