'use client';

import { useSyncExternalStore } from 'react';
import { motionMedia } from './motion';

/** Subscribe to live OS preference changes without a hydration-dependent initial render. */
function subscribe(onChange: () => void) {
    const query = window.matchMedia(motionMedia.reduced);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
}

/** CSS handles the first paint; this hook gates programmatic movement and live changes. */
export function useReducedMotionPreference() {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(motionMedia.reduced).matches,
        () => false
    );
}
