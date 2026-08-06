// The README's plate of the catalogue, engraved from guide frontmatter.
// One star per published guide; positions hash from the catalogue number the
// same way the site's index plate does, so the two never disagree and the
// output is byte identical for the same data.
//
//   node scripts/readme-plate.mjs           regenerate .github/assets/plate-*.svg
//   node scripts/readme-plate.mjs --check   fail loudly if the committed SVGs or
//                                           the README's printed numbers drift
//                                           from frontmatter (CI runs this)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const GUIDES = join(root, 'site', 'src', 'content', 'guides');
const ASSETS = join(root, '.github', 'assets');
const README = join(root, 'README.md');

// ---- Read the catalogue --------------------------------------------------
const fm = (text) => text.split('---')[1] ?? '';
const field = (block, key) => block.match(new RegExp(`^${key}: *(.*)$`, 'm'))?.[1].trim() ?? null;

const guides = readdirSync(GUIDES)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => {
    const block = fm(readFileSync(join(GUIDES, f), 'utf8'));
    return {
      file: f,
      title: field(block, 'title'),
      track: field(block, 'track'),
      level: field(block, 'level'),
      number: Number(field(block, 'number')),
      minutes: Number(field(block, 'minutes')),
      status: field(block, 'status'),
      lastUpdated: new Date(field(block, 'lastUpdated')),
      original: /sources: \[\]/.test(block),
    };
  })
  .filter((g) => g.status === 'published');

// Same ordering the site's catalogue sheet uses: newest first.
const sheet = [...guides].sort((a, b) => +b.lastUpdated - +a.lastUpdated || b.number - a.number);
const newest = sheet[0];

const stats = {
  count: guides.length,
  minutes: guides.reduce((s, g) => s + g.minutes, 0),
  sourced: guides.filter((g) => !g.original).length,
  original: guides.filter((g) => g.original).length,
  nMin: Math.min(...guides.map((g) => g.number)),
  nMax: Math.max(...guides.map((g) => g.number)),
};

// ---- Shared conventions (mirrors site/src/pages/index.astro) -------------
// Deterministic hash of the catalogue number: same mix the index plate uses,
// so a star sits where its number says and nowhere else.
const noise = (n, salt) => {
  let h = Math.imul(n + salt * 977 + 1, 2654435761) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  return h / 4294967296;
};
// Depth encodes as radius, same constants as the site plate.
const LEVEL_R = { broad: 1.9, practitioner: 2.5, deep: 3.2 };
// The house star, lifted from the site so both plates use one glyph.
const STAR_D = 'M12 0 L14.88 9.12 L24 12 L14.88 14.88 L12 24 L9.12 14.88 L0 12 L9.12 9.12 Z';
const starAt = (x, y, size) =>
  `translate(${(x - size / 2).toFixed(2)} ${(y - size / 2).toFixed(2)}) scale(${(size / 24).toFixed(4)})`;

// Five clusters left to right in curriculum order. Constellation names are the
// real ones from site/src/data/tracks.ts.
const CLUSTERS = [
  { slug: 'foundations', numeral: 'I', name: 'THE LENS', cx: 120, cy: 258, rx: 46, ry: 52 },
  { slug: 'prompting', numeral: 'II', name: 'THE LOOM', cx: 330, cy: 218, rx: 62, ry: 62 },
  { slug: 'agents', numeral: 'III', name: 'THE COURIER', cx: 520, cy: 240, rx: 88, ry: 74 },
  { slug: 'building', numeral: 'IV', name: 'THE FORGE', cx: 712, cy: 150, rx: 44, ry: 46 },
  { slug: 'practice', numeral: 'V', name: 'THE METRONOME', cx: 880, cy: 112, rx: 54, ry: 48 },
];

