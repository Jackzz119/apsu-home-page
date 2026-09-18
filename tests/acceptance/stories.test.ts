import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Assignment §4E: every stateful component has a colocated story per state that reviewers can open. */
const ui = 'components/ui';
const sections = 'components/sections';
const helpers = new Set(['storyFixtures.tsx', 'SectionPrimitives.tsx']);

const componentFiles = (dir: string) =>
    readdirSync(dir).filter((file) => file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && !helpers.has(file));
const source = (dir: string, file: string) => readFileSync(join(dir, file), 'utf8');
const storyNames = (dir: string, component: string) =>
    Array.from(source(dir, `${component}.stories.tsx`).matchAll(/^export const (\w+)/gm), (match) => match[1]);

describe('stories per component', () => {
    it('colocates a stories file with every primitive and every client section', () => {
        for (const file of componentFiles(ui)) {
            expect(existsSync(join(ui, file.replace(/\.tsx$/, '.stories.tsx'))), file).toBe(true);
        }
        const clientSections = componentFiles(sections).filter((file) =>
            /^'use client';/m.test(source(sections, file))
        );
        expect(clientSections.length).toBeGreaterThanOrEqual(5);
        for (const file of clientSections) {
            expect(existsSync(join(sections, file.replace(/\.tsx$/, '.stories.tsx'))), file).toBe(true);
        }
    });

    it('starts every component stories file with a Default story', () => {
        const specimen = 'DesignTokens.stories.tsx';
        for (const dir of [ui, sections]) {
            for (const file of readdirSync(dir).filter((name) => name.endsWith('.stories.tsx') && name !== specimen)) {
                expect(storyNames(dir, file.replace(/\.stories\.tsx$/, '')), file).toContain('Default');
            }
        }
    });

    it('names hover, focus, pressed and disabled states of the pressable primitives as stories', () => {
        for (const component of ['Button', 'IconButton', 'Chip', 'Card', 'Accordion', 'SegmentedControl']) {
            const names = storyNames(ui, component);
            for (const state of ['Hover', 'Focus', 'Pressed']) {
                expect(
                    names.some((name) => name.includes(state)),
                    `${component} needs a ${state} story`
                ).toBe(true);
            }
        }
        for (const component of ['Button', 'IconButton', 'Chip', 'NumberField', 'RadioGroup', 'SegmentedControl']) {
            expect(storyNames(ui, component), component).toContain('Disabled');
        }
        expect(storyNames(ui, 'NumberField')).toEqual(
            expect.arrayContaining(['Focus', 'Invalid', 'StepperHover', 'StepperPressed'])
        );
    });

    it('covers the documented states of the interactive page islands', () => {
        const islands: Record<string, string[]> = {
            Header: ['MenuOpen'],
            BmiCalculator: ['Expanded', 'Invalid', 'MetricResult', 'ImperialResult'],
            Faq: ['AllExpanded'],
            LanguageMarquee: ['Paused', 'Toggled'],
            TrustMarquee: ['Paused']
        };
        for (const [component, states] of Object.entries(islands)) {
            expect(storyNames(sections, component), component).toEqual(expect.arrayContaining(states));
        }
    });

    it('ships at least as many primitive stories as the README inventory declares', () => {
        const readme = readFileSync('README.md', 'utf8');
        const rows = Array.from(readme.matchAll(/^\| (\w+)\s+\|[^|\n]*\|\s*(\d+)\s*\|$/gm), (match) => ({
            component: match[1],
            declared: Number(match[2])
        }));
        expect(rows.map((row) => row.component)).toEqual(
            expect.arrayContaining(['Button', 'Chip', 'Card', 'Accordion', 'Carousel', 'Marquee', 'NumberField'])
        );
        for (const row of rows) {
            expect(storyNames(ui, row.component).length, row.component).toBeGreaterThanOrEqual(row.declared);
        }
    });
});
