import { userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BmiCalculator } from './BmiCalculator';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

const meta = {
    title: 'Sections/BmiCalculator',
    component: BmiCalculator,
    parameters: { layout: 'fullscreen' },
    args: { content: homeMock.bmiCalculator, ui: homePresentation }
} satisfies Meta<typeof BmiCalculator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
async function openForm(canvasElement: HTMLElement) {
    const canvas = within(canvasElement);
    const disclosure = canvas.queryByRole('button', { name: homePresentation.bmi.openLabel });
    if (disclosure) await userEvent.click(disclosure);
    return canvas;
}
export const Expanded: Story = {
    play: async ({ canvasElement }) => {
        await openForm(canvasElement);
    }
};
export const Invalid: Story = {
    play: async ({ canvasElement }) => {
        const canvas = await openForm(canvasElement);
        await userEvent.click(canvas.getByRole('button', { name: homeMock.bmiCalculator.submitLabel }));
    }
};
export const ImperialResult: Story = {
    play: async ({ canvasElement }) => {
        const canvas = await openForm(canvasElement);
        await userEvent.type(canvas.getByRole('spinbutton', { name: 'Height' }), '5');
        await userEvent.clear(canvas.getByRole('spinbutton', { name: 'Height (in)' }));
        await userEvent.type(canvas.getByRole('spinbutton', { name: 'Height (in)' }), '8');
        await userEvent.type(canvas.getByRole('spinbutton', { name: 'Weight' }), '160');
        await userEvent.click(canvas.getByRole('button', { name: homeMock.bmiCalculator.submitLabel }));
    }
};
export const MetricResult: Story = {
    play: async ({ canvasElement }) => {
        const canvas = await openForm(canvasElement);
        await userEvent.click(canvas.getByRole('radio', { name: 'cm/kgs' }));
        await userEvent.type(canvas.getByRole('spinbutton', { name: 'Height' }), '170');
        await userEvent.type(canvas.getByRole('spinbutton', { name: 'Weight' }), '80');
        await userEvent.click(canvas.getByRole('button', { name: homeMock.bmiCalculator.submitLabel }));
    }
};
export const WeightError: Story = {
    play: async ({ canvasElement }) => {
        const canvas = await openForm(canvasElement);
        await userEvent.type(canvas.getByRole('spinbutton', { name: 'Height' }), '5');
        await userEvent.click(canvas.getByRole('button', { name: homeMock.bmiCalculator.submitLabel }));
    }
};
export const KeyboardResult: Story = {
    play: async ({ canvasElement }) => {
        const canvas = await openForm(canvasElement);
        await userEvent.type(canvas.getByRole('spinbutton', { name: 'Height' }), '5');
        await userEvent.type(canvas.getByRole('spinbutton', { name: 'Weight' }), '160');
        canvas.getByRole('button', { name: homeMock.bmiCalculator.submitLabel }).focus();
        await userEvent.keyboard('{Enter}');
    }
};
