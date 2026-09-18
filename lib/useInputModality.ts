'use client';

import { useSyncExternalStore } from 'react';

type InputModality = 'keyboard' | 'pointer';
let modality: InputModality = 'keyboard';

/** Pointer focus can retain :focus-visible after keyboard use; observe the actual input source. */
function subscribe(notify: () => void) {
    const keyboard = () => {
        modality = 'keyboard';
        notify();
    };
    const pointer = () => {
        modality = 'pointer';
        notify();
    };
    document.addEventListener('keydown', keyboard, true);
    document.addEventListener('pointerdown', pointer, true);
    return () => {
        document.removeEventListener('keydown', keyboard, true);
        document.removeEventListener('pointerdown', pointer, true);
    };
}

/** Share modality across controls without moving or discarding the user's focus. */
export function useInputModality() {
    return useSyncExternalStore(
        subscribe,
        () => modality,
        () => 'keyboard' as const
    );
}
