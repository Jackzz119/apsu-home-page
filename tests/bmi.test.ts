import { describe, expect, it } from 'vitest';
import { calculateBmi, displayHeight, displayWeight, heightInMeters, measurement, weightInKilograms } from '@/lib/bmi';

describe('BMI measurements and classification', () => {
    it.each(['', ' ', '-1', 'NaN', 'Infinity', '1e999', '0x10', '12px'])(
        'rejects invalid measurements: %s',
        (value) => {
            expect(measurement(value)).toBeNull();
        }
    );
    it('requires a positive total height and weight with valid imperial parts', () => {
        expect(heightInMeters('imperial', '0', '0')).toBeNull();
        expect(heightInMeters('imperial', '5', '12')).toBeNull();
        expect(heightInMeters('imperial', '5.5', '0')).toBeNull();
        expect(heightInMeters('metric', '0', '0')).toBeNull();
        expect(weightInKilograms('metric', '0')).toBeNull();
        expect(heightInMeters('imperial', '5', '8')).toBeCloseTo(1.7272, 8);
        expect(weightInKilograms('imperial', '160')).toBeCloseTo(72.5747792, 8);
    });
    it.each([
        [18.4999, 'bmi-underweight'],
        [18.5, 'bmi-healthy'],
        [24.9999, 'bmi-healthy'],
        [25, 'bmi-overweight'],
        [29.9999, 'bmi-overweight'],
        [30, 'bmi-obese']
    ] as const)('classifies %s before display rounding', (score, category) => {
        expect(calculateBmi(2, score * 4)).toEqual({ score, category });
    });
    it('uses equivalent physical values in either unit system', () => {
        const meters = heightInMeters('imperial', '5', '8')!;
        const kg = weightInKilograms('imperial', '160')!;
        const metric = displayHeight('metric', meters);
        expect(heightInMeters('metric', metric.height, metric.inches)).toBeCloseTo(meters, 8);
        expect(weightInKilograms('metric', displayWeight('metric', kg))).toBeCloseTo(kg, 6);
        expect(displayHeight('imperial', meters)).toEqual({ height: '5', inches: '8' });
        expect(displayWeight('imperial', kg)).toBe('160');
        expect(calculateBmi(meters, kg)?.score).toBeCloseTo(24.327, 2);
    });
    it('rejects non-finite, zero and negative physical values', () => {
        for (const pair of [
            [0, 70],
            [1.7, 0],
            [-1, 70],
            [Infinity, 70],
            [1.7, NaN],
            [Number.MIN_VALUE, 70]
        ])
            expect(calculateBmi(...(pair as [number, number]))).toBeNull();
    });
});
