'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import styles from './primitives.module.css';

const buttonClass = cva(`${styles.button} ${styles.feedback}`, {
    variants: {
        variant: { primary: styles.primary, secondary: styles.secondary, outline: styles.outline },
        size: { sm: styles.controlSmall, md: styles.controlMedium }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
});

type Appearance = {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md';
    trailingIcon?: ReactNode;
    disabled?: boolean;
};
export type ButtonProps = Appearance &
    (
        | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
        | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
    );

/** Render a native action or destination; disabled links cannot navigate or invoke callbacks. */
export function Button(props: ButtonProps) {
    const { children, variant, size, trailingIcon, disabled, className, ...rest } = props;
    const classes = buttonClass({ variant, size, className });
    const content = (
        <>
            <span>{children}</span>
            {trailingIcon && (
                <span className={styles.trailingIcon} aria-hidden="true">
                    {trailingIcon}
                </span>
            )}
        </>
    );
    if ('href' in rest && rest.href !== undefined) {
        const { href, onClick, tabIndex, ...link } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
        return (
            <a
                {...link}
                href={disabled ? undefined : href}
                role={disabled ? 'link' : undefined}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : tabIndex}
                className={classes}
                onClick={(event) => {
                    if (disabled) {
                        event.preventDefault();
                        return;
                    }
                    onClick?.(event);
                }}>
                {content}
            </a>
        );
    }
    const { type = 'button', ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
        <button {...button} type={type} disabled={disabled} className={classes}>
            {content}
        </button>
    );
}
