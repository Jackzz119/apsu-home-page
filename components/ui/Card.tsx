import type { HTMLAttributes, ReactNode } from 'react';
import styles from './primitives.module.css';

export type CardProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    children: ReactNode;
    variant?: 'surface' | 'mint' | 'purple' | 'cyan';
    size?: 'sm' | 'md';
    href?: string;
};

/** Provide a source surface; only destination-bearing cards receive interactive styling. */
export function Card({ children, variant = 'surface', size = 'md', href, className = '', ...props }: CardProps) {
    const classes = `${styles.card} ${styles[variant]} ${size === 'sm' ? styles.cardSmall : ''} ${className}`;
    if (href)
        return (
            <a {...props} href={href} className={`${classes} ${styles.interactiveCard} ${styles.feedback}`}>
                {children}
            </a>
        );
    return (
        <div {...props} className={classes}>
            {children}
        </div>
    );
}
