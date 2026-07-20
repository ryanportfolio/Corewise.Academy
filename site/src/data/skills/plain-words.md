---
description: Swap fancy, Latinate, or insider words for plain phrases in user-visible site copy. Use when the user says /plain-words, asks to de-fancy or simplify copy, before writing or editing guide or page prose, or for a sitewide fancy-word sweep.
---

# Plain words: fancy words lose to plain ones

Every word a visitor can read follows one test: would a smart reader outside AI
tooling pause on this word? If yes, and a plain phrase says the same thing, the
plain phrase ships. This skill is the working procedure and the trap list.

## Step 1: Apply while writing (default path)

Whenever drafting or editing user-visible copy, check each sentence against the
trap list below before it lands. This binds even when the skill was not
explicitly invoked, same as the other copy rules.

## Step 2: The trap list

Real swaps that shipped in the 2026-07-18 sitewide sweep. Same word appearing
again is a defect:

| Fancy | Plain |
|---|---|
| ancillary | tooling / works in progress (name the thing) |
| prohibition | ban |
| disambiguation | separation |
| exfiltration | data theft |
| verbatim | word-for-word |
| elicitation | nudge (or say the instruction) |
| corroborated | backed up |
| subsequent | later / after |
| interventions | fixes |
| convergence | shared conclusion |
| imperatively | as a command |
| amend | fix / update |
| disarmingly | surprisingly |
| load-bearing (figurative) | most important |
| happy case | when things go right |
| first-party | the writer's own |
| data governance | who controls your data |
| synchronous (in prose) | back-and-forth |
| thin-kernel discipline | keep-it-thin habit |
| connectives | connecting words |
| casualty | say the specific thing (death metaphors banned anyway) |
| un-undoable | that cannot be undone (coinages banned anyway) |

The list is examples, not the boundary. Any Latinate dress-up (utilize,
leverage, facilitate, commence, myriad, plethora, salient), literary flourish,
or insider term a smart non-programmer would need a dictionary for gets the
same treatment.

## Step 3: What never changes

- Technical terms that are the accurate name of the thing: token, commit, PR,
  retrieval, deterministic when precision matters, product and model names.
- Code, class names, ids, frontmatter keys, URLs, repo names, file paths.
- Quoted artifacts. `site/src/data/showpieceSkill.ts` and any block labeled as
  quoted reproduces a real document; rewording it is a misquote.
- A fancy word with no equally accurate plain substitute stays, glossed at
  first use if it is not the reader's own vocabulary.

## Step 4: Full-site sweep (`/plain-words` on its own)

1. Grep `site/src` for the trap-list words first; fix hits.
2. Read every copy-bearing file (pages, layouts, copy components, guide MDX)
   and flag candidates against the Step 2/Step 3 tests.
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
on words like "editor's". Escape as `\'` or the build fails.

## Anti-patterns

- Don't swap an accurate technical name for a vaguer word; precision wins over
  plainness when they conflict.
- Don't trade one fancy word for another or for a sidegrade synonym.
- Don't edit text a visitor never sees.
- Don't reword quoted artifacts or attributed quotes.
- Don't skip the gates after a sweep.
