#!/usr/bin/env node
// Fetch a YouTube transcript for a given video URL and print it to stdout.
//
//   node scripts/transcript.mjs "https://www.youtube.com/watch?v=VIDEO_ID"
//   node scripts/transcript.mjs VIDEO_ID
//
// Strategy, most reliable first:
//   1. yt-dlp, if it is on PATH (manual subtitles preferred, then auto-generated).
//   2. Zero-dependency fallback: read the caption track the YouTube watch page
//      embeds. YouTube often gates these URLs behind a player token, so this
//      path fails for many videos even when captions exist.
//   3. Neither worked -> exit non-zero with a clear message, so the ingest
//      workflow knows to ask the editor to paste a transcript.
//
// Output format either way: one line per caption, "[m:ss] text" on stdout;
// diagnostics on stderr.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const raw = process.argv[2];
if (!raw) {
  console.error('Usage: node scripts/transcript.mjs <youtube-url-or-id>');
  process.exit(2);
}

function videoId(input) {
  // bare 11-char id
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const u = new URL(input);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    // /shorts/ID, /embed/ID, /live/ID
    const m = u.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{11})/);
    if (m) return m[1];
  } catch {
    /* not a URL */
  }
  return null;
}

const id = videoId(raw);
if (!id) {
  console.error(`Could not parse a YouTube video id from: ${raw}`);
  process.exit(2);
}
const watchUrl = `https://www.youtube.com/watch?v=${id}`;

function stamp(seconds) {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

function printLines(lines, sourceNote) {
  console.error(`# Transcript for ${watchUrl} ${sourceNote}`);
  for (const l of lines) if (l.text) console.log(`[${stamp(l.t)}] ${l.text}`);
}

// ---------------------------------------------------------------- yt-dlp path

function haveYtDlp() {
  return spawnSync('yt-dlp', ['--version'], { stdio: 'ignore', shell: false }).status === 0;
}

// Parse YouTube's json3 caption format: { events: [{ tStartMs, segs: [{utf8}] }] }.
function parseJson3(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const lines = [];
  for (const ev of data.events ?? []) {
    if (!ev.segs) continue;
    const text = ev.segs
      .map((s) => s.utf8 ?? '')
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) lines.push({ t: (ev.tStartMs ?? 0) / 1000, text });
  }
  return lines;
}

// Prefer an exact-language file (video.en.json3) over auto-translated variants
// (video.en-de.json3 = English translated from German).
function pickSubFile(dir, base) {
  const files = fs.readdirSync(dir).filter((f) => f.startsWith(base + '.') && f.endsWith('.json3'));
  if (!files.length) return null;
  files.sort((a, b) => a.length - b.length); // "en" beats "en-US" beats "en-de"
  const exact = files.find((f) => /\.en\.json3$/.test(f));
  return path.join(dir, exact ?? files[0]);
}

function tryYtDlp() {
  if (!haveYtDlp()) return null;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cw-transcript-'));
  try {
    // Two passes: manual subtitles first, auto-generated only if none exist.
    for (const [flag, note] of [
      ['--write-subs', ''],
      ['--write-auto-subs', ' (auto-generated)'],
    ]) {
      const base = flag === '--write-subs' ? 'manual' : 'auto';
      const run = spawnSync(
        'yt-dlp',
        [
          '--skip-download',
          flag,
          '--sub-langs',
          'en.*',
          '--sub-format',
          'json3',
          '-o',
          path.join(dir, `${base}.%(ext)s`),
          watchUrl,
        ],
        { encoding: 'utf8', shell: false, timeout: 120_000 },
      );
      if (run.status !== 0) {
        console.error(`yt-dlp exited ${run.status}: ${(run.stderr || '').trim().split('\n').pop()}`);
        continue;
      }
      const file = pickSubFile(dir, base);
      if (!file) continue;
      const lines = parseJson3(file);
      if (lines.length) return { lines, note: `[yt-dlp${note}]` };
    }
    return null;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// ------------------------------------------------- zero-dependency fallback

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36';

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}

async function getText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

async function tryWatchPage() {
  const watch = await getText(watchUrl);

  // The player response embedded in the watch page lists caption tracks.
  const m = watch.match(/"captionTracks":(\[.*?\])/);
  if (!m) return null;

  let tracks;
  try {
    tracks = JSON.parse(m[1]);
  } catch {
    return null;
  }
  if (!tracks.length) return null;

  // Prefer a manually-made English track; fall back to auto/any.
  const pick =
    tracks.find((t) => t.languageCode?.startsWith('en') && t.kind !== 'asr') ||
    tracks.find((t) => t.languageCode?.startsWith('en')) ||
    tracks[0];

  const xml = await getText(pick.baseUrl.replace(/\\u0026/g, '&'));
  const lines = [...xml.matchAll(/<text start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)].map((mm) => ({
    t: parseFloat(mm[1]),
    text: decodeEntities(mm[2].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim(),
  }));
  if (!lines.length) return null;

  const auto = pick.kind === 'asr' ? ' (auto-generated)' : '';
  return { lines, note: `[${pick.languageCode}${auto}]` };
}

// -------------------------------------------------------------------- main

try {
  const viaYtDlp = tryYtDlp();
  if (viaYtDlp) {
    printLines(viaYtDlp.lines, viaYtDlp.note);
    process.exit(0);
  }
  console.error(haveYtDlp() ? 'yt-dlp found no caption track; trying watch-page fallback…' : 'yt-dlp not on PATH; trying watch-page fallback…');

  const viaWatch = await tryWatchPage();
  if (viaWatch) {
    printLines(viaWatch.lines, viaWatch.note);
    process.exit(0);
  }

  console.error(`No transcript available for video ${id}.`);
  console.error('Ask the editor to paste a transcript, or pick a video that has captions.');
  process.exit(1);
} catch (err) {
  console.error(`Failed to fetch transcript: ${err.message}`);
  process.exit(1);
}
