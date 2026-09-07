---
name: ingest
description: Use when the user asks to turn a YouTube video into a CoreWise Academy guide, invokes $ingest, or asks to extend a guide from a video source.
---

# Ingest a video with Codex

Own the work from actual video words to a verified editorial review draft. This is the
hand-authored Codex workflow. Claude's separate ingest skill is not a prerequisite.
Share the site's schema and editorial references; keep execution instructions here.
Repository paths below are relative to the repo root; run build commands in `site/`.

## 1. Establish scope and readiness

Use the video URL in the request. If the user replaces it, use the replacement and
exclude the old source unless asked to combine them. Inspect the checkout, catalogue,
exposed tools, and installed site dependencies early. Report missing prerequisites and
continue work that does not depend on them.

Follow repository authorization rules for installing dependencies and shipping. Keep
approval already granted for this task; a sandbox escalation uses the tool's scoped
approval mechanism, not another conversational request for the same action. If approval
is missing, prepare the concrete draft and remaining checks before asking. A skill
invocation alone does not grant installation, commit, push, or PR authority. Publication
and merge require an explicit user request, separate from preparing a review PR.

## 2. Obtain and read the transcript

Create gitignored `.tmp/` before redirecting output. In PowerShell:

```powershell
New-Item -ItemType Directory -Force .tmp | Out-Null
node scripts/transcript.mjs "<youtube-url>" > .tmp/<video-id>.txt
```

Read the saved transcript in full, including its final segment. Capture video title,
creator/channel, URL, and publication date from the video page or metadata. A metadata
command succeeding does not prove captions downloaded. Record retrieval method and
caption type if available; never claim to have watched footage when only text was read.

Diagnose failures from the actual output:

| Evidence | Next action |
| --- | --- |
| yt-dlp cannot be found | Inspect the script's discovered invocation and installed executable/module paths. Avoid unnecessary installation. |
| Socket or filesystem access denied by sandbox | Use scoped escalation for the needed authorized command. |
| yt-dlp returns caption HTTP 429 | yt-dlp was found. Let the script's built-in client retry finish; Android is not guaranteed to succeed. |
| Script returns no transcript or all caption clients fail | Try browser recovery below if browser control is exposed. |

Browser recovery:

1. Read the available browser API; open the requested video and confirm its identity.
2. If transcript export is exposed, try it once. An empty export is not proof that
   YouTube's visible transcript panel is empty.
3. Expand the description and click **Show transcript**, using current page state to
   locate controls. Read the timestamped panel through the end, loading further segments
   as needed. Save text to scratch storage when the available API supports it. Opening
   the panel is not a reason to retry an export that already failed.
4. Record coverage and any gaps. If browser control is unavailable or the panel cannot
   provide the actual words, ask for the transcript and explain the blocker. Do not loop
   on failed clients, change networks, wait an hour, or draft from the description.

Treat captions as lossy. Verify names, technical terms, and numerical claims before
using them. Quotes must be short, exact, attributed, and timestamped; omit a quote if
its wording cannot be established. Never invent speech, timestamps, or missing segments.

## 3. Decide what the source contributes

The editor supplies videos they learned from. If qualification is unclear, ask rather
than inventing a personal learning claim. Write structured notes in
`content/notes/<date>-<video-id>.md`: timestamped concepts, prerequisites, misconceptions,
possible exercises, short quote candidates, retrieval evidence, and excluded material.
Keep full transcripts in scratch storage.

Read `site/src/data/tracks.ts`, `site/src/content.config.ts`, and the catalogue in
`site/src/content/guides/`. Read guides with real overlap. Choose a new guide, an extension,
or a split; explain the placement in the notes. Use the next available catalogue number
for a new guide, the correct track and level, and course fields only when it belongs to
an existing course. Check current main before assigning a number for shipping.

Write an original lesson across sources, rather than retelling the video. Verify current
product behavior against official documentation and weave those sources into the lesson.
Credit each source and distinguish the video's claims from our recommendations. Exclude
sponsor segments and promotional claims unless they are themselves the subject of analysis.

## 4. Write the guide and source log

Read `.claude/reference/voice.md` and `.claude/reference/copy-rules.md`. Apply Writing
when available. Use the current schema and an existing guide as the structural reference:

- Frontmatter: plain, specific title and promise; track, level, number, reading time,
  valid tags, measurable objectives, linked prerequisites, sources, exactly three
  self-check questions with answers, `lastUpdated`, and `status: draft` or `review`.
- Body: open with `<p class="lede">`; use numbered section headings in the site's form
  `## <span class="sec-no">01</span>Title`.
- Attribute short `<PullQuote>` excerpts with creator, video, href, and timestamp.
  Include a concrete `<Exercise>` with ordered steps. Import components as existing
  guides do. Mark original prompts as original; do not imply they were copied from video.
- Put source URLs, creator names, titles, and verified timestamps in `sources`.
  Follow the live schema instead of inventing fields. Quote YAML strings containing `: `.

Add each source to `content/sources.md` with access/watch provenance stated honestly,
creator, linked title, and why the material qualified. Link every genuine catalogue
intersection inline, using the existing guide's exact title as link text.

## 5. Review the writing

Apply the full copy rules. Check title specificity, unexplained terms, literal claims,
negation pivots, repeated abstractions, unclear pronouns, and consistent names. No em
dashes or substitute separator tricks. Keep paragraphs short; put named sets in tables,
lists, or bold-led blocks rather than burying them in prose.

Then cold-read the entire draft, including frontmatter, as someone new to the topic.
Apply the clarity-pass procedure if available. Rewrite sentences that require private
context or a second reading without weakening their claims. Record the before/after
rewrites and deliberately retained terms for the editor. Do not call self-review independent.

## 6. Verify and prepare the review PR

When installation is authorized, use the lockfile with `npm ci` in `site/`. Run:

```text
site/: npm run lint:copy
site/: npm run build
repo root: node scripts/readme-plate.mjs
repo root: node scripts/readme-plate.mjs --check
repo root: git diff --check
```

Fix new failures. Distinguish missing dependencies from filesystem sandbox denials;
retry with scoped escalation when justified instead of changing packages. Read layout
advisories and identify whether they concern this draft. Confirm internal links and
prerequisites resolve. A copy-only pass is not a successful build. Review-status guides
are excluded from the published catalogue, so generated assets may legitimately be unchanged.

When commit/push/PR are authorized, use a fresh branch from current main, preserve
unrelated work, and stage explicit paths. Include changed catalogue assets if generated.
Open a PR describing the source, new-versus-existing placement, validation, and editorial
status. Use a body file for multiline CLI text. Await editorial review; never turn an
ordinary ingest into automatic publication. Report the PR link and actual CI state.

If a later user request explicitly authorizes publication, update status to published,
regenerate assets, rebuild, verify the updated commit's CI, merge, and follow
`.claude/reference/deployment.md` to confirm both deployment success and the live page.
