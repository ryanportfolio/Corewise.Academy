# Prompting the newest Claude models

Consult when writing or editing a system prompt for the newest Claude models (Opus 4.5+,
Sonnet 4.6+, Fable 5, Mythos 5). These models are highly responsive to system prompts, so
language tuned for older, under-triggering models now backfires. Distilled from the CoreWise
guide `stop-shouting-at-the-model`, whose primary source is Anthropic's Claude prompting best
practices. For live model ids, pricing, and the exact 400 errors each migration throws, use the
`claude-api` skill rather than trusting version-pinned facts from memory.

## Turn the volume down

Forceful push-to-act language ("CRITICAL: You MUST use this tool", "NEVER", "ALWAYS") now
overtriggers: the model grabs the tool when a plain answer would do, or drops everything to obey
a nudge. Rewrite as a condition that names when to act ("Use this tool when..."). You are
steering a model that already listens.

- Cut blanket tool defaults ("if in doubt, use [tool]"). They push an already-exploratory model
  into more exploration. If it still over-explores at high effort, lower the effort parameter as
  a fallback.
- These models follow instructions literally. "Can you suggest changes" yields suggestions, not
  edits. Want action by default: say so as a command, or install a `<default_to_action>` block.
  Define autonomy once (what the model may do alone vs. what needs a human) instead of scattering
  "ask first" reminders.

## Two deprecated levers

Both return errors on the newest models. Replace at the concept level; confirm the exact
per-model status via the `claude-api` skill before you migrate.

- **Manual thinking budgets** (`budget_tokens`): replace with adaptive thinking
  (`thinking: {type: "adaptive"}`), depth set by the effort parameter plus query complexity. On
  Fable 5 and Mythos 5 thinking is always on and adaptive is the only mode. Anthropic's evals show
  adaptive beats the old budgeted thinking.
- **Last-turn assistant prefill**: each job it did has a new home. Format constraints go to
  Structured Outputs. Preamble goes away with a "no preamble" system instruction. Resume an
  interrupted response by continuing from the user message. Restore earlier context with tools or
  a conversation summary.

## Five standing behavior blocks

Install once in the system prompt (you are correcting a default), not as per-task reminders. Each
hands the model a condition, not a shout.

| Block | Prevents |
| --- | --- |
| `<use_parallel_tool_calls>` | Serial tool calls; pushes independent ones (speculative searches, multi-file reads, parallel bash) toward ~100% parallel |
| Subagent scope | Reflexive subagent spawns where a grep would do; restrict proactive subagents to parallel, independent tasks each in their own context |
| Minimalism | Extra files, unrequested abstractions, defensive bloat (scope, docs, defensive coding, abstractions) |
| Reversibility | Destructive, hard-to-reverse, or externally visible ops (deleting files, force-pushing, posting externally) without confirmation; also bans shortcuts like `--no-verify` |
| `<investigate_before_answering>` | Speculation about code the model never opened; read referenced files first |

## Audit checklist

1. Grep prompts for `CRITICAL`, `MUST`, `NEVER`, `ALWAYS`. For each, ask whether the model
   actually under-triggers there. If not, rewrite it conditional or delete it.
2. Find every `budget_tokens` and last-turn prefill. Swap budgets for adaptive thinking plus
   effort; swap prefill for Structured Outputs plus a "no preamble" instruction. Send one request
   per target model and confirm none returns a 400.
3. Add the reversibility and `<investigate_before_answering>` blocks to agent system prompts;
   confirm the model checks before a destructive shortcut and reads before it answers.

Source guide: `site/src/content/guides/stop-shouting-at-the-model.mdx`.
