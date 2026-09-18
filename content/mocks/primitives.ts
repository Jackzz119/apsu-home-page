/** Development-only labels and fixtures; product copy remains in homeMock, including source defects. */
export const primitiveMock = {
    heading: 'Component library preview',
    notice: 'Development specimen. Product sections and action destinations are pending P5 and design review.',
    unitsLabel: 'Units',
    error: 'Enter a positive value.',
    hint: 'Use the unit shown beside the field.',
    pauseLabel: 'Pause languages',
    resumeLabel: 'Resume languages',
    languagesLabel: 'Supported languages',
    statusLabel: '{start}–{end} of {total}',
    ratingLabel: '5 out of 5 stars',
    partialRatingLabel: '3.5 out of 5 stars',
    emptyRatingLabel: '0 out of 5 stars',
    destinationId: 'specimen-target',
    destinationLabel: 'Example destination',
    componentNames: [
        'Button',
        'Chip',
        'Card',
        'Accordion',
        'Carousel',
        'Marquee',
        'NumberField',
        'RadioGroup',
        'SegmentedControl',
        'Rating',
        'IconButton'
    ]
} as const;
