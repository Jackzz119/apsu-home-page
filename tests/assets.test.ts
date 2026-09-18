import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { assets } from '@/content/mocks/assets';
import { homeMock } from '@/content/mocks/home';
import { homePresentation } from '@/content/presentation';

/** Catch missing files and stale layout metadata, including large transparent source canvases. */
describe('delivery image metadata', () => {
    const sources = Object.values(assets).concat(homePresentation.socialIcons, homePresentation.testimonialIcons, [
        homePresentation.arrow,
        homePresentation.smallArrow,
        homePresentation.stepper,
        ...homeMock.onlineCare.cards.flatMap((card) => (card.kind === 'chat' ? [card.illustration] : []))
    ]);
    it.each(sources)('$src matches its decoded dimensions', async (image) => {
        const metadata = await sharp(`public${image.src}`).metadata();
        expect({ width: metadata.width, height: metadata.height }).toEqual({
            width: image.width,
            height: image.height
        });
    });
});
