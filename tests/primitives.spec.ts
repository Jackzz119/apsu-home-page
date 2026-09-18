import { expect, test, type Page } from '@playwright/test';
import axe from 'axe-core';
import { homeMock } from '../content/mocks/home';
import { primitiveMock } from '../content/mocks/primitives';

declare global {
    interface Window {
        primitiveAxe: typeof axe;
    }
}

/** Visit the isolated canvas, waiting for real fonts and rendered content before assertions. */
async function story(page: Page, id: string) {
    await page.goto(`/iframe.html?id=primitives-${id}&viewMode=story`);
    await page.locator('#storybook-root main').waitFor();
    await page.evaluate(() => document.fonts.ready);
}

test('every primitive state has zero axe violations and no horizontal overflow', async ({
    page,
    request
}, testInfo) => {
    test.setTimeout(240_000);
    const index = await (await request.get('/index.json')).json();
    const ids = Object.keys(index.entries).filter((id) => id.startsWith('primitives-'));
    expect(ids.length).toBeGreaterThanOrEqual(70);
    const results = [];
    for (const id of ids) {
        await story(page, id.replace('primitives-', ''));
        // Isolate this runner from the addon's simultaneous scan without disabling either scan or any rule.
        await page.addScriptTag({
            content: `(() => { const previous = window.axe; ${axe.source}\n window.primitiveAxe = window.axe; window.axe = previous; })();`
        });
        const result = await page.evaluate(async () => {
            const root = document.querySelector('#storybook-root')!;
            const report = await window.primitiveAxe.run(root);
            return {
                violations: report.violations.map(({ id, nodes }) => ({
                    id,
                    nodes: nodes.map((node) => ({ html: node.html, failureSummary: node.failureSummary }))
                })),
                overflow: document.documentElement.scrollWidth > window.innerWidth + 1
            };
        });
        results.push({ id, ...result });
        expect.soft(result.violations, id).toEqual([]);
        expect.soft(result.overflow, `${id}: horizontal overflow`).toBe(false);
    }
    await testInfo.attach('primitive-state-audit', {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json'
    });
});

test('buttons preserve native disabled, destination and keyboard feedback behavior', async ({ page }) => {
    await story(page, 'button--default');
    const button = page.getByRole('button');
    await expect(button.locator('img')).toHaveAttribute('src', '/images/arrow-right-circle.svg');
    expect(await button.locator('img').evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBe(40);
    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();
    await page.keyboard.down('Space');
    await expect(button).toHaveCSS('transform', 'none');
    await page.keyboard.up('Space');
    await story(page, 'button--disabled');
    await expect(page.getByRole('button')).toBeDisabled();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button')).not.toBeFocused();
    await story(page, 'button--disabled-link');
    const link = page.getByRole('link');
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).not.toHaveAttribute('href');
    await link.dispatchEvent('click');
    expect(new URL(page.url()).hash).toBe('');
    await story(page, 'button--link');
    await page.getByRole('link').click();
    expect(new URL(page.url()).hash).toBe(`#${primitiveMock.destinationId}`);
});

