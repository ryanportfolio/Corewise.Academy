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
  answers. Use periods, commas, colons, or parentheses; label-style separators use
  " · ". No lookalike substitutes (en dash, double hyphen). Enforced by
  `scripts/no-em-dash.mjs`, which runs first in `npm run build` and fails the build
  (and the deploy) on any em dash in `site/src`.
- **Docs are cited inline** as links where a claim leans on them. Frontmatter
  `sources` stays `[]` (that field is for video sources).
- **Provenance is factual.** Any claim about how something was made is verified
  like a technical claim; a method distilled after the fact is disclosed as
  such, never narrated as the recipe that produced the work. When the lesson
  exists as a usable artifact (a prompt, a skill file, a script), embed it
  copy-ready instead of describing it; edited material is never labeled
  verbatim. Full ruling: `.claude/reference/copy-rules.md`, Provenance and
  artifacts.

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

- Apply the global `writing` skill (it loads the house voice from
  `.claude/reference/voice.md`). Every guide has one job: change what the reader
  does next. Answer early, be specific, cut any sentence that can go without loss.
- **Ultra concise**: 550-850 words of body prose. Shorter and denser wins. Set
  `minutes` from final length (4-7 typical).
- **No walls of text, and run the layout pass.** Paragraphs run 1-4 sentences;
  break at each new idea. The defect that gets a draft rejected is a paragraph
  that names a set and then swallows the items: "The audit checks three things:
  routing integrity (...), index truth (...), and freshness (...)". Announce,
  then hand the items to a structure: "The audit runs three checks:" plus a
  list. Convert a named set to a table (shared dimensions) or a list, a term
  and its meaning to a **bold-led** block, ordered steps to a numbered list.
  Structure only genuine structure; over-structuring is its own defect, and
  prose still carries the argument. `npm run lint:copy` prints candidates
  (advisory, never blocks). Full rule in `copy-rules.md` ("The layout pass is
  required, not optional").
- **State the rule, skip the flourish.** No aphorism capstones, no dramatic
  justifications on self-evident rules, no praise of the guide's own advice,
  no coined names. Rules read as flat plain declaratives. When a mechanism has
  levels or stages, say what the end state buys; tour the stops only if the
  reader must choose one. One example per claim, and only if the claim is
  unclear without it. Full rulings: `.claude/reference/copy-rules.md`.
- **Stakes woven in, never labeled.** The lede and section openers make the
  reader feel the cost or payoff (the afternoon lost, the tokens burned, the
  capability unlocked). Never a "Why this matters" or "Why you should care"
  section or phrase.
- Typing-voice, not blog-voice: plain sentences a sharp person would type to a
  colleague. No idiom flourishes or vibe-labels; state the concrete cost instead.
  First person where genuine. Honest edges: say plainly what is uncertain or
  version-dependent. No AI tells (delve, robust, seamless, negation pivots,
  rule-of-three lists, Title Case headings, trailing summaries).
- **Plain language, no jargon.** Assume a smart reader who does not live in AI
  tooling. Prefer the everyday phrase; when a term of art is genuinely needed
  (context window, token, MCP), gloss it in plain words on first use, then use
  it freely. If a jargon word can be swapped for plain words with no loss of
  precision, swap it. No insider shorthand (ctx, evals, "the harness") without
  explanation. Metaphors never carry the point: a title, heading, or claim
  whose only statement is a metaphor ("Rent the model, own the method", "The
  pay moves to deciding") gets rewritten as the literal version ("Deciding is
  now the hard part"); two-part aphorism shapes ("X the A, Y the B") are out.
- **Titles are simple and specific.** The title says what the reader gets, in
  plain words, before any wordplay. "Give your agent a memory" and "Stop
  shouting at the model" work; "The firmament moved" fails because nobody can
  decode it without opening the guide, so nobody clicks. Evocative is welcome
  only on top of specific ("Thinking on a budget" names its topic). Same rule
  for the description: a concrete promise, not atmosphere. Slug matches the
  title.
- **Say what it is, not what it is not.** Headings and claims defined by
  negation ("Synthesis, not summary") are banned; state the positive fact.
  The negation pivot is banned in every disguise, including split across
  sentences: "It's not just X, it's Y", "The interesting part is not X. It is
  Y", "This isn't about A; it's about B", "less about X than Y". Delete the
  denial half, open with the point; a negation survives only when it corrects
  a real misconception the reader holds, after the positive claim.
  Lead with the point: if a paragraph's payoff sentence could open it, move it
  up and cut the wind-up. Never talk down to the reader (no "adults learn what
  they can use"-style framing). Full ruling:
  `.claude/reference/copy-rules.md`, Plain language.
- **Cross-link at every real overlap.** While writing, keep the catalogue's
  titles and descriptions at hand; when a sentence touches a topic another
  guide covers (token spend, memory, skills, migration errors, prompting
  fundamentals), link that guide inline at the mention, title as link text.
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
who has not opened the guide know what they are getting? If not, retitle;
(8) cross-link check: scan the draft against every existing guide's title and
description; add an inline link wherever the draft touches a topic another
guide covers; (9) self-containment check: every passage lands for a first-time
reader with no private context; if it only makes sense to someone who has seen
the artifact it references, show the artifact or cut the passage; (10) word-tic
sweep: count repeats of abstract nouns and adjectives across the draft ("true",
"real", "powerful"); a word leaned on repeatedly marks sentences to rewrite as
concrete statements; (11) one name per concept: pick one word for each thing and
repeat it, never renaming the same idea (the model-recheck guide called one plot
"frontier", "edge", "map", and "curve", and one variant both "size" and "tier"),
and check comparison labels too ("high effort" versus "top effort" for the same
setting); (12) referent check: read every "it", "they", "that", and bare "do not"
and confirm each points to one nameable thing, or name the thing instead of
pointing at it.

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
- Don't rename one concept across the draft (frontier / edge / curve for one plot;
  size / tier for one variant) or leave a dangling "it / they / do not". One name per
  thing, every reference resolved.
