# Source notes: review a visual plan before you build

- Source: [The ONLY 4 Things You Need To Prompt Like An Anthropic Engineer](https://www.youtube.com/watch?v=_NzakzRXzLI), Austin Marchese.
- YouTube page publication date: October 21, 2026. Duration: 20:13.
- Accessed October 21, 2026. Read all 163 timestamped caption segments, 0:00 through the closing segment at 20:04. Caption type was not labeled in the visible panel. Footage not watched.
- Retrieval: `scripts/transcript.mjs` found yt-dlp; caption requests returned HTTP 429, including its Android retry. The visible YouTube Show transcript panel succeeded. Saved its complete text in gitignored `.tmp/_NzakzRXzLI.txt`. A first scoped read omitted singular "minute" labels; the final extraction includes both singular and plural labels and the full missing 1:06-1:56 passage was read.
- The video embeds clips from Anthropic's [How the Claude Code team uses Claude Code](https://www.youtube.com/watch?v=S-sYlFiGFv8). Those clips were read in Marchese's captions; the full original interview was not reviewed. Attribute interpretation to Marchese, not to an independently verified interview.
- Editor supplied the source for ingest. No personal viewing or learning claim inferred.

## Placement and reader

New guide No. 65, **Review a visual plan before you build**, prompting / practitioner. Fresh `origin/main` at `0ae5ec86c40881b53424112bea0552d2f0f0490b` has a maximum guide number of 64. No course assignment.

Reader: someone already using Claude for work, with several unresolved choices before a build. The useful addition is a reviewable visual brief: alternatives, decisions, missing access, feedback, and workflow coverage. Guide No. 24 covers when to brainstorm; No. 57 covers completion criteria; No. 63 covers building a task-specific agent setup. Link their detailed procedures instead of duplicating them. No. 46 covers workflow shapes and No. 30 covers pruning old instructions.

## Coverage before drafting

| Topic | Time | Decision |
| --- | --- | --- |
| Introduction and 10x framing | 0:00-0:25 | Exclude unsupported universal speed claim; identify source in introduction |
| Goals versus prescribed solutions, with tasks still useful | 0:25-3:16 | Include in section 01: outcome, options, constraints, and room for exact tasks |
| Audit past prompts | 2:12-2:37 | Include bounded exercise using one supplied past request, without assuming chat-history access |
| HTML planning page, questions, mockups, inline comments | 3:16-5:50 | Include section 02 and original copy-ready prompt |
| Lavish example | 4:34-4:52 | Include optional contextual link after verifying repository; no install or efficacy claim |
| Visual-planning cost and when chat suffices | 5:50-6:40 | Include section 02: quick reply versus consequential visual or dependent choices |
| Solid sponsorship and searchable video library demo | 6:40-8:23 | Exclude sponsor claims, credits, budget and promotional demo |
| Access, context, feedback framing and 80% anecdote | 8:23-9:35 | Include three-part table; exclude 80% as quality threshold |
| Runnable development environment and connections | 9:35-10:55 | Include section 03: identify required tools and scope access; detailed setup already in No. 63 |
| Small-business build-connector skill | 10:42-10:55 | Exclude product-specific setup detour; no necessary dependency for visual planning |
| Context as decision principles | 10:55-12:17 | Include section 03: audience, scale, and priority rules |
| Verification versus user feedback | 12:17-13:35 | Include section 04: behavior check plus user outcome |
| Monthly review of feedback in messages and calls | 13:35-14:23 | Include section 04 as optional bounded review, with approved excerpts and evidence links |
| Keep human judgment | 14:23-14:33 | Include explicit human review of priorities and changes |
| Custom workflow, subagents, separate review roles | 14:33-15:51 | Include section 05; workflow shapes already covered in No. 46 |
| Visualizing dependencies and checking every item runs | 15:51-16:53 | Include section 05: plan arrows versus execution records |
| Subscription giveaway and channel promotion | 17:01-17:28 | Exclude |
| Detachment, pruning skills, changing tools | 17:28-18:49 | Include section 06; detailed procedure already in No. 30 |
| Altman clip and 30-product claim | 18:49-19:13 | Exclude universal product-building advice; small reversible trial retained |
| /doctor, fundamentals, cheap experiments | 19:13-19:45 | Include diagnostic limit and trial recommendation, with documentation |
| Problem-solving clip and closing promotion | 19:45-20:13 | Exclude generic recap and promotion |

## Evidence and drafting limits

- Quote candidate, Marchese at 5:50-5:57: "If you could answer in one quick message, just stay in the chat." Exact caption wording, 16 words. Other speaker names and screen-only prompts cannot be established from these captions; no quote or reconstruction claimed for them.
- Original prompt and exercise will be authored for this guide. They are not transcripts of the screen-only prompts.
- Current official docs checked October 21: [best practices](https://code.claude.com/docs/en/best-practices) for exploration before implementation, specific files/screenshots, interviews and runnable verification; [permissions](https://code.claude.com/docs/en/permissions) for scoped controls and plan-mode write restrictions; [memory](https://code.claude.com/docs/en/memory) for project instructions versus enforced settings; [subagents](https://code.claude.com/docs/en/sub-agents) for separate contexts, tool permissions and usage cost. [Commands](https://code.claude.com/docs/en/commands) confirms `/doctor` diagnoses setup and proposes fixes; that detail was removed for editorial scope, not lack of support.
- [Lavish repository](https://github.com/kunchenguid/lavish) redirects to `kunchenguid/lavish-axi`. Its current README confirms local HTML review, element/text comments and sending feedback to an agent. No promise of saved time; no package installation or runtime test.
- Visual mockups cannot prove usability, conversion improvement, execution coverage, or correctness. Keep outcome evidence separate from implementation checks.
- Do not recommend copying all private communications or treating fewer approval prompts as the goal. Identify the missing task input and appropriate permission.

## Final coverage and editorial review

Final coverage differs from the initial table in these places:

- Monthly personal-feedback review (13:35-14:23) excluded after independent editorial review: a work-relationship review adds a second purpose outside the visual build plan. Its useful principle remains in the product-feedback section. No implication that this segment was missed or unsupported.
- `/doctor` (19:13) excluded as an installation/setup detour. Official documentation verified its limited role; it cannot validate the usefulness of a plan.
- Detachment and pruning (17:28-18:49) retained in section 06, now applied to reopening the visual plan after trial evidence challenges an earlier choice. Detailed instruction-pruning methods remain in the linked No. 30.
- All other include/already-covered decisions in the table are represented in the final draft. Sponsors, giveaways, speculative multipliers and screen-only prompts remain excluded.

### Independent clarity review

- Reviewer: `/root/clarity_review`, fresh `fork_turns: none` subagent, read-only. Received only the draft, audience, house voice, fixed phrasing examples and the prescribed neutral brief. No inherited conversation or source notes.
- Initial SHA-256: `50FA50035E47C1BBA7F7D22BDBBA090E8B104F85F003FC12486DBA6E2C69D1D3`.
- Initial result: five requirements. Cut the personal-feedback detour; cut or connect section 06 to a specific planning decision; specify comparing a workflow with/without an extra worker; assign verification to the reader; replace "earns its cost" with a direct instruction.
- Weakest passages identified: "Save the current version, try a smaller change, and retain it only if it meets the same requirements with less work" lacked a specific comparison and clear referent. "Add a worker when its separate assignment helps the task, and compare the full cost with the simpler process" left the comparison unspecified.
- Author decisions: accepted four directly. Adapted the section 06 requirement by retaining the source's useful detachment point, applying it to the visual page and trial findings, and removing installation diagnostics. Inspected both weakest passages and replaced them with observable actions. Removed the unused command source from frontmatter.
- Revised SHA-256: `85159E31B89A70B04B29DF55591ABE681BA5BAB0B4A46C4F8C30B3898B468DF6`.
- Final verification: PASS from the same independent reviewer on the revised hash above. No unresolved requirements or regressions. The reviewer checked the full revised draft, self-checks and exercise. Full brief and working record in `.tmp/editorial-review/review-a-visual-plan-before-you-build/`.
- Final weakest passages inspected by reviewer and author: "Put each failed check or user complaint beside the decision it challenges" gives a concrete action in the review page; "Keep the earlier plan so you can compare decisions, but change a choice when the trial shows it failed" now has evidence supplied by the preceding paragraph; the with/without-worker comparison names a baseline and usage/review-time measures. Retained for these reasons. No later guide prose changes.

### Checks and handoff

- `npm run lint:copy`: PASS. All 17 advisory layout notices concern existing guides; none names this draft. Manual layout pass confirms the named comparisons use tables, the reusable prompt has one line per paragraph, and the exercise uses ordered steps.
- Frontmatter checked against live `content.config.ts`: PASS for required fields, allowed fields, types, enums, tags, date, positive integers, source shape and exactly three self-checks. Six inline catalogue links use exact titles and resolve; the prerequisite resolves. No. 65 is unique in this fetched catalogue.
- `node scripts/readme-plate.mjs` and `--check`: PASS. Published catalogue remains at 57 guides; review-status draft adds no published star or number. Generated SVG byte/line-ending-only changes restored to avoid unrelated churn.
- `git diff --check` and `git diff --no-index --check` for both new files: PASS.
- No site dependency installation, unit/type tests, or application build performed. This is content-only validation, not a build claim.
- Initial handoff: shipping was not authorized by ordinary ingest. Prepared with status `review`, without committing or publishing. Substantial editorial omissions: the monthly personal-feedback workflow and `/doctor` setup advice, for the scope reasons above.

### Publication authorization

The editor explicitly requested "merge and publish" on October 21, 2026. Set status to `published`; guide body is unchanged from the independently verified revision. Regenerate catalogue assets and rerun content checks before opening the PR. Cross-vendor Opus review, passing PR checks, production deployment success and a live-page check remain required before reporting publication complete.

### Cross-vendor publication review

- PR: https://github.com/ryanportfolio/Corewise.Academy/pull/302. Opus 5.5, high effort, one restricted read-only invocation on base `0ae5ec86c40881b53424112bea0552d2f0f0490b` through head `7c65cb1ae7e3d9ab5cd53bbdc53fc71f6e1a3e09`, six changed files. Launcher evidence PASS: exact model, eligible Max subscription response attribution, scope packet read, no permission denials, no changed tracked files and unchanged persistent configuration.
- No blocking defects. Verified and fixed all three minor observations: removed stale "review guide" wording in the source log; added the three inline citation timestamps missing from frontmatter; moved the pull-quote link from 5:57 to 5:50 so it includes the opening "If" in the previous caption segment.
- Checked the observations against the source registry, source-list renderer and caption segments at 2:53, 5:50, 5:57, 9:27 and 15:28. Unlinked frontmatter timestamps remain because they identify supporting passages used in the lesson. No guide prose or quoted wording changed. No second review invocation.
- Reviewer could not independently verify external docs or run builds. Those source checks and the content-only validation are recorded above; no application build claim is made. The earlier independent editorial verdict still applies to the unchanged prose.
