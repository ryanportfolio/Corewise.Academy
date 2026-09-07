---
description: Sitewide sweep of shipped site copy for fancy, Latinate, or insider words. Use when the user says /plain-words or asks for a sitewide fancy-word sweep. The word test and trap list live in the writing skill, pattern 31.
---

# Plain words: the sitewide sweep

The rule (fancy words lose to plain ones) is in `.claude/reference/copy-rules.md`.
The word test and the Fancy → Plain trap table are in
`.claude/skills/writing/patterns.md`, pattern 31; the `writing` skill applies
them while drafting. This skill is the repo procedure for sweeping copy that
already shipped.

## Sweep

1. Grep `site/src` for the pattern 31 trap words first; fix hits.
2. Read every copy-bearing file (pages, layouts, copy components, guide MDX)
   and flag candidates against the pattern 31 test and its what-never-changes
   list.
3. For each candidate, the replacement must be clearly plainer, grammatical in
   place, identical in meaning, and obey the other copy rules (no em dashes,
   no coinages, headings never end with a period, no death metaphors).
   A sidegrade synonym is not a finding.
4. After changing wording that is quoted elsewhere (Chalk lines, pull-quotes,
   titles in `site/src/data/trackNotes.ts` and `site/src/pages/index.astro`),
   grep for the old wording and update every copy.
5. Run the gates before shipping: `npm run lint:copy` and `npm run build` in
   `site/`.

## Known trap

Apostrophes inside `.astro` frontmatter strings: single-quoted JS strings break
on words like "editor's". Escape as `\x27` or the build fails.

## Anti-patterns

- Don't swap an accurate technical name for a vaguer word; precision wins over
  plainness when they conflict.
- Don't edit text a visitor never sees.
- Don't reword quoted artifacts or attributed quotes.
  `site/src/data/showpieceSkill.ts` and any block labeled as quoted reproduces
  a real document; rewording it is a misquote.
- Don't skip the gates after a sweep.
