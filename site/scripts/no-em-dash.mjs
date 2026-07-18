// Editorial gate: em dashes (U+2014) are banned everywhere on the site.
// Runs before every build (npm run build), so a violation can never deploy.
// Scans all text sources under src/; prints file:line:col for each hit.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'src');
const TEXT_EXT = /\.(astro|mdx|md|ts|js|mjs|css|json|svg|txt)$/;
const EM_DASH = '—';

const hits = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (TEXT_EXT.test(name)) {
      const lines = readFileSync(p, 'utf8').split('\n');
      lines.forEach((line, i) => {
        let col = line.indexOf(EM_DASH);
        while (col !== -1) {
          hits.push(`${relative(root, p)}:${i + 1}:${col + 1}  ${line.trim().slice(0, 80)}`);
          col = line.indexOf(EM_DASH, col + 1);
        }
      });
    }
  }
};
walk(root);

if (hits.length) {
  console.error(`Em dash ban violated: ${hits.length} occurrence(s) in src/. Replace with plain punctuation (comma, colon, period, parentheses) or a middot separator.`);
  for (const h of hits) console.error('  ' + h);
  process.exit(1);
}
console.log('no-em-dash: clean');
