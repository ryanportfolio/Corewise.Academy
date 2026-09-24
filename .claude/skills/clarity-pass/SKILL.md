---
description: Cold-re-read a finished guide draft as a first-time reader and rewrite abstract, idiomatic, or two-read passages. Runs at the end of /ingest and /create-guide. Use when the user says /clarity-pass or calls a draft unclear or obtuse.
---

# Clarity pass

Runs after the rule checklist (ingest Step 6 / create-guide Step 4 / `copy-rules.md`),
never instead of it. The rule pass catches known defects (em dashes, negation pivots,
AI tells, layout, jargon). This pass catches what rule checklists miss: sentences that
pass every rule and still make a smart first-time reader stop and re-read. The editor
added this skill after a rule-clean draft still needed 13 such rewrites on a manual
"anything obtuse?" prompt (2026-08-04).

Input: the finished draft(s), after the rule pass, before the PR is called done. If
$ARGUMENTS names a file or slug, use it; otherwise use the guide(s) drafted or edited
this session.

## Step 1: Read and restate

Read the whole file top to bottom in one sitting, frontmatter included (description,
objectives, prerequisite notes, self-check answers). Before rewriting, record what the
intended reader can recover from the draft alone: its main claim, next action, and
essential conditions or caveats. Mark unclear or absent elements without supplying the
author's missing meaning. Then compare this restatement with the intended message and
flag mismatches or sentences that require a second reading.

For important prose, a fresh independent reader can help when tools are exposed and
delegation is authorized. Give that reader the draft and audience first; reveal the
author's intended interpretation only after the restatement. If reviewing your own
draft or with prior context, call it self-review. Do not claim a cold or independent
read, or treat model agreement as evidence of factual accuracy.

## Step 2: Hunt these classes

Each class below survived a full rule pass before the editor caught it. Real examples
from the 2026-08-04 session:

| Class | Shipped | Became |
|---|---|---|
| Abstraction carrying a heading | "The question that finds the risk" | "Ask what it can do on its own" |
| Idiom carrying the claim | "stays on the table" | "can still happen one day" |
| Borrowed-register word | "narrow tools bound what a hijacked agent can do" | "narrow tools limit the damage" |
| Stiff or Latinate phrasing | "tools it legitimately held" | "tools it was given" |
| Referent fog | "that is the wrong place for it" | "a system that can act differently on every run has not earned that trust" |
| Unexplained coinage | "the self-grading trap" | "the agent never grades its own work" |
| Compressed apposition | "an agent that only reads a knowledge store" | "an agent that only looks things up in a database" |
| Insider shorthand | "applied to a single delegation" | "for a single piece of handed-over work" |

## Step 3: The say-it-aloud rewrite

For each flagged sentence: say what it means, in plain words, as if explaining to a
smart colleague outside AI. Write down what you said; that is the replacement. The
technical claim must stay identical, including every caveat. If saying it aloud takes
two sentences, the replacement is two sentences. If the intended meaning remains
unresolved, flag the gap and preserve the caveat; do not guess it away in a rewrite.

## Step 4: Verify and hand back

1. Rerun the gates: `npm run lint:copy` in `site/`, and `npm run build` if frontmatter
   changed.
2. If shipping is already authorized and a review PR is open, commit the rewrites to
   that branch and push. Otherwise leave the edits for the calling pipeline.
3. Unless the user specifies another output format, begin the returned response with
   the review type and reader restatement, before any edited text or proposed
   replacements. Then list every rewrite (shipped phrase, replacement), plus anything flagged
   and deliberately kept (glossed terms of art, quotes), so the editor can veto by item.

## Anti-patterns

- Don't re-run the rule checklist here and call it a clarity pass; this pass starts
  where that one ends.
- A clean draft may stay unchanged. Report no clarity issues with the restatement
  that supports that judgment; do not manufacture flags or rewrites.
- Don't soften or drop a technical claim to make the sentence smoother; accuracy
  outranks smoothness.
- Don't rewrite source quotes, code, file names, or API strings.
- Don't polish into blandness: the house voice (plain declarative, concrete, a little
  asymmetry) stays; only the decoding cost goes.
