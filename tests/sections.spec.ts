import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { homeMock } from '@/content/mocks/home';
import { homePresentation as ui } from '@/content/presentation';

test.setTimeout(30_000);
test.use({ baseURL: process.env.PLAYWRIGHT_APP_URL ?? 'http://127.0.0.1:3000' });
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
});

async function openBmi(page: import('@playwright/test').Page) {
    const button = page.getByRole('button', { name: ui.bmi.openLabel });
    if (await button.isVisible()) await button.click();
    return page.locator('#bmi-calculator');
}

test('composes 14 sections, one h1/main and real local assets without placeholder requests', async ({ page }) => {
    await expect(page.locator('[data-section]')).toHaveCount(14);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager';
        await Promise.all(Array.from(document.images, (image) => image.decode()));
    });
    expect(
        await page
            .locator('img')
            .evaluateAll((images) =>
                images.every(
                    (image) =>
                        (image as HTMLImageElement).naturalWidth > 0 &&
                        !(image as HTMLImageElement).src.includes('placeholder')
                )
            )
    ).toBe(true);
    for (const target of ['weight-loss', 'weight-loss-plans', 'birth-control', 'sleep', 'faq'])
        await expect(page.locator(`[id="${target}"]`)).toHaveCount(1);
    const requests: string[] = [];
    page.on('request', (request) => {
        if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') requests.push(request.url());
    });
    const initial = page.url();
    for (const button of await page.locator('button[data-action-kind="demo"]').all())
        if (await button.isVisible()) await button.click();
    expect(page.url()).toBe(initial);
    expect(requests).toEqual([]);
});

test('native menu traps focus, closes with Escape, restores focus and navigates to content', async ({
    page,
    isMobile
}) => {
    void isMobile;
    const trigger = page.getByRole('button', { name: homeMock.header.openMenuLabel });
    if (!(await trigger.isVisible())) {
        await expect(page.locator('[data-navigation-row]')).toBeVisible();
        return;
    }
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    await trigger.click();
    await dialog.getByRole('link', { name: 'Weight Loss' }).click();
    await expect(page.locator('#weight-loss')).toBeFocused();
    await expect(dialog).not.toBeVisible();
    await trigger.click();
    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(dialog).not.toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('page anchors scroll smoothly for pointers and immediately for keyboard or reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager';
        await Promise.all(Array.from(document.images, (image) => image.decode()));
    });
    const trigger = page.getByRole('button', { name: homeMock.header.openMenuLabel });
    const mobile = await trigger.isVisible();
    if (mobile) await trigger.click();
    const link = (mobile ? page.getByRole('dialog') : page.locator('header nav').first()).getByRole('link', {
        name: 'Weight Loss',
        exact: true
    });
    const target = page.locator('#weight-loss');
    const destination = await target.evaluate((node) => node.getBoundingClientRect().top + scrollY);
    // Record real frames: a final hash and CSS value alone would also pass for a hard jump.
    const travel = page.evaluate(
        () =>
            new Promise<number[]>((resolve) => {
                const positions: number[] = [];
                const started = performance.now();
                function sample() {
                    positions.push(scrollY);
                    if (performance.now() - started < 1800) requestAnimationFrame(sample);
                    else resolve(positions);
                }
                sample();
            })
    );
    await link.click();
    const positions = await travel;
    expect(positions.some((y) => y > 5 && y < destination - 5)).toBe(true);
    await expect.poll(() => target.evaluate((node) => Math.abs(node.getBoundingClientRect().top))).toBeLessThan(2);
    await expect(page).toHaveURL(/#weight-loss$/);
    if (mobile) {
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(target).toBeFocused();
        expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    }
    await page.keyboard.press('Tab');
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
    await page.locator('header > div > a').focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    if (mobile) await trigger.click();
    await link.click();
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
    await expect.poll(() => target.evaluate((node) => Math.abs(node.getBoundingClientRect().top))).toBeLessThan(2);
});

