---
description: Sweep CoreWise Academy guides and add inline links where topics overlap. Use when the user says /crosslink, asks to cross-link guides or add internal links between articles, or after new guides land.
---

# Crosslink — connect guides where their topics overlap

Finds places where one guide's prose touches a topic another guide covers, and adds an inline link at the mention. Output is edited guide MDX files, verified with a build, delivered per the session's git conventions (branch, PR; merge only if auto-merge mode is on).

## The goal

A reader who pauses mid-sentence with a question ("how do I cut that token bill?") should find the guide that answers it linked right there, not have to discover it from the track page. The catalogue reads as one connected curriculum, not twelve isolated articles. Editor's standing request (2026-07-17): the site needs far more cross-linking than guides naturally acquire, so this sweep is expected to run whenever new guides land.

Editorial basis: the cross-linking ruling in `.claude/reference/copy-rules.md`.

## Calibration examples (first pass, 2026-07-17)

Links that earned their place, use them as the quality bar:

- new-claude-lineup's tokenizer paragraph ("roughly 30% more tokens... your prompts just cost about a third more") → Thinking on a budget. The reader just learned their bill grew; that guide is how to shrink it.
- new-claude-lineup's deprecated thinking-budget paragraph → Stop shouting at the model, which walks the migration; and the reverse link from that guide's migration section back to the lineup catalogue. Each direction earned its own mention.
- guardrails-for-long-runs' Markdown-memory paragraph → Give your agent a memory (the managed-agent version of the same idea).
- firmware-not-folklore's layers paragraph → Expertise you can install (skills layer) and Give your agent a memory (memory layer).
- brief-the-model's lede claim that fundamentals hold across models → Claude and OpenAI, one prompting playbook (the proof).

Shape that worked: weave into the existing sentence or append one short pointer sentence ("And once the bigger bill lands, [guide] is the guide to cutting reasoning-token spend without cutting depth."). Never a bare "See also".

## Step 1: Build the topic map

Read every guide's frontmatter (`title`, `description`, `objectives`) in `site/src/content/guides/`. For each guide, list 3-6 topics it owns (for example: reasoning-token spend, agent memory, skill files, migration 400 errors, prompting fundamentals, system-prompt calibration, long-run guardrails, model routing, design concepts). One guide owns a topic if a reader asking about that topic should land there.

## Step 2: Sweep for unlinked mentions

For each guide body, search for sentences that touch a topic owned by a different guide. Search by concept keywords from the topic map, not exact titles. A mention qualifies only if:

- The overlap is real: the other guide would genuinely help a reader who paused at that sentence.
- The mention is in body prose or an exercise, not frontmatter.
- No link to that guide already exists in the same section.

## Step 3: Add the links

At each qualifying mention, add an inline link with the target guide's title as the link text, using the site-root path:

```html
<a href="/guides/<slug>/">Guide title</a>
```

Weave the link into the existing sentence or append one short pointer sentence. Keep it to 2-4 links per guide; if more qualify, keep the strongest. Never force a link where the prose has to bend to host it.

## Step 4: Verify and report

- Every added href resolves to a real published guide slug.
- `npm run build` passes in `site/`.
- Report the links added as pairs (from-guide → to-guide) so the editor can audit the judgment calls.

## Anti-patterns

- Don't link on shared vocabulary alone; link on shared usefulness.
- Don't stack multiple links in one sentence or repeat the same target in one section.
- Don't rewrite surrounding prose beyond what the link needs.
- Don't link a guide to itself or add reciprocal links mechanically; each direction must earn its own mention.
- Don't touch frontmatter, PullQuote attributions, or source registries.
