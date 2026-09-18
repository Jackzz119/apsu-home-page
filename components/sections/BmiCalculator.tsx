'use client';
import { useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { BmiCalculator as Content } from '@/content/schema';
import {
    calculateBmi,
    displayHeight,
    displayWeight,
    heightInMeters,
    weightInKilograms,
    type BmiResult
} from '@/lib/bmi';
import { Button } from '../ui/Button';
import { NumberField } from '../ui/NumberField';
import { RadioGroup } from '../ui/RadioGroup';
import { SegmentedControl } from '../ui/SegmentedControl';
import { ActionControl, SectionHeading, SourceImage, TitleRuns, type SectionProps } from './SectionPrimitives';
import styles from './sections.module.css';
export type BmiCalculatorProps = SectionProps<Content>;
export function BmiCalculator({ content, ui }: BmiCalculatorProps) {
    const uid = useId();
    const form = useRef<HTMLFormElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [unit, setUnit] = useState<'imperial' | 'metric'>(content.sourcePreview.unit);
    const [fields, setFields] = useState({ height: '', inches: '0', weight: '' });
    const [sex, setSex] = useState(content.sourcePreview.sexOptionId);
    const [result, setResult] = useState<BmiResult | null>(null);
    const [calculationError, setCalculationError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [canonical, setCanonical] = useState<{ meters: number | null; kg: number | null }>({
        meters: null,
        kg: null
    });
    const units = content.units.find((option) => option.kind === unit)!;
    const heightError = submitted && canonical.meters === null ? ui.bmi.invalidHeight : undefined;
    const weightError = submitted && canonical.kg === null ? ui.bmi.invalidWeight : undefined;
    function update(field: keyof typeof fields, value: string) {
        const next = { ...fields, [field]: value };
        setFields(next);
        setResult(null);
        setCalculationError(false);
        setCanonical((previous) =>
            field === 'weight'
                ? { ...previous, kg: weightInKilograms(unit, next.weight) }
                : { ...previous, meters: heightInMeters(unit, next.height, next.inches) }
        );
    }
    function changeUnit(next: 'imperial' | 'metric') {
        setFields({ ...displayHeight(next, canonical.meters), weight: displayWeight(next, canonical.kg) });
        setUnit(next);
        setSubmitted(false);
        setCalculationError(false);
    }
    const fieldProps = (field: keyof typeof fields, label: string, suffix: string, error?: string) => ({
        label,
        unit: suffix,
        value: fields[field],
        min: 0,
        step: field === 'height' && unit === 'imperial' ? 1 : 0.1,
        error,
        inputMode: 'decimal' as const,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => update(field, event.target.value),
        stepperIcon: <SourceImage asset={ui.stepper} />,
        incrementLabel: ui.bmi.increaseLabel.replace('{field}', `${label} ${suffix}`),
        decrementLabel: ui.bmi.decreaseLabel.replace('{field}', `${label} ${suffix}`)
    });
    return (
        <section
            id={content.id}
            aria-labelledby={`${content.id}-title`}
            className={`${styles.section} ${styles.bmi}`}
            data-section="bmi-calculator"
            data-expanded={expanded}>
            <SectionHeading heading={content.heading} headingId={`${content.id}-title`} />
            <p className={styles.bmiDisclaimer}>{ui.bmi.disclaimer}</p>
            <Button
                className={styles.bmiDisclosure}
                variant="outline"
                aria-expanded={expanded}
                aria-controls={`${uid}-content`}
                onClick={() => setExpanded(!expanded)}
                trailingIcon={<ChevronDown />}>
                {expanded ? ui.bmi.closeLabel : ui.bmi.openLabel}
            </Button>
            <div id={`${uid}-content`} className={styles.bmiContent}>
                <SourceImage
                    asset={content.background}
                    className={styles.bmiBackground}
                    sizes="(min-width: 1024px) 1320px, 100vw"
                />
                <form
                    ref={form}
                    className={styles.bmiForm}
                    noValidate
                    onSubmit={(event) => {
                        event.preventDefault();
                        setSubmitted(true);
                        const { meters, kg } = canonical;
                        if (meters === null || kg === null) {
                            setResult(null);
                            requestAnimationFrame(() =>
                                form.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
                            );
                            return;
                        }
                        const calculated = calculateBmi(meters, kg);
                        setResult(calculated);
                        setCalculationError(calculated === null);
                    }}>
                    <div className={styles.bmiFormTitle}>
                        <SectionHeading heading={content.heading} headingId={`${content.id}-form-title`} />
                        <span>{content.title}</span>
                    </div>
                    <div className={styles.bmiFormHeading}>
                        <SegmentedControl
                            label={<span className={styles.srOnly}>{ui.bmi.unitsLabel}</span>}
                            options={content.units.map((option) => ({ value: option.kind, label: option.label }))}
                            value={unit}
                            onValueChange={(value) => changeUnit(value as typeof unit)}
                            size="sm"
                        />
                    </div>
                    <div className={styles.measurements}>
                        <div className={styles.heightFields}>
                            <NumberField
                                {...fieldProps('height', content.heightLabel, units.heightUnit, heightError)}
                            />
                            {units.kind === 'imperial' && (
                                <NumberField
                                    {...fieldProps(
                                        'inches',
                                        `${content.heightLabel} (${units.secondaryHeightUnit})`,
                                        units.secondaryHeightUnit,
                                        heightError
                                    )}
                                    max={11.9}
                                />
                            )}
                        </div>
                        <NumberField {...fieldProps('weight', content.weightLabel, units.weightUnit, weightError)} />
                    </div>
                    <RadioGroup
                        label={content.sexLabel}
                        options={content.sexOptions.map((option) => ({ value: option.id, label: option.label }))}
                        value={sex}
                        onValueChange={setSex}
                    />
                    {calculationError && (
                        <p role="alert" className={styles.calculationError}>
                            {ui.bmi.invalidCalculation}
                        </p>
                    )}
                    <Button type="submit">{content.submitLabel}</Button>
                </form>
                <div className={styles.bmiResult}>
                    <div className={styles.bmiDial}>
                        <h3>
                            <TitleRuns runs={content.resultTitle} />
                        </h3>
                        <div role="status" aria-live="polite" aria-atomic="true" className={styles.resultStatus}>
                            {result ? (
                                <>
                                    <strong className={styles.bmiScore}>{result.score.toFixed(1)}</strong>
                                    <p>{content.ranges.find((range) => range.id === result.category)?.label}</p>
                                </>
                            ) : (
                                <p>{ui.bmi.emptyResult}</p>
                            )}
                        </div>
                    </div>
                    {result && <p className={styles.bmiNote}>{ui.bmi.roundedNote}</p>}
                    <ul className={styles.bmiRanges}>
                        {content.ranges.map((range) => (
                            <li key={range.id} data-range={range.id} data-current={result?.category === range.id}>
                                <span>{range.label}</span>
                                <strong>{range.description}</strong>
                            </li>
                        ))}
                    </ul>
                    <p className={styles.bmiResultDisclaimer}>{ui.bmi.disclaimer}</p>
                    <ActionControl action={content.action} ui={ui} variant="outline" small />
                </div>
            </div>
        </section>
    );
}
