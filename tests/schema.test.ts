import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Action, BmiUnits, Heading, HomePage, ImageAsset, OnlineCareCard, Price, SuccessStory } from '@/content/schema';

const image = { src: '/images/example.webp', alt: '', width: 640, height: 480 };
const price = { amount: 2000, currency: 'USD', interval: 'month', prefix: 'From' };
const author = { id: 'story-1', name: 'Example author', location: 'Example city' };

describe('content boundaries', () => {
    it('preserves integer cents without coercing or rounding', () => {
        expect(Price.parse(price)).toEqual(price);
        for (const amount of ['2000', 20.5, -1, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) {
            expect(Price.safeParse({ ...price, amount }).success).toBe(false);
        }
    });

    it('rejects unsupported currencies and misspelled price fields', () => {
        expect(Price.safeParse({ ...price, currency: 'EUR' }).success).toBe(false);
        expect(Price.safeParse({ ...price, ammount: 2000 }).success).toBe(false);
    });

    it('accepts decorative local assets and requires usable intrinsic dimensions', () => {
        expect(ImageAsset.parse(image)).toEqual(image);
        for (const dimensions of [{ width: 0 }, { height: -1 }, { width: 1.5 }]) {
            expect(ImageAsset.safeParse({ ...image, ...dimensions }).success).toBe(false);
        }
    });

    it.each([
        'https://www.figma.com/api/mcp/asset/temporary.png',
        '/images/../private.png',
        '//example.com/image.png',
        '/images/example.webp?token=temporary'
    ])('rejects preview or nonlocal image paths: %s', (src) => {
        expect(ImageAsset.safeParse({ ...image, src }).success).toBe(false);
    });

    it('preserves heading fragments and mobile omissions verbatim', () => {
        const heading = {
            eyebrow: null,
            title: [
                { kind: 'plain', text: 'Healthcare that ' },
                { kind: 'accent', text: 'speaks your language.' }
            ],
            desktopBody: ['Desktop introduction.'],
            mobileBody: []
        };
        expect(Heading.parse(heading)).toEqual(heading);
    });
});

describe('action destinations', () => {
    const identity = { id: 'action-1', label: 'Get started' };

    it('accepts only registered anchors and explicit HTTP destinations', () => {
        expect(Action.parse({ ...identity, kind: 'anchor', target: 'weight-loss' }).kind).toBe('anchor');
        expect(Action.parse({ ...identity, kind: 'external', href: 'https://example.com/consult' }).kind).toBe(
            'external'
        );
        expect(Action.safeParse({ ...identity, kind: 'anchor', target: 'made-up-section' }).success).toBe(false);
    });

    it.each(['javascript:alert(1)', 'data:text/html,test', '//example.com', '#', 'not a url'])(
        'rejects unsafe or fake external destinations: %s',
        (href) => {
            expect(Action.safeParse({ ...identity, kind: 'external', href }).success).toBe(false);
        }
    );

    it('keeps demo controls effect-free and rejects disguised navigation', () => {
        expect(Action.parse({ ...identity, kind: 'demo' })).toEqual({ ...identity, kind: 'demo' });
        expect(Action.safeParse({ ...identity, kind: 'demo', href: '#' }).success).toBe(false);
        expect(Action.safeParse({ ...identity, kind: 'demo', target: 'weight-loss' }).success).toBe(false);
        expect(Action.safeParse({ ...identity, kind: 'unresolved' }).success).toBe(false);
    });
});

describe('content variants', () => {
    it('accepts a photo story without inventing a quote and rejects mixed shapes', () => {
        const photo = { ...author, kind: 'photo', image };
        expect(SuccessStory.parse(photo)).toEqual(photo);
        expect(SuccessStory.safeParse({ ...photo, quote: 'An invented quotation.' }).success).toBe(false);
        expect(SuccessStory.safeParse({ ...author, kind: 'quote', image }).success).toBe(false);
    });

    it('requires quote content and constrains its five-star rating', () => {
        const quote = { ...author, kind: 'quote', category: 'Sleep', quote: 'Source quotation.', rating: 5 };
        expect(SuccessStory.parse(quote)).toEqual(quote);
        expect(SuccessStory.safeParse({ ...quote, rating: 6 }).success).toBe(false);
        expect(SuccessStory.safeParse({ ...quote, quote: '' }).success).toBe(false);
    });

    it('distinguishes a static chat from an image-only service card', () => {
        const chat = {
            id: 'support',
            kind: 'chat',
            illustration: image,
            title: 'Provider support',
            providerName: 'Example provider',
            avatar: image,
            statusLabel: 'Online',
            dayLabel: 'Today',
            messages: [{ id: 'message-1', speaker: 'provider', text: 'Example message.', time: '10:00 AM' }]
        };
        expect(OnlineCareCard.parse(chat)).toEqual(chat);
        expect(OnlineCareCard.safeParse({ ...chat, image }).success).toBe(false);
        expect(OnlineCareCard.safeParse({ ...chat, kind: 'image' }).success).toBe(false);
    });

    it('requires an inches label only for imperial measurements', () => {
        const metric = { kind: 'metric', label: 'cm/kgs', heightUnit: 'cm', weightUnit: 'kg' };
        expect(BmiUnits.parse(metric)).toEqual(metric);
        expect(BmiUnits.safeParse({ ...metric, secondaryHeightUnit: 'in' }).success).toBe(false);
        expect(BmiUnits.safeParse({ ...metric, kind: 'imperial' }).success).toBe(false);
        expect(BmiUnits.safeParse({ ...metric, kind: 'imperial', secondaryHeightUnit: 'in' }).success).toBe(true);
    });

    it('reports nested contract failures without silently dropping the invalid section', () => {
        const result = HomePage.safeParse({
            successStories: {
                id: 'stories',
                heading: {
                    eyebrow: null,
                    title: [{ kind: 'plain', text: 'Stories' }],
                    desktopBody: [],
                    mobileBody: []
                },
                stories: [{ ...author, kind: 'quote', category: 'Sleep', quote: 'Example', rating: 6 }]
            }
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(
                result.error.issues.some((issue) => issue.path.join('.') === 'successStories.stories.0.rating')
            ).toBe(true);
            expect(result.error.issues.some((issue) => issue.path.join('.') === 'header')).toBe(true);
        }
    });
});

describe('schema as the single type source', () => {
    const source = readFileSync('content/schema.ts', 'utf8');

    it('infers every exported type from its zod schema instead of a hand-written interface', () => {
        expect(source).not.toMatch(/\binterface\b/);
        const types = Array.from(source.matchAll(/^export type (\w+) = (.+);$/gm), (match) => [match[1], match[2]]);
        const schemas = Array.from(source.matchAll(/^export const (\w+) = z\./gm), (match) => match[1]);
        expect(types.length).toBeGreaterThan(20);
        for (const [name, definition] of types) expect(definition, name).toBe(`z.infer<typeof ${name}>`);
        expect(types.map(([name]) => name).sort()).toEqual([...schemas].sort());
    });
});
