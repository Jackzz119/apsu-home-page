'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './primitives.module.css';

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
    label: string;
    children: ReactNode;
    variant?: 'primary' | 'outline';
    size?: 'sm' | 'md';
};

/** Keep icon actions natively focusable, with a required accessible name. */
export function IconButton({
    label,
    children,
    variant = 'outline',
    size = 'md',
    className = '',
    type = 'button',
    ...props
}: IconButtonProps) {
    return (
        <button
            {...props}
            type={type}
            aria-label={label}
            className={`${styles.iconButton} ${styles.feedback} ${styles[variant]} ${size === 'sm' ? styles.iconSmall : styles.iconMedium} ${className}`}>
            <span aria-hidden="true">{children}</span>
        </button>
    );
}
