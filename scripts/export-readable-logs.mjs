#!/usr/bin/env node
/**
 * Derive readable Markdown views of the raw AI transcripts in ai-logs/ for reviewers who want to sample a
 * session without parsing JSONL. Each view keeps user prompts, assistant replies and one-line tool-call
 * summaries; tool outputs, reasoning/thinking blocks and injected system context are omitted.
 * The raw `.jsonl` files stay authoritative and unedited. Run after `npm run sync:ai-logs`.
 * Usage: node scripts/export-readable-logs.mjs
 */
import { createHash } from 'node:crypto';
import { createReadStream, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { createInterface } from 'node:readline';

const root = 'ai-logs';
const out = join(root, 'readable');
const summaryLength = 160;

/** Yield every raw transcript under a directory, recursing into sub-agent folders. */
function* transcripts(dir) {
    for (const entry of readdirSync(dir).sort()) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) yield* transcripts(path);
        else if (entry.endsWith('.jsonl')) yield path;
    }
}

/** Parse one JSONL file line by line without loading it entirely into memory. */
async function* records(path) {
    const reader = createInterface({ input: createReadStream(path, 'utf8'), crlfDelay: Infinity });
    for await (const line of reader) {
        if (!line.trim()) continue;
        try {
            yield JSON.parse(line);
        } catch {
            // A truncated trailing line is left out of the derived view; the raw file keeps it verbatim.
        }
    }
}

/** Remove harness-injected blocks from a user prompt so the person's own words remain. */
function stripInjected(text) {
    return text
        .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
        .replace(/<local-command-[a-z-]+>[\s\S]*?<\/local-command-[a-z-]+>/g, '')
        .replace(/<command-(?:name|message|args)>[\s\S]*?<\/command-(?:name|message|args)>/g, '')
        .trim();
}

/** Injected context arrives as a tag-wrapped block or a pasted instruction file, never as a person's prompt. */
function isInjected(text) {
    const trimmed = text.trim();
    return (
        (trimmed.startsWith('<') && trimmed.endsWith('>')) ||
        trimmed.startsWith('# AGENTS.md instructions') ||
        trimmed.startsWith('Base directory for this skill:')
    );
}

