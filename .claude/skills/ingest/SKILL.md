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
  during the Step 6 writing pass.
- **Titles are plain and specific, never cryptic.** The title says what the reader
  gets, in plain words, before any wordplay. Test: a reader who has not opened the
  guide can say what it is about from the title alone; if decoding requires the
  body, retitle. Evocative only on top of specific ("Give your agent a memory"
  works; "The firmament moved" fails). No terms of art carrying a title. The
  description is a concrete promise, not atmosphere. Slug matches the title. Full
  ruling in `.claude/reference/copy-rules.md`.
- **Plain language, fewer words.** Every sentence must land for a smart reader who
  has never worked with AI (the stranger test). Compressed insider shorthand is the
  usual failure: "board state", "move statistics", "attribution graph", "frontier
  model", "token". Describe the observable thing first, then name the concept. Say
  what it is, not what it is not (no "Synthesis, not summary" headings, no negation
  pivots). Lead with the point; cut wind-ups. No ten-dollar words, no invented
  coinages, no talking down, theme never over clarity. Step 6 runs the full pass;
  canonical ruling in `.claude/reference/copy-rules.md`, deeper procedures in the
  writing, plain-words, and stranger-test skills; house voice in
  `.claude/reference/voice.md`.
- **Information with a shape gets that shape.** A guide is not done until the Step 6
  layout pass has run. Prose that names a set ("four failure modes", "three checks")
  hands the items to a table, a list, or bold-led blocks; it never describes them all
  inside the announcing paragraph. This is the single edit that turned a rejected
  wall-of-text draft into the accepted version (editor ruling, 2026-07-24).
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

Run these from the repo root, in this order:

1. Create the scratch folder; it is gitignored, so a fresh clone or worktree lacks it
   and the redirect in the next step fails without it: `mkdir -p .tmp` (bash) or
   `New-Item -ItemType Directory -Force .tmp` (PowerShell).
2. `node scripts/transcript.mjs "<youtube-url>" > .tmp/<video-id>.txt` (stdout is the
   transcript, stderr the diagnostics; the first stderr lines say which fetch path won
   and whether the captions are auto-generated).
3. Use the API's metadata for crediting. If it is missing, read the video page or run:
   `yt-dlp --skip-download --print "%(channel)s | %(title)s | %(upload_date)s | %(duration_string)s" "<youtube-url>"`.
   If `yt-dlp` alone is not on this shell's PATH, reuse the invocation the script
   printed on its `# yt-dlp via:` line; it is already quoted for paths with spaces.
4. Read the saved transcript file in full before synthesizing. A 20-minute video is
   roughly 700 caption lines.

The script tries youtube-transcript.io first when `YOUTUBE_TRANSCRIPT_IO_KEY` is
set, otherwise using `~/.claude/secrets/youtube-transcript-io.key` if present.
Never print the key. A successful response supplies the transcript and video
metadata. An API failure exits 3 and goes straight to browser recovery; respect
any `Retry-After` and do not retry through yt-dlp.

Without a key, the script tries yt-dlp (manual subtitles preferred, then
auto-generated). It looks on PATH, as a Python module, and in Windows Python
Scripts folders before using the watch-page fallback. Do not install dependencies
to retrieve captions.

| Evidence | What to do |
|---|---|
| API exits 3 (no track, quota, authentication, timeout, or service error) | Try browser recovery. Do not infer that the visible transcript is missing. |
| yt-dlp cannot be found | Check `where.exe yt-dlp`, `py -0p`, and installed Python module paths. |
| yt-dlp caption request returns HTTP 429 | Let the helper's bounded client retry finish, then try browser recovery. |
| Script returns no transcript | Try browser recovery. |

Browser recovery:

1. Inspect the exposed browser API and open the video. Try transcript export once
   if available; a failed export does not establish that the visible panel is empty.
2. Expand the description, open **Show transcript**, and read through the final
   segment, loading more as needed. Record coverage and any gaps.
3. If the actual words remain unavailable, ask for the transcript. Do not loop on
   failed clients, switch networks, wait an hour, or draft from the description.

- If it prints a timestamped transcript, use it. The header line says whether the
  captions were auto-generated when known. Treat captions as lossy: verify names,
  numbers, and technical terms before quoting them. Record an unknown caption type
  honestly. Do not fabricate a transcript or proceed without the actual words.

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

## Step 6: Writing review pass

Run a full editorial pass on the finished draft before the build. The build gate only
catches em dashes and heading length; every other writing defect is caught here or
ships. This is the step that stops jargon reaching the live site. Apply the canonical
rules in `.claude/reference/copy-rules.md`, and for anything you are unsure of, run the
matching skill: writing, plain-words, or stranger-test (writing also loads the
house voice in `.claude/reference/voice.md`).

Go through the draft in this order:

1. **Stranger test (the one that bites most).** Read each sentence as a smart reader
   who has never worked with AI. Any word carrying an insider meaning ("board state",
   "move statistics", "attribution graph", "frontier model", "token", "grokking") gets
   rewritten to describe the observable thing first, then name the concept. A real
   example that shipped and was rejected: "An Othello-trained network was found tracking
   the true board state, not just move statistics" reads as noise to an outsider. It
   became: the model was fed only lists of game moves, never shown a board, yet built
   its own picture of where every piece sat.
