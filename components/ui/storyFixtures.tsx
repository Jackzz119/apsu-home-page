import { homeMock } from '@/content/mocks/home';
import { primitiveMock } from '@/content/mocks/primitives';
import { Card } from './Card';
import { Chip } from './Chip';

export const sexOptions = homeMock.bmiCalculator.sexOptions.map((option) => ({
    value: option.id,
    label: option.label
}));
export const unitOptions = homeMock.bmiCalculator.units.map((option) => ({ value: option.kind, label: option.label }));
export const carouselItems = homeMock.onlineCare.cards.map((card) => ({
    id: card.id,
    label: card.title,
    content: (
        <Card>
            <h2 className="text-service-title">{card.title}</h2>
            {card.kind === 'chat' && <p className="mt-content-gap text-body">{card.messages[0].text}</p>}
        </Card>
    )
}));
export const marqueeItems = homeMock.hero.languageRows.flat().map((chip) => ({
    id: chip.id,
    content: <Chip label={chip.label} selected={chip.highlighted} direction={chip.direction} />
}));
export const carouselArgs = {
    label: homeMock.onlineCare.heading.title[0].text,
    items: carouselItems,
    previousLabel: homeMock.onlineCare.previousLabel,
    nextLabel: homeMock.onlineCare.nextLabel,
    statusLabel: primitiveMock.statusLabel
};
export const marqueeArgs = {
    label: primitiveMock.languagesLabel,
    items: marqueeItems,
    pauseLabel: primitiveMock.pauseLabel,
    resumeLabel: primitiveMock.resumeLabel
};
