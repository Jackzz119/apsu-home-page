'use client';

import { ChoiceGroup, type RadioGroupProps } from './RadioGroup';

export type SegmentedControlProps = RadioGroupProps;

/** Present a native mutually exclusive choice as the source's pill-shaped unit selector. */
export function SegmentedControl(props: SegmentedControlProps) {
    return <ChoiceGroup {...props} segmented />;
}
