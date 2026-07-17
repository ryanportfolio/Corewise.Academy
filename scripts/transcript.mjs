#!/usr/bin/env node
// Fetch a YouTube transcript for a given video URL and print it to stdout.
//
//   node scripts/transcript.mjs "https://www.youtube.com/watch?v=VIDEO_ID"
//   node scripts/transcript.mjs VIDEO_ID
//
// No dependencies — it reads the caption track YouTube already ships with the
// watch page. If the video has no captions (many don't), it says so clearly and
// exits non-zero, so the ingest workflow knows to ask the editor to paste one.
//
// Reliability note: YouTube increasingly gates caption URLs behind a
// player-generated token, so bare server-side fetch fails for many videos even
// when captions exist. When it does, the paste fallback is the intended path.
// For a more reliable fetch, install yt-dlp and run:
//   yt-dlp --skip-download --write-auto-subs --sub-format vtt --sub-langs en -o - <url>
// Adding an npm transcript library is possible too, but that is a dependency the
// editor should approve first.

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

function stamp(seconds) {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

async function getText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

const NO_CAPTIONS = (extra = '') => {
  console.error(`No transcript available for video ${id}.${extra ? ' ' + extra : ''}`);
  console.error('Ask the editor to paste a transcript, or pick a video that has captions.');
  process.exit(1);
};

try {
  const watch = await getText(`https://www.youtube.com/watch?v=${id}`);

  // The player response embedded in the watch page lists caption tracks.
  const m = watch.match(/"captionTracks":(\[.*?\])/);
  if (!m) NO_CAPTIONS('This video has no caption tracks.');

  let tracks;
  try {
    tracks = JSON.parse(m[1]);
  } catch {
    NO_CAPTIONS('Could not parse caption track list.');
  }
  if (!tracks.length) NO_CAPTIONS('This video has no caption tracks.');

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

  if (!lines.length) NO_CAPTIONS('The caption track was empty.');

  const auto = pick.kind === 'asr' ? ' (auto-generated)' : '';
  console.error(`# Transcript for https://www.youtube.com/watch?v=${id} [${pick.languageCode}${auto}]`);
  for (const l of lines) if (l.text) console.log(`[${stamp(l.t)}] ${l.text}`);
} catch (err) {
  console.error(`Failed to fetch transcript: ${err.message}`);
  process.exit(1);
}
