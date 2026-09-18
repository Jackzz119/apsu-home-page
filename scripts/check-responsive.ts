import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { format } from 'prettier';

/** Run against either the dev server or a production preview; exit nonzero on any layout failure. */
const origin = process.env.RESPONSIVE_URL ?? 'http://127.0.0.1:3000';
const widths = [320, 360, 375, 414, 640, 768, 1024, 1280, 1440, 1600, 1920];
const browser = await chromium.launch();
const results: { width: number; overflow: boolean; navigation: boolean; geometry: boolean; details: string[] }[] = [];
await mkdir('docs/responsive-shots', { recursive: true });
try {
    for (const width of widths) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.goto(origin, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
            await document.fonts.ready;
            for (const img of document.images) img.loading = 'eager';
            await Promise.all(Array.from(document.images, (img) => img.decode().catch(() => undefined)));
        });
        const result = await page.evaluate(() => {
            const details: string[] = [];
            const visible = (el: Element) =>
                el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
            const overflow = document.documentElement.scrollWidth <= innerWidth;
            const nav = document.querySelector('[data-navigation-row]');
            const navItems =
                nav && visible(nav) ? Array.from(nav.children).map((el) => el.getBoundingClientRect()) : [];
            let navigation = navItems.every((rect) => Math.abs(rect.top - (navItems[0]?.top ?? rect.top)) <= 1);
            if (nav && visible(nav)) {
                const siblings = Array.from(nav.parentElement!.parentElement!.children)
                    .filter(visible)
                    .map((el) => el.getBoundingClientRect());
                navigation &&= siblings.every((rect, i) => !i || rect.left >= siblings[i - 1].right - 1);
            }
            const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
            let previousBottom = 0;
            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top < previousBottom - 1) details.push(`${section.id}: overlaps previous section`);
                if (rect.left < -1 || rect.right > innerWidth + 1) details.push(`${section.id}: outside viewport`);
                previousBottom = rect.bottom;
                const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
                let text: Node | null;
                while ((text = walker.nextNode())) {
                    const parent = text.parentElement;
                    if (
                        !parent ||
                        !text.textContent?.trim() ||
                        !visible(parent) ||
                        parent.closest(
                            '[aria-hidden="true"], [inert], [data-reduced="false"], [aria-roledescription="carousel"], dialog, [data-scan-exempt]'
                        )
                    )
                        continue;
                    if (parent.closest('details:not([open])') && !parent.closest('summary')) continue;
                    if (getComputedStyle(parent).position === 'absolute' && parent.getBoundingClientRect().width <= 1)
                        continue;
                    const range = document.createRange();
                    range.selectNodeContents(text);
                    for (const box of range.getClientRects()) {
                        if (box.width === 0 || box.height === 0) continue;
                        if (
                            box.left < rect.left - 2 ||
                            box.right > rect.right + 2 ||
                            box.top < rect.top - 2 ||
                            box.bottom > rect.bottom + 2
                        ) {
                            details.push(
                                `${section.id}: text outside section (${text.textContent.trim().slice(0, 45)})`
                            );
                            break;
                        }
                        let ancestor: HTMLElement | null = parent;
                        while (ancestor && ancestor !== section) {
                            const css = getComputedStyle(ancestor);
                            if (css.overflowX === 'hidden' || css.overflowX === 'clip') {
                                const bounds = ancestor.getBoundingClientRect();
                                if (
                                    box.left < bounds.left - 2 ||
                                    box.right > bounds.right + 2 ||
                                    box.top < bounds.top - 2 ||
                                    box.bottom > bounds.bottom + 2
                                )
                                    details.push(`${section.id}: text clipped by ${ancestor.tagName}`);
                            }
                            ancestor = ancestor.parentElement;
                        }
                    }
                }
            }
            return {
                width: innerWidth,
                overflow,
                navigation,
                geometry: details.length === 0,
                details: [...new Set(details)]
            };
        });
        results.push(result);
        await page.screenshot({ path: `docs/responsive-shots/${width}.png`, fullPage: true, animations: 'disabled' });
        process.stdout.write(
            `${width}: ${result.overflow && result.navigation && result.geometry ? 'PASS' : 'FAIL'} ${result.details.join('; ')}\n`
        );
        await page.close();
    }
} finally {
    await browser.close();
}
const status = (pass: boolean) => (pass ? 'Pass' : 'Fail');
await writeFile(
    'docs/responsive-report.md',
    await format(
        `# Responsive report\n\nGenerated by \`npm run check:responsive\` against ${origin}. Chromium; normal motion; fonts and local images decoded before capture.\n\n| Width | No page overflow | Navigation on one line | Sections / text bounds |\n| --- | --- | --- | --- |\n${results.map((r) => `| ${r.width} | ${status(r.overflow)} | ${status(r.navigation)} | ${status(r.geometry)} |`).join('\n')}\n\nThe geometry check measures consecutive section boxes and text bounds, including clipping ancestors. Intentional image crops, marquee tracks, hidden dialog contents and the carousel's scrolling viewport are excluded from text clipping assertions; dedicated interaction tests cover those controls. This is not a pixel-diff or a physical-device test.\n\n${results.flatMap((r) => r.details.map((d) => `- ${r.width}: ${d}`)).join('\n')}\n`,
        { parser: 'markdown', printWidth: 120 }
    )
);
if (process.argv.includes('--composite')) {
    const { default: sharp } = await import('sharp');
    const tiles = await Promise.all(
        widths.map(async (width) => ({
            input: await sharp(`docs/responsive-shots/${width}.png`).resize({ width: 200 }).png().toBuffer(),
            width
        }))
    );
    const metadata = await Promise.all(tiles.map((tile) => sharp(tile.input).metadata()));
    await sharp({
        create: {
            width: widths.length * 200,
            height: Math.max(...metadata.map((m) => m.height!)),
            channels: 4,
            background: '#faf9f4'
        }
    })
        .composite(tiles.map((tile, i) => ({ input: tile.input, left: i * 200, top: 0 })))
        .png()
        .toFile('docs/responsive-report.png');
}
process.exitCode = results.some((r) => !r.overflow || !r.navigation || !r.geometry) ? 1 : 0;
