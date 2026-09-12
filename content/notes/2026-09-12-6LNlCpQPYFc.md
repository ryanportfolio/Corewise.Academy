# How to Actually Choose the Right AI Agent

- Source: https://www.youtube.com/watch?v=6LNlCpQPYFc
- Channel: Nate Herk | AI Automation. Guest: Mark Kashef, verified in the video description.
- Published: 2026-09-11. Metadata duration: 2048 seconds (34:08).
- Accessed: 2026-09-12, at the editor's ingest request. No personal learning or watching claim is assigned to the editor.
- Retrieval: repository `scripts/transcript.mjs`, yt-dlp English auto-generated captions. Initial sandbox socket denial; scoped escalation succeeded. Metadata and description retrieved separately with yt-dlp.
- Coverage: read the entire returned transcript, 0:00 through the final caption at 34:06. Final caption ends mid-sentence ("because different models"); no ending reconstructed. Footage not watched. Full captions stay in gitignored `.tmp/6LNlCpQPYFc.txt`.

## Timestamped notes

| Time | Contribution | Editorial treatment |
| --- | --- | --- |
| 2:06 | Distinguishes model reasoning from tools and execution | Define harness once, confirm with Anthropic docs |
| 6:37 | Act, observe result, continue the loop | Summarize briefly; no new loop tutorial |
| 7:54 | Requests landing-page creation and local hosting | Example of separate file and execution capabilities; no general LM Studio limitation |
| 11:13 | Own reusable assets and adapt them across agents | Preserve instructions while testing app-specific requirements |
| 12:03 | Personal preferences for Claude Code and Codex | Exclude personality comparisons and rankings as unmeasured opinions |
| 17:26 | Shared skill structure, discovery differences, script invocation | Confirm shared format with Agent Skills specification; clarify runtime requirements |
| 18:46 | Monthly skill audit | Personal cadence, not a universal interval or scheduled action |
| 22:41 | rot.md and differing review intervals | Distill into recording when instructions last helped |
| 24:54 | Check whether skills still add value | Short caption-exact excerpt; compare with/without procedure |
| 28:14 | Keep rules while reducing procedure detail | Separate written guidance from enforced access controls |
| 31:14 | Project scope before global promotion | Confirm scopes in Claude Code documentation |
| 33:37 | Inspect setup before blaming model | Closing sentence incomplete; not quoted |

## Placement

New guide No. 53, `compare-ai-agents-on-your-own-work`, Agents & Automation, practitioner, status review. No course. Title revised at the editor's request to "Compare AI agents on your own work". Number is next in this checkout; recheck current main before shipping.

Read catalogue and overlapping guides: No. 9 covers capturing model process and routing; No. 22 rechecks model/effort choices; No. 30 trims instructions; No. 45 shares skill libraries. Their overlap is linked rather than repeated. This guide's distinct job is comparing complete agent setups, locating capability failures, and testing a skill after a move. Also links No. 35 for larger known-answer evaluations. Prerequisite No. 10 supplies skill basics.

## Exercise and misconceptions

Original editorial exercise, not a prompt copied from the video: identical sample inputs, predefined checks, separate workspaces, repeated runs, then move a skill and retest. No benchmark was run during ingestion and the guide reports no measured winner.

- Missing command access is not proof of weak model reasoning.
- A shared skill format does not guarantee identical tool support or runtime availability.
- Comparing different apps and models does not isolate the model's contribution.
- Removing a procedure does not justify removing access controls.

## Sources checked

- Anthropic, https://code.claude.com/docs/en/how-claude-code-works (2026-09-12): model/tools distinction, context-action-verification loop, execution environment. Used for the definition, not performance claims.
- Agent Skills, https://agentskills.io/specification (2026-09-12): required name/description, optional supporting files, compatibility requirements and implementation-dependent script support.
- Anthropic, https://code.claude.com/docs/en/memory (2026-09-12): project/user scopes; instruction files are context rather than enforced controls.

## Excluded material

Clay sponsor 9:26-10:29; promotional links; local-model percentage forecasts; product loyalty metaphors; unverified attribution that Boris Cherny advised deleting every skill after six months; leaked-code anecdotes; product release and IPO predictions; universal claims about Python portability or local model limitations. Captions garble names, so Mark Kashef comes from the description. No reconstruction of the truncated closing sentence.

## Clarity review

Self-review using Writing and clarity-pass, not independent review. Full frontmatter/body reread; named comparisons use tables and requirements use a list.

Rewrites recorded before final validation:

- "Check the execution boundary" became "Check what the agent can do". Names the reader's action.
- "Portable format is not portable execution" became "A shared format still leaves execution requirements to check". Removed compressed contrast.
- "Promote defaults after evidence" became "Keep changes local first". Replaced unexplained promotion shorthand.

Deliberately retained: harness, defined at first use; SKILL.md and compatibility, exact format identifiers; the short Mark Kashef quotation, exact caption words across 24:54-24:57.

## Verification

Follow-up: editor authorized `npm ci` and requested highlighting Harness Firmware. Added a dedicated first-party section with the current repository link and the existing No. 12 guide. Verified the current public README and the site's about-page description. The older guide/CTA uses AI Firmware branding and dated counts; the new section uses current naming and omits those counts. Six body guide links now resolve. Added the repository to sources and distinguished our implementation from the video. Cold-read added section; retained runtime file distinction, replaced vague portability claims with explicit checks.

- `npm run lint:copy`: passed. All 17 layout advisories concern existing guides; none concern this draft.
- `npm ci`: completed after editor authorization. npm reported nine dependency audit findings (two low, one moderate, five high, one critical); no dependency versions changed.
- `npm run build`: passed, 72 pages in 3.40 seconds. Initial attempt before installation lacked Astro; sandboxed attempt after installation hit filesystem access denials. Scoped escalation resolved the build without package changes. All copy gates passed with the added Harness Firmware section.
- `node scripts/readme-plate.mjs` and `--check`: passed, 45 published stars. Review guide excluded as expected; generated asset content unchanged. Original line endings restored to avoid unrelated modifications.
- Internal links: all six body guide targets and the prerequisite exist. No. 53 unique in this checkout; exactly three self-check questions.
- `git diff --check`: passed.
- Editor subsequently authorized merge and publication, including RTK and STK links in the how-its-built diagram. Guide changed to published; No. 53 checked against fetched current main. Publication build passed: 73 pages, 46 catalogue stars. No independent review claimed. GitHub CI and production verification follow the publication commit.
