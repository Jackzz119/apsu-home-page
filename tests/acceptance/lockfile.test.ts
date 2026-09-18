import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Assignment §1: the lockfile is committed and reproduces exactly the versions package.json names. */
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

describe('committed lockfile', () => {
    it('is tracked by git next to package.json', () => {
        const tracked = execFileSync('git', ['ls-files', '--error-unmatch', 'package-lock.json', 'package.json'], {
            encoding: 'utf8'
        });
        expect(tracked.trim().split('\n').sort()).toEqual(['package-lock.json', 'package.json']);
    });

    it('pins every dependency exactly and mirrors package.json in the lockfile root', () => {
        // `npm ci` refuses to run when these disagree; the CI workflow exercises that command on Linux.
        expect(lock.lockfileVersion).toBeGreaterThanOrEqual(3);
        expect(lock.name).toBe(pkg.name);
        for (const field of ['dependencies', 'devDependencies'] as const) {
            for (const [name, version] of Object.entries(pkg[field] as Record<string, string>)) {
                expect(version, `${name} must be pinned exactly`).toMatch(exactVersion);
            }
            expect(lock.packages[''][field]).toEqual(pkg[field]);
        }
    });

    it('declares the Node range that the README and .nvmrc advertise', () => {
        expect(pkg.engines.node).toBe('>=20.9');
        expect(readFileSync('.nvmrc', 'utf8').trim()).toBe('22');
    });
});
