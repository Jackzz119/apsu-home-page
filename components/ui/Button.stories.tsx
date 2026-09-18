import { ArrowUpRight } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';
import { fn } from 'storybook/test';
import { primitiveMock } from '@/content/mocks/primitives';

const meta = {
    title: 'Primitives/Button',
    component: Button,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: {
        children: homeMock.hero.action.label,
        trailingIcon: <ArrowUpRight />,
        onClick: fn()
    }
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Pressed: Story = { parameters: { pseudo: { active: true } } };
export const Disabled: Story = { args: { disabled: true } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Compact: Story = { args: { size: 'sm', children: homeMock.serviceCards.items[0].action.label } };
export const Link: Story = {
    args: { href: `#${primitiveMock.destinationId}` },
    render: (args) => (
        <>
            <Button {...args} />
            <p id={primitiveMock.destinationId} className="mt-content-gap">
                {primitiveMock.destinationLabel}
            </p>
        </>
    )
};
export const DisabledLink: Story = { args: { href: `#${primitiveMock.destinationId}`, disabled: true } };
