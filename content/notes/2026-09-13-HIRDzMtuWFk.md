# Source notes: Make skills improve after each run

- Video: [Anthropic Engineer Explains: What to Build Instead of AI Agents](https://www.youtube.com/watch?v=HIRDzMtuWFk)
- Creator/channel: Nate Herk / AI Automation.
- Published: 2026-09-13. Duration: 587 seconds, from yt-dlp metadata.
- Access: full auto-generated English captions retrieved with `node scripts/transcript.mjs` through yt-dlp. Read from 0:00 through the final caption at 9:46. Footage not watched.
- Initial sandbox attempt failed with WinError 10013. Scoped network escalation succeeded. Transcript remains in gitignored `.tmp/HIRDzMtuWFk.txt`.
- Qualification: editor requested the video and a Harness Firmware connection. The practical contribution is maintaining reusable skills through observed failures and checked revisions. No personal watch or learning claim inferred.

## Timestamped concepts

| Time | Source idea | Editorial treatment |
| --- | --- | --- |
| 0:23 | General-purpose agents equipped with skills | Confirmed the approach in Anthropic's engineering article; omitted the headline's replacement claim |
| 1:26 | Save repeated slide-styling code | Distinguish reuse from correctness on new content |
| 2:40 | Run again and confirm the saved file is called | Keep observable tool-log evidence |
| 3:17 | Load skill details as needed | Check current Claude Code docs; avoid promising every description is always fully loaded |
| 4:36 | Test direct, reworded, and unrelated requests | Original slide/email cases, fresh sessions |
| 4:55 | Turn corrections into procedural knowledge | Original diagnostic table maps failures to files and checks |
| 6:14 | Model differences survive shared skills | Keep portability caveat and existing comparison-guide link |
| 6:24 | Short quote about portable process | Exact five-word excerpt, without added punctuation |
| 6:46 | Check results before delivery | Output/evidence table |
| 7:59 | Verification needs evidence beyond the first draft | Distinguish subjective feedback from inspectable artifacts |
| 9:18 | Courses and communities | Promotion excluded |

## Placement and scope

New guide No. 54, Agents & Automation, practitioner; no course fields. Prepared in review status, then marked published at the editor's explicit request. Current main checked before shipping; number 54 remains available.

Read overlapping guides: Expertise you can install; Turn repeated fixes into rules; Loop the agent until the work passes; Every new repo starts with your lessons; Compare AI agents on your own work; the opening and sharing setup of One skills library for your whole team. The new lesson combines failure diagnosis with discovery tests and keeping a verified revision. Existing guides cover adoption, project guards, retry loops, architecture, runtime comparisons, and distribution separately. Link the actual intersections instead of expanding into team distribution or installation.

Prerequisite: an existing skill and a task whose output the reader can check. Exercise uses a failed case plus an earlier successful case. Prompt and test requests are original editorial material, not video transcriptions. No executable skill was installed or modified.

## Verification of sources

- [Anthropic engineering article](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills): skills specialize a general-purpose agent; evaluate representative tasks; keep supporting code and context in files. Author names Barry Zhang and Mahesh Murag confirm caption errors; the guide does not need to name them.
- [Claude Code skills docs](https://code.claude.com/docs/en/skills): description-based selection, on-demand full instructions, and description truncation in large collections. No claim of perfect routing or unlimited startup metadata.
- [Agent Skills specification](https://agentskills.io/specification): supporting directory conventions, script dependencies, implementation-dependent execution support. Shared format does not establish equal behavior across models.
- [Harness Firmware README](https://github.com/ryanportfolio/Harness-Firmware): current repository feedback loop, recall/refine, committed references, reviewed local changes, separately approved sync, and distinct runtime entry points. This first-party implementation is clearly separated from Herk's examples. No speedup or guaranteed self-improvement claimed.
- Access date for all documentation and repository sources: 2026-09-13.

## Exclusions and caveats

Omit the unverified claim that Anthropic has stopped building agents, numerical completion percentages, claims of guaranteed learning, and course promotions. Caption errors include Enthropic, cloud code, skill.mmd, and context rod. Use verified product and file names in prose; preserve the chosen quote exactly. Agent personas can find concerns but cannot substitute for sources, real user feedback, or tests.

Our additions: classify the failing layer before changing files; preserve a previously successful case; use bounded attempts; retain prior versions; do not require a change after every successful run. These are recommendations, not attributed experiments.

## Editorial review

Writing and layout pass: failure mapping and evidence comparisons use tables; trigger cases and exercise use lists; original prompt is copy-ready. Title and numbered headings are within site limits. Self-review only, not independent review.

Clarity pass, after a full reread including frontmatter:

| Before | After | Reason |
| --- | --- | --- |
| Its practical starting point is an observed gap on a representative task. | Start by running a typical task and observing where the agent struggles. | Replaces an unclear pronoun and abstract phrasing with an action |
| Reuse code and test discovery / Discovery needs its own test. | Reuse code, check skill choice / Check whether the agent finds the skill without being told its name. | Names the observable behavior |
| Our recommendation is to bound repair attempts. | Set a limit on repair attempts before starting. | Plain action; the original prompt supplies a two-attempt example |
| a direct request ... a nearby request | an explicit task request ... a similar request | Avoids confusing direct task wording with naming the skill |

Deliberately retained: `SKILL.md`, `recall`, `refine`, and `sync-starter` are exact file or skill names; Harness Firmware is the project name; the five-word source quote is unchanged. Renderer is used with slide-styling context. The prompt now permits a local repair and the exercise uses a copy, avoiding an unnecessary extra approval step for that requested edit.

Draft verification: copy lint passed, with 17 existing layout advisories and none for this draft. The attempted local build reran those gates successfully, then failed because `astro` is not installed. All four internal body links resolve to published guides with exact title text; prerequisite exists; exactly three self-check questions. `git diff --check` passed. Transcript is gitignored.

Publication: editor explicitly authorized merge and publication and waived local build verification. No dependencies installed. Catalogue assets regenerated for published status. Local Astro compilation and rendered layout remain unverified; deployment outcome is checked separately.