test('BMI validates, calculates only after submit, preserves physical units and clears stale results', async ({
    page
}) => {
    const bmi = await openBmi(page);
    const result = bmi.getByRole('status');
    await expect(result).toHaveText(ui.bmi.emptyResult);
    await bmi.getByRole('button', { name: 'Calculate BMI' }).click();
    await expect(bmi.getByRole('spinbutton', { name: 'Height', exact: true })).toBeFocused();
    await expect(bmi.locator('[aria-invalid="true"]')).toHaveCount(3);
    await bmi.getByRole('radio', { name: 'cm/kgs' }).locator('..').click();
    await bmi.getByRole('spinbutton', { name: 'Height', exact: true }).fill('170');
    await bmi.getByRole('spinbutton', { name: 'Weight', exact: true }).fill('80');
    await expect(result).toHaveText(ui.bmi.emptyResult);
    await bmi.getByRole('button', { name: 'Calculate BMI' }).click();
    await expect(result).toContainText('27.7');
    await expect(result).toContainText('Overweight');
    for (let i = 0; i < 3; i++) {
        await bmi.getByRole('radio', { name: 'ft / lbs' }).locator('..').click();
        await bmi.getByRole('radio', { name: 'cm/kgs' }).locator('..').click();
    }
    await expect(bmi.getByRole('spinbutton', { name: 'Height', exact: true })).toHaveValue('170');
    await expect(bmi.getByRole('spinbutton', { name: 'Weight', exact: true })).toHaveValue('80');
    await expect(result).toContainText('27.7');
    await bmi.getByRole('radio', { name: 'Male', exact: true }).locator('..').click();
    await expect(result).toContainText('27.7');
    const collapse = bmi.getByRole('button', { name: ui.bmi.closeLabel });
    if (await collapse.isVisible()) {
        await collapse.click();
        await bmi.getByRole('button', { name: ui.bmi.openLabel }).click();
        await expect(result).toContainText('27.7');
    }
    await bmi.getByRole('spinbutton', { name: 'Weight', exact: true }).fill('70');
    await expect(result).toHaveText(ui.bmi.emptyResult);
    await bmi.getByRole('button', { name: 'Increase Weight kg' }).click();
    await expect(bmi.getByRole('spinbutton', { name: 'Weight', exact: true })).toHaveValue('70.1');
    await bmi.getByRole('spinbutton', { name: 'Weight', exact: true }).fill('-1');
    await bmi.getByRole('button', { name: 'Calculate BMI' }).click();
    await expect(bmi.getByRole('spinbutton', { name: 'Weight', exact: true })).toHaveAttribute('aria-invalid', 'true');
});

test('BMI validation and result states preserve geometry across the eleven responsive widths', async ({
    page
}, info) => {
    const widths = info.project.name === 'mobile-375' ? [320, 360, 375, 414, 640, 768] : [1024, 1280, 1440, 1600, 1920];
    for (const width of widths) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto('/');
        await page.evaluate(() => document.fonts.ready);
        const bmi = await openBmi(page);
        const fields = bmi.getByRole('spinbutton');
        for (const field of await fields.all()) await expect(field).toHaveValue('');
        const geometry = () =>
            bmi.evaluate((root) => {
                const selectors = ['form', 'input[type="number"]', 'button[type="submit"]', '[role="status"]', 'ul'];
                return [root, ...selectors.flatMap((selector) => Array.from(root.querySelectorAll(selector)))].map(
                    (node) => {
                        const box = node.getBoundingClientRect();
                        return [box.x, box.y + scrollY, box.width, box.height];
                    }
                );
            });
        const baseline = await geometry();
        const stable = async () => {
            const actual = await geometry();
            expect(actual.length).toBe(baseline.length);
            actual.forEach((box, index) =>
                box.forEach((value, axis) => {
                    expect(
                        Math.abs(value - baseline[index][axis]),
                        `${width}px box ${index} axis ${axis}`
                    ).toBeLessThan(1);
                })
            );
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        };
        await bmi.getByRole('button', { name: 'Calculate BMI' }).click();
        await expect(bmi.locator('[aria-invalid="true"]')).toHaveCount(3);
        await expect(bmi.getByText(ui.bmi.invalidHeight, { exact: true })).toHaveCount(1);
        await stable();
        await bmi.getByRole('spinbutton', { name: 'Height', exact: true }).fill('5');
        await expect(bmi.locator('[aria-invalid="true"]')).toHaveCount(1);
        await stable();
        await bmi.getByRole('spinbutton', { name: 'Weight', exact: true }).fill('160');
        await bmi.getByRole('button', { name: 'Calculate BMI' }).click();
        await expect(bmi.locator('[role="status"] strong')).toHaveText('31.2');
        await stable();
        await bmi.getByRole('spinbutton', { name: 'Weight', exact: true }).fill('150');
        await expect(bmi.getByRole('status')).toHaveText(ui.bmi.emptyResult);
        await stable();
    }
});

