// Generate "listen to this guide" narration for every published guide.
//
// Usage:  OPENAI_API_KEY=sk-... node scripts/generate-audio.mjs [--force] [--dry-run] [guide-id ...]
//         --dry-run prints the extracted narration text without calling the API (no key needed).
//
// For each published guide in src/content/guides/, this extracts the speakable
// prose (frontmatter, imports, JSX tags, and code blocks stripped), sends it to
// OpenAI's gpt-4o-mini-tts in paragraph-aligned chunks, and writes
// public/audio/<guide-id>.mp3 plus a hash manifest at src/data/audioManifest.json.
// Guides whose narration text is unchanged since the last run are skipped, so
// re-running after editing one guide only bills for that guide.

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GUIDES_DIR = join(ROOT, 'src', 'content', 'guides');
const AUDIO_DIR = join(ROOT, 'public', 'audio');
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'audioManifest.json');

const MODEL = 'gpt-4o-mini-tts';
const VOICE = 'ash';
const INSTRUCTIONS =
  'You are narrating a short written technology guide for an audio version of the page. ' +
  'Calm, measured, unhurried. Plain delivery, no dramatization. ' +
  'Brief pause at paragraph breaks; slightly longer pause before a section heading.';
// The API caps input around 2,000 tokens; 2,800 chars of prose stays safely under it.
const MAX_CHUNK_CHARS = 2800;

const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const onlyIds = args.filter((a) => !a.startsWith('--'));

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY && !dryRun) {
  console.error('OPENAI_API_KEY is not set. Aborting before any request is made.');
  process.exit(1);
}

// ---------- text extraction ----------

function frontmatterField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(['"]?)(.+?)\\1\\s*$`, 'm'));
  return m ? m[2] : '';
}

function decodeEntities(s) {
  return s
    .replace(/&ensp;|&emsp;|&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&mdash;|&ndash;/g, ', ');
}

// Turn one guide's MDX into plain narration text.
function narrationText(raw) {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const fm = fmMatch ? fmMatch[1] : '';
  let body = fmMatch ? raw.slice(fmMatch[0].length) : raw;

  const title = frontmatterField(fm, 'title');

  body = body
    .replace(/^import .*$/gm, '')
    // decorative chalkboard line: skip
    .replace(/<Chalk>[\s\S]*?<\/Chalk>/g, '')
    // spoken stand-in for code, which reads terribly aloud
    .replace(/```[\s\S]*?```/g, '\nThere is a code example at this point; see the page.\n')
    // announce the exercise panel, keep its steps
    .replace(/<Exercise([^>]*)>/g, (_, attrs) => {
      const t = attrs.match(/title=["']([^"']+)["']/);
      return `\n${t ? t[1] : 'Field exercise'}.\n`;
    })
    .replace(/<\/Exercise>/g, '\n');

  const lines = [];
  for (let line of body.split('\n')) {
    const heading = line.match(/^#{2,4}\s+(.*)$/);
    if (heading) {
      let h = heading[1].replace(/<[^>]+>[^<]*<\/[^>]+>/g, '').replace(/<[^>]+>/g, '').trim();
      if (h) lines.push('', `${h}.`, '');
      continue;
    }
    // markdown table rows: separator lines vanish, cells become a spoken list
    if (/^\s*\|.*\|\s*$/.test(line)) {
      if (/^[\s|:-]+$/.test(line)) continue;
      line = line
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean)
        .join(', ') + '.';
    }
    lines.push(line);
  }
  body = lines.join('\n');

  body = body
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // markdown links: keep text
    .replace(/<[^>]+>/g, '') // any remaining HTML/JSX tags
    .replace(/^\s*[-*]\s+/gm, '') // list markers
    .replace(/^\s*\d+\.\s+/gm, '') // ordered list markers
    .replace(/^\s*>\s*/gm, '') // blockquote markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');

  body = decodeEntities(body)
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return `${title}.\n\nA CoreWise Academy guide.\n\n${body}`;
}

// Split narration into chunks at paragraph boundaries, sentences as fallback.
function chunkText(text) {
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let current = '';
  const push = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };
  for (const p of paragraphs) {
    if (p.length > MAX_CHUNK_CHARS) {
      push();
      let piece = '';
      for (const sentence of p.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [p]) {
        if (piece.length + sentence.length > MAX_CHUNK_CHARS) {
          chunks.push(piece.trim());
          piece = '';
        }
        piece += sentence;
      }
      if (piece.trim()) chunks.push(piece.trim());
      continue;
    }
    if (current.length + p.length + 2 > MAX_CHUNK_CHARS) push();
    current += (current ? '\n\n' : '') + p;
  }
  push();
  return chunks;
}

// ---------- OpenAI call ----------

async function speak(input) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        voice: VOICE,
        input,
        instructions: INSTRUCTIONS,
        response_format: 'mp3',
      }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const detail = await res.text();
    if (res.status === 429 || res.status >= 500) {
      const wait = attempt * 5000;
      console.warn(`  retry ${attempt}/3 after ${res.status}: waiting ${wait / 1000}s`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    throw new Error(`TTS request failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  throw new Error('TTS request failed after 3 attempts (rate limit or server errors).');
}

// ---------- main ----------

const manifest = existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) : {};
mkdirSync(AUDIO_DIR, { recursive: true });

const files = readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.mdx'));
let generated = 0;
let skipped = 0;
let totalChars = 0;

for (const file of files) {
  const id = file.replace(/\.mdx$/, '');
  if (onlyIds.length && !onlyIds.includes(id)) continue;

  const raw = readFileSync(join(GUIDES_DIR, file), 'utf8').replace(/\r\n/g, '\n');
  if (!/^status:\s*published\s*$/m.test(raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '')) continue;

  const text = narrationText(raw);
  const hash = createHash('sha256').update(`${MODEL}|${VOICE}|${INSTRUCTIONS}|${text}`).digest('hex');
  const outPath = join(AUDIO_DIR, `${id}.mp3`);

  if (!force && manifest[id]?.hash === hash && existsSync(outPath)) {
    skipped++;
    continue;
  }

  const chunks = chunkText(text);
  console.log(`${id}: ${text.length} chars in ${chunks.length} chunk(s)`);
  if (dryRun) {
    console.log('---\n' + text + '\n---');
    totalChars += text.length;
    continue;
  }
  const parts = [];
  for (let i = 0; i < chunks.length; i++) {
    process.stdout.write(`  chunk ${i + 1}/${chunks.length}...`);
    parts.push(await speak(chunks[i]));
    process.stdout.write(' done\n');
  }
  const mp3 = Buffer.concat(parts);
  writeFileSync(outPath, mp3);
  manifest[id] = {
    hash,
    voice: VOICE,
    model: MODEL,
    bytes: mp3.length,
    chars: text.length,
    generatedAt: new Date().toISOString().slice(0, 10),
  };
  // write after every guide so a crash mid-run loses nothing
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  generated++;
  totalChars += text.length;
}

console.log(
  `\nDone. Generated ${generated}, skipped ${skipped} unchanged. ` +
    `${totalChars.toLocaleString()} chars sent (~$${((totalChars / 1e6) * 15).toFixed(2)} est.).`,
);
