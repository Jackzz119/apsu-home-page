import Image from 'next/image';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Menu } from 'lucide-react';
import {
    Button,
    Chip,
    Card,
    Accordion,
    Carousel,
    Marquee,
    NumberField,
    RadioGroup,
    SegmentedControl,
    Rating,
    IconButton
} from '@/components';
import { homeMock } from '@/content/mocks/home';
import { primitiveMock } from '@/content/mocks/primitives';
import { carouselArgs, marqueeArgs, sexOptions, unitOptions } from './storyFixtures';

/** An overview for visual review; individual colocated stories remain the state-by-state contract. */
function Primitives() {
    const specimens = [
        <Button
            key="button"
            trailingIcon={<Image {...primitiveMock.buttonArrow} alt={primitiveMock.buttonArrow.alt} unoptimized />}>
            {homeMock.hero.action.label}
        </Button>,
        <div key="chip" className="gap-label-gap flex flex-wrap">
            <Chip label={homeMock.hero.languageRows[0][0].label} />
            <Chip label={homeMock.hero.languageRows[0][1].label} selected />
        </div>,
        <div key="card" className="gap-content-gap grid lg:grid-cols-3">
            {homeMock.serviceCards.items.map((card, index) => (
                <Card key={card.id} variant={(['mint', 'purple', 'cyan'] as const)[index]}>
                    <h3 className="text-service-title">{card.title}</h3>
                </Card>
            ))}
        </div>,
        <Accordion key="accordion" title={homeMock.faq.items[0].question} defaultOpen>
            <p>{homeMock.faq.items[0].answer[0]}</p>
        </Accordion>,
        <Carousel key="carousel" {...carouselArgs} />,
        <Marquee key="marquee" {...marqueeArgs} />,
        <NumberField
            key="number"
            stepperIcon={<Image {...primitiveMock.numberStepper} alt={primitiveMock.numberStepper.alt} unoptimized />}
            incrementLabel={primitiveMock.incrementLabel}
            decrementLabel={primitiveMock.decrementLabel}
            label={homeMock.bmiCalculator.heightLabel}
            unit={homeMock.bmiCalculator.units[0].heightUnit}
            defaultValue={0}
        />,
        <RadioGroup
            key="radio"
            label={homeMock.bmiCalculator.sexLabel}
            options={sexOptions}
            defaultValue={sexOptions[1].value}
        />,
        <SegmentedControl
            key="segments"
            label={primitiveMock.unitsLabel}
            options={unitOptions}
            defaultValue={unitOptions[0].value}
        />,
        <Rating key="rating" value={5} label={primitiveMock.ratingLabel} />,
        <IconButton key="icon" label={homeMock.header.openMenuLabel}>
            <Menu />
        </IconButton>
    ];
    return (
        <main className="container-page space-y-plan-gap p-page-gutter">
            <header className="space-y-label-gap">
                <h1 className="text-section">{primitiveMock.heading}</h1>
                <p className="text-body">{primitiveMock.notice}</p>
            </header>
            {specimens.map((specimen, index) => (
                <section
                    key={primitiveMock.componentNames[index]}
                    aria-labelledby={`specimen-${index}`}
                    className="space-y-content-gap">
                    <h2 id={`specimen-${index}`} className="text-eyebrow font-medium">
                        {primitiveMock.componentNames[index]}
                    </h2>
                    {specimen}
                </section>
            ))}
        </main>
    );
}
const meta = {
    title: 'Primitives/Overview',
    component: Primitives,
    parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof Primitives>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
