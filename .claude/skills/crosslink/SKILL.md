---
description: Sweep CoreWise Academy guides and add inline links where topics overlap. Use when the user says /crosslink, asks to cross-link guides or add internal links between articles, or after new guides land.
---

# Crosslink — connect guides where their topics overlap

Finds places where one guide's prose touches a topic another guide covers, and adds an inline link at the mention. Output is edited guide MDX files, verified with a build, delivered per the session's git conventions (branch, PR; merge only if auto-merge mode is on).

Editorial basis: the cross-linking ruling in `.claude/reference/copy-rules.md`.

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
