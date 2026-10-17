# Publication guards

Repository root: `<repository>`

No inputs were edited. No reviewer was dispatched for Task 1. No publication was attempted.

## Task 1: coordinator record

Draft: `site/src/content/guides/build-software-around-business-rules.mdx`

SHA-256: `14D72650A2A7491644A79B07F03E86854CED30A5C047346B2B8136C1BC1D9057`

Audience: practical users of coding agents who can brief an agent, review its plan, and inspect a running app. The guide is marked practitioner level.

Reviewer identity: pending dispatch. Initial findings: pending. Author revision decisions: pending. Final verification: pending. Mechanical checks: not run in this bounded task.

Status: `INCOMPLETE: independent editorial review not dispatched`. Dispatch is intentionally outside this task; no tool-availability failure is asserted. The guide's `status: published` frontmatter does not establish completion of this editorial gate.

### Calibration overlap

The fixed phrasing examples came from this guide's earlier wording. Record this overlap outside the reviewer packet. Agreement with those supplied replacements cannot count as independent confirmation of those edits.

The author must inspect these passages:

- The former "Questions can expose omissions" example concerns the interview advice in section 01. The current draft gives the interview instruction, then five questions about the dashboard. Check whether each surrounding sentence adds useful information instead of restating the benefit.
- Section 02 now says: "If the people handling orders call an order \"accepted,\" use that name in the app and code." This matches the calibration's direct version. Judge its fit and the following explanation yourself; reviewer agreement would be calibrated agreement.
- Section 06 now says: "Build the first version with sample orders before connecting it to customer data." The calibration's third pair also supplies a local dashboard with sample orders. Inspect the actual task and limits in the guide, including the exercise; agreement with the supplied example is not independent confirmation.

These are author inspection obligations, not reviewer findings. Do not add them to the dispatch brief. After the reader returns, record each finding and its acceptance, adaptation, or rejection. Inspect the weakest passages directly, then obtain final verification from the same reader. Record the final hash and remaining requirements before claiming PASS. Run the calling workflow's applicable mechanical checks separately. This skill supplies no shipping authority.

## Task 1: saved dispatch packet

Send the following packet unchanged when dispatch is authorized within the calling workflow. Use a fresh read-only reader with no inherited author context. Keep the draft unchanged until its response returns.

### Inputs

- Draft: `<repository>/site/src/content/guides/build-software-around-business-rules.mdx`
- Intended audience: practical users of coding agents who can brief an agent, review its plan, and inspect a running app. The guide is marked practitioner level.
- House voice: `<repository>/.claude/reference/voice.md`
- Fixed phrasing examples: `<repository>/.agents/skills/clarity-pass/references/phrasing.md`

Read only those files and this brief. Remain read-only and do not delegate. Apply the house voice: plain declarative prose, concrete things and actions, honest caveats, and useful examples without unnecessary teaching scaffolding. Do not open linked sources or perform factual or mechanical verification.

### Reviewer brief

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
   When the context lacks the example or criterion, ask the author rather than
   inventing material to fill the gap.

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

## Task 2: reader review of missing-context.md

Draft: `.tmp/publish-clarity/missing-context.md`

SHA-256: `9F187E82D5AA8F00A09BE9C1569A562239512843B55D20810093D89D17AB6734`

Reader identity: `/root/clarity_publication_guards`, the already-dispatched reader for this bounded task. The coordinator retains the dispatch record; this written identity does not replace it.

### Meaning recovered before edits

The draft advises a practical coding-agent user to choose a first feature whose result can be evaluated. The intended next action is to select that feature. It supplies no project, feature, expected result, or criterion for judging suitability. No further conditions or caveats can be recovered from the draft.

### Two-read finding

**Requirement.** Body sentence: "Choose an initial feature with suitable properties and an outcome that can be evaluated."

Meaning and fit: the title promises help choosing a first task, but the only advice leaves the choice and its deciding criteria to the reader. "Suitable properties" never says what makes a feature suitable; "can be evaluated" never says what evidence the reader should inspect.

Sentences only: both phrases are abstract and awkward for this audience. Replacing "outcome" with "result" would leave the substantive gap intact. This is also the weakest passage in the draft; retaining it would preserve an instruction the reader still has to invent.

Question for the author: What project or feature is this advice for, what properties make a first feature suitable, and what observable result should the user check? Supply that context so the sentence can name a usable choice or criterion. Do not insert a dashboard, sample orders, or another task from the calibration examples: none is supplied by this draft.

No direct replacement is proposed because it would require inventing the missing advice. No optional suggestions.

Status: `INCOMPLETE`. The author must supply the missing criterion or context and revise the instruction. A final version still needs verification. No PASS or publication readiness is claimed.
