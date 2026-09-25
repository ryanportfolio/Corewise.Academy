# Theo: Getting the most out of Opus 5.5

- Source: https://www.youtube.com/watch?v=ejjBbaq9RmY
- Creator: Theo - t3gg.
- Metadata: yt-dlp reports upload date 2026-09-25 and duration 1,721 seconds (28:41). The local session date is September 24 in America/New_York; preserve the reported date rather than silently changing it.
- Retrieval: `node scripts/transcript.mjs` with yt-dlp, auto-generated English captions. Initial sandbox request failed with WinError 10013; scoped network access succeeded. Read all 850 caption lines, 0:00 through the closing line at 28:38. Footage not watched. Full captions stay in ignored `.tmp/ejjBbaq9RmY.txt`.
- Qualification: editor supplied this video to extend guide No. 59, which already uses the same Addy Osmani playbook. No personal watch claim inferred.

## Placement and contributions

Extend `keep-long-claude-code-tasks-on-track`; preserve its title, slug, catalogue number, and existing lessons. No new guide. The prior finish-line lesson already covers complete-task prompting, so repeating it here would add little.

| Time | Source material | Editorial use |
| --- | --- | --- |
| 2:55–3:32 | Complete task, screenshot, and PR as explicit end conditions | Already covered by guide No. 57; retain the existing prerequisite link |
| 5:18–8:48 | Remote run: named host and connection reference, configuration transfer, visible session, local computer-use limits, permission to ask if setup fails | New remote-handoff section and checklist; generalize private machine and repository names |
| 9:24–10:30 | Receiving session stopped after phase zero despite a multi-phase plan | Separate setup from implementation completion; do not imply the demo proves the whole job finished |
| 12:57–14:46 | Skatebench xhigh/max comparison and preference for high or xhigh | Added at the editor's request: reported 338 versus about 5,000 average tokens, 6 versus 50 seconds, and 78% versus 79% accuracy. Attribute to Theo and limit to his benchmark; recommend measuring the reader's task |
| 14:54–16:17 | Correct an active run instead of restarting; describes prior failures to retain earlier work | Existing correction example already addresses this. Exclude training-mechanism claims |
| 20:42–21:06 | Theo finds subagents less likely unless requested; general permission may still leave work unsplit | Explicitly name audit areas and require each agent's evidence; present observation as Theo's |
| 21:43–22:28 | Returning to old tasks; asks status, user needs, and risk of merging today | Copy-ready original review prompt asking for failure behavior, evidence, and missing checks |
| 22:30–24:37 | Theo uses other model families to review; acknowledges extra weak findings | Add second-model review as an option, with finding-by-finding verification. Exclude rankings and benchmark scores |
| 24:39–25:16 | Give the reviewer tools and ask it to identify claims it cannot verify | Make missing hardware, configuration, and subjective checks visible |

## Prerequisites and misconceptions

- Reader can define a deliverable and a behavior check using guide No. 57.
- A session appearing on another computer does not prove implementation has started or finished.
- Permission to continue does not grant unspecified access to other machines or secrets.
- A merge-risk answer is a review input, not merge approval or proof that a change is safe.
- A second model's agreement does not replace reproducible evidence.
- General permission to use subagents does not guarantee the model will divide the task.

## Exercise and quotations

Extend the current exercise with a merge-risk question and comparison against actual code/check output. Remote access is optional and is not required for the exercise.

Short quote candidate at 21:57: "What are the risks of merging this code today?" The guide paraphrases it in a timestamped link and keeps the existing Duncan pull quote. Added prompts and recommendations are explicitly original, not transcript copies.

## Primary-source checks

Read the relevant prompting, steering, task-file, and review sections of Addy Osmani's [Getting the most out of Opus 5.5 in Claude and Claude Code](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/). Confirms mid-run input, continuation boundaries, TASKS.md, explicit subagent division with evidence, and marking claims that could not be confirmed.

Read the verification section of Anthropic's [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices). Confirms runnable checks, visual checks, and a fresh reviewer. The remote example and preference for another model family remain attributed to Theo; no claim that arbitrary tools or hosts are available by default.

## Exclusions

- Browserbase sponsor, 0:56–2:28.
- Universal prohibition on max effort, and causal claims from the stalled-run anecdote at 4:19–5:12. The editor requested the substantial max-effort discussion be included; the guide now includes the attributed Skatebench comparison while preserving its limits. No raw benchmark runs were independently inspected.
- Design rankings and general screenshot tips, 16:19–18:17 and 27:29–27:48, beyond this guide's scope.
- Review benchmark rankings, universal model-quality claims, and explanations of reinforcement-learning internals.
- Safeguard, automatic switching, and reasoning-trace speculation, 25:42–27:17.
- Promotional future-video claims and closing endorsement.

## Editorial self-review

Used the Clarity Pass procedure as self-review, with prior source context. Reader restatement: preserve the active task in a file, name permitted work and blockers, verify the receiving environment and remaining phases, then inspect merge risks against evidence. Approval boundaries still apply.

The opening identifies the task-control problem without requiring either video. Theo is introduced before his first attributed example. The handoff requirements use a table; the review request is copy-ready. No title or existing quotation changed. Retained technical terms: repository, branch, runtime, TASKS.md, subagents, and merge; the guide targets coding-agent practitioners. No additional clarity rewrites needed after the draft pass.

This is a local editorial revision. Preserve the existing `published` status so a later content merge does not remove an already-live guide from the catalogue. No publication, commit, push, or merge is part of this revision.

## Token-saving companion

At the editor's request, link their [practical token-saving guide](https://savetokens.tips/guide). Read the live home and guide pages to confirm coverage of shorter replies, scoped reads, output filtering, and model routing. The link is further practical advice, not evidence for Theo's max-effort benchmark. Added section passed a self-review for attribution, numerical fidelity, and reader action.

## Ingest coverage-rule validation

The observed baseline omission was the effort comparison, excluded because the existing guide focused on task control and the evidence did not support a universal rule. The editor approved a narrow change to `.agents/skills/ingest/SKILL.md`: topic decisions before drafting and a coverage check afterward.

Expected behavior: retain useful attributed observations with limits, allow relevant additions to the existing outline, and still exclude sponsors, repetition, and unrelated material. A fresh agent received only the revised skill and a separate supplied source outline containing an effort comparison, setup-only handoff, repeated progress-file advice, a sponsor, and an unrelated camera purchase. It included both substantive additions, rejected the universal maximum-effort prohibition, referenced existing coverage, and excluded the sponsor and camera material. It also identified missing publication evidence.

Local acceptance: passed this bounded application check; retain the change. Improvement verdict: INCONCLUSIVE as a causal comparison, since the baseline was the observed session failure rather than a matched fresh-agent trial. Later real-task benefit remains pending. The Git diff against the parent commit preserves the previous skill for rollback. No other runtime's Ingest skill was changed.