test('BMI count-up has intermediate frames, an immediate accessible final value and safe interruption', async ({
    page
}) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const bmi = await openBmi(page);
    await bmi.getByRole('radio', { name: 'cm/kgs' }).locator('..').click();
    const height = bmi.getByRole('spinbutton', { name: 'Height', exact: true });
    const weight = bmi.getByRole('spinbutton', { name: 'Weight', exact: true });
    const submit = bmi.getByRole('button', { name: 'Calculate BMI' });
    await height.fill('170');
    await weight.fill('80');
    const sample = page.evaluate(
        () =>
            new Promise<{ value: number; height: number; accessible: string }[]>((resolve) => {
                const frames: { value: number; height: number; accessible: string }[] = [];
                const started = performance.now();
                function frame() {
                    const status = document.querySelector('#bmi-calculator [role="status"]')!;
                    const score = status.querySelector('strong');
                    if (score)
                        frames.push({
                            value: Number(score.textContent),
                            height: status.getBoundingClientRect().height,
                            accessible: status.querySelector('span')!.textContent!
                        });
                    if (performance.now() - started < 700) requestAnimationFrame(frame);
                    else resolve(frames);
                }
                frame();
            })
    );
    await submit.click();
    const frames = await sample;
    expect(frames.some((frame) => frame.value > 0 && frame.value < 27.7)).toBe(true);
    expect(frames.at(-1)?.value).toBe(27.7);
    expect(new Set(frames.map((frame) => frame.height)).size).toBe(1);
    expect(frames.every((frame) => frame.accessible === '27.7')).toBe(true);
    const score = bmi.locator('[role="status"] strong');
    await expect(score).toHaveAttribute('aria-hidden', 'true');
    await weight.fill('70');
    await submit.press('Enter');
    await expect(score).toHaveText('24.2');
    await weight.fill('80');
    await submit.click();
    await weight.fill('60');
    await page.waitForTimeout(300);
    await expect(bmi.getByRole('status')).toHaveText(ui.bmi.emptyResult);
    await submit.click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(score).toHaveText('20.8');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(score).toHaveText('20.8');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await weight.fill('80');
    await submit.click();
    await expect(score).toHaveText('27.7');
});

test('mobile plan comparison stays visible and BMI disclosure retains measurements', async ({ page }) => {
    for (const name of ['Compounded Semaglutide', 'Compounded Tirzepatide'])
        await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    const disclosure = page.getByRole('button', { name: ui.bmi.openLabel });
    if (await disclosure.isVisible()) {
        await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('#bmi-calculator form')).not.toBeVisible();
        const height = await page.evaluate(
            () =>
                document.getElementById('bmi-calculator')!.getBoundingClientRect().bottom -
                document.getElementById('weight-loss')!.getBoundingClientRect().top
        );
        expect(height).toBeLessThan(1450);
    }
});

test('shared language pause is persistent, reduced motion reveals all unique content', async ({ page }) => {
    await page.getByRole('button', { name: ui.pauseLanguages }).click();
    const rows = page.locator('section[aria-label^="Supported languages"]');
    await expect(rows.nth(0)).toHaveAttribute('data-paused', 'true');
    await expect(rows.nth(1)).toHaveAttribute('data-paused', 'true');
    await page.getByRole('button', { name: ui.pauseTrust }).click();
    await expect(page.locator('section[aria-label="Care benefits"]')).toHaveAttribute('data-paused', 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.getByRole('button', { name: ui.resumeLanguages })).not.toBeVisible();
    for (const row of await rows.all()) await expect(row).toHaveAttribute('data-reduced', 'true');
    await expect(page.locator('[dir="rtl"]:visible')).toHaveCount(1);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.getByRole('button', { name: ui.resumeLanguages })).toBeVisible();
});