// Deterministic de-overlap: fixed iteration order, fixed step, no randomness,
// so two stars never fuse into one blob and builds stay byte identical.
const separate = (stars) => {
  for (let pass = 0; pass < 60; pass++) {
    let moved = false;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const a = stars[i];
        const b = stars[j];
        const need = a.r + b.r + 1.4;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.001;
        if (d < need) {
          const push = (need - d) / 2;
          const ux = dx / d;
          const uy = dy / d;
          a.x -= ux * push;
          a.y -= uy * push;
          b.x += ux * push;
          b.y += uy * push;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  for (const s of stars) {
    s.x = +s.x.toFixed(1);
    s.y = +s.y.toFixed(1);
  }
};

const W = 1000;
const H = 430;

const monthYear = (d) =>
  `${d.toLocaleString('en', { month: 'long', timeZone: 'UTC' })} ${d.getUTCFullYear()}`;

// ---- Engrave one impression ----------------------------------------------
const impression = ({ paper, ink, soft, mute, accent, lineO, starO }) => {
  const el = [];
  el.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${paper}"/>`);
  // Sheet rules: outer border and inner hairline, like a printed plate.
  el.push(`<rect x="8" y="8" width="${W - 16}" height="${H - 16}" fill="none" stroke="${ink}" stroke-width="1.2"/>`);
  el.push(`<rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="${ink}" stroke-opacity="${lineO}" stroke-width="0.7"/>`);

  // The spine: one dashed line through the five clusters, curriculum order.
  const spine = CLUSTERS.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.cx} ${c.cy}`).join(' ');
  el.push(`<path d="${spine}" fill="none" stroke="${ink}" stroke-opacity="${lineO}" stroke-width="0.9" stroke-dasharray="1 5"/>`);

  // Stars: one per published guide, hashed into its layer's cluster.
  let newestStar = null;
  for (const c of CLUSTERS) {
    const members = guides.filter((g) => g.track === c.slug);
    const stars = members.map((g) => {
      const a = noise(g.number, 1) * Math.PI * 2;
      const d = Math.sqrt(noise(g.number, 2));
      return {
        g,
        x: c.cx + Math.cos(a) * d * c.rx,
        y: c.cy + Math.sin(a) * d * c.ry,
        r: g === newest ? 7.5 : LEVEL_R[g.level] ?? 2.2,
      };
    });
    separate(stars);
    for (const s of stars) {
      const o = +(starO + noise(s.g.number, 3) * 0.35).toFixed(2);
      if (s.g === newest) {
        newestStar = { x: s.x, y: s.y };
        el.push(`<path d="${STAR_D}" transform="${starAt(s.x, s.y, 15)}" fill="${accent}"/>`);
      } else {
        el.push(`<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="${ink}" fill-opacity="${o}"/>`);
      }
    }
    // Cluster caption on the bottom band.
    el.push(`<text x="${c.cx}" y="382" text-anchor="middle" font-size="11.5" letter-spacing="1.5" fill="${soft}">${c.numeral} · ${c.name}</text>`);
    el.push(`<text x="${c.cx}" y="399" text-anchor="middle" font-size="10" letter-spacing="1" fill="${soft}">${members.length} ${members.length === 1 ? 'GUIDE' : 'GUIDES'}</text>`);
  }

  // Leader to the newest star: the one label the plate calls out.
  if (newestStar) {
    const lx = newestStar.x + 14;
    const ly = newestStar.y - 14;
    el.push(`<path d="M ${newestStar.x + 6} ${newestStar.y - 6} L ${lx} ${ly}" stroke="${ink}" stroke-opacity="0.55" stroke-width="0.7" fill="none"/>`);
    el.push(`<text x="${lx + 4}" y="${ly + 3}" font-size="10.5" letter-spacing="1" fill="${accent}">Nº ${String(newest.number).padStart(3, '0')} · NEWEST</text>`);
  }

  // Cartouche, top left: what an atlas prints in the corner of a plate.
  // Hierarchy: title, then the payload stat line, then provenance a shade down.
  const cart = [
    ['COREWISE ACADEMY', 15, 2.8, ink, 600],
    ['PLATE OF THE CATALOGUE', 10.5, 2, soft, 400],
    [`${stats.count} GUIDES · ${stats.minutes} MINUTES OF READING`, 11.5, 1.2, ink, 600],
    ['SURVEYED FROM GUIDE FRONTMATTER', 9.5, 1, mute, 400],
    [`ENGRAVED BY scripts/readme-plate.mjs · CORRECTED TO ${monthYear(newest.lastUpdated).toUpperCase()}`, 9.5, 1, mute, 400],
  ];
  let cy = 46;
  for (const [t, size, ls, fill, weight] of cart) {
    el.push(`<text x="34" y="${cy}" font-size="${size}" letter-spacing="${ls}" fill="${fill}" font-weight="${weight}">${t}</text>`);
    cy += size >= 15 ? 22 : size >= 11 ? 18 : 15;
  }
  // The key, bottom of the cartouche block. Every mark on the plate is named here.
  el.push(`<text x="34" y="${cy + 4}" font-size="10" letter-spacing="1" fill="${soft}">ONE STAR = ONE PUBLISHED GUIDE · LARGER = DEEPER</text>`);
  el.push(`<text x="34" y="${cy + 20}" font-size="10" letter-spacing="1" fill="${soft}">THE DOTTED PATH WALKS THE FIVE LAYERS IN ORDER</text>`);
  // Checker's credit, bottom right: the other half of the provenance.
  el.push(`<text x="${W - 34}" y="336" text-anchor="end" font-size="9.5" letter-spacing="1" fill="${mute}">CHECKED BY scripts/readme-plate.mjs --check</text>`);
  el.push(`<text x="${W - 34}" y="351" text-anchor="end" font-size="9.5" letter-spacing="1" fill="${mute}">CI FAILS WHEN SKY AND PAGE DISAGREE</text>`);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Chart of the CoreWise Academy catalogue: ${stats.count} published guides as stars in five constellations, one per curriculum layer.">`,
    `<g font-family="ui-monospace, 'IBM Plex Mono', SFMono-Regular, Menlo, monospace">`,
    ...el,
    '</g>',
    '</svg>',
    '',
  ].join('\n');
};

