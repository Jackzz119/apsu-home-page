'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useInputModality } from '@/lib/useInputModality';
import { useReducedMotionPreference } from '@/lib/useReducedMotionPreference';
import { Button } from './Button';
import styles from './primitives.module.css';

export type MarqueeProps = {
    label: string;
    /** Interactive items supply a pointer-only duplicate (tabIndex -1), without DOM ids. */
    items: readonly { id: string; content: ReactNode; duplicateContent?: ReactNode }[];
    pauseLabel: string;
    resumeLabel: string;
    autoPlay?: boolean;
    defaultPaused?: boolean;
    motion?: 'auto' | 'reduced';
    size?: 'sm' | 'md';
    /** Optional shared pause state for multi-row compositions. */
    paused?: boolean;
    onPausedChange?: (paused: boolean) => void;
    showControl?: boolean;
};

/** Repeat two equal tracks, with a persistent pause control and a wrapping reduced-motion fallback. */
export function Marquee({
    label,
    items,
    pauseLabel,
    resumeLabel,
    autoPlay = false,
    defaultPaused = false,
    motion = 'auto',
    size = 'md',
    paused: controlledPaused,
    onPausedChange,
    showControl = true
}: MarqueeProps) {
    const root = useRef<HTMLElement>(null);
    const viewport = useRef<HTMLDivElement>(null);
    const [localPaused, setPaused] = useState(defaultPaused);
    const paused = controlledPaused ?? localPaused;
    const interactive = items.some((item) => item.duplicateContent !== undefined);
    const osReduced = useReducedMotionPreference();
    const modality = useInputModality();
    const reduced = osReduced || motion === 'reduced' || !autoPlay;
    useEffect(() => {
        const node = root.current;
        const clip = viewport.current;
        if (!node || !clip) return;
        const observer = new ResizeObserver(() => node.style.setProperty('--marquee-width', `${clip.clientWidth}px`));
        observer.observe(clip);
        const visibility = () => {
            node.dataset.hidden = String(document.hidden);
        };
        document.addEventListener('visibilitychange', visibility);
        visibility();
        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', visibility);
        };
    }, []);
    return (
        <section
            ref={root}
            aria-label={label}
            className={styles.marquee}
            data-input={modality}
            data-interactive={interactive}
            data-paused={paused}
            data-reduced={reduced}
            data-size={size}>
            <div ref={viewport} className={styles.marqueeViewport}>
                <div className={styles.marqueeTrack}>
                    <ul className={styles.marqueeGroup}>
                        {items.map((item) => (
                            <li key={item.id}>{item.content}</li>
                        ))}
                    </ul>
                    <ul
                        className={styles.marqueeGroup}
                        aria-hidden="true"
                        inert={!interactive}
                        onPointerDownCapture={interactive ? (event) => event.preventDefault() : undefined}>
                        {items.map((item) => (
                            <li key={item.id}>{item.duplicateContent ?? item.content}</li>
                        ))}
                    </ul>
                </div>
            </div>
            {showControl && autoPlay && !reduced && (
                <Button
                    className={styles.marqueeControl}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setPaused(!paused);
                        onPausedChange?.(!paused);
                    }}>
                    {paused ? resumeLabel : pauseLabel}
                </Button>
            )}
        </section>
    );
}
