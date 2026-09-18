'use client';

import { useId, type InputHTMLAttributes } from 'react';
import styles from './primitives.module.css';

export type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
    label: string;
    unit?: string;
    error?: string;
    hint?: string;
    size?: 'sm' | 'md';
};

/** Keep native numeric editing and associate labels, units, hints and validation text. */
export function NumberField({
    label,
    unit,
    error,
    hint,
    size = 'md',
    id,
    className = '',
    'aria-describedby': describedBy,
    ...props
}: NumberFieldProps) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const description =
        [describedBy, unit && `${fieldId}-unit`, hint && `${fieldId}-hint`, error && `${fieldId}-error`]
            .filter(Boolean)
            .join(' ') || undefined;
    return (
        <div className={`${styles.field} ${className}`}>
            <label htmlFor={fieldId} className={styles.fieldLabel}>
                {label}
            </label>
            <div
                className={styles.numberShell}
                data-invalid={Boolean(error)}
                data-disabled={props.disabled || undefined}
                data-size={size}>
                <input
                    {...props}
                    type="number"
                    id={fieldId}
                    aria-invalid={error ? true : props['aria-invalid']}
                    aria-describedby={description}
                    className={styles.numberInput}
                />
                {unit && (
                    <span id={`${fieldId}-unit`} className={styles.unit}>
                        {unit}
                    </span>
                )}
            </div>
            {hint && (
                <p id={`${fieldId}-hint`} className={styles.hint}>
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${fieldId}-error`} className={styles.error}>
                    {error}
                </p>
            )}
        </div>
    );
}
