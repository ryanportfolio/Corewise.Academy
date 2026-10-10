# Source notes: build an AI setup for one work task

## Source and retrieval

- Video: [Stop Prompting Claude. Start Harness Engineering.](https://www.youtube.com/watch?v=bIYWxYm5cOY), Austin Marchese, published October 9, 2026. Title and date read from the expanded YouTube page. The initial tab title briefly showed an alternate title; the visible heading and settled tab title agreed on this title.
- Access: all 126 visible transcript segments read, not footage watched. Caption type was not labeled. Read every segment from 0:00 through the closing 16:15 segment, including exact-minute segments at 3:00, 10:00, 13:00, and 15:00.
- `node scripts/transcript.mjs` found yt-dlp, but both caption clients returned HTTP 429. Watch-page fallback returned no transcript. Browser export also reported no transcript. The visible Show transcript panel worked, matching the existing September 25 pitfall.
- Full caption text kept in gitignored `.tmp/bIYWxYm5cOY-browser.txt`. Obvious caption errors include "clawed code", "hardness", "Carpathy", and "McKenzie". Guide uses verified product spelling and does not quote uncertain names.
- Editor supplied the source and requested a highlight of harnessfirmware.com. No personal learning claim inferred.
- Video discloses Anthropic sponsorship at 5:10. Sponsor product tour is excluded.

## Placement

New guide No. 63, agents track, practitioner level, `status: review`. Fresh `origin/main` at `fd1fc8bf5b766de275f72221bb483033c88f5b54` contains Nos. 1-62. No existing guide combines choosing a narrow task, the parts of a custom agent setup, a source-based question workflow, and interface verification. Existing guides cover general business context, knowledge-base maintenance, skill repair, and agent comparison; link those at their intersections rather than repeat their lessons.

## Coverage before drafting

| Substantial topic | Timestamps | Decision and placement |
| --- | --- | --- |
| Existing agent software supplies tools and execution; work-specific additions extend it | 1:14-2:44; 6:55-7:20; 8:42-9:06 | Include in section 01, define harness, treat equation as an illustration rather than measured arithmetic |
| Startup trends, product launches, and universal 99% or speed figures | 0:25-1:10; 2:02; 7:13; 8:58; 11:44 | Exclude unsupported generalizations and decorative evidence; preserve practical extension advice |
| Makers, takers, shapers | 3:16-3:46 | Include brief attributed distinction in section 02; no unverified report attribution or claim that standard products cannot be useful |
| Choose work you know, narrow scope, design for one person | 2:52-5:03 | Include section 02 and original planning prompt; narrow personal-fit claim without suggesting superiority to named companies |
| Domain-selection and build prompts shown on screen | 4:55-5:03; 10:38-10:53 | Caption text lacks their contents; provide clearly labeled original prompt, never a transcription |
| Sponsor product tour and proposal example | 5:10-6:55 | Exclude disclosed sponsor material and release claims |
| Eight parts: rules, skills, connections, context, hooks, subagents, interface, feedback | 7:28-8:22 | Include eight-row checklist in section 03; optional parts need a demonstrated purpose |
| Knowledge graph for growing context | 7:45 | Already covered: link Set up an AI that knows your business and Keep a growing knowledge base accurate |
| Local-document knowledge answering, answer/sync separation | 9:14-10:14; 11:17-11:35 | Include section 04, explicit evidence and missing-answer checks; source-only instructions are not enforcement |
| Delegating hook/subagent choice to Claude Code | 10:14 | Include as optional rather than mandatory; any addition must have a named task and check |
| One-page interface with send, sync, and feedback | 10:22-10:38; 11:17-11:35 | Include sections 04 and 06; require proof that controls call the agent rather than return mock output |
| Desktop setup, free plugin, promotional build instructions | 10:46-11:17 | Use existing setup guide for prerequisites; exclude plugin promotion and version-sensitive click path |
| Feedback improves local data and procedure | 8:15; 10:30; 11:32-11:44 | Include sections 04-05; qualify that saving feedback does not train model weights; link Make skills improve after each run |
| Anti-slop agreement, subscription giveaway, channel promotion | 11:52-12:29; 14:20-14:28; 15:57-16:15 | Exclude promotion; keep 15:50 caution about using existing tools |
| Interface suitability, rapid local editing | 12:29-14:11 | Include section 06 as Marchese's preference and reader-testable advice; no blanket equivalence between products |
| Local interface and subscription cost | 13:33-13:40 | Include qualified note in section 06: execution/authentication determines billing; local hosting alone does not |
| Team expansion | 14:11-14:28 | Include brief permissions and ownership condition; link Build a knowledge base your team can ask; video explicitly leaves implementation out |
| "Karpathy curve": data, task breakdown, organizational choices | 14:52-15:47 | Include bounded attributed interpretation in section 06; no verified original Karpathy source or forecast asserted |
| Customization is not necessary for every task | 15:50-16:06 | Include in section 02 and exercise; compare effort before keeping setup |
| Harness Firmware connection requested by editor | First-party addition | Dedicated section 05 plus early direct website link, source and setup links; distinguish our implementation from Marchese's demo |

## Evidence and teaching choices

Prerequisites: access to an installed coding agent and a project folder; linked setup guide. Choose sample documents you can inspect. Do not assume the video proves reliability, tenfold speed, source restrictions, or model equivalence.

Useful misconception checks:

- An instruction to answer only from files needs evidence checks; it does not prevent every unsupported answer.
- A visible Send button needs a working connection to the agent.
- Saving feedback changes data or procedures, not model weights.
- A local webpage does not decide whether inference uses a subscription or API billing.

Exercise: choose a recurring question task; gather approved files; implement answer procedure before a new interface; test supported, missing, conflicting, and changed facts; fix one cause and compare complete runs.

Exact short quote candidate: "the highest and best use of your time is extending what's already there" (7:05). Full segment read; use only this 13-word excerpt with attribution.

## Verification sources

Read October 9, 2026:

- Anthropic, [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works): harness definition, gathering context, action, and verification; extensions add to the existing loop.
- Anthropic, [How Claude remembers your project](https://code.claude.com/docs/en/memory): instruction files versus enforced permission controls.
- Anthropic, [Extend Claude with skills](https://code.claude.com/docs/en/skills), [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp), and [Hooks reference](https://code.claude.com/docs/en/hooks): procedure files, connections, and event scripts. Avoid version claims.
- Anthropic, [Run Claude Code programmatically](https://code.claude.com/docs/en/headless): `-p` noninteractive calls, skills in prompt strings, project context, and JSON output. Bare mode skips instruction/skill discovery and subscription login; no bare-mode command prescribed.
- Anthropic, [Authentication](https://code.claude.com/docs/en/authentication): supported account types and API authentication; billing depends on the execution setup.
- [Harness Firmware website](https://harnessfirmware.com/): inspected visible website; direct links to memory, skills, and web creator. Website marketing claims are not independent measured evidence.
- [Harness Firmware README](https://github.com/ryanportfolio/Harness-Firmware): current default branch read through `gh api`, not an external local checkout. Confirms separate Claude Code and Codex files, shared committed project references, recall/refine/sync maintenance, and capability requirements. No skill counts copied.

## Editorial record

Audience: practitioners who already use a coding agent and want one repeatable work task to use their own documents and procedures.

Brief: Read the entire draft, including frontmatter, exercises, captions, and answers. Before proposing edits, state what a reader can recover from the draft alone: its main point, intended next action, and essential conditions or caveats. Review natural phrasing, sentence usefulness, and whole-piece fit against the house voice. Return concrete findings with exact quoted text or locations, reader impact, and a proposed edit or question. Distinguish requirements from optional preferences. Identify anything deliberately retained because precision or voice would suffer. Editorial judgment does not verify source facts. Do not rewrite quotations, code, identifiers, or technical caveats. Read only the draft and house voice, remain read-only, and do not delegate.

Initial draft SHA-256: `D56B405B9F481DE264DDCB4DE2EF1D1C8B68D9C89BD39ABF653B707E11752D82`.

Independent reader: `/root/editorial_reader`, dispatched with `fork_turns: none` and only the draft, audience, house voice, and unchanged brief above. The reader did not write the draft. Draft frozen while this review runs.

Initial review: the reader recovered the intended task, planning/building steps, and essential source, tool, interface, and billing caveats. One requirement: exercise 2 made a new project appear mandatory despite an audience with an existing folder. Accepted and clarified the exercise as a separate sample project, allowing an existing Firmware project. Section 05 now distinguishes the full template from the existing-repository Claude Code skills-only plugin, checked against the current README quickstart.

Optional wording findings accepted: "Customization earns its place..." became "Customize a tool when it repeatedly fails to do something you need"; the task checklist now says "how you will check it" rather than "evidence that would establish correctness".

Optional findings retained: the short closing Karpathy paragraph remains because it captures a substantial source topic as an attributed interpretation and a checkable local question, without asserting the forecast. "Original prompt" remains because ingest requires readers to distinguish our artifact from a source's screen-only prompt. The reviewer deliberately retained the harness definition, enforcement and billing caveats, feedback distinction, and concrete Firmware table.

Final draft SHA-256: `A356363292484706B5394877B28960EE9E103D5A2581835A715427EF0A6D4707`.

Independent verification: the same fresh reader read the revised full draft and confirmed the hash, the exercise and installation fixes, and the surrounding passages. Verdict: **PASS**, no editorial requirement remains. The reader's judgment was about writing; source facts were checked by the author against the evidence above.

## Final coverage and checks

The finished draft covers every included practical topic. Existing-guide links carry broader context organization, skills, knowledge-base maintenance, comparisons, and team use. Deliberate exclusions remain the sponsor release tour, promotions and giveaways, startup generalizations, and universal performance figures. The screen-only prompts were unavailable as text; the guide supplies an explicitly original prompt. The final discussion retains Marchese's interpretation without inventing an original Karpathy source or asserting a forecast.

Layout pass: the eight parts, answer cases, and Firmware procedures use tables; sequential work uses lists; new/existing installation paths use bold-led blocks. No paragraph advisories for this guide.

Content-only verification completed:

- `site/: npm run lint:copy`: passed em-dash and heading gates. Seventeen layout advisories concern existing guides, none this draft.
- `node scripts/readme-plate.mjs` followed by `--check`: passed. The review-status guide is excluded from the published catalogue, which remains 55 published guides. Generated SVG content was unchanged; restored generated files after verifying their diff was empty to remove line-ending-only working-tree noise.
- Frontmatter parsed with existing PyYAML and checked against the live schema. Valid track, level, tags, positive catalogue number and reading time, sources, date, review status, and exactly three question/answer pairs. Catalogue number 63 is unique in the fetched baseline.
- Every prerequisite and inline guide link resolves, and link text matches the target guide's exact title. Component imports resolve.
- Quote, source timestamps, and 126-segment coverage checked against the saved full transcript. No invented transcript prompts or quotations.
- `git diff --check`: passed. New-file whitespace inspected separately.
- No dependency installation, application build, unit tests, commit, push, PR, merge, or publication performed. A content draft does not require those actions. Source browser tabs closed; no dev server started.

Review draft: `site/src/content/guides/build-an-ai-setup-for-one-work-task.mdx`. Publication or review-PR shipping requires an explicit editor request; recheck current main and catalogue numbering before shipping.

## Publication authorization and checks

The editor subsequently requested: "merge and publish, skip opus review". This explicitly authorizes shipping and publication and waives the usual cross-vendor review for this change. The independent clarity-pass review above remains complete; no Opus review claimed.

Refetched main before shipping; it remains `fd1fc8bf5b766de275f72221bb483033c88f5b54`, with No. 63 available. Changed only the guide's publication status after editorial verification; its reviewed prose, questions, answers, prompt, and exercise are unchanged. Published-file SHA-256: `41481B473CF0518C7DCF2B945D478E648079619803977BB768543082DD2896E9`.

Regenerated catalogue assets for 56 published guides. Copy lint, schema and links, source timestamps and quote, README plate consistency, and whitespace checks passed. Content-only exception still applies: no dependency installation or local application build. GitHub checks and the production deployment are verified during the shipping handoff.