2. **Plain words, literal claims.** Metaphors never carry the point: a title, heading, or
   claim whose only statement is a metaphor ("Rent the model, own the method", "The pay
   moves to deciding") gets rewritten as the literal version ("Deciding is now the hard
   part"); decoration is welcome only on top of a literal statement, and two-part aphorism
   shapes ("X the A, Y the B") are out. Latinate dress-ups and ten-dollar words lose to the everyday phrase
   (utilize becomes use, subsequent becomes later, prohibition becomes ban). No invented
   coinages; gloss a genuine term of art at first use or replace it.
3. **Negation pivots.** Delete any sentence that denies something nobody claimed before
   pivoting to the point ("not just X, it's Y", "the real question isn't X"), including
   the split-across-two-sentences form. Lead with the positive claim.
4. **AI tells.** Cut delve, robust, seamless, crucial, pivotal, testament, showcase,
   leverage, "serves as", rule-of-three lists, "from X to Y" fake ranges, Title Case
   Headings, sycophantic openers, trailing summaries.
5. **Lead with the point.** If a paragraph's payoff could open it, move it up and cut
   the wind-up.
6. **The layout pass (required).** Paragraphs run 1 to 4 sentences; break at each new
   idea. The defect that gets a draft rejected as "a wall of text" is a paragraph that
   names a set and then swallows the items instead of handing them to a structure:

   - Rejected: "The audit checks three things: routing integrity (...), index truth
     (...), and freshness (...)" — 49 words, no structure.
   - Approved: "The audit runs three checks:" — 5 words, then a three-item list.

   Convert a named set to a table (when the items share dimensions) or a list; a term
   and its meaning to a **bold-led** block; ordered steps to a numbered list; two
   options the reader chooses between to one bold-led block each. Structure only
   genuine structure: a short two-sentence contrast is often right in prose, and
   over-structuring is its own defect. `npm run lint:copy` prints the paragraphs worth
   a second look (advisory, always exits 0, never blocks a build). Full rule in
   `copy-rules.md` ("The layout pass is required, not optional").
7. **Flourish and mechanism.** Cut aphorism capstones, dramatic justifications of
   self-evident rules, and self-praise. When a thing has stages, say what the end state
   buys instead of touring every stop. One example per claim, only when the claim is
   unclear without it.
8. **Death metaphors.** No "die", "dies", "killed" for removal; say the specific verb
   (cut, retired, cancelled, gone).
9. **Word-tic sweep.** Count repeats of abstract nouns and adjectives ("real", "true",
   "trend") and rewrite the sentences that lean on them into concrete statements.
10. **One name per concept.** Pick one word for each thing and repeat it; never rename
    the same idea across the draft. The model-recheck guide called one plot "frontier",
    "efficient edge", "map", and "curve", and called one model variant both "size" and
    "tier", so the reader kept re-learning what was one thing. Covers comparison labels:
    "high effort" against "top effort" for the same setting hides that they match. This
    is the mirror of the word-tic sweep.
11. **Referent check.** Read every "it", "they", "that", "this", and bare "do not" and
    confirm each points to one nameable thing. "Once price is in the picture, they do
    not" shipped with "they" and "do not what" both dangling; name the thing instead.
12. **Headings.** No trailing periods, plain and specific, within the length caps. No
    heading defined by negation ("Bigger is not better per dollar"); state the positive
    claim ("Smaller can win per dollar").

If a passage cannot be made clear for a first-time reader, cut it. Clarity beats coverage.

Run `clarity-pass` on the finished draft as a required independent editorial review.
Actually dispatch a fresh reviewer with no inherited conversation, following that
skill's input limits. Review natural phrasing, sentence usefulness, and whole-piece
fit. Evaluate the findings, revise, and return the final draft to the reviewer for
verification before the mechanical checks below. Record reviewer identity, draft
hashes, findings, revision decisions, and verification in the task notes. If fresh
review is unavailable or requirements remain, report editorial review INCOMPLETE;
continue other preparation without claiming the draft is ready. Self-review does
not satisfy this step.

## Step 7: Verify the build

Run `npm run build` in `site/`. It must pass — the content schema will reject a guide
with missing or malformed frontmatter. Fix any error before opening the PR.

Then run `node scripts/readme-plate.mjs` from the repo root. A new guide changes the
catalogue, and that script rewrites the README's counts and redraws its chart from
frontmatter. Commit the changed `README.md` and `.github/assets/plate-*.svg` with the
guide; CI runs `node scripts/readme-plate.mjs --check` and fails the PR if they lag.

## Step 8: Open the pull request

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
- Don't skip the registry row, the writing pass, the layout pass, or the build check.
- Don't ship a paragraph that announces a set and then describes every item inside
  itself. Announce, then hand the items to a table, list, or bold-led blocks.
- Don't ship compressed insider shorthand ("board state", "move statistics"). An
  outsider must get every sentence on first read; if not, rewrite or cut it.
- Don't use negation pivots ("not just X, it's Y") or AI-tell words (delve, robust,
  seamless, crucial, leverage). The Step 6 writing pass exists to catch them.
- Don't rename one concept across the draft (frontier / edge / curve for one plot;
  size / tier for one variant) or leave a dangling "it / they / do not". One name per
  thing, every reference resolved.
- Don't reshape the guide anatomy or invent new section types — consistency across
  guides is the point.
