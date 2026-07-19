# Stop hitting your token limit

Consult when a Claude session runs out its limit mid-afternoon, or when you are trimming a setup to make the budget last. The limit is a compute budget, not a token count: compute spent equals tokens consumed times the cost of the model that reads them. Every fix shrinks the tokens or downshifts the model. Distilled from the CoreWise guide `stop-hitting-your-token-limit`. For live model ids and pricing, use the `claude-api` skill rather than trusting version-pinned numbers.

## Audit before you optimize

- `/usage` shows how much of the limit is gone and what is using it. Two findings hit almost everyone: a large share running above 150K context, and a large share from subagent-heavy work. Both are token problems, not model problems.
- `/context` run twice. Mid-conversation it shows how fast the window fills. In a brand-new chat it shows the preload: everything loaded before you type. Tens of thousands of tokens at message zero is common, and that is your floor for every conversation you start.

## Shrink the tokens

Session habits first, they cost nothing:

- `/clear` when you switch tasks, so an old context does not ride under the new one.
- Reply while the prompt cache is warm. The discount expires after a few idle minutes; a cold cache re-reads the whole context at full price.
- Match the effort setting to the task instead of leaving it high for everything.
- Past about 60 percent on the context indicator, `/compact` folds history into a short summary.

Then clean the preload found in the audit:

- Delete MCP servers you do not use. Each loads its tool definitions into every conversation.
- Archive skills you never invoke; shorten the descriptions of the ones you keep. Names and descriptions load at every session start.
- Cut CLAUDE.md hardest. It is re-read on every message, so a 4,000-token file taxes every exchange. Keep it to how Claude should work with the project, a couple hundred lines at most, detail split into files loaded on demand.

Output is the same bill from the other side: every word the model says back is billed and re-read on every following turn. See the `thinking-on-a-budget` guide for the output half, from a one-line "be concise" to a full compression contract. The `caveman` skill is the tool for this: it strips articles and filler, allows fragments, swaps causal narration for arrows, and never shortens code, error strings, facts, or caveats.

## Downshift the model

- Rule of thumb: if AI could solve the task a year ago, it does not need a frontier model today. Scraping, summarizing, formatting, and fetching all run fine on a small model.
- Encode the choice in the skill definition so you do not re-decide every run. A skill can pin the model it runs on. It can also fork its context, starting on a fresh thread when it needs nothing from the conversation, which cuts the token side at the same time.
- The floor below the cheapest model is no model. A script runs the same way every time, costs zero tokens, and never hallucinates. Any deterministic step of a skill (renaming, parsing, moving files, formatting output) belongs in code; keep the model for the parts that need judgment.

## Riskier fixes, priced honestly

Exhaust the free fixes above first. These add a new failure mode:

- **Input compression** (for example RTK) sits between your commands and the model, deterministically stripping boilerplate from tool output before Claude reads it. The project claims 60 to 90 percent savings on the text it filters. Trade: another moving part in the pipeline.
- **Image-encoded context** (for example pxpipe) renders bulky text as PNG because dense text packs about three characters per image token against one per text token. Genuinely lossy: exact strings can come back garbled, and the pricing quirk it exploits may not last.
- **Further out**: route execution-heavy work to a second agent with its own budget, swap Claude Code's backing model for a cheaper provider via environment variables, or run an open model on your own hardware. Each buys capacity and sells something you may care about: model quality, control of your data, or evenings spent maintaining a server.

Source guide: site/src/content/guides/stop-hitting-your-token-limit.mdx
