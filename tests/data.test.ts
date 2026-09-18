import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from '@/content/schema';
import { homeMock } from '@/content/mocks/home';
import { getHomePage } from '@/lib/api/home';
import { GET } from '@/app/api/home/route';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

describe('source fixture', () => {
    it('validates the complete fourteen-section response', () => {
        expect(HomePage.parse(homeMock)).toEqual(homeMock);
        expect(Object.keys(homeMock)).toHaveLength(14);
    });

    it('applies approved corrections while retaining the requested source copy and provenance', () => {
        expect(homeMock.trustMarquee.items[2].text).toBe('Cash-pay, No Insurance Needed');
        expect(homeMock.footer.columns[1].title).toBe('Comapny');
        expect(homeMock.weightLoss.heading.title[0].text).toBe('Loss Weight In Your Way.');
        expect(homeMock.hero.languageRows[1][0].label).toBe('Русскийالعربية');
        expect(homeMock.onlineCare.cards[1].title).toBe('Easy Manager Treatment');
        expect(new Set(homeMock.faq.items.map((item) => item.answer[0])).size).toBe(1);
        expect(homeMock.bmiCalculator.sourcePreview).toMatchObject({ inputText: '0', scoreText: '56' });
        expect(homeMock.bmiCalculator.ranges[1].description).toBe('<18.5 - 24.9');
    });

    it('keeps source board differences and static illustration data', () => {
        expect(homeMock.birthControl.heading.mobileBody).toEqual([]);
        expect(homeMock.sleep.heading.title[0].text).toBe('Sleep');
        expect(homeMock.sleep.heading.mobileBody[1]).toMatch(/sleepers\.$/);
        expect(homeMock.sleep.heading.desktopBody[1]).toMatch(/sleepers$/);
        expect(homeMock.sleep.profile.score).toBe(78);
    });

    it('has unique authored IDs and existing local placeholder assets', () => {
        const ids: string[] = [];
        function visit(value: unknown) {
            if (!value || typeof value !== 'object') return;
            if ('id' in value) ids.push(String(value.id));
            if ('src' in value) expect(existsSync(resolve('public', String(value.src).slice(1)))).toBe(true);
            Object.values(value).forEach(visit);
        }
        visit(homeMock);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('homepage data boundary', () => {
    it('does not make HTTP requests without an API URL and isolates parsed data', async () => {
        vi.stubEnv('NEXT_PUBLIC_API_URL', '');
        const fetch = vi.fn();
        vi.stubGlobal('fetch', fetch);
        const first = await getHomePage();
        first.header.id = 'changed-by-consumer';
        expect((await getHomePage()).header.id).toBe('header');
        expect(fetch).not.toHaveBeenCalled();
    });

    it.each(['https://api.example.test', 'https://api.example.test/', 'https://api.example.test/v1/'])(
        'uses the configured base URL %s',
        async (base) => {
            vi.stubEnv('NEXT_PUBLIC_API_URL', base);
            const fetch = vi.fn().mockResolvedValue(Response.json(homeMock));
            vi.stubGlobal('fetch', fetch);
            expect(await getHomePage()).toEqual(homeMock);
            expect(String(fetch.mock.calls[0][0])).toBe(`${base.replace(/\/+$/, '')}/api/home`);
            expect(fetch.mock.calls[0][1]).toMatchObject({ cache: 'no-store', signal: expect.any(AbortSignal) });
        }
    );

    it.each([
        'file:///tmp/mock',
        'https://api.example.test/?x=1',
        'https://api.example.test/#x',
        'https://user:pass@api.example.test'
    ])('rejects an invalid base URL %s before requesting it', async (base) => {
        vi.stubEnv('NEXT_PUBLIC_API_URL', base);
        const fetch = vi.fn();
        vi.stubGlobal('fetch', fetch);
        await expect(getHomePage()).rejects.toThrow();
        expect(fetch).not.toHaveBeenCalled();
    });

    it('does not silently fall back on HTTP failure, transport failure or invalid content', async () => {
        vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.test');
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(new Response(null, { status: 503 }))
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce(new Response('not JSON'))
            .mockResolvedValueOnce(Response.json({ ...homeMock, hero: null }));
        vi.stubGlobal('fetch', fetch);
        await expect(getHomePage()).rejects.toThrow('HTTP 503');
        await expect(getHomePage()).rejects.toThrow('offline');
        await expect(getHomePage()).rejects.toThrow();
        await expect(getHomePage()).rejects.toThrow();
    });

    it('serves the same validated mock from the route regardless of the remote setting', async () => {
        vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.test');
        const response = GET();
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/json');
        expect(await response.json()).toEqual(homeMock);
    });
});
