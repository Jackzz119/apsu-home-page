import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Assignment §2 and §5: the README explains the structure, the AI usage with its logs, and every deviation. */
const readme = readFileSync('README.md', 'utf8');
const headings = Array.from(readme.matchAll(/^## (.+)$/gm), (match) => match[1].trim());
const section = (heading: string) => readme.split(/^## /m).find((part) => part.startsWith(heading)) ?? '';

describe('README delivery checklist', () => {
    it('answers the ten delivery questions as top-level sections', () => {
        for (const heading of [
            'Getting started',
            'Directory structure',
            'Data layer & API contract',
            'Design decisions',
            'Responsive strategy',
            'Interaction states & motion',
            'Deviation log',
            'Storybook',
            'AI usage',
            'Known limitations'
        ]) {
            expect(headings, heading).toContain(heading);
        }
    });

    it('lists the four client commands', () => {
        for (const command of ['npm install', 'npm run build', 'npm run dev', 'npm run storybook']) {
            expect(section('Getting started')).toContain(command);
        }
    });

    it('links AI usage to the raw session index and transcripts', () => {
        const usage = section('AI usage');
        expect(usage).toMatch(/\]\(ai-logs\/README\.md\)/);
        expect(usage).toMatch(/\]\(ai-logs\/(?:claude-code|codex)\/[^)]+\.jsonl\)/);
        expect(usage).toMatch(/\]\(ai-logs\/MANIFEST\.sha256\)/);
    });

    it('links the deviation log to docs/deviations.md', () => {
        expect(section('Deviation log')).toMatch(/\]\(docs\/deviations\.md\)/);
    });

    it('points every relative link at a file that exists', () => {
        const links = Array.from(readme.matchAll(/\]\(([^)\s]+)\)/g), (match) => match[1]).filter(
            (link) => !/^(?:https?:|mailto:|#)/.test(link)
        );
        expect(links.length).toBeGreaterThan(10);
        for (const link of links) {
            expect(existsSync(decodeURI(link.split('#')[0])), link).toBe(true);
        }
    });
});
