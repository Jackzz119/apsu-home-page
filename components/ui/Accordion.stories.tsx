import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Accordion } from './Accordion';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';

const meta = {
    title: 'Primitives/Accordion',
    component: Accordion,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: { title: homeMock.faq.items[0].question, children: <p>{homeMock.faq.items[0].answer[0]}</p> }
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultOpen: true } };
export const Collapsed: Story = {};
export const Expanded: Story = { args: { defaultOpen: true } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Pressed: Story = { parameters: { pseudo: { active: true } } };
export const ReducedMotion: Story = { args: { motion: 'reduced' } };

export const Compact: Story = { args: { size: 'sm', defaultOpen: true } };

/** Review approved FAQ copy at natural height before composing the P5 section. */
export const AllAnswers: Story = {
    render: () => (
        <div className="gap-content-gap flex flex-col">
            {homeMock.faq.items.map((item) => (
                <Accordion key={item.id} title={item.question} defaultOpen>
                    {item.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </Accordion>
            ))}
        </div>
    )
};