test('Resume restarts both strips on pointer exit without blurring the control', async ({ page }) => {
    const languageRows = page.locator('section[aria-label^="Supported languages"]');
    const trust = page.getByRole('region', { name: ui.trustLabel, exact: true });
    for (const [pauseLabel, resumeLabel, rows] of [
        [ui.pauseLanguages, ui.resumeLanguages, languageRows],
        [ui.pauseTrust, ui.resumeTrust, trust]
    ] as const) {
        await page.getByRole('button', { name: pauseLabel }).click();
        await page.mouse.move(0, 0);
        for (const row of await rows.all()) {
            await expect(row).toHaveAttribute('data-paused', 'true');
            await expect(row.locator('ul').first().locator('..')).toHaveCSS('animation-play-state', 'paused');
        }
        const resume = page.getByRole('button', { name: resumeLabel });
        // Cover a keyboard-to-pointer switch: Chromium can retain :focus-visible on this button.
        await page.keyboard.press('Tab');
        await resume.focus();
        await expect(resume).toBeFocused();
        await resume.click();
        await page.mouse.move(0, 0);
        await expect(page.getByRole('button', { name: pauseLabel })).toBeFocused();
        for (const row of await rows.all()) {
            const track = row.locator('ul').first().locator('..');
            await expect(track).toHaveCSS('animation-play-state', 'running');
            const time = await track.evaluate((node) => Number(node.getAnimations()[0].currentTime));
            await expect
                .poll(() => track.evaluate((node) => Number(node.getAnimations()[0].currentTime)))
                .toBeGreaterThan(time);
        }
    }
});

