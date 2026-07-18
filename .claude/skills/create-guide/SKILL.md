---
description: Research current official AI docs and best practices, then write an ultra-concise doc-grounded CoreWise Academy guide as a review PR. Use when the user says /create-guide or asks for a guide or course from current docs, no video source.
---

# create-guide — from fresh official docs to a reviewed guide

The doc-grounded sibling of `/ingest`. Instead of a watched video, the source is
current official documentation, researched at run time. Output is always a pull
request with `status: review`; merging is publishing and the editor decides that.

Input (`$ARGUMENTS`): a topic, doc URLs, or nothing. Empty means: research the
default doc set and propose the guide (or short course) that helps the broadest
set of readers right now.

## Non-negotiables

- **Never publish.** The PR is the editorial gate. Never set `status: published`.
- **No invented facts.** Every model name, feature, limit, and date must trace to
  a page fetched this run. If a fetch fails, narrow the guide or stop; never fill
  gaps from memory, which is stale by definition for this material.
- **Em dashes are banned** everywhere: prose, frontmatter, objectives, self-check
  answers. Use periods, commas, or parentheses. Existing guides that contain them
  are not a license.
- **Docs are cited inline** as links where a claim leans on them. Frontmatter
  `sources` stays `[]` (that field is for video sources).

## Step 1: Research the ground truth

Default doc set (edit freely as the ecosystem moves; these are the load-bearing
official pages as of July 2026):

- https://platform.claude.com/docs/en/release-notes/overview
- https://platform.claude.com/docs/en/managed-agents/memory
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- https://developers.openai.com/api/docs/guides/latest-model

Fetch each relevant page (plus at most 1-2 directly linked pages when one is
load-bearing but thin) and distill a fact sheet: 15-40 one-sentence, paraphrased,
concrete facts with exact names, parameters, and dates, plus caveats for anything
ambiguous or deprecated. The fact sheet is the only source of technical truth for
everything downstream.

When picking what to write, weight by breadth: a technique every reader can apply
tomorrow beats a niche capability, and something that changed recently beats
something stable that older guides already cover.

## Step 2: Decide placement

Read `site/src/data/tracks.ts` and every guide in `site/src/content/guides/`.
Pick track, level, and the next free catalogue `number` (sequential, no gaps).
Related guides written together form a course: same `courseSlug`, `courseOrder`
from 1. Do not overlap an existing guide; a strictly deeper follow-up with the
existing guide as a prerequisite is the only exception.

## Step 3: Write

Anatomy and frontmatter schema are identical to `/ingest` Step 4 and
`site/src/content.config.ts` (objective box with Bloom verbs, lede, `sec-no`
numbered sections, exercise, exactly 3 self-check items, quoted YAML scalars that
contain a colon plus space). Doc-grounded deltas:

- Apply `/purposeful-writing`. Every guide has one job: change what the reader
  does next. Answer early, be specific, cut any sentence that can go without loss.
- **Ultra concise**: 550-850 words of body prose. Shorter and denser wins. Set
  `minutes` from final length (4-7 typical).
- **Stakes woven in, never labeled.** The lede and section openers make the
  reader feel the cost or payoff (the afternoon lost, the tokens burned, the
  capability unlocked). Never a "Why this matters" or "Why you should care"
  section or phrase.
- Typing-voice, not blog-voice: plain sentences a sharp person would type to a
  colleague. No idiom flourishes or vibe-labels; state the concrete cost instead.
  First person where genuine. Honest edges: say plainly what is uncertain or
  version-dependent. No AI tells (delve, robust, seamless, "not just X, it's Y",
  rule-of-three lists, Title Case headings, trailing summaries).
- **Plain language, no jargon.** Assume a smart reader who does not live in AI
  tooling. Prefer the everyday phrase; when a term of art is genuinely needed
  (context window, token, MCP), gloss it in plain words on first use, then use
  it freely. If a jargon word can be swapped for plain words with no loss of
  precision, swap it. No insider shorthand (ctx, evals, "the harness") without
  explanation.
- **Titles are simple and specific.** The title says what the reader gets, in
  plain words, before any wordplay. "Give your agent a memory" and "Stop
  shouting at the model" work; "The firmament moved" fails because nobody can
  decode it without opening the guide, so nobody clicks. Evocative is welcome
  only on top of specific ("Thinking on a budget" names its topic). Same rule
  for the description: a concrete promise, not atmosphere. Slug matches the
  title.
- **Every concept lands twice**: what it means in plain words, and how the
  reader applies it in practice. A claim with no concrete application (a tiny
  example prompt, a before/after, a specific thing to do differently today)
  gets cut. Test each section: could the reader do something differently right
  after reading it? "Put the instructions before the document, not after" beats
  "structure your prompt well", and a two-line example beats both. A concept
  the reader cannot use is worthless, however accurate.

## Step 4: Review pass

On the finished file, in order: (1) search for em dashes and double-hyphen
stand-ins, replace every one; (2) audit each technical claim against the fact
sheet, soften or delete anything unsupported; (3) verify frontmatter against the
schema; (4) cut any paragraph that restates; (5) hunt jargon: every term of art
is either glossed on first use or replaced with plain words; (6) application
check: every section leaves the reader with something concrete to do; a section
that only explains gets an example or gets cut; (7) title check: would a reader
who has not opened the guide know what they are getting? If not, retitle.

## Step 5: Verify and open the PR

Run `npm run build` in `site/` and fix any error. Branch (never main), commit the
guide, push, and open a PR describing what was researched, the placement call, and
that merging is publishing. `/pr` handles the push-and-PR mechanics.

## Scaling to several guides

For a course of 3+ guides in one run, and only when the session exposes
multi-agent orchestration and the user has opted in, fan out: parallel doc
fetchers, one curriculum planner, one writer plus one reviewer per guide (writers
and reviewers on a capable model at medium reasoning). Otherwise run the steps
above once per guide in sequence; the contract is identical either way.

## Anti-patterns

- Don't write from memory of the docs; fetch them this run.
- Don't pad. If it lands in 500 words, ship 500 words.
- Don't label motivation. Stakes live in the prose or the guide fails review.
- Don't merge, and don't set `status: published`.
- Don't put doc links in the `sources` frontmatter; it is video-shaped. Inline
  links in prose.
- Don't reuse a catalogue number or overlap an existing guide's topic.
