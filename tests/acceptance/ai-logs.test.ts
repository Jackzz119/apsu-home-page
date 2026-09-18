import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Assignment §6: raw, unedited AI session logs are shipped and every copied file matches its checksum. */
const root = 'ai-logs';
const sessionId = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

function transcripts(dir: string): string[] {
    if (!existsSync(dir)) return [];
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return transcripts(path);
        return entry.endsWith('.jsonl') ? [path] : [];
    });
}

const logs = ['claude-code', 'codex']
    .flatMap((tool) => transcripts(join(root, tool)))
    .map((path) => relative(root, path).split(sep).join('/'))
    .sort();

describe('raw AI logs', () => {
    it('ships at least one raw transcript for each tool', () => {
        expect(logs.some((file) => file.startsWith('claude-code/'))).toBe(true);
        expect(logs.some((file) => file.startsWith('codex/'))).toBe(true);
    });

    it('lists every raw transcript in MANIFEST.sha256 with a matching checksum', () => {
        const manifest = new Map(
            readFileSync(join(root, 'MANIFEST.sha256'), 'utf8')
                .trim()
                .split('\n')
                .map((line) => line.trim().split(/\s+/) as [string, string])
                .map(([hash, file]) => [file, hash])
        );
        expect(Array.from(manifest.keys()).sort()).toEqual(logs);
        for (const file of logs) {
            const hash = createHash('sha256')
                .update(readFileSync(join(root, file)))
                .digest('hex');
            expect(hash, file).toBe(manifest.get(file));
        }
    });

    it('indexes every session id in the log README', () => {
        const index = readFileSync(join(root, 'README.md'), 'utf8');
        for (const file of logs) {
            const ids = file.match(sessionId) ?? [];
            expect(ids.length, file).toBeGreaterThan(0);
            expect(
                ids.some((id) => index.includes(id)),
                `${file} is not described in ai-logs/README.md`
            ).toBe(true);
        }
    });

    it('marks every readable export as derived from a shipped raw transcript', () => {
        const readable = join(root, 'readable');
        if (!existsSync(readable)) return;
        const rawNames = new Set(
            logs.map((file) =>
                file
                    .split('/')
                    .pop()!
                    .replace(/\.jsonl$/, '')
            )
        );
        for (const file of readdirSync(readable).filter((name) => name.endsWith('.md'))) {
            expect(rawNames.has(file.replace(/\.md$/, '')), file).toBe(true);
            expect(readFileSync(join(readable, file), 'utf8').slice(0, 600)).toContain('raw file is authoritative');
        }
    });
});
