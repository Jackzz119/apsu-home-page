'use client';

import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { ChevronUp } from 'lucide-react';
import { useReducedMotionPreference } from '@/lib/useReducedMotionPreference';
import styles from './primitives.module.css';

export type AccordionProps = {
    title: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    motion?: 'auto' | 'reduced';
    size?: 'sm' | 'md';
};

/** Keep native details semantics while measuring and reversing a short pointer transition. */
export function Accordion({
    title,
    children,
    defaultOpen = false,
    onOpenChange,
    motion = 'auto',
    size = 'md'
}: AccordionProps) {
    const details = useRef<HTMLDetailsElement>(null);
    const body = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const target = useRef(defaultOpen);
    const frame = useRef(0);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const osReduced = useReducedMotionPreference();
    const reduced = osReduced || motion === 'reduced';

    function cancel() {
        cancelAnimationFrame(frame.current);
        clearTimeout(timer.current);
    }
    const finish = useCallback(() => {
        cancelAnimationFrame(frame.current);
        clearTimeout(timer.current);
        if (!details.current || !body.current) return;
        details.current.open = target.current;
        body.current.style.removeProperty('height');
        body.current.style.removeProperty('opacity');
        body.current.style.removeProperty('transition');
        body.current.inert = false;
        body.current.removeAttribute('aria-hidden');
    }, []);
    useEffect(
        () => () => {
            cancelAnimationFrame(frame.current);
            clearTimeout(timer.current);
        },
        []
    );
    useEffect(() => {
        if (reduced) finish();
    }, [reduced, finish]);

    function toggle(event: MouseEvent<HTMLElement>) {
        event.preventDefault();
        const root = details.current;
        const panel = body.current;
        const inner = content.current;
        if (!root || !panel || !inner) return;
        const height = root.open ? panel.getBoundingClientRect().height : 0;
        const opacity = root.open ? getComputedStyle(panel).opacity : '0';
        cancel();
        target.current = !target.current;
        root.dataset.targetOpen = String(target.current);
        const instant = reduced || event.detail === 0;
        root.dataset.instant = String(instant);
        if (!target.current && panel.contains(document.activeElement)) root.querySelector('summary')?.focus();
        onOpenChange?.(target.current);
        if (instant) {
            finish();
            return;
        }
        root.open = true;
        panel.inert = !target.current;
        panel.setAttribute('aria-hidden', String(!target.current));
        panel.style.transition = 'none';
        panel.style.height = `${height}px`;
        panel.style.opacity = opacity;
        // Flush the measured current frame before retargeting an interrupted transition.
        void panel.offsetHeight;
        panel.style.removeProperty('transition');
        frame.current = requestAnimationFrame(() => {
            panel.style.height = `${target.current ? inner.getBoundingClientRect().height : 0}px`;
            panel.style.opacity = target.current ? '1' : '0';
            const budget = Math.max(...getComputedStyle(panel).transitionDuration.split(',').map(parseFloat)) * 1000;
            timer.current = setTimeout(finish, budget + 50);
        });
    }

    return (
        <details
            ref={details}
            open={defaultOpen}
            className={styles.accordion}
            data-target-open={defaultOpen}
            data-size={size}>
            <summary className={`${styles.summary} ${styles.feedback}`} onClick={toggle}>
                {title}
                <span className={styles.chevron} aria-hidden="true">
                    <ChevronUp />
                </span>
            </summary>
            <div
                ref={body}
                className={styles.accordionBody}
                onTransitionEnd={(event) => {
                    if (event.target === event.currentTarget && event.propertyName === 'height') finish();
                }}>
                <div ref={content} className={styles.accordionContent}>
                    {children}
                </div>
            </div>
        </details>
    );
}
