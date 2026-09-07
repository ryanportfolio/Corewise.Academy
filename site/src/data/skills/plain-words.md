---
description: Sitewide sweep of shipped site copy for fancy, Latinate, or insider words. Use when the user says /plain-words or asks for a sitewide fancy-word sweep. Carries the word test and trap table.
---

# Plain words: the sitewide sweep

The rule: fancy words lose to plain ones. This file carries the word test and
the trap table (the same text as pattern 31 of the `writing` skill, inlined so
this copy stands alone) plus the sweep procedure for copy that already shipped.

## Word test and trap table

Test for any word: would a smart reader outside the domain pause on it? If a plain phrase says the same thing, the plain phrase ships. Swaps a real editor made on shipped copy; the same word appearing again is a defect:

| Fancy | Plain |
|---|---|
| ancillary | supporting, or name the thing ("tooling", "works in progress") |
| prohibition | ban |
| verbatim | word-for-word |
| corroborated | backed up |
| subsequent | later, after |
| interventions | fixes |
| amend | fix, update |
| disambiguation | separation |
| exfiltration | data theft |
| elicitation | nudge (or say the instruction) |
| convergence | shared conclusion |
| imperatively | as a command |
| salient | main |
| myriad, plethora | many |
| happy case | when things go right |
| connectives | connecting words |
| first-party | your own |
| data governance | who controls your data |

Some words have no fixed swap because the plain phrase depends on what was meant: "disarmingly", "load-bearing" as a metaphor, "synchronous" in prose. Say the specific thing the sentence observes ("the assumption everything else rests on", "a back-and-forth call"); do not pick a near-synonym that shifts the meaning.

The list is examples, not the boundary. What never changes: a technical term that is the accurate name of the thing (token, commit, retrieval, deterministic when precision matters, product and model names); code, identifiers, URLs, paths; quoted artifacts; a fancy word with no equally accurate plain substitute, glossed at first use. A sidegrade synonym is not a fix.

## Sweep

1. Grep `site/src` for the trap-table words first; fix hits.
2. Read every copy-bearing file (pages, layouts, copy components, guide MDX)
   and flag candidates against the word test and its what-never-changes list.
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
