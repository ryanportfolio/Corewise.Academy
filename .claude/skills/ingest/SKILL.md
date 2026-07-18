---
description: Ingest a YouTube source into a CoreWise Academy guide — transcript, notes, MDX draft, source log, review PR (never publishes). Use when the user says /ingest, gives a YouTube URL to build a guide from, or asks to add a guide from a video.
---

# Ingest — turn a watched video into a reviewed guide

This is the internal, editor-only content pipeline for CoreWise Academy. It never
publishes: the pull request IS the editorial review step, and merging is publishing.
Follow it end to end so guides stay consistent across sessions.

Input: one or more YouTube URLs in `$ARGUMENTS` or the message. If none given, ask
which video to ingest.

## Non-negotiables

- **Never publish directly.** Output is always a pull request. Do not set a guide's
  `status: published` and merge it yourself; the editor decides that on review.
- **Original synthesis, never reproduction.** A guide is a multi-source synthesis in
  the publication's own voice — not a transcript summary, not a retelling of one
  video. Quotes are short (under ~15 words), attributed, and timestamped.
- **Every source is credited** by creator, video link, and timestamps, and logged in
  the source registry.
- **The editorial bar:** a video qualifies only if the editor personally learned from
  it. If that is unclear, ask before ingesting.
- **Em dashes are BANNED on the site.** Editor's standing rule, zero exceptions: no
  em dash anywhere in a guide (prose, frontmatter description, objectives, self-check
  answers, pull-quote text). Use a period, comma, colon, or parentheses; label-style
  separators use " · ". `npm run build` fails on any em dash in `site/src`
  (`scripts/no-em-dash.mjs`), so a violation cannot ship, but write clean from the
  start instead of leaning on the gate. Sweep the finished draft for the character
  before Step 6.
- **Titles are plain and specific, never cryptic.** The title says what the reader
  gets, in plain words, before any wordplay. Test: a reader who has not opened the
  guide can say what it is about from the title alone; if decoding requires the
  body, retitle. Evocative only on top of specific ("Give your agent a memory"
  works; "The firmament moved" fails). No terms of art carrying a title. The
  description is a concrete promise, not atmosphere. Slug matches the title. Full
  ruling in `.claude/reference/copy-rules.md`.
- **Plain language, fewer words.** Say what it is, not what it is not (no
  "Synthesis, not summary" headings). Lead with the point; cut wind-ups. No
  ten-dollar words ("andragogy"), no talking down to the reader, theme never
  over clarity. Full ruling in `.claude/reference/copy-rules.md`.
- **Cross-link every real overlap.** When the draft touches a topic another guide
  covers, link that guide inline at the mention, title as link text. Run a
  cross-link check against the catalogue before Step 6.
- **Self-contained, tic-free, provenance-honest.** Every passage must land for a
  first-time reader with no private context (show the referenced artifact or cut
  the passage). Sweep the finished draft for word tics: an abstract word repeated
  across the piece marks sentences to rewrite as concrete statements. Claims
  about how something was made are facts; methods distilled afterward are
  disclosed as such. Full rulings: `.claude/reference/copy-rules.md`.

## Step 1: Get the transcript

Run `node scripts/transcript.mjs "<youtube-url>"`.

The script tries yt-dlp first (manual subtitles preferred, then auto-generated) and
falls back to a dependency-free watch-page fetch if yt-dlp is not installed. With
yt-dlp on PATH this succeeds for nearly any captioned video.

- If it prints a timestamped transcript, use it. The header line says whether the
  captions were auto-generated — treat auto captions as lossy: verify names, numbers,
  and technical terms against the video before quoting them.
- If it exits with "No transcript available", ask the editor to paste a transcript.
  Do not fabricate one. Do not proceed without the actual words of the video.

Capture the creator name, channel, video title, and URL for crediting.

## Step 2: Synthesize structured notes

From the transcript, extract (in your own words, not the video's phrasing):

- **Concepts** — the load-bearing ideas, each with the timestamp where it's made.
- **Prerequisites** — what a learner must already know for this to land.
- **Misconceptions** — what the video corrects or warns against.
- **Exercises** — anything hands-on the learner could do to practice.
- **Quotes** — at most a few short, quotable lines, each with its timestamp.

## Step 3: Read the curriculum, then decide placement

Read `site/src/data/tracks.ts` (the five fixed tracks and three levels) and the
existing guides in `site/src/content/guides/`. Then decide:

- **New guide** — the material is a distinct lesson not yet covered.
- **Extend an existing guide** — it deepens or corrects one that exists.
- **Split across several** — it spans more than one lesson or level.

Pick the track, the level (Broad / Practitioner / Deep), and — if part of a course —
the `courseSlug` and `courseOrder`. Assign the next catalogue `number`.

## Step 4: Draft or update the MDX

Write to `site/src/content/guides/<slug>.mdx`. Match the guide anatomy exactly, in
this order, using the existing sample guide as the structural reference:

1. **Objective box** — "Upon leaving this room, you can…" with measurable
   Bloom's-taxonomy verbs (Estimate, Restructure, Diagnose, Compare, Build…), never
   "understand" or "learn about". Frontmatter `objectives`.
2. **Prerequisites** — links to prior guides (`prerequisites` frontmatter).
3. **Distilled lesson body** — the original synthesis. Open with a `<p class="lede">`
   for the drop cap. Number sections with `## <span class="sec-no">01</span>Title`.
4. **Pull quotes** — `<PullQuote>` with creator, video, href, and timestamp.
5. **"Try this now" exercise** — `<Exercise>` with an ordered list.
6. **Self-check** — exactly 3 questions with reveal answers (`selfCheck` frontmatter).
7. **Sources** — every source video in `sources` frontmatter (url, creator, video,
   timestamps, watched).

Set `status: draft` (or `review`) and `lastUpdated` to today. Fill every required
field in the schema at `site/src/content.config.ts`.

YAML gotcha (has bitten twice): any frontmatter string containing `: ` (a colon
followed by a space) — titles, objectives, self-check answers — must be quoted, or
the build fails with "bad indentation of a mapping entry". When in doubt,
single-quote the whole scalar.

Multi-source rule: if the guide draws on more than one video, weave them — do not
section the guide by source. The reader should see one lesson, not a playlist.

## Step 5: Update the source registry

Add a row to `content/sources.md` for each ingested video: date watched, creator /
channel, video title + link, and a one-line note on why it qualified.

## Step 6: Verify the build

Run `npm run build` in `site/`. It must pass — the content schema will reject a guide
with missing or malformed frontmatter. Fix any error before opening the PR.

## Step 7: Open the pull request

Branch (never commit to `main`), commit the new/updated MDX plus the registry change,
push, and open a PR describing: which video(s), the placement decision and why, and
whether this is a new guide or an edit. State in the PR body that it awaits editorial
review and that merging is publishing.

## Anti-patterns

- Don't publish or merge — the editor does that on review.
- Don't summarize a single video — synthesize across sources in the house voice.
- Don't invent a transcript, a quote, a timestamp, or a source. If you don't have the
  words, ask for them.
- Don't use vague objectives ("understand X"). Only observable, checkable verbs.
- Don't ship a cryptic title. Plain and specific first; wordplay only on top.
- Don't use em dashes anywhere, and don't substitute lookalikes (en dash, double
  hyphen). Plain punctuation only; the build gate will reject the PR otherwise.
- Don't skip the registry row or the build check.
- Don't reshape the guide anatomy or invent new section types — consistency across
  guides is the point.
