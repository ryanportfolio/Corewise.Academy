# Source notes: If You Ask Claude 5 Questions, It'll Make You Build 10x Faster

- Creator: Austin Marchese, interviewing Ryan Ouyang (AI engineer at Whop).
- Source: https://www.youtube.com/watch?v=fFktpPMQzjI
- Published November 10, 2026; duration 22:36, from yt-dlp metadata.
- Read all 728 English caption lines, 0:00 through 22:34. Retrieval: repository `scripts/transcript.mjs` through youtube-transcript.io; language `en`. Manual versus automatic caption type not supplied. Footage not watched. Transcript in gitignored `.tmp/fFktpPMQzjI.txt`.
- Caption corrections: "Ryan Oyang" is Ryan Ouyang and "WAP" / "WOP" / "W" is Whop, both per the video description. "Claw" / "Clawude" is Claude; "claw.md" is CLAUDE.md. The captions drop the word Whop in many lines.
- Qualification: editor-selected source for ingest. No personal learning claim inferred.
- Baseline: freshly fetched `origin/main`, `5a1ea9b3`.

## Conflicts of interest in the source

Marchese states at 9:02 that he is a Whop affiliate; the description's first link is an affiliate signup. At 13:24 he says he and Ouyang built an earlier startup (IYK) together. Whop's CLI, payments, ads, analytics, and benchmark data appear in every question. The guide discloses both relationships in its second paragraph and keeps only the method.

## Placement

New No. 68, **Five questions before you build with AI**, practice / broad. The catalogue has bottleneck automation (No. 8), whether an AI change is worth its cost (No. 62), scoring against known good answers (No. 35), and which human work keeps its value (No. 33). None gives one pre-build checklist that joins outcome, smallest first version, a leave-out list, guarded parts, and bottlenecks with a review schedule. Each overlap gets an inline link and stays short here. Not part of a course. `status: review`.

## Coverage decisions

| Topic | Time | Decision |
| --- | --- | --- |
| Hook, "10x faster", Whop valuation | 0:00-0:34 | Exclude. No measurement supports the multiplier |
| Q1: context and desired outcome | 0:34-3:59 | Include section 01. Keep the context list (2:07), the one number and deadline (2:43), stating the purpose behind the task (2:56), and the revenue-to-conversion example (3:47). Exclude the Whop CLI install |
| Q2: most important thing to build | 3:59-9:24 | Include section 02. Keep work only you can do (4:23), the two uses of that test (5:57), the car wash first version (6:41), and the three steps (8:02). Rename "secret sauce" and "MVP" to plain phrases. Exclude the Silicon Valley plot retelling and the Whop intelligence tool |
| Q3: what are you not building | 9:24-13:38 | Include section 03. Keep the database example (10:05), the three kinds of low-value build (10:45), using a service for payments and ads (11:20), and value per tool (12:05). Exclude the "99% of people skip" figure, the 195 countries claim, giveaway, subscribe request, and IYK funding figure |
| Q4: hot zones and evals | 13:38-17:15 | Include section 04. Keep the term hot zones once, the CLAUDE.md approval line (14:29), the three parts of an eval (15:18), and the report skill tested by hand (16:20). Add Anthropic's documentation: CLAUDE.md is not enforced, an `ask` permission rule is |
| Q5: bottlenecks | 17:15-19:44 | Include section 05. Keep the visitors and sales example (17:29), the avoidance quote (18:06), and the two checks (19:09). Exclude "procrastination is wisdom" as an aphorism |
| Asking again on a schedule | 19:44-22:00 | Include section 06. Marchese assigns questions 4 and 5 to the weekly list and 1 and 3 to the monthly or quarterly one (20:28). He leaves question 2 unassigned; the guide places it weekly from Ouyang's week-by-week description (20:07) and says so |
| Recap, Whop pitch, next video | 22:00-22:36 | Exclude |

## Source checks

- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests), read November 10, 2026: criteria should be specific and measurable ("Instead of 'good performance,' specify 'accurate sentiment classification'"); eval design principles are task-specific with edge cases, automate when possible, volume over quality. The fetch covered the first 100,000 of about 153,000 characters; the claims used come from that part.
- [How Claude remembers your project](https://code.claude.com/docs/en/memory): "Claude treats them as context, not enforced configuration."
- [Configure permissions](https://code.claude.com/docs/en/permissions): "Ask rules prompt for confirmation whenever Claude Code tries to use the specified tool." `Edit` rules apply to the built-in file-editing tools. A Bash command can still write files, so the guide limits the claim to the file-editing tools. No rule was configured or tested.

## Draft decisions

- One direct quotation, Ouyang at 18:06, ten words. Caption type is unknown, so the wording was not checked against the audio.
- The video shows its prompts on screen and the captions do not contain them. The guide's prompt, exercise, summary table, and the own-earlier-months fallback for benchmarks are original and labelled as such where the reader could mistake them for the source's.
- Marchese's definition of a hot zone is "critical parts of your work that you need to get right" (13:42). The guide uses that definition and his two examples.

## Validation

- Clarity pass: 23 rewrites after a cold re-read, listed in the pull request.
- `site/: npm run lint:copy`: em-dash and heading-length gates clean; the 17 layout advisories are all in other guides.
