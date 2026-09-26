---
name: clarity-pass
description: Use when a guide draft needs editorial review after writing, including required review in /ingest and /create-guide, or when prose sounds unnatural, unclear, or obtuse.
---

# Clarity pass

Review a finished draft with a fresh reader before calling it ready. Knowing the
writer's intent can hide awkward wording, unnecessary explanation, and a title
that promises something different from the body. Run after the author's Writing
sweep and before the calling workflow's final mechanical checks.

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
`.claude/reference/voice.md`, and the reviewer brief below. No previous criticisms,
desired fixes, source notes, or explanations of what the author meant. Ask it to read
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

Review these three levels:

| Level | Questions |
|---|---|
| Natural phrasing | Would someone addressing this audience actually put these words together? Check headings and compressed phrases even when every word is familiar and the meaning is clear. Flag vague referents, idioms carrying a technical claim, and phrases requiring private context. |
| Sentence usefulness | Does each sentence help the reader understand, decide, or act? Identify metacommentary that only describes the article, redundant explanations, and unsupported claims. Keep attribution and caveats that establish scope or evidence. |
| Whole-piece fit | Does the title accurately promise what the body delivers? Check audience, opening, section order, scope drift, repetition, and missing steps. Recommend a narrower title or scope where appropriate; do not invent material to fill a gap. |

Return the restatement, then concrete findings with exact quoted text or locations,
reader impact, and a proposed edit or question. Distinguish requirements from optional
preferences. Report broader issues once, with the passages supporting them. Also
identify anything deliberately retained because precision or voice would suffer.
No quota: a clean draft can receive no findings. Editorial judgment does not verify
source facts. Do not rewrite quotations, code, identifiers, or technical caveats.

## 3. Author revision

Evaluate each finding against the source evidence and the writing rules. Accept,
adapt, or reject it with a short reason in the review record. Check whether an accepted
finding recurs elsewhere; repair the pattern, not just the cited sentence.

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
