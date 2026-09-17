/** Seconds for Motion; multiply by 1000 for native Web Animations, whose timing uses milliseconds. */
export const motionDuration = { fast: 0.16, release: 0.1, base: 0.2, slow: 0.25, stagger: 0.05 } as const;

/** Curves for complete transform strings; CSS-only UI does not import Motion. */
export const motionEase = { out: [0.23, 1, 0.32, 1], inOut: [0.77, 0, 0.175, 1], drawer: [0.32, 0.72, 0, 1] } as const;

/** Media conditions for native handlers; Motion consumers use useReducedMotion. */
export const motionMedia = {
    fineHover: '(hover: hover) and (pointer: fine)',
    reduced: '(prefers-reduced-motion: reduce)'
} as const;

/** Remove spatial feedback and delays while retaining brief color/opacity feedback. */
export function getMotionTokens(reducedMotion: boolean) {
    return {
        duration: motionDuration,
        ease: motionEase,
        spatialDuration: reducedMotion ? 0 : motionDuration.base,
        stagger: reducedMotion ? 0 : motionDuration.stagger,
        pressTransform: reducedMotion ? 'scale(1)' : 'scale(0.97)',
        shiftTransform: reducedMotion ? 'translateY(0px)' : 'translateY(-2px)'
    };
}
