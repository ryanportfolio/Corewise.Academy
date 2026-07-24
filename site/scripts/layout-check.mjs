// Advisory layout check: finds prose that is hiding a shape.
//
// Why advisory and not a build gate (calibrated 2026-07-24 against the whole
// catalogue): the obvious metrics do not separate good from bad. The wall-of-text
// draft the editor rejected actually had FEWER consecutive prose paragraphs than
// the version approved to replace it, and several published guides carry longer
// paragraphs than that rejected draft did. Layout is a judgment call, so this
// script reports candidates and always exits 0. The writer decides.
//
// The one signal that did separate the rejected drafts from their approved
// rewrites: a paragraph that announces a set ("the audit checks three things",
// "two settings matter") and then swallows the items in that same paragraph,
// instead of handing them to a table, list, or bold-led block.
//   rejected: "The audit checks three things: routing integrity (...), index
//             truth (...), and freshness (...)"            49 words, no structure
//   approved: "The audit runs three checks:"                5 words, then a list
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Optional dir argument so the thresholds below can be re-calibrated against a
// known-good or known-bad set of drafts.
const GUIDES_DIR = process.argv[2]
  ? resolve(process.argv[2])
  : new URL('../src/content/guides/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// A paragraph naming a set of things it is about to describe.
const ENUMERATION = /\b(two|three|four|five|six)\b\s+(?:\w+\s+){0,3}(kinds|types|ways|modes|things|reasons|stages|steps|gates|checks|settings|axes|columns|levels|piles|failure modes)\b/i;
// "The first is X. The second is Y." walked through in prose.
const ORDINAL_CHAIN = /\bthe (first|second|third) (one|thing|is|:)/i;

// An enumerating paragraph under this length is an announcement, or a short
// contrast that a table would over-structure ("Structure only genuine structure",
// copy-rules.md). Above it, the paragraph is carrying the items itself.
const ENUM_WORDS = 60;
// A paragraph this long is worth a second look whatever its shape. Ledes are
// exempt: a single flowing opening paragraph is the intended form.
const LONG_WORDS = 120;

const isStructural = (t) =>
  t.startsWith('|') ||
  t.startsWith('```') ||
  /^[-*]\s/.test(t) ||
  /^\d+\.\s/.test(t) ||
  t.startsWith('**') ||
  (t.startsWith('<') && !t.startsWith('<p class="lede">'));

function blocksOf(text) {
  const body = text.replace(/\r\n/g, '\n').replace(/^---\n[\s\S]*?\n---\n/, '');
  const offset = text.replace(/\r\n/g, '\n').split('\n').length - body.split('\n').length;
  const out = [];
  let cur = [];
  let start = 0;
  body.split('\n').forEach((line, i) => {
    if (line.trim() === '') {
      if (cur.length) out.push({ text: cur.join(' ').trim(), line: start + offset + 1 });
      cur = [];
    } else {
      if (!cur.length) start = i;
      cur.push(line);
    }
  });
  if (cur.length) out.push({ text: cur.join(' ').trim(), line: start + offset + 1 });
  return out.filter((b) => b.text && !b.text.startsWith('import ') && !b.text.startsWith('#'));
}

const findings = [];
for (const file of readdirSync(GUIDES_DIR)) {
  if (!file.endsWith('.mdx')) continue;
  const blocks = blocksOf(readFileSync(join(GUIDES_DIR, file), 'utf8'));

  blocks.forEach((block, i) => {
    if (isStructural(block.text)) return;
    const isLede = block.text.startsWith('<p class="lede">');
    const prose = block.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = prose.split(' ').filter(Boolean).length;

    const cue = prose.match(ENUMERATION) || prose.match(ORDINAL_CHAIN);
    const next = blocks[i + 1];
    const handedOff = next && isStructural(next.text);

    // A lede naming what the guide covers is the intended form, even though the
    // structure that carries those items is sections away.
    if (cue && !isLede && words >= ENUM_WORDS && !handedOff) {
      findings.push({
        file,
        line: block.line,
        why: `names a set ("${cue[0].trim()}") and carries the items in the same ${words}-word paragraph`,
        fix: 'give the items a table, list, or bold-led block, and cut this paragraph to the announcement',
      });
    } else if (!isLede && words >= LONG_WORDS) {
      findings.push({
        file,
        line: block.line,
        why: `${words}-word paragraph`,
        fix: 'break at each new idea, or convert the part that has a shape',
      });
    }
  });
}

if (findings.length) {
  console.log(`layout-check: ${findings.length} paragraph(s) worth a second look (advisory, never blocks a build)`);
  for (const f of findings) {
    console.log(`  ${f.file}:${f.line} ${f.why}`);
    console.log(`      fix: ${f.fix}`);
  }
} else {
  console.log('layout-check: clean');
}
