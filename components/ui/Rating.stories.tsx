import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Rating } from './Rating';
import { primitiveDecorators } from '../../.storybook/primitiveDecorators';
import { homeMock } from '@/content/mocks/home';
import { primitiveMock } from '@/content/mocks/primitives';

const meta = {
    title: 'Primitives/Rating',
    component: Rating,
    decorators: primitiveDecorators,
    parameters: { layout: 'fullscreen' },
    args: { value: homeMock.successStories.stories[0].rating, label: primitiveMock.ratingLabel }
} satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Partial: Story = { args: { value: 3.5, label: primitiveMock.partialRatingLabel } };
export const Empty: Story = { args: { value: 0, label: primitiveMock.emptyRatingLabel } };
export const Compact: Story = { args: { size: 'sm' } };
