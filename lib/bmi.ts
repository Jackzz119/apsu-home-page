/** Exact definitions; keep canonical measurements when switching display units. */
export const METERS_PER_INCH = 0.0254;
export const KILOGRAMS_PER_POUND = 0.45359237;
export type BmiCategory = 'bmi-underweight' | 'bmi-healthy' | 'bmi-overweight' | 'bmi-obese';
export type BmiResult = { score: number; category: BmiCategory };

/** Reject empty, non-decimal and non-finite input rather than coercing it to zero. */
export function measurement(value: string): number | null {
    if (!/^\d+(?:\.\d+)?$/.test(value.trim())) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}
export function heightInMeters(unit: 'imperial' | 'metric', height: string, inches: string): number | null {
    const primary = measurement(height);
    const secondary = measurement(inches);
    if (primary === null) return null;
    if (unit === 'imperial' && (secondary === null || secondary >= 12 || !Number.isInteger(primary))) return null;
    const meters = unit === 'metric' ? primary / 100 : (primary * 12 + (secondary ?? 0)) * METERS_PER_INCH;
    return Number.isFinite(meters) && meters > 0 ? meters : null;
}
export function weightInKilograms(unit: 'imperial' | 'metric', weight: string): number | null {
    const value = measurement(weight);
    if (value === null || value <= 0) return null;
    const kg = unit === 'metric' ? value : value * KILOGRAMS_PER_POUND;
    return Number.isFinite(kg) ? kg : null;
}
/** Classify the unrounded score; sex does not enter the standard adult BMI formula. */
export function calculateBmi(meters: number, kilograms: number): BmiResult | null {
    if (!Number.isFinite(meters) || !Number.isFinite(kilograms) || meters <= 0 || kilograms <= 0) return null;
    const score = kilograms / meters ** 2;
    if (!Number.isFinite(score) || score <= 0) return null;
    return {
        score,
        category:
            score < 18.5 ? 'bmi-underweight' : score < 25 ? 'bmi-healthy' : score < 30 ? 'bmi-overweight' : 'bmi-obese'
    };
}
export function displayHeight(unit: 'imperial' | 'metric', meters: number | null): { height: string; inches: string } {
    if (meters === null) return { height: '', inches: '0' };
    if (unit === 'metric') return { height: String(Number((meters * 100).toFixed(6))), inches: '0' };
    const total = Number((meters / METERS_PER_INCH).toFixed(6));
    return { height: String(Math.floor(total / 12)), inches: String(Number((total % 12).toFixed(6))) };
}
export function displayWeight(unit: 'imperial' | 'metric', kg: number | null): string {
    if (kg === null) return '';
    return String(Number((unit === 'metric' ? kg : kg / KILOGRAMS_PER_POUND).toFixed(6)));
}
