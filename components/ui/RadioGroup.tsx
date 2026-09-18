'use client';

import { useId, type ReactNode } from 'react';
import styles from './primitives.module.css';

export type ChoiceOption = { value: string; label: string; disabled?: boolean };
export type RadioGroupProps = {
    label: ReactNode;
    options: readonly ChoiceOption[];
    name?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    size?: 'sm' | 'md';
};

/** Share native radio semantics between circles and segmented presentation. */
export function ChoiceGroup({
    label,
    options,
    name,
    value,
    defaultValue,
    onValueChange,
    disabled,
    required,
    size = 'md',
    segmented = false
}: RadioGroupProps & { segmented?: boolean }) {
    const generatedName = useId();
    return (
        <fieldset disabled={disabled} className={styles.choiceGroup} data-size={size}>
            <legend className={styles.fieldLabel}>{label}</legend>
            <div className={segmented ? styles.segments : styles.radios}>
                {options.map((option) => (
                    <label key={option.value} className={segmented ? styles.segment : styles.radioLabel}>
                        <input
                            type="radio"
                            name={name ?? generatedName}
                            value={option.value}
                            disabled={option.disabled}
                            required={required}
                            checked={value === undefined ? undefined : value === option.value}
                            defaultChecked={value === undefined ? defaultValue === option.value : undefined}
                            onChange={() => onValueChange?.(option.value)}
                            className={segmented ? styles.segmentInput : styles.radioInput}
                        />
                        <span className={segmented ? styles.segmentLabel : undefined}>{option.label}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

/** Use the browser's radio keyboard behavior without a custom focus controller. */
export function RadioGroup(props: RadioGroupProps) {
    return <ChoiceGroup {...props} />;
}
