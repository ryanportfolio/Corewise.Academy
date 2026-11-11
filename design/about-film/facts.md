# Facts: every on-screen string and number, with its source

Checked 2026-11-10. "Portfolio text" is the owner's overview of fullbuild.ai
(home and about), taken from the local preview of fullbuild2 main `85dcc52c`.
The same strings live in `scripts/portfolio-content.mjs` in the private
`ryanportfolio/fullbuild2` repo.

## The film (sheet A-800)

| On screen | Source |
|---|---|
| Solving bottlenecks | Portfolio text, about page title: "Solving Bottlenecks" |
| A business grows only as fast as its slowest step | Portfolio text, "How I work with you" |
| Speeding up any other step changes nothing / The work still queues at the slow one | Same paragraph |
| REACH, ACQUIRE, CONVERT, EXPAND, BOTTLENECK | Diagram labels for step 1 |
| find you, get in touch, buy, come back | Step 1: "how people find you, get in touch, buy, and come back" |
| DROP OFF, WHERE CUSTOMERS DROP OFF, LOSES THE MOST | Step 1: "Find where customers drop off", "The stage that loses the most people is the bottleneck" |
| Find the slowest step together, Break the goal down, Build the fix, Test it many times, Hand it over, Continue to optimize | The six step titles |
| Find where customers drop off, Turn the goal into testable steps, Build fast, review every change, Repeat, score and compare, You own the code and the tools, Find the next weak point | The six step subtitles. The third is "Build fast. Review every change." on the portfolio, joined with a comma here because display text carries no periods |
| MORE GROWTH, MORE ADS, VERSION A, VERSION B, KEEP WHAT CONVERTS | Diagram labels for step 2 |
| BUILD, REVIEW, TEST, SHIP | Diagram labels for step 3 |
| REVIEWED INDEPENDENTLY · TESTED IN REAL USE, CONFIDENT MISTAKE · CAUGHT | Step 3: "AI also makes confident mistakes, so every change is reviewed independently and tested in real use" |
| AVERAGE, LOWER SCORE, HIGHER SCORE, FULL RANGE, ONE MARK PER RUN | Diagram labels for step 4, and "score every result" |
| CODE, TOOLS, FLOW, RUNS ON ITS OWN SCHEDULE, ALL YOURS | Diagram labels for step 5, and "It's all yours" |
| CHECK, NEXT WEAK POINT, FIX, COMPARE | Diagram labels for step 6 |
| Tell me what you want to build or fix / And what's slowing you down | Contact ending |
| HI@FULLBUILD.AI, RYAN ALLEN, WEBSITES, BRANDS, AND USEFUL SOFTWARE | Contact ending and footer |

Labels with no portfolio source, which describe the drawing itself: ARRIVING,
THROUGH, LOST, UNCHANGED, BEFORE, FASTER, FIXED, STEP n OF 6.

The film shows no business figures. Gauge lengths and bar heights are counts
from the seeded simulation that is on screen, and carry no units.

## The page (sheets A-001, A-600, A-650)

| Claim | Source |
|---|---|
| Guide count, reading minutes, guides per track | Computed at build from `site/src/content/guides` |
| Latter Design: browser editor for layered, animated shader backgrounds; saved-design library; PNG, video and HTML export | `ryanportfolio/LatterDesign` README |
| MAIMCOIL: Steam App ID 4975550, Tauri 2, Rust/Steamworks; 110K+ lines of TypeScript and Rust | `ryanportfolio/PixelSwarm` README. Line count: 113,666 lines across tracked `.ts`, `.tsx` and `.rs` files on the default branch, counted 2026-11-10 (the previous page said ~47k) |
| savetokens.tips: 45.3% of output tokens removed, 529,601 commands, 681.7M tokens saved, 12 habits | `ryanportfolio/savetokens` README, snapshot 2026-11-10. The site refreshes this daily, so the page prints the snapshot date |
| Harness Firmware: 54 Claude Code skills, 50 Codex skills, 8 core, 19 discipline, 27 specialist, MIT | `ryanportfolio/Harness-Firmware` README |
| Secure Wall: default deny, Windows 10 (21H2 or newer) and 11, built on TinyWall, prompt offers Allow outgoing, Always allow, Ignore; x64, arm64, x86 installers; alpha; GPL-3.0 | `ryanportfolio/SecureWall` README |
| STK: 16,384 byte threshold, 51,200 for Markdown, outline capped at 80 lines, 41 unit tests, MIT | `ryanportfolio/STK` `docs/usage.md`, `docs/dual-client-verification.md`, `Cargo.toml` |
| MAVVI: six flavors named Apple Crush, Berry Drift, Guava Hour, Matcha Mood, Pineapple Day, Vanilla Dusk | Asset file names in `ryanportfolio/mavvi`. The repo has no README |
| One-line descriptions and stacks for all twelve works | Portfolio text, "Selected work" |

## Open items

- `https://fullbuild.ai/prototype/mavvi/` returned 404 on 2026-11-10, so the
  MAVVI detail carries no link. Add `href` to its entry in `details` in
  `about.astro` once the portfolio update ships.
- `https://fullbuild.ai/about` also returned 404 on that date. The page links
  to `https://fullbuild.ai` only.
