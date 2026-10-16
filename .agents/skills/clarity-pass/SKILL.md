---
name: clarity-pass
description: "Use when a guide draft needs editorial review after writing, including required review in $ingest and $create-guide, or when prose sounds unnatural, unclear, or obtuse."
---

# Clarity pass

Review a finished draft with a fresh reader before calling it ready. Knowing the
writer's intent can hide awkward wording, unnecessary explanation, and a title
that promises something different from the body. Run after the author's Writing
sweep and before the calling workflow's final mechanical checks.

Understandable prose can still be stiff, vague, or padded. Publication requires
natural phrasing as well as recoverable meaning. Use the fixed
[phrasing examples](references/phrasing.md) to establish that standard.

The calling agent coordinates and revises; the reviewer is a separate read-only
subagent. Keep a compact record at `.tmp/editorial-review/<slug>/review.md` (or in
the existing task notes): audience, brief, draft hashes, reviewer ID, findings,
revision decisions, verification, and remaining requirements. After compaction,
read that record and inspect the recorded worker before dispatching a replacement.

## 1. Dispatch a fresh reader

The calling agent must invoke an independent reviewer, not merely read this skill.
This skill explicitly requests delegation for that bounded review. Check actual tool
exposure first. In Codex, use `spawn_agent` with `fork_turns: "none"`; in Claude,
use an exposed Agent/Task tool with a new context and no inherited conversation.
Do not use a fork containing the author's reasoning or a reviewer who wrote the draft.

Give the reviewer only the draft path, intended audience, house voice at
`.claude/reference/voice.md`, the fixed phrasing examples, and the reviewer brief below.
Do not add draft-specific criticisms, desired fixes, source notes, or explanations
of what the author meant. Ask it to read
only those inputs, remain read-only, and not delegate. Record the draft's SHA-256
and reviewer identity with its returned review in the task's notes or review artifact.
This record documents a tool call; a written claim of independence cannot replace it.

Save the audience and reviewer brief before dispatch and send it unchanged. Build
it from section 2 and the house voice, without diagnoses from the author. Once the
review starts, leave its draft unchanged until the reviewer returns; revise a new
version afterward. This keeps the findings tied to what the reviewer actually read.

If fresh context is unavailable, continue preparing and checking the draft but report
`INCOMPLETE: independent editorial review unavailable`. Self-review may help but
does not satisfy this gate. Do not call the draft editorially ready or publish it.
This skill grants no shipping authority.

## 2. Reviewer brief

Read the entire draft, including frontmatter, exercises, captions, and answers.
Before proposing edits, state what a reader can recover from the draft alone:
its main point, intended next action, and essential conditions or caveats. Do not
supply missing meaning from assumptions about the author.

Make two reads of the full draft:

1. **Meaning and fit.** Check whether the title promises what the body delivers,
   the audience can recover the point and next action, and the sections add useful
   information. Flag scope drift, repetition, missing steps, unsupported claims,
   and unclear references. Preserve attribution and consequential caveats.
2. **Sentences only.** Read the fixed phrasing examples, then examine every authored
   sentence and heading for natural wording. Ask what thing, action, or result it
   names; whether someone addressing this audience would say it that way; and
   whether a plainer version or deletion would keep the meaning. Flag abstract
   instructions the reader must translate, awkward verb/noun combinations,
   metacommentary that merely praises or restates advice, and empty recaps. Do not
   let sound facts, good structure, or a recoverable meaning excuse weak phrasing.
   Check whether generic advice gives a usable choice or criterion; simpler
   synonyms alone do not repair an instruction that leaves the reader to supply
   the advice. Apply the same test to your proposed replacement.

A useful general statement need not contain an example. Do not replace defined
technical terms with vague words, turn every sentence into a command, or flatten
the writer's voice. Preserve the meaning of caveats and fix their authored wording
when needed. Exact quotations, code, and identifiers stay unchanged. Editorial
judgment does not verify source facts; leave source, schema,
link, and mechanical verification to the calling workflow.

Return the restatement and concrete findings with exact quotations or locations,
reader impact, and a direct edit, deletion, or question. Stiff, vague, or redundant
prose that fails the house voice is a **Requirement**, even when its meaning can
be inferred. Reserve **Suggestion** for equally clear stylistic alternatives.
Report a recurring issue once with supporting passages, then check its full extent.

Before a PASS, quote the passages you judged weakest and explain why each needs
an edit or is acceptable. Select them for editorial weakness, not ease of defense;
one or two may be enough. A generic assurance about clarity is insufficient.
No findings quota: a clean draft may pass with its weakest passages deliberately
retained for stated reasons. More findings do not establish a better review.

## 3. Author revision

Evaluate each finding against the source evidence and the writing rules. Accept,
adapt, or reject it with a short reason in the review record. Check whether an accepted
finding recurs elsewhere; repair the pattern, not just the cited sentence.

The author owns the final judgment. Inspect the weakest passages yourself and
record whether the proposed edits improve them. A reviewer PASS, agreement between
models, or successful mechanical checks cannot replace that judgment.

Use the smallest edit that improves the reader's experience. Preserve facts, caveats,
distinctive voice, and valid terms of art. Natural phrasing is not a ban on particular
words: a familiar word can sound awkward beside the wrong verb or noun, while a
technical term can be the most natural and accurate choice. Do not smooth uncertainty
into certainty or remove attribution just to shorten a paragraph.

## 4. Verify the revision and stop

Send the revised full draft to the same independent reviewer. Ask it to verify the
changes, check their surrounding passages for regressions, and identify unresolved
requirements. It should not start another general polish round. Record the revised
SHA-256, verification response, accepted edits, and deliberately retained wording.

One review, one author revision, one verification is the normal budget. If a material
issue remains, report `INCOMPLETE` and the specific remaining work; do not silently
mark it passed or loop indefinitely. A clean initial review still verifies the final
draft. Any later prose change invalidates the verified version and needs verification
of the affected passages before readiness can be claimed.

Then run the calling workflow's applicable copy, schema, link, and other mechanical
checks. Follow its content-only exceptions; this skill does not independently require
a build or dependency installation. Keep review notes out of published prose.

Hand back `PASS` only when independent review and final verification are recorded
and no editorial requirement remains. List optional suggestions separately. Report
mechanical checks separately; passing a linter cannot establish natural writing.
