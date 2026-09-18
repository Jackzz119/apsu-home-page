import type { ImageAsset } from '@/content/schema';

/** Optimized local exports of the supplied Figma artwork; provenance is in docs/assets.md. */
export const assets = {
    'tirzepatide-vial': { src: '/images/tirzepatide-vial.webp', alt: '', width: 432, height: 1000 },
    'weight-loss-woman': {
        src: '/images/weight-loss-woman.webp',
        alt: '',
        width: 1000,
        height: 1120
    },
    'tirzepatide-plan': { src: '/images/tirzepatide-plan.webp', alt: '', width: 533, height: 1000 },
    'bmi-outdoors': {
        src: '/images/bmi-outdoors.webp',
        alt: '',
        width: 1600,
        height: 1068
    },
    'birth-control-woman': {
        src: '/images/birth-control-woman.webp',
        alt: '',
        width: 1000,
        height: 1851
    },
    'sleep-woman': {
        src: '/images/sleep-woman.webp',
        alt: '',
        width: 1000,
        height: 1278
    },
    'provider-avatar': {
        src: '/images/provider-avatar.webp',
        alt: '',
        width: 400,
        height: 400
    },
    'care-team': {
        src: '/images/care-team.webp',
        alt: '',
        width: 1000,
        height: 563
    },
    'medication-options': {
        src: '/images/medication-options.webp',
        alt: '',
        width: 628,
        height: 406
    },
    delivery: {
        src: '/images/delivery.webp',
        alt: '',
        width: 1000,
        height: 1500
    },
    'success-story': { src: '/images/success-story.webp', alt: '', width: 925, height: 1000 },
    'apsu-logo': {
        src: '/images/apsu-logo.svg',
        alt: '',
        width: 287,
        height: 32
    },
    'apsu-logo-inverse': {
        src: '/images/apsu-logo-inverse.svg',
        alt: '',
        width: 228,
        height: 82
    },
    'apsu-wordmark': {
        src: '/images/apsu-wordmark.svg',
        alt: '',
        width: 375,
        height: 130
    }
} satisfies Record<string, ImageAsset>;