const LIGHT = impression({ paper: '#f3efe4', ink: '#1c1914', soft: '#574f43', mute: '#6f6656', accent: '#1c31a4', lineO: 0.16, starO: 0.55 });
const DARK = impression({ paper: '#121420', ink: '#e8e4d8', soft: '#a9a496', mute: '#84806f', accent: '#96a8ff', lineO: 0.16, starO: 0.6 });

// ---- Generate or check ---------------------------------------------------
const lf = (s) => s.replace(/\r\n/g, '\n');
const failures = [];

if (process.argv.includes('--check')) {
  for (const [name, want] of [['plate-light.svg', LIGHT], ['plate-dark.svg', DARK]]) {
    let have = '';
    try {
      have = lf(readFileSync(join(ASSETS, name), 'utf8'));
    } catch {
      failures.push(`${name}: missing. Run node scripts/readme-plate.mjs`);
      continue;
    }
    if (have !== want) failures.push(`${name}: stale. Frontmatter changed; run node scripts/readme-plate.mjs`);
  }

  const readme = lf(readFileSync(README, 'utf8'));
  // Every number the README prints about the catalogue, checked at the source.
  const claims = [
    [`${stats.count} guides`, 'guide count'],
    [`${stats.count} published guides`, 'guide count in the image alt text'],
    [`${stats.minutes} minutes`, 'total reading minutes'],
    [`${stats.sourced} of them credit`, 'sourced-guide count'],
    [`${stats.original} are original`, 'original-guide count'],
  ];
  for (const c of CLUSTERS) {
    const n = guides.filter((g) => g.track === c.slug).length;
    claims.push([new RegExp(`${c.name}[^\\n]*\\b${n}\\b`), `${c.name} row count`]);
  }
  for (const [needle, what] of claims) {
    const ok = needle instanceof RegExp ? needle.test(readme) : readme.includes(needle);
    if (!ok) failures.push(`README.md: ${what} does not match frontmatter (expected ${needle})`);
  }

  // The site's em dash ban holds on the repo's public face too.
  for (const [label, text] of [['README.md', readme], ['plate-light.svg', LIGHT], ['plate-dark.svg', DARK]]) {
    const line = text.split('\n').findIndex((l) => l.includes('—'));
    if (line !== -1) failures.push(`${label}:${line + 1}: em dash. Replace with plain punctuation.`);
  }

  if (failures.length) {
    console.error(`readme-plate check failed (${failures.length}):`);
    for (const f of failures) console.error('  ' + f);
    process.exit(1);
  }
  console.log(`readme-plate: clean (${stats.count} stars, light and dark SVGs, README claims match)`);
} else {
  writeFileSync(join(ASSETS, 'plate-light.svg'), LIGHT);
  writeFileSync(join(ASSETS, 'plate-dark.svg'), DARK);
  console.log(`engraved ${stats.count} stars into .github/assets/plate-{light,dark}.svg`);
}
