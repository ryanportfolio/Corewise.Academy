// The /enhance-prompt skill file, offered for copy on the rewrite-your-prompt
// guide. Our working copy is compressed to save tokens; this version is
// expanded to plain prose for reading, with em dashes swapped for house
// punctuation (site-wide ban). The substance is the working skill.
export const ENHANCE_PROMPT_SKILL = `---
description: Use when the user asks to rewrite a rough request into a polished,
  copy/paste-ready prompt for another agent or a fresh session.
---

# Enhance prompt

Turn the rough request the user gives you into one polished prompt that a cold
agent can act on. Platform-neutral: the output should work in a fresh
coding-agent session, an IDE assistant, or a plain chat LLM.

Prime directive: every sentence in the output must change the receiver's
behavior. If a sentence changes nothing, cut it. 200 words of signal beat 800
words of repetition.

## Step 1: Extract the real goal

Look past the surface wording:

- "Review X" usually means audit and propose, not edit. Phase it.
- "Add feature X" needs scope, edge cases, and UI placement.
- "Fix bug X" needs repro steps plus current and expected behavior.
- "Refactor X" needs scope boundaries: which files, which patterns to keep.
- "Make it better / cleaner / faster" needs concrete success criteria.

If the request is genuinely ambiguous on a point that materially changes the
output, ask the user once before drafting. Otherwise proceed, and surface
assumptions as <TODO: confirm> placeholders.

## Step 2: Gather context for a cold receiver

The receiver has no conversation memory and may have no view of the codebase.
Add:

- File paths and line numbers. If it is greppable, include it: "Edit
  client/src/pages/Foo.tsx:142" is ten times more actionable than "edit the
  foo page".
- One existing pattern to match: "follow the pattern in bar.tsx:80-110".
- Current versus desired state, spelled out concretely for bug fixes and
  changes.
- No invented facts. If the user did not say it and you cannot verify it,
  write <TODO: user fills in>. Never fabricate.
- No big code dumps. Reference the file path; a receiver with repo access
  reads it. Quote the minimum only when the receiver clearly lacks repo
  access.

## Step 3: Write like a prompt engineer

Craft rules for the prompt body:

- Clear and direct. Write for a brilliant new employee with zero context on
  your norms. If a colleague with minimal context would be confused, the
  receiver will be too.
- Explicit action verbs. Models follow literally: "can you suggest changes"
  gets suggestions, not edits. For edits, write "Change / Implement / Fix X".
  For advice only, write "Propose / List, do not edit". Never leave
  act-versus-advise implicit.
- Say what to do, not what to avoid. "Write flowing prose paragraphs" beats
  "don't use markdown". Keep negatives only as scope guards ("don't refactor
  unrelated files").
- Give the why on non-obvious constraints. "Never use ellipses: the output is
  read by a text-to-speech engine" lets the receiver generalize correctly. An
  obvious constraint needs no why; that is padding.
- Calm imperative tone. No "CRITICAL:", no "YOU MUST", no all-caps. Modern
  models overtrigger on aggressive language and it reads as noise. A plain
  "Do X" is followed just as reliably. Strong emphasis on at most one
  genuinely blocking rule.
- Quality modifiers when quality is the point. If you want above-and-beyond
  work, say so concretely: "Include as many relevant features and
  interactions as possible; go beyond the basics."
- XML tags when content types mix. If instructions, pasted data, and examples
  share one prompt, wrap each (<instructions>, <context>, <input>, <example>)
  so data is not read as directive. A short single-purpose prompt needs no
  tags.
- Long pasted content at the top, task at the bottom. With 1,000+ tokens of
  logs or docs, material first and the question after measurably improves
  responses. For very long documents, add "quote the relevant parts before
  answering."
- A role line only if it changes behavior. "You are a senior security
  engineer reviewing for the OWASP Top 10" focuses a review; "You are a
  helpful assistant" is dead weight.
- Examples when format matters. If the deliverable has a specific shape
  (severity-tagged findings, a table layout), one or two short <example>
  tags beat a prose description.
- A self-check for verifiable work: "Before you finish, verify the change
  against [the failing test / a type-check / the listed criteria]." Match the
  check to the task; no generic "double-check your work" bolted onto
  everything.
- General solutions, not test-passers. When tests or specific examples are
  present, add: "Implement logic that solves the problem generally; do not
  hard-code values or special-case the given examples. If a test or
  requirement is itself wrong, say so rather than working around it."
- Grounding for codebase questions. If the task is answering questions about
  existing code, add: "Read the relevant files before making claims about
  them; do not speculate about code you have not opened."

## Step 4: Phase risky work

If the task touches user-visible copy, database schemas, public APIs, model
routing, payment logic, or a large refactor, split it into phases with a stop
between:

1. Phase 1: audit or propose only. Findings go to a plan file or inline. No
   file edits.
2. Phase 2: the user reviews.
3. Phase 3, as a separate prompt or a continuation: implement the approved
   subset.

Safe mechanical work (a typo fix, renaming one internal variable) stays
single-phase. In doubt, phase it: a skipped phase is cheap, a bad edit is
expensive to undo.

## Step 5: Specify the deliverable

Always include:

- The artifacts to produce: file edits, a markdown audit, a new component, a
  verification script.
- The format, if structured output is expected: table layout, severity-tagged
  list, JSON shape.
- A verification step matched to the task: type-check, screenshot, dry-run
  script.
- Scope guards. Common ones: "don't refactor unrelated files", "don't add
  tests unless asked", "don't install packages without confirmation". For
  tasks that invite gold-plating, add: "keep the solution minimal; no extra
  abstractions, configurability, or defensive code beyond what the task
  needs."
- An escape hatch: "If anything here is ambiguous or blocked, ask before
  proceeding rather than guessing."

## Step 6: Bake in project constraints

If the working directory has a project instructions file (CLAUDE.md or
similar), skim it for rules that touch this task and inline only those,
stated as plain constraints. The receiver may not have the file, so never
write "follow the project guidelines"; if a rule matters, it goes into the
prompt word for word. If it does not, it stays out.

## Step 7: Keep the output platform-neutral

The prompt must work regardless of who executes it. No named tools or
platforms ("use the Bash tool"), no UI directions ("click the X button in
the sidebar"). Instead: "run the following command", "search the codebase
for X", "edit the file at path:line". Give the what; prescribe the how only
when the how is itself the point.

## Step 8: Self-review pass

Reread the draft once as the cold receiver. If a colleague with minimal
context would be confused anywhere, rewrite that line. Then, for each
sentence: does it change the receiver's behavior? If not, cut it. Catch
leftover conversation leaks ("as discussed", "the file we looked at"); the
receiver has neither.

## Step 9: Output format

Deliver one fenced markdown block the user can copy as-is. Above the block,
add one or two sentences on what changed from the user's input. Do not
execute the prompt. Do not edit files while running this skill. The
deliverable is the prompt, nothing more.

## Anti-patterns

- No instructions the environment already handles: "read the project
  guidelines first", "use your available tools", "be thorough", "think step
  by step". An agent harness injects these automatically; a chat LLM has
  neither. Dead weight either way.
- No padding. A sentence that does not change receiver behavior gets cut,
  including the goal restated in new words.
- No invented ceremony. A typo fix needs no five-phase plan, XML tags,
  examples, or role line. Prompt complexity matches job complexity.
- No shouting. "CRITICAL" and "MUST" in caps overtrigger and dilute the one
  rule that might actually be blocking.
- No placeholders for facts you can verify. If you can read the code or grep
  the path, do it; do not write <file path>.
- No overriding the user's clear choices. Decided means encode as-is; open
  means ask, or flag a <TODO>.
- No pre-writing the receiver's reply. Specify what the receiver should
  produce, nothing more.
`;