test('language demo toggles synchronize loop copies and remain keyboard accessible', async ({ page }) => {
    const row = page.getByRole('region', { name: `${ui.languagesLabel} 1` });
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    const track = row.locator('ul').first().locator('..');
    await track.evaluate((node) => {
        const animation = node.getAnimations()[0];
        animation.currentTime = Number(animation.effect!.getTiming().duration) * 0.9;
    });
    const copy = row.locator('ul[aria-hidden] button').filter({ hasText: 'English' });
    const original = row.getByRole('button', { name: 'English', exact: true });
    await expect(copy).toHaveAttribute('tabindex', '-1');
    await copy.click();
    await expect(original).toHaveAttribute('aria-pressed', 'true');
    await expect(copy).toHaveAttribute('aria-pressed', 'true');
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await original.focus();
    await expect(track).toHaveCSS('animation-name', 'none');
    await expect(row.locator('ul[aria-hidden]')).not.toBeVisible();
    await original.press('Space');
    await expect(original).toHaveAttribute('aria-pressed', 'false');
    for (let index = 0; index < 6; index++) {
        const focused = page.locator(':focus');
        await expect(focused).toBeInViewport();
        expect(await focused.evaluate((node) => Boolean(node.closest('[aria-hidden="true"]')))).toBe(false);
        await page.keyboard.press('Tab');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const chinese = page.getByRole('button', { name: '中文', exact: true });
    await chinese.click();
    await expect(chinese).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: 'Português', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('FAQ keyboard toggles and carousel keyboard boundaries remain usable', async ({ page }) => {
    const first = page.locator('#faq details').first();
    await expect(first).toHaveAttribute('open', '');
    await first.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(first).not.toHaveAttribute('open');
    await first.locator('summary').press('Enter');
    await expect(first).toHaveAttribute('open', '');
    const carousel = page.locator('#online-care [aria-roledescription="carousel"]');
    const track = carousel.locator('[tabindex="0"]');
    await track.focus();
    await page.keyboard.press('End');
    await expect(carousel.getByRole('button', { name: homeMock.onlineCare.nextLabel })).toBeDisabled();
    await page.keyboard.press('Home');
    await expect(carousel.getByRole('button', { name: homeMock.onlineCare.previousLabel })).toBeDisabled();
});

test('full page and expanded calculator pass axe in normal and reduced motion', async ({ page }) => {
    await page.addScriptTag({ content: await readFile('node_modules/axe-core/axe.min.js', 'utf8') });
    for (const reducedMotion of ['no-preference', 'reduce'] as const) {
        await page.emulateMedia({ reducedMotion });
        await openBmi(page);
        const violations = await page.evaluate(
            async () =>
                (
                    await (
                        window as unknown as { axe: { run: (root: Document) => Promise<{ violations: unknown[] }> } }
                    ).axe.run(document)
                ).violations
        );
        expect(violations).toEqual([]);
    }
});

test('BMI units switch on the first press after validation, across the full radio hit area', async ({ page }) => {
    const bmi = await openBmi(page);
    const metric = bmi.getByRole('radio', { name: 'cm/kgs' });
    const imperial = bmi.getByRole('radio', { name: 'ft / lbs' });
    for (const fraction of [0.15, 0.5, 0.85]) {
        await imperial.check();
        await bmi.getByRole('button', { name: 'Calculate BMI' }).click();
        await expect(bmi.locator('[aria-invalid="true"]')).toHaveCount(3);
        await metric.scrollIntoViewIfNeeded();
        const box = (await metric.boundingBox())!;
        const point = { x: box.x + box.width * fraction, y: box.y + box.height / 2 };
        await page.mouse.move(point.x, point.y);
        await page.mouse.down();
        expect(
            await metric.evaluate((node, point) => document.elementFromPoint(point.x, point.y) === node, point)
        ).toBe(true);
        await page.mouse.up();
        await expect(metric).toBeChecked();
        await expect(bmi.getByRole('spinbutton')).toHaveCount(2);
        await expect(bmi.locator('[aria-invalid="true"]')).toHaveCount(0);
    }
    await metric.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(imperial).toBeChecked();
    await page.keyboard.press('ArrowRight');
    await expect(metric).toBeChecked();
});

test('BMI score fits its container without changing font family, weight or panel geometry', async ({ page }) => {
    const bmi = await openBmi(page);
    await bmi.getByRole('radio', { name: 'cm/kgs' }).check();
    const height = bmi.getByRole('spinbutton', { name: 'Height', exact: true });
    const weight = bmi.getByRole('spinbutton', { name: 'Weight' });
    const submit = bmi.getByRole('button', { name: 'Calculate BMI' });
    const score = bmi.locator('[role="status"] strong');
    await height.fill('100');
    await weight.fill('25');
    await submit.press('Enter');
    const sample = () =>
        score.evaluate((node) => {
            const style = getComputedStyle(node);
            const box = node.getBoundingClientRect();
            const frame = node.parentElement!.getBoundingClientRect();
            return {
                font: style.fontFamily,
                weight: style.fontWeight,
                size: parseFloat(style.fontSize),
                width: box.width,
                available: frame.width,
                frameHeight: frame.height
            };
        });
    const normal = await sample();
    for (const value of ['1083.9', '10839', '10839000000000000000']) {
        await weight.fill(value);
        await submit.press('Enter');
        const large = await sample();
        expect(large.font).toBe(normal.font);
        expect(large.weight).toBe(normal.weight);
        expect(large.frameHeight).toBe(normal.frameHeight);
        expect(large.width).toBeLessThanOrEqual(large.available + 1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(large.size).toBeLessThanOrEqual(normal.size);
        if (value === '1083.9') expect(large.size).toBeGreaterThan(normal.size * 0.7);
    }
    await weight.fill('25');
    await submit.press('Enter');
    expect((await sample()).size).toBe(normal.size);
    await weight.fill('10839');
    await submit.press('Enter');
    const fullWidth = await sample();
    await score.evaluate((node) => {
        node.parentElement!.style.width = '50%';
    });
    await expect.poll(async () => (await sample()).size).toBeLessThan(fullWidth.size);
    expect((await sample()).width).toBeLessThanOrEqual((await sample()).available + 1);
    await score.evaluate((node) => {
        node.parentElement!.style.removeProperty('width');
    });
    await expect.poll(async () => (await sample()).size).toBe(fullWidth.size);
});
