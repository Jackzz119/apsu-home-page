'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotionPreference } from '@/lib/useReducedMotionPreference';
import { Button } from './Button';
import styles from './primitives.module.css';

export type MarqueeProps = {
    label: string;
    /** Repeated content is informational: do not supply controls or DOM ids. */
    items: readonly { id: string; content: ReactNode }[];
    pauseLabel: string;
    resumeLabel: string;
    autoPlay?: boolean;
    defaultPaused?: boolean;
    motion?: 'auto' | 'reduced';
    size?: 'sm' | 'md';
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
    size = 'md'
}: MarqueeProps) {
    const root = useRef<HTMLElement>(null);
    const viewport = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(defaultPaused);
    const osReduced = useReducedMotionPreference();
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
                    <ul className={styles.marqueeGroup} aria-hidden="true" inert>
                        {items.map((item) => (
                            <li key={item.id}>{item.content}</li>
                        ))}
                    </ul>
                </div>
            </div>
            {autoPlay && !reduced && (
                <Button
                    className={styles.marqueeControl}
                    variant="outline"
                    size="sm"
                    onClick={() => setPaused(!paused)}>
                    {paused ? resumeLabel : pauseLabel}
                </Button>
            )}
        </section>
    );
}
