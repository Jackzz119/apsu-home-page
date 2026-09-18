import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { homeMock } from '@/content/mocks/home';
import { homePresentation as ui } from '@/content/presentation';

test.setTimeout(30_000);
test.use({ baseURL: 'http://127.0.0.1:3000' });
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
