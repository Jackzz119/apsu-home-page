import { expect, test, type CDPSession, type Page } from '@playwright/test';
import { homeMock } from '@/content/mocks/home';
import { homePresentation as ui } from '@/content/presentation';

/**
 * Assignment §4D acceptance: every visible interactive element answers hover, focus-visible and pressed,
 * and the pointer feedback is transitioned. Pseudo-classes are forced through the DevTools protocol so
 * anchors, toggles and moving marquee chips are measured without activating them, and a control's whole
 * subtree (icons, the label beside a visually hidden radio) counts as its rendered state.
 * Links, buttons and disclosure summaries must change on hover and press; text inputs, radios and focusable
 * regions are keyboard controls and must show focus-visible.
 */
test.use({ baseURL: 'http://127.0.0.1:3000' });
test.setTimeout(300_000);

type Kind = 'pointer' | 'keyboard';
type Candidate = { index: number; description: string; kind: Kind };
type Result = Candidate & { hover: boolean; active: boolean; focus: boolean; transition: boolean };

const ATTRIBUTE = 'data-acceptance-state';
const PROPERTIES = [
    'color',
    'background-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline-style',
    'outline-width',
    'outline-color',
    'box-shadow',
    'opacity',
    'transform',
    'scale',
    'translate',
    'filter',
    'text-decoration-line'
];

declare global {
    interface Window {
        acceptanceState: {
            collect(root: string): Candidate[];
            signature(index: number): string;
            transition(index: number): boolean;
            settle(index: number): Promise<void>;
        };
    }
}

/** Install the in-page helpers once per document: tagging, style signatures and transition settling. */
async function installHelpers(page: Page) {
    await page.evaluate(
        ({ attribute, properties }) => {
            const proxy = (el: Element) => {
                const rect = el.getBoundingClientRect();
                const invisible = getComputedStyle(el).opacity === '0' || rect.width <= 1 || rect.height <= 1;
                return invisible && el.parentElement ? el.parentElement : el;
            };
            const nodes = (index: number) => {
                const el = document.querySelector(`[${attribute}="${index}"]`);
                if (!el) throw new Error(`Control ${index} disappeared during the scan.`);
                const scope = proxy(el);
                return [scope, ...Array.from(scope.querySelectorAll('*'))];
            };
            window.acceptanceState = {
                collect: (root) => {
                    const scope = document.querySelector(root);
                    if (!scope) return [];
                    for (const tagged of Array.from(document.querySelectorAll(`[${attribute}]`))) {
                        tagged.removeAttribute(attribute);
                    }
                    const controls = Array.from(
                        scope.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex="0"]')
                    ).filter((el) => {
                        if (el.matches(':disabled, [aria-disabled="true"]')) return false;
                        if (el.closest('[aria-hidden="true"], [inert], dialog:not([open]), [data-scan-exempt]')) {
                            return false;
                        }
                        const style = getComputedStyle(el);
                        if (style.display === 'none' || style.visibility === 'hidden') return false;
                        const rect = proxy(el).getBoundingClientRect();
                        return rect.width > 1 && rect.height > 1;
                    });
                    return controls.map((el, index) => {
                        el.setAttribute(attribute, String(index));
                        const label = (el.getAttribute('aria-label') || el.textContent || '')
                            .trim()
                            .replace(/\s+/g, ' ')
                            .slice(0, 40);
                        const type = el instanceof HTMLInputElement ? `[${el.type}]` : '';
                        return {
                            index,
                            description: `${el.tagName.toLowerCase()}${type} "${label}"`,
                            kind: el.matches('a[href], button, summary') ? 'pointer' : 'keyboard'
                        } as Candidate;
                    });
                },
                signature: (index) =>
                    nodes(index)
                        .map((node) => {
                            const style = getComputedStyle(node);
                            return properties.map((property) => style.getPropertyValue(property)).join('|');
                        })
                        .join('\n'),
                transition: (index) =>
                    nodes(index).some((node) =>
                        getComputedStyle(node)
                            .transitionDuration.split(',')
                            .some((duration) => parseFloat(duration) > 0)
                    ),
                settle: async (index) => {
                    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                    const transitions = nodes(index)
                        .flatMap((node) => node.getAnimations())
                        .filter((animation) => animation instanceof CSSTransition);
                    await Promise.all(transitions.map((animation) => animation.finished.catch(() => undefined)));
                }
            };
        },
        { attribute: ATTRIBUTE, properties: PROPERTIES }
    );
}

/** Force each pseudo-class on one control and compare the settled subtree style with its resting state. */
async function measure(page: Page, cdp: CDPSession, documentId: number, candidate: Candidate): Promise<Result> {
    const { nodeId } = await cdp.send('DOM.querySelector', {
        nodeId: documentId,
        selector: `[${ATTRIBUTE}="${candidate.index}"]`
    });
    expect(nodeId, `${candidate.description} was not found by the DevTools protocol`).toBeGreaterThan(0);
    const state = async (forcedPseudoClasses: string[]) => {
        await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses });
        await page.evaluate((index) => window.acceptanceState.settle(index), candidate.index);
        return page.evaluate((index) => window.acceptanceState.signature(index), candidate.index);
    };
    const resting = await state([]);
    const hover = await state(['hover']);
    const active = await state(['active']);
    const focus = await state(['focus', 'focus-visible']);
    await state([]);
    const transition = await page.evaluate((index) => window.acceptanceState.transition(index), candidate.index);
    return {
        ...candidate,
        hover: hover !== resting,
        active: active !== resting,
        focus: focus !== resting,
        transition
    };
}

test('every visible control answers hover, focus-visible and pressed with a transition', async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const disclosure = page.getByRole('button', { name: ui.bmi.openLabel });
    if (await disclosure.isVisible()) await disclosure.click();
    await installHelpers(page);

    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const results: Result[] = [];
    const scan = async (root: string) => {
        await page.mouse.move(0, 0);
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        const candidates = await page.evaluate((selector) => window.acceptanceState.collect(selector), root);
        const { root: documentNode } = await cdp.send('DOM.getDocument', { depth: 0 });
        for (const candidate of candidates) results.push(await measure(page, cdp, documentNode.nodeId, candidate));
    };

    await scan('body');
    const trigger = page.getByRole('button', { name: homeMock.header.openMenuLabel });
    if (await trigger.isVisible()) {
        await trigger.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await scan('dialog[open]');
        await page.keyboard.press('Escape');
    }

    const failures = results
        .filter((result) =>
            result.kind === 'pointer'
                ? !(result.hover && result.active && result.focus && result.transition)
                : !result.focus
        )
        .map((result) => {
            const missing = [
                !result.hover && 'hover',
                !result.active && 'pressed',
                !result.focus && 'focus-visible',
                !result.transition && 'transition'
            ].filter(Boolean);
            return `${result.description}: missing ${missing.join(', ')}`;
        });
    await testInfo.attach('interaction-state-audit', {
        body: JSON.stringify({ controls: results.length, failures, results }, null, 2),
        contentType: 'application/json'
    });
    testInfo.annotations.push({ type: 'controls measured', description: String(results.length) });
    expect(results.length).toBeGreaterThanOrEqual(40);
    expect(failures).toEqual([]);
});
