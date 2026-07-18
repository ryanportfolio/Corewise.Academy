// Build gate: headings must fit on one line at the rendered desktop size.
// Caps are derived from browser measurement at 1280px (2026-07-18):
// the guide h1 is sized so a 41-char title fits one line; section h2s fit up to ~32 chars.
// If a longer heading is genuinely needed, shorten the words, not the font (copy-rules.md).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const GUIDES_DIR = new URL('../src/content/guides/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const TITLE_MAX = 41;
const SECTION_MAX = 32;

let failed = false;
for (const file of readdirSync(GUIDES_DIR)) {
  if (!file.endsWith('.mdx')) continue;
  const text = readFileSync(join(GUIDES_DIR, file), 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const title = line.match(/^title:\s*['"]?(.+?)['"]?\s*$/);
    if (title && title[1].length > TITLE_MAX) {
      console.error(`${file}:${i + 1} title is ${title[1].length} chars (max ${TITLE_MAX}): ${title[1]}`);
      failed = true;
    }
    const sec = line.match(/^##\s*<span class="sec-no">\d+<\/span>(.+)$/);
    if (sec && sec[1].length > SECTION_MAX) {
      console.error(`${file}:${i + 1} section heading is ${sec[1].length} chars (max ${SECTION_MAX}): ${sec[1]}`);
      failed = true;
    }
  });
}

if (failed) {
  console.error('heading-length: FAIL — a heading this long wraps to a second line at desktop width.');
  process.exit(1);
}
console.log('heading-length: clean');
