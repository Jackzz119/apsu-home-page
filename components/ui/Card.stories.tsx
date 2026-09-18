import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './Card';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';
import { primitiveMock } from '@/content/mocks/primitives';

const meta = {
    title: 'Primitives/Card',
    component: Card,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: { children: <h2 className="text-service-title">{homeMock.serviceCards.items[0].title}</h2> }
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Mint: Story = { args: { variant: 'mint' } };
export const Purple: Story = { args: { variant: 'purple' } };
export const Cyan: Story = { args: { variant: 'cyan' } };
export const Compact: Story = { args: { size: 'sm' } };
export const Interactive: Story = {
    args: { href: `#${primitiveMock.destinationId}` },
    render: (args) => (
        <>
            <Card {...args} />
            <p id={primitiveMock.destinationId} className="mt-content-gap">
                {primitiveMock.destinationLabel}
            </p>
        </>
    )
};
export const InteractiveHover: Story = { ...Interactive, parameters: { pseudo: { hover: true } } };
export const Focus: Story = { ...Interactive, parameters: { pseudo: { focusVisible: true } } };
export const Pressed: Story = { ...Interactive, parameters: { pseudo: { active: true } } };