test('pointer press reverses; reduced motion removes scale and coarse touch has no sticky hover', async ({
    page,
    browser
}) => {
    await story(page, 'button--default');
    const button = page.getByRole('button');
    const bounds = (await button.boundingBox())!;
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await expect(button).toHaveCSS('transform', 'matrix(0.97, 0, 0, 0.97, 0, 0)');
    await page.mouse.up();
    await expect(button).toHaveCSS('transform', 'none');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.mouse.down();
    await expect(button).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await page.mouse.up();
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const touchPage = await context.newPage();
    await touchPage.goto(`${new URL(page.url()).origin}/iframe.html?id=primitives-button--default&viewMode=story`);
    const touchButton = touchPage.getByRole('button');
    await touchButton.waitFor();
    const baseline = await touchButton.evaluate((node) => getComputedStyle(node).backgroundColor);
    await touchButton.tap();
    await expect(touchButton).toHaveCSS('background-color', baseline);
    expect(await touchPage.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(false);
    await context.close();
});

test('native input groups expose labels, validity, exclusive keyboard selection and real chip toggles', async ({
    page
}) => {
    await story(page, 'numberfield--invalid');
    const input = page.getByRole('spinbutton', { name: homeMock.bmiCalculator.heightLabel });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(
        `${homeMock.bmiCalculator.units[0].heightUnit} ${primitiveMock.error}`
    );
    await story(page, 'numberfield--default');
    const number = page.getByRole('spinbutton');
    await number.focus();
    await number.press('ArrowUp');
    await expect(number).toHaveValue('1');
    await page.getByRole('button', { name: primitiveMock.incrementLabel }).click();
    await expect(number).toHaveValue('2');
    await page.getByRole('button', { name: primitiveMock.decrementLabel }).press('Space');
    await expect(number).toHaveValue('1');
    await expect(number.locator('..')).toHaveCSS('border-radius', '9999px');
    await expect(number.locator('..').locator('img')).toHaveAttribute('src', '/images/number-sort.svg');
    // This specimen stores the value in React state, so a missing change event loses edits on rerender.
    await story(page, 'numberfield--with-hint');
    const increase = page.getByRole('button', { name: primitiveMock.incrementLabel });
    const decrease = page.getByRole('button', { name: primitiveMock.decrementLabel });
    await increase.click();
    await increase.click();
    await expect(number).toHaveValue('1');
    await expect(page.locator('[data-controlled-value]')).toHaveAttribute('data-controlled-value', '1');
    await number.fill('2');
    await increase.click();
    await expect(number).toHaveValue('2');
    await decrease.click();
    await expect(number).toHaveValue('1.5');
    await expect(page.locator('[data-controlled-value]')).toHaveAttribute('data-controlled-value', '1.5');
    await number.fill('0');
    await decrease.click();
    await expect(number).toHaveValue('0');
    await number.fill('');
    await increase.click();
    await expect(number).toHaveValue('0.5');
    for (const args of ['readOnly:true', 'step:any']) {
        await page.goto(`/iframe.html?id=primitives-numberfield--with-hint&viewMode=story&args=${args}`);
        await expect(increase).toBeDisabled();
        await expect(decrease).toBeDisabled();
    }
    await story(page, 'numberfield--disabled');
    await expect(number).toBeDisabled();
    await expect(increase).toBeDisabled();
    await expect(decrease).toBeDisabled();
    for (const id of ['radiogroup', 'segmentedcontrol']) {
        await story(page, `${id}--default`);
        const options = page.getByRole('radio');
        const initial = await options.evaluateAll((nodes) =>
            nodes.findIndex((node) => (node as HTMLInputElement).checked)
        );
        await options.nth(initial).focus();
        await page.keyboard.press('ArrowRight');
        await expect(options.nth((initial + 1) % 2)).toBeChecked();
        expect(
            await options.evaluateAll((nodes) => nodes.filter((node) => (node as HTMLInputElement).checked).length)
        ).toBe(1);
        await story(page, `${id}--disabled`);
        await expect(options.nth(0)).toBeDisabled();
        await expect(options.nth(1)).toBeDisabled();
    }
    await story(page, 'chip--interactive');
    await page.getByRole('button').click();
    await expect(page.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button').press('Space');
    await expect(page.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
});

test('accordion reverses from its measured height and keeps keyboard/reduced changes immediate', async ({ page }) => {
    await story(page, 'accordion--collapsed');
    const summary = page.locator('summary');
    const details = page.locator('details');
    const panel = details.locator(':scope > div');
    await summary.click();
    await expect(details).toHaveAttribute('open');
    await summary.click();
    await summary.click();
    await expect(details).toHaveAttribute('open');
    await expect(panel).not.toHaveAttribute('style', /height/);
    await expect(panel).not.toHaveAttribute('inert');
    await summary.focus();
    await summary.press('Enter');
    await expect(details).not.toHaveAttribute('open');
    await expect(panel).not.toHaveAttribute('style', /height/);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await summary.click();
    await expect(details).toHaveAttribute('open');
    await expect(panel).not.toHaveAttribute('style', /height/);
    await expect(summary).toBeFocused();
});

test('accordion retargets under four-times slow motion and CPU throttling without jumping', async ({
    page
}, testInfo) => {
    await story(page, 'accordion--collapsed');
    await page.addStyleTag({ content: ':root { --dur-base: 800ms; --dur-spatial: 800ms; }' });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const summary = page.locator('summary');
    const panel = page.locator('details > div');
    const height = () => panel.evaluate((node) => node.getBoundingClientRect().height);
    await summary.dispatchEvent('click', { detail: 1 });
    await expect.poll(height).toBeGreaterThan(1);
    const opening = await height();
    await summary.dispatchEvent('click', { detail: 1 });
    const reversal = await height();
    expect(reversal).toBeGreaterThan(0);
    // Sample the shortened reverse transition; dispatch avoids Playwright waiting for a stable summary.
    await page.waitForTimeout(50);
    const closing = await height();
    expect(closing).toBeLessThanOrEqual(reversal + 1);
    await summary.dispatchEvent('click', { detail: 1 });
    await expect(panel).not.toHaveAttribute('style', /height/);
    await expect(page.locator('details')).toHaveAttribute('open');
    expect(await panel.evaluate((node) => node.clientHeight >= node.scrollHeight)).toBe(true);
    await testInfo.attach('slow-motion-reversal', {
        body: JSON.stringify({ opening, reversal, closing, final: await height(), durationMs: 800, cpuRate: 4 }),
        contentType: 'application/json'
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
});

test('carousel stays bounded, makes offscreen content inert and supports keyboard and resize', async ({ page }) => {
    await story(page, 'carousel--single');
    const previous = page.getByRole('button', { name: homeMock.onlineCare.previousLabel });
    const next = page.getByRole('button', { name: homeMock.onlineCare.nextLabel });
    const track = page.locator('[tabindex="0"]');
    await expect(previous).toBeDisabled();
    await expect(page.locator('[aria-roledescription="slide"][inert]')).toHaveCount(3);
    await track.focus();
    await track.press('End');
    await expect(next).toBeDisabled();
    await expect(previous).toBeEnabled();
    await expect(track).toBeFocused();
    await track.press('Home');
    await expect(previous).toBeDisabled();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await next.click();
    await expect(previous).toBeEnabled();
    await page.setViewportSize({ width: 820, height: 900 });
    await track.focus();
    await track.press('End');
    await expect(next).toBeDisabled();
    await track.press('ArrowRight');
    await expect(next).toBeDisabled();
    const range = await track.evaluate((node) => ({ left: node.scrollLeft, max: node.scrollWidth - node.clientWidth }));
    expect(Math.abs(range.left - range.max)).toBeLessThanOrEqual(1);
});

test('marquee supports persistent pause, focus pause, equal loops and live reduced motion', async ({ page }) => {
    await story(page, 'marquee--running');
    const region = page.getByRole('region', { name: primitiveMock.languagesLabel });
    const track = region.locator('ul').first().locator('..');
    const pause = page.getByRole('button', { name: primitiveMock.pauseLabel });
    const widths = await region
        .locator('ul')
        .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
    expect(Math.abs(widths[0] - widths[1])).toBeLessThan(0.01);
    await expect(region.locator('ul').nth(1)).toHaveAttribute('inert');
    await expect(region.locator('ul').nth(1)).toHaveAttribute('aria-hidden', 'true');
    await pause.click();
    await expect(page.getByRole('button', { name: primitiveMock.resumeLabel })).toBeVisible();
    await expect(region).toHaveAttribute('data-paused', 'true');
    await page.mouse.move(0, 800);
    await page
        .getByRole('button', { name: primitiveMock.resumeLabel })
        .evaluate((node) => (node as HTMLElement).blur());
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    await page.getByRole('button', { name: primitiveMock.resumeLabel }).click();
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    // Pointer focus must not latch the hover pause after Resume.
    await page.mouse.move(0, 800);
    await expect(track).toHaveCSS('animation-play-state', 'running');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(track).toHaveCSS('animation-name', 'none');
    await expect(region.locator('ul').nth(1)).not.toBeVisible();
    await expect(region.locator('ul').first()).toHaveCSS('flex-wrap', 'wrap');
    await expect(page.getByRole('button')).toHaveCount(0);
});

test('overview evidence uses loaded fonts at the source viewport', async ({ page }, testInfo) => {
    await story(page, 'overview--default');
    expect(await page.evaluate(() => document.fonts.check('500 18px "Work Sans"'))).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('overview.png'), fullPage: true, animations: 'disabled' });
});
