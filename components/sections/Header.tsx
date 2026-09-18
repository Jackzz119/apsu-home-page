'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useInputModality } from '@/lib/useInputModality';
import type { Header as Content } from '@/content/schema';
import { IconButton } from '../ui/IconButton';
import { ActionControl, SourceImage, TextAction, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type HeaderProps = SectionProps<Content>;
export function Header({ content, ui }: HeaderProps) {
    const modality = useInputModality();
    const navbar = useRef<HTMLDivElement>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState(false);
    useLayoutEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        const previousPadding = document.body.style.paddingRight;
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbar > 0) {
            const padding = parseFloat(getComputedStyle(document.body).paddingRight);
            document.body.style.paddingRight = `${padding + scrollbar}px`;
        }
        document.body.style.overflow = 'hidden';
        // Match the navbar's untransformed box, so both toggle buttons share a target.
        const align = () => {
            const bar = navbar.current;
            const menu = dialog.current;
            if (!bar || !menu) return;
            const box = bar.getBoundingClientRect();
            menu.style.setProperty('--menu-top', `${box.top}px`);
            menu.style.setProperty(
                '--menu-right',
                `${document.documentElement.getBoundingClientRect().right - box.right}px`
            );
        };
        align();
        const observer = new ResizeObserver(align);
        if (navbar.current) observer.observe(navbar.current);
        window.addEventListener('resize', align);
        window.addEventListener('scroll', align, { passive: true });
        const desktop = matchMedia('(min-width: 1024px)');
        const resize = () => {
            if (desktop.matches) dialog.current?.close();
        };
        desktop.addEventListener('change', resize);
        return () => {
            document.body.style.overflow = previous;
            document.body.style.paddingRight = previousPadding;
            observer.disconnect();
            window.removeEventListener('resize', align);
            window.removeEventListener('scroll', align);
            desktop.removeEventListener('change', resize);
        };
    }, [open]);
    return (
        <header id={content.id} className={styles.header} data-section="header" data-input={modality}>
            <a href="#main-content" className={styles.skip} data-scan-exempt>
                {ui.skipLabel}
            </a>
            <div ref={navbar} className={styles.navbar}>
                <a href="#top" aria-label={ui.homeLabel} className={styles.logo}>
                    <SourceImage asset={content.logo} priority />
                </a>
                <nav className={styles.desktopNav} aria-label={content.navigationLabel}>
                    <ul data-navigation-row>
                        {content.navigation.map((action) => (
                            <li key={action.id}>
                                <TextAction action={action} />
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={styles.headerActions}>
                    {content.actions.map((action, i) => (
                        <ActionControl
                            key={action.id}
                            action={action}
                            ui={ui}
                            variant={i === 0 ? 'primary' : 'outline'}
                            small
                            arrow={false}
                        />
                    ))}
                </div>
                <IconButton
                    className={styles.menuTrigger}
                    label={content.openMenuLabel}
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    aria-controls={`${content.id}-menu`}
                    variant="outline"
                    onClick={(event) => {
                        if (!dialog.current) return;
                        dialog.current.dataset.instant = String(event.detail === 0);
                        dialog.current.showModal();
                        setOpen(true);
                    }}>
                    <Menu />
                </IconButton>
            </div>
            <dialog
                ref={dialog}
                id={`${content.id}-menu`}
                aria-label={content.navigationLabel}
                onKeyDown={(event) => {
                    if (event.key !== 'Tab' || !dialog.current) return;
                    const controls = Array.from(
                        dialog.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
                    ).filter((node) => node.getClientRects().length);
                    const first = controls[0];
                    const last = controls.at(-1);
                    if (event.shiftKey && document.activeElement === first) {
                        event.preventDefault();
                        last?.focus();
                    } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first?.focus();
                    }
                }}
                className={styles.menu}
                onClose={() => setOpen(Boolean(dialog.current?.open))}
                onCancel={() => {
                    if (dialog.current) dialog.current.dataset.instant = 'true';
                }}>
                <div className={styles.menuHeading}>
                    <a
                        href="#top"
                        aria-label={ui.homeLabel}
                        onClick={() => dialog.current?.close()}
                        className={styles.logo}>
                        <SourceImage asset={content.logo} />
                    </a>
                    <IconButton
                        label={content.closeMenuLabel}
                        variant="outline"
                        onClick={(event) => {
                            if (dialog.current) {
                                dialog.current.dataset.instant = String(event.detail === 0);
                                dialog.current.close();
                            }
                        }}>
                        <X />
                    </IconButton>
                </div>
                <nav
                    aria-label={content.navigationLabel}
                    onClick={(event) => {
                        const anchor = (event.target as HTMLElement).closest('a');
                        if (!anchor) return;
                        dialog.current?.close();
                        const hash = anchor.hash.slice(1);
                        requestAnimationFrame(() => document.getElementById(hash)?.focus({ preventScroll: true }));
                    }}>
                    <ul>
                        {content.navigation.map((action) => (
                            <li key={action.id}>
                                <TextAction action={action} />
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={styles.menuActions}>
                    {content.actions.map((action, i) => (
                        <ActionControl
                            key={action.id}
                            action={action}
                            ui={ui}
                            variant={i === 0 ? 'primary' : 'outline'}
                            small
                            arrow={false}
                        />
                    ))}
                </div>
            </dialog>
        </header>
    );
}
