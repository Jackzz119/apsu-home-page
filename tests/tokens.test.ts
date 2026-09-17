import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getMotionTokens, motionDuration, motionEase, motionMedia } from '@/lib/motion';
import { findTokenViolations } from '../scripts/check-tokens.mjs';

const css = readFileSync('styles/tokens.css', 'utf8');

describe('motion token contract', () => {
    it('keeps CSS milliseconds and Motion seconds equal', () => {
        for (const [name, seconds] of Object.entries(motionDuration))
            expect(css).toContain(`--dur-${name}: ${seconds * 1000}ms;`);
        for (const [name, values] of Object.entries(motionEase)) {
            const token = name === 'inOut' ? 'in-out' : name;
            expect(css).toContain(`--ease-${token}: cubic-bezier(${values.join(', ')});`);
        }
        expect(css).toContain(`@media ${motionMedia.fineHover}`);
        expect(css).toContain(`@media ${motionMedia.reduced}`);
    });

    it('removes spatial effects without removing helpful color/opacity feedback', () => {
        expect(getMotionTokens(true)).toMatchObject({
            spatialDuration: 0,
            stagger: 0,
            pressTransform: 'scale(1)',
            shiftTransform: 'translateY(0px)',
            duration: { fast: 0.16 }
        });
        expect(getMotionTokens(false)).toMatchObject({
            spatialDuration: 0.2,
            stagger: 0.05,
            pressTransform: 'scale(0.97)',
            shiftTransform: 'translateY(-2px)'
        });
        expect(css).toContain('--motion-press-scale: 0.97;');
        expect(css).toContain('--motion-shift: 2px;');
    });
});

describe('token guard', () => {
    it.each([
        'text-[#123456]',
        'text-[17px]',
        'p-[1.1rem]',
        'bg-[rgb(1,2,3)]',
        'md:grid-cols-2',
        'min-[900px]:flex',
        'bg-white',
        'text-green-700'
    ])('rejects %s', (value) => {
        expect(findTokenViolations(`<div className="${value}" />`, 'sample.tsx').length).toBeGreaterThan(0);
    });

    it('checks CSS and JavaScript color literals', () => {
        expect(findTokenViolations('a { color: #123; }', 'sample.css')).toHaveLength(1);
        expect(findTokenViolations("const style = { color: '#abcdef' };", 'sample.tsx')).toHaveLength(1);
    });

    it('accepts semantic utilities, source tokens, comments and navigation fragments', () => {
        expect(
            findTokenViolations(
                '<a href="#abc" className="bg-brand text-body sm:grid lg:flex xl:block rounded-card" />',
                'sample.tsx'
            )
        ).toEqual([]);
        expect(findTokenViolations('/* #123 */ a { color: var(--color-text); }', 'sample.css')).toEqual([]);
        expect(findTokenViolations('// "text-[17px]"\nconst style = "text-body";', 'sample.tsx')).toEqual([]);
    });

    it('reports the offending source line', () => {
        expect(findTokenViolations('\n\n<div className="text-[17px]" />', 'sample.tsx')[0].line).toBe(3);
    });
});
