import type { ImageAsset } from './schema';

/** Interface copy and decorative control assets, independent of medical/marketing content. */
export const homePresentation = {
    arrow: { src: '/images/arrow-right-circle.svg', alt: '', width: 40, height: 40 } satisfies ImageAsset,
    smallArrow: { src: '/images/arrow-right-circle-small.svg', alt: '', width: 32, height: 32 } satisfies ImageAsset,
    stepper: { src: '/images/number-sort.svg', alt: '', width: 24, height: 24 } satisfies ImageAsset,
    ctaWordmark: { src: '/images/apsu-logo-inverse.svg', alt: '', width: 228, height: 82 } satisfies ImageAsset,
    footerWordmark: { src: '/images/apsu-wordmark.svg', alt: '', width: 375, height: 130 } satisfies ImageAsset,
    socialIcons: ['x', 'facebook', 'instagram', 'linkedin'].map((name) => ({
        src: `/images/social-${name}.svg`,
        alt: '',
        width: name === 'linkedin' ? 19 : 24,
        height: name === 'linkedin' ? 19 : 24
    })),
    testimonialIcons: ['x', 'instagram', 'linkedin-solid'].map((name) => ({
        src: `/images/social-${name}.svg`,
        alt: '',
        width: 24,
        height: 24
    })),
    servicesLabel: 'Services',
    skipLabel: 'Skip to content',
    homeLabel: 'Apsu home',
    languagesLabel: 'Supported languages',
    pauseLanguages: 'Pause languages',
    resumeLanguages: 'Resume languages',
    trustLabel: 'Care benefits',
    pauseTrust: 'Pause care benefits',
    resumeTrust: 'Resume care benefits',
    careCarouselLabel: 'Online care benefits',
    carouselStatus: '{start}–{end} of {total}',
    ratingLabel: '{value} out of 5 stars',
    bmi: {
        openLabel: 'Open BMI calculator',
        closeLabel: 'Close BMI calculator',
        unitsLabel: 'Units',
        increaseLabel: 'Increase {field}',
        decreaseLabel: 'Decrease {field}',
        invalidHeight: 'Enter a positive height. Inches must be less than 12.',
        invalidWeight: 'Enter a positive weight.',
        invalidCalculation: 'These measurements cannot be calculated. Check your height and weight.',
        emptyResult: 'Enter your height and weight to see your BMI.',
        roundedNote: 'Score rounded to one decimal; ranges use the full value.',
        disclaimer:
            'BMI is a screening measure, not a diagnosis. A physician decides whether treatment is right for you.'
    }
};
export type HomePresentation = typeof homePresentation;