function oneLine(value, limit = summaryLength) {
    const text = String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim();
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

/** Pick the most descriptive field of a tool input for a one-line summary. */
function describeInput(input) {
    if (typeof input === 'string') {
        try {
            return describeInput(JSON.parse(input));
        } catch {
            return oneLine(input);
        }
    }
    if (!input || typeof input !== 'object') return '';
    for (const key of ['description', 'command', 'file_path', 'pattern', 'query', 'url', 'prompt', 'cmd']) {
        if (typeof input[key] === 'string' && input[key]) return oneLine(input[key]);
        if (Array.isArray(input[key])) return oneLine(input[key].join(' '));
    }
    return oneLine(JSON.stringify(input));
}

const quote = (text) =>
    text
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');

/** Convert a Claude Code transcript into ordered readable entries. */
async function readClaude(path) {
    const entries = [];
    let title = '';
    let sessionId = basename(path, '.jsonl');
    for await (const record of records(path)) {
        if (record.sessionId) sessionId = record.sessionId;
        if (record.type === 'custom-title') title = record.customTitle ?? record.title ?? title;
        if (record.type !== 'user' && record.type !== 'assistant') continue;
        const content = record.message?.content;
        const blocks =
            typeof content === 'string' ? [{ type: 'text', text: content }] : Array.isArray(content) ? content : [];
        const texts = [];
        const tools = [];
        for (const block of blocks) {
            if (block.type === 'text' && typeof block.text === 'string') {
                const text = record.type === 'user' ? stripInjected(block.text) : block.text.trim();
                if (text && !(record.type === 'user' && isInjected(text))) texts.push(text);
            } else if (block.type === 'tool_use') {
                tools.push(`- Tool \`${block.name}\`: ${describeInput(block.input)}`);
            }
        }
        if (!texts.length && !tools.length) continue;
        entries.push({
            time: record.timestamp,
            role: record.type === 'user' ? 'User' : 'Assistant',
            sidechain: Boolean(record.isSidechain),
            body: [...texts.map((text) => (record.type === 'user' ? quote(text) : text)), ...tools].join('\n\n')
        });
    }
    return { tool: 'Claude Code', sessionId, title, entries };
}

/** Convert a Codex CLI rollout into ordered readable entries. */
async function readCodex(path) {
    const entries = [];
    let sessionId = basename(path, '.jsonl');
    let meta = '';
    for await (const record of records(path)) {
        const payload = record.payload ?? {};
        if (record.type === 'session_meta') {
            sessionId = payload.id ?? sessionId;
            meta = [payload.cli_version && `Codex CLI ${payload.cli_version}`, payload.cwd && `cwd ${payload.cwd}`]
                .filter(Boolean)
                .join(' · ');
            continue;
        }
        if (record.type !== 'response_item') continue;
        if (payload.type === 'message' && payload.role !== 'developer') {
            const texts = [];
            for (const block of payload.content ?? []) {
                if ((block.type === 'input_text' || block.type === 'output_text') && typeof block.text === 'string') {
                    const text = payload.role === 'user' ? stripInjected(block.text) : block.text.trim();
                    if (text && !(payload.role === 'user' && isInjected(text))) texts.push(text);
                }
            }
            if (!texts.length) continue;
            entries.push({
                time: record.timestamp,
                role: payload.role === 'user' ? 'User' : 'Assistant',
                body: texts.map((text) => (payload.role === 'user' ? quote(text) : text)).join('\n\n')
            });
        } else if (payload.type === 'custom_tool_call' || payload.type === 'function_call') {
            entries.push({
                time: record.timestamp,
                role: 'Assistant',
                body: `- Tool \`${payload.name}\`: ${describeInput(payload.input ?? payload.arguments)}`
            });
        } else if (payload.type === 'local_shell_call') {
            entries.push({
                time: record.timestamp,
                role: 'Assistant',
                body: `- Shell: ${oneLine((payload.action?.command ?? []).join(' '))}`
            });
        }
    }
    return { tool: 'Codex CLI', sessionId, title: meta, entries };
}

/** Merge consecutive assistant entries so tool-call lines sit under the reply that issued them. */
function merge(entries) {
    const merged = [];
    for (const entry of entries) {
        const previous = merged.at(-1);
        if (
            previous &&
            previous.role === entry.role &&
            entry.role === 'Assistant' &&
            previous.sidechain === entry.sidechain
        ) {
            previous.body += `\n\n${entry.body}`;
            previous.end = entry.time;
        } else merged.push({ ...entry, end: entry.time });
    }
    return merged;
}

function render(path, session) {
    const raw = relative(out, path).split('\\').join('/');
    const hash = createHash('sha256').update(readFileSync(path)).digest('hex');
    const entries = merge(session.entries);
    const users = entries.filter((entry) => entry.role === 'User').length;
    const header = [
        `# Readable transcript · ${session.sessionId}`,
        '',
        `> Derived on ${new Date().toISOString().slice(0, 10)} from [\`${raw}\`](${raw}) (sha256 \`${hash}\`); the raw file is authoritative and unedited. This view keeps user prompts (quoted), assistant replies and one-line tool-call summaries. Tool outputs, reasoning/thinking blocks and harness-injected context are omitted.`,
        '',
        `Tool: ${session.tool}${session.title ? ` · ${session.title}` : ''} · Entries: ${users} user / ${entries.length - users} assistant · From ${entries[0]?.time ?? '?'} to ${entries.at(-1)?.end ?? '?'}`,
        '',
        '---',
        ''
    ];
    const body = entries.map(
        (entry) =>
            `### ${entry.time ?? 'unknown time'} · ${entry.role}${entry.sidechain ? ' (sub-agent)' : ''}\n\n${entry.body}\n`
    );
    return `${header.join('\n')}${body.join('\n')}`;
}

mkdirSync(out, { recursive: true });
let count = 0;
for (const [dir, read] of [
    [join(root, 'claude-code'), readClaude],
    [join(root, 'codex'), readCodex]
]) {
    if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) continue;
    for (const path of transcripts(dir)) {
        const target = join(out, `${basename(path, '.jsonl')}.md`);
        writeFileSync(target, render(path, await read(path)));
        count += 1;
        process.stdout.write(`${target} (${(statSync(target).size / 1024).toFixed(0)} KB)\n`);
    }
}
process.stdout.write(`exported ${count} readable transcript(s) -> ${out}\n`);
