import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

/** Check literals, not comments; this guard complements visual and semantic review. */
export function findTokenViolations(source, filename) {
    const violations = [];
    const patterns = [
        [/#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![\da-z])/gi, 'Use a semantic color token.'],
        [/\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\(\s*[\d.]/gi, 'Define color functions in styles/tokens.css.'],
        [
            /\[[^\]\n]*(?:\d(?:px|rem|em|vh|vw)|#[\da-f]+)[^\]\n]*\]/gi,
            'Use a named token instead of an arbitrary utility value.'
        ],
        [/\b(?:md|2xl):|\b(?:min|max)-\[[^\]]+\]:/g, 'Use only the sm, lg and xl layout breakpoints.'],
        [
            /\b(?:bg|text|border|ring|fill|stroke)-(?:white|black|(?:red|green|blue|gray|slate|zinc|neutral|stone|amber|emerald|violet|pink)-\d+)\b/g,
            'Use the source semantic palette.'
        ]
    ];

    function inspect(text, offset) {
        for (const [pattern, message] of patterns) {
            for (const match of text.matchAll(pattern)) {
                const line = source.slice(0, offset + match.index).split('\n').length;
                violations.push({ line, message, value: match[0] });
            }
        }
    }

    if (filename.endsWith('.css')) {
        inspect(
            source.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' ')),
            0
        );
    } else {
        const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        function visit(node) {
            if (
                ts.isStringLiteralLike(node) ||
                ts.isTemplateHead(node) ||
                ts.isTemplateMiddle(node) ||
                ts.isTemplateTail(node)
            ) {
                // A URL fragment is a destination, not a CSS color.
                const parent = node.parent;
                if (!(ts.isJsxAttribute(parent) && ['href', 'src'].includes(parent.name.getText(tree)))) {
                    inspect(node.text, node.getStart(tree) + 1);
                }
            }
            ts.forEachChild(node, visit);
        }
        visit(tree);
    }
    return violations;
}

/** Limit the scan to application styling sources, excluding assets, fixtures and design snapshots. */
async function scanDirectory(directory, root) {
    let violations = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) {
            violations = violations.concat(await scanDirectory(path, root));
        } else if (/\.(?:[cm]?[jt]sx?|css)$/.test(entry.name) && relative(root, path) !== 'styles/tokens.css') {
            const found = findTokenViolations(await readFile(path, 'utf8'), path);
            violations.push(...found.map((issue) => ({ file: relative(root, path), ...issue })));
        }
    }
    return violations;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const root = process.cwd();
    const findings = (
        await Promise.all(
            ['app', 'components', 'lib', 'styles', '.storybook'].map((directory) =>
                scanDirectory(resolve(root, directory), root)
            )
        )
    ).flat();
    for (const finding of findings)
        process.stderr.write(`${finding.file}:${finding.line} ${finding.message} (${finding.value})\n`);
    process.stdout.write(`Token check: ${findings.length} violation(s).\n`);
    process.exitCode = findings.length ? 1 : 0;
}
