'use client';

import type { ButtonHTMLAttributes } from 'react';
import styles from './primitives.module.css';

export type ChipProps = {
    label: string;
    selected?: boolean;
    size?: 'sm' | 'md';
    direction?: 'ltr' | 'rtl' | 'auto';
    disabled?: boolean;
    tabIndex?: number;
    onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
};

/** A chip is informational unless the caller supplies a real action. */
export function Chip({
    label,
    selected = false,
    size = 'md',
    direction = 'auto',
    disabled,
    tabIndex,
    onClick
}: ChipProps) {
    const className = `${styles.chip} ${size === 'sm' ? styles.chipSmall : ''}`;
    if (onClick)
        return (
            <button
                type="button"
                dir={direction}
                className={`${className} ${styles.feedback}`}
                aria-pressed={selected}
                data-selected={selected}
                disabled={disabled}
                tabIndex={tabIndex}
                onClick={onClick}>
                {label}
            </button>
        );
    return (
        <span dir={direction} className={className} data-selected={selected}>
            {label}
        </span>
    );
}
