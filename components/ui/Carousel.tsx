'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReducedMotionPreference } from '@/lib/useReducedMotionPreference';
import { IconButton } from './IconButton';
import styles from './primitives.module.css';

export type CarouselItem = { id: string; label: string; content: ReactNode };
export type CarouselProps = {
    label: string;
    items: readonly CarouselItem[];
    previousLabel: string;
    nextLabel: string;
    statusLabel: string;
    size?: 'single' | 'peek';
    initialIndex?: number;
    motion?: 'auto' | 'reduced';
};

/** Offer manual native scrolling, bounded controls and accessible visible slides, without autoplay. */
export function Carousel({
    label,
    items,
    previousLabel,
    nextLabel,
    statusLabel,
    size = 'peek',
    initialIndex = 0,
    motion = 'auto'
}: CarouselProps) {
    const track = useRef<HTMLDivElement>(null);
    const destination = useRef(initialIndex);
    const osReduced = useReducedMotionPreference();
    const reduced = osReduced || motion === 'reduced';
    const [range, setRange] = useState({ start: 0, end: 0, first: true, last: items.length <= 1 });

    useEffect(() => {
        const rail = track.current;
        if (!rail) return;
        let frame = 0;
        let settle: ReturnType<typeof setTimeout>;
        function measure() {
            if (!rail) return;
            const bounds = rail.getBoundingClientRect();
            let start = 0;
            let end = 0;
            Array.from(rail.children).forEach((child, index) => {
                const slide = child as HTMLElement;
                const rect = slide.getBoundingClientRect();
                const visible = rect.right > bounds.left + 1 && rect.left < bounds.right - 1;
                if (!visible && slide.contains(document.activeElement)) rail.focus({ preventScroll: true });
                slide.inert = !visible;
                if (visible) {
                    slide.removeAttribute('aria-hidden');
                    if (!start) start = index + 1;
                    end = index + 1;
                } else slide.setAttribute('aria-hidden', 'true');
            });
            const first = rail.scrollLeft <= 1;
            const last = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1;
            setRange((old) =>
                old.start === start && old.end === end && old.first === first && old.last === last
                    ? old
                    : { start, end, first, last }
            );
        }
        function schedule() {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(measure);
            clearTimeout(settle);
            settle = setTimeout(() => {
                if (!rail) return;
                const left = rail.getBoundingClientRect().left;
                const children = Array.from(rail.children);
                const nearest = children.reduce(
                    (best, child, index) =>
                        Math.abs(child.getBoundingClientRect().left - left) <
                        Math.abs(children[best].getBoundingClientRect().left - left)
                            ? index
                            : best,
                    0
                );
                destination.current = nearest;
            }, 120);
        }
        const slide = rail.children[Math.max(0, Math.min(items.length - 1, initialIndex))] as HTMLElement | undefined;
        if (slide)
            rail.scrollLeft = slide.offsetLeft - rail.offsetLeft - parseFloat(getComputedStyle(rail).paddingLeft);
        const observer = new ResizeObserver(schedule);
        observer.observe(rail);
        Array.from(rail.children).forEach((child) => observer.observe(child));
        rail.addEventListener('scroll', schedule, { passive: true });
        schedule();
        return () => {
            observer.disconnect();
            rail.removeEventListener('scroll', schedule);
            cancelAnimationFrame(frame);
            clearTimeout(settle);
        };
    }, [items.length, initialIndex]);

    useEffect(() => {
        const rail = track.current;
        if (reduced && rail) rail.scrollTo({ left: rail.scrollLeft, behavior: 'instant' });
    }, [reduced]);

    function move(index: number, keyboard: boolean) {
        const rail = track.current;
        if (!rail || !items.length) return;
        destination.current = Math.max(0, Math.min(items.length - 1, index));
        const slide = rail.children[destination.current] as HTMLElement;
        rail.scrollTo({
            left: Math.min(
                rail.scrollWidth - rail.clientWidth,
                Math.max(0, slide.offsetLeft - rail.offsetLeft - parseFloat(getComputedStyle(rail).paddingLeft))
            ),
            behavior: reduced || keyboard ? 'instant' : 'smooth'
        });
    }

    return (
        <section aria-label={label} aria-roledescription="carousel" className={styles.carousel} data-size={size}>
            <div
                ref={track}
                className={styles.track}
                role="group"
                tabIndex={items.length ? 0 : -1}
                aria-label={label}
                onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const index =
                        event.key === 'ArrowRight'
                            ? destination.current + 1
                            : event.key === 'ArrowLeft'
                              ? destination.current - 1
                              : event.key === 'Home'
                                ? 0
                                : event.key === 'End'
                                  ? items.length - 1
                                  : undefined;
                    if (index !== undefined) {
                        event.preventDefault();
                        move(index, true);
                    }
                }}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={styles.slide}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={item.label}>
                        {item.content}
                    </div>
                ))}
            </div>
            <div className={styles.carouselControls}>
                <span className={styles.carouselStatus} aria-live="polite" aria-atomic="true">
                    {statusLabel
                        .replace('{start}', String(range.start))
                        .replace('{end}', String(range.end))
                        .replace('{total}', String(items.length))}
                </span>
                <IconButton
                    label={previousLabel}
                    disabled={range.first}
                    onClick={(event) => move(destination.current - 1, event.detail === 0)}>
                    <ArrowLeft />
                </IconButton>
                <IconButton
                    label={nextLabel}
                    disabled={range.last}
                    onClick={(event) => move(destination.current + 1, event.detail === 0)}>
                    <ArrowRight />
                </IconButton>
            </div>
        </section>
    );
}
