# Held-out editorial excerpts

Audience: Practical users of coding agents, including people choosing a first task, checking an agent's changes, or deciding what to ask for next. Judge each excerpt within its stated context.

## H01

Context: A guide explains how much checking to request after an agent edits a project.

Apply a proportionate validation strategy to each edit. The appropriate level of scrutiny depends on the nature of the change and its potential consequences, so select checks that reflect those considerations.

## H02

Context: An agent has fixed a bug that occurs when a saved filter is empty.

Ask the agent to repeat the steps that produced the bug, then try the same page with a nonempty filter. If either case fails, give it the failing steps and ask it to fix that case before changing anything else.

## H03

Context: A user is deciding whether to accept an agent's completed code change.

Read the agent's summary and inspect the result before accepting the change. Pay attention to any areas that may need improvement, then ask a follow-up question that helps address the remaining concerns.

## H04

Context: A guide shows users how to find the code an agent changed.

Ask the agent to list the files it changed and explain each change in one sentence. This gives you a clear view of the modifications and helps you understand what changed across the affected files.

## H05

Context: A guide explains a retry option for an API request.

An idempotent operation has the same intended effect when repeated as it does when performed once. For this API's create-payment endpoint, retry with the same idempotency key so a lost response does not lead to a second payment. Check the endpoint's documented key-retention period; an old key may no longer prevent a duplicate.

## H06

Context: A guide helps users write the task they will give an agent.

Use a work request whose completion state can be established without reliance on broad qualitative interpretation. Exploratory work may not have a single pass-or-fail outcome, but the expected deliverable should still permit a shared understanding of completion.

## H07

Context: A guide summarizes a supplied internal evaluation. The evaluation records 20 bug-fix tasks completed in one repository, with 14 fixes passing that repository's checks. It does not measure other repositories or unattended production use.

In the supplied evaluation, 14 of 20 fixes passed the repository's checks. That result describes this set of tasks; it does not show how often the agent will succeed in your project or whether those checks caught every bug.

## H08

Context: A reader has never used a coding agent and needs to choose a first task from an existing project's backlog.

Start with a task that has suitable boundaries and a manageable level of complexity. Match the scope to your current confidence, and expand your use of the agent as you become more comfortable with the process.

## H09

Context: A writer is reviewing a checklist whose exact wording must remain available for discussion.

The checklist says, "Exercise appropriate judgment when reviewing agent output." That instruction leaves the reader to invent the review. Replace it with a specific check: "Run the steps that produced the bug and confirm that the result now matches the task's acceptance criteria."

## H10

Context: A guide helps users decide what to ask an agent after its first attempt fails. Some failures come from missing information; others come from an implementation error.

The reason for a failed attempt will not always be clear immediately. Retain active ownership of the correction process by assessing the available evidence and providing remedial direction that is responsive to the type of difficulty encountered.
