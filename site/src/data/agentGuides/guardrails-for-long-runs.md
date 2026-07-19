# Guardrails for hours-long agent runs

Consult when configuring an agent (Fable 5) to run autonomously for many minutes or hours, and it hands back confident summaries of work it never did, wraps up early, or forgets findings across a context reset. Distilled from the CoreWise guide `guardrails-for-long-runs`, whose sources are Anthropic's prompting-Fable-5, best-practices, and managed-agent memory docs. For live model ids, pricing, and exact refusal or 400 errors, use the `claude-api` skill rather than trusting version-pinned facts from memory.

## Set effort, not model size

The effort parameter is the primary dial for intelligence, latency, and cost on Fable 5.

- high is the default and the right resting place for most work.
- xhigh for capability-sensitive work where getting it right beats getting it fast. Expect turns of 2 to 10 minutes.
- medium or low for routine tasks. Low on Fable 5 can still exceed xhigh on prior models, so cheap and fast is not dumb.

Rule of thumb: a hard task usually wants the same model at higher effort, not a bigger model. Saving money usually wants lower effort on Fable 5, not a downgraded model.

## Make the run check itself

The signature failure of a long run is the fabricated status report: the agent claims it ran the tests, fixed the file, or deployed, when it did none. One instruction is the fix.

- Add to agent instructions: audit every claim against tool results before reporting it. In Anthropic's testing this nearly eliminated fabricated status. A claim now has to trace to an observed tool result or it does not get made.

## Remove the token countdown

A running remaining-token counter reads to the model as a deadline, so it wraps up early and cuts work short.

- Do not show remaining-token counts to the model.
- If your software must show them, pair the number with an explicit reassurance that the model has ample context left.
- Set client timeouts for the runs you actually expect. Turns of 2 minutes or more are normal, not a hang.

## Memory that survives a reset

A run longer than one context window needs saved information that outlasts the reset.

- Give the model a memory system of Markdown files, one lesson per file, so a finding written 2 hours in is still readable 4 hours in.
- Small focused files beat one growing scratchpad. Same discipline the managed-agent memory docs recommend for their stores.

## Fresh eyes over self-critique

- Prefer a fresh-context verifier subagent over self-review. A model reading its own transcript shares its own blind spots; a subagent that reads only the finished work and the criteria does not.
- Keep the evaluator separate from the worker.

## Mid-task messages need an explicit nudge

- For a word-for-word message mid-task, define a `send_to_user` tool in your own software, then prompt for when and how to call it. Defining the tool alone is not enough; Fable 5 stays silent without the instruction.

## Do not try to read raw reasoning

- On Fable 5 `thinking.display` defaults to omitted and the raw chain of thought is never returned.
- An instruction telling the model to echo or transcribe its reasoning can trip the `reasoning_extraction` refusal, returning `stop_reason` "refusal" instead of work.
- Audit skills for show-your-thinking language written for older models ("show your thinking", "explain your reasoning step by step", "print your chain of thought"). Strip it, and set `thinking.display` to summarized to read structured thinking blocks.

Source guide: site/src/content/guides/guardrails-for-long-runs.mdx
