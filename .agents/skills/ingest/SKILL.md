---
name: ingest
description: Use when the user asks to turn a YouTube video into a CoreWise Academy guide, invokes $ingest, or asks to extend a guide from a video source.
---

# Ingest a video with Codex

Own the work from actual video words to a verified editorial review draft. This is the
hand-authored Codex workflow. Claude's separate ingest skill is not a prerequisite.
Share the site's schema and editorial references; keep execution instructions here.
Repository paths below are relative to the repo root; run copy checks in `site/`.

## 1. Establish scope and readiness

Use the video URL in the request. If the user replaces it, use the replacement and
exclude the old source unless asked to combine them. Inspect the checkout, catalogue,
and exposed tools early. Site dependencies are not required for content-only ingest. Report missing prerequisites and
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

Before drafting, add a coverage table to the source notes. Map every substantial
video topic to its timestamps and one decision: include (where), already covered
(linked guide or section), or exclude (specific reason). Consider sustained discussion,
concrete evidence, and relevance to the reader's decisions; airtime alone does not
require inclusion. When extending a guide, let useful source material broaden its
outline within the editor's request instead of treating the current headings as a limit.

Uncertainty alone is not a reason to omit a useful insight. First consider an attributed
observation, a narrower claim, or an explicit caveat. A creator's reported comparison can
support a bounded lesson without proving a universal rule. Exclude claims that remain
unsupported or misleading after qualification, repetitive material, and irrelevant topics;
keep the existing exclusions for sponsors and promotion.

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

### Introduce the lesson and its sources

Write the opening for someone who has never seen the video. The lede should name
the reader's concrete problem or decision and what the guide helps them do. Use an
example when it makes that purpose clearer; avoid generic promises or a video recap.

Before the first creator reference, introduce the creator and link the source title
in a sentence explaining its contribution. Frontmatter and the sources list do not
replace this introduction. For multiple sources, introduce each where it first matters.

Lead paragraphs with the lesson. Put timecodes in descriptive source links when
useful, rather than opening with "At 1:57, Nate recommends...". After introducing
the source, state the action first, then link the relevant explanation in the video.

## 5. Review the writing

Compare the finished draft with the coverage table. Confirm each included topic appears,
each already-covered topic has a useful reference, and each exclusion still has a sound
reason. Reconsider major omissions caused only by the old outline or lack of universal
proof. Record final decisions in the notes and briefly flag any substantial relevant
topics still omitted, with reasons, in the editorial handoff. Do not turn this check into
a requirement to recap the whole video.

Apply the full copy rules. Check title specificity, unexplained terms, literal claims,
negation pivots, repeated abstractions, unclear pronouns, and consistent names. No em
dashes or substitute separator tricks. Keep paragraphs short; put named sets in tables,
lists, or bold-led blocks rather than burying them in prose.

Run `clarity-pass` on the finished draft as a required independent editorial review.
Actually dispatch a fresh reviewer with no inherited conversation, following that
skill's input limits. Review natural phrasing, sentence usefulness, and whole-piece
fit. Evaluate the findings, revise, and return the final draft to the reviewer for
verification before the mechanical checks below. Record reviewer identity, draft
hashes, findings, revision decisions, and verification in the task notes. If fresh
review is unavailable or requirements remain, report editorial review INCOMPLETE;
continue other preparation without claiming the draft is ready. Self-review does
not satisfy this step.

## 6. Verify and prepare the review PR

For content-only ingest, run the dependency-free checks below. Do not run `npm ci` or
`npm run build`, or block the draft or publication because site dependencies are absent.
This also applies when Writing or clarity-pass mentions a build. If the task includes
application code or build configuration changes, validate those changes separately.
Run:

```text
site/: npm run lint:copy
repo root: node scripts/readme-plate.mjs
repo root: node scripts/readme-plate.mjs --check
repo root: git diff --check
```

Fix new failures. Read layout advisories and identify whether they concern this draft.
Check frontmatter against the live schema; confirm internal links and prerequisites
resolve. Report these as content checks, without claiming a local build passed.
Review-status guides are excluded from the published catalogue, so generated assets
may legitimately be unchanged.

When commit/push/PR are authorized, use a fresh branch from current main, preserve
unrelated work, and stage explicit paths. Include changed catalogue assets if generated.
Open a PR describing the source, new-versus-existing placement, validation, and editorial
status. Use a body file for multiline CLI text. Await editorial review; never turn an
ordinary ingest into automatic publication. Report the PR link and actual CI state.

If a later user request explicitly authorizes publication, update status to published,
regenerate assets, rerun the content checks, verify the updated commit's CI, merge, and follow
`.claude/reference/deployment.md` to confirm both deployment success and the live page.
