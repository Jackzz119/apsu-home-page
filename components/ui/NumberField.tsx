'use client';

import { useId, useRef, type ReactNode, type InputHTMLAttributes } from 'react';
import styles from './primitives.module.css';

export type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
    label: string;
    stepperIcon: ReactNode;
    incrementLabel: string;
    decrementLabel: string;
    unit?: string;
    error?: string;
    hint?: string;
    size?: 'sm' | 'md';
};

/** Keep native numeric editing and associate labels, units, hints and validation text. */
export function NumberField({
    label,
    stepperIcon,
    incrementLabel,
    decrementLabel,
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
    const inputRef = useRef<HTMLInputElement>(null);
    const cannotStep = props.disabled || props.readOnly || props.step === 'any';
    function stepBy(direction: number) {
        const input = inputRef.current;
        if (!input || cannotStep) return;
        const previous = input.value;
        input.stepUp(direction);
        if (input.value !== previous) {
            // Native stepping leaves React's value tracker unchanged; notify controlled and uncontrolled callers.
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
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
                data-invalid={Boolean(error) || props['aria-invalid'] === true || props['aria-invalid'] === 'true'}
                data-disabled={props.disabled || undefined}
                data-size={size}>
                <input
                    {...props}
                    ref={inputRef}
                    type="number"
                    id={fieldId}
                    aria-invalid={error ? true : props['aria-invalid']}
                    aria-describedby={description}
                    className={styles.numberInput}
                />
                <span className={styles.numberSuffix}>
                    <span className={styles.numberStepper}>
                        <span className={styles.numberStepperIcon} aria-hidden="true">
                            {stepperIcon}
                        </span>
                        <button
                            type="button"
                            aria-label={incrementLabel}
                            aria-controls={fieldId}
                            disabled={cannotStep}
                            onClick={() => stepBy(1)}
                        />
                        <button
                            type="button"
                            aria-label={decrementLabel}
                            aria-controls={fieldId}
                            disabled={cannotStep}
                            onClick={() => stepBy(-1)}
                        />
                    </span>
                    {unit && (
                        <span id={`${fieldId}-unit`} className={styles.unit}>
                            {unit}
                        </span>
                    )}
                </span>
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
