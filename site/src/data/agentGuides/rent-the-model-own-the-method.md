# Capture the model's discipline

Consult when deciding which model runs a task, when you want to keep an expensive model's working discipline after it is priced up or capped, or when structuring a planner-and-worker split. The method survives; the model does not. For live model ids, pricing, and tiers, use the `claude-api` skill rather than restating version-pinned facts.

## Put the judgment in the plan, not the workers

Quality lives at the plan-and-verify layer. A strong planner over cheap workers matched a strong planner over strong workers in Nate's runs, for roughly one third the cost, because executing a well-specified step needs far less intelligence than designing it.

- The expensive model scopes, anticipates failure modes, and reviews each report, redesigning the next step from what came back.
- Cheap models execute the well-specified steps and report.
- Treat the top model as a senior engineer about to rotate off: have it review your setups, improve your skills, and explain its own reasoning while you still have access.

## Extract the discipline into a skill file

When a top model hands you a deliverable you love but cannot explain, do not just save the deliverable. Reopen the session and interrogate it: what did you consider, how did you verify, why does this work. Have it condense the answers into an installable skill file any model can run. Costs about 10 to 15 minutes at the end of a session; the discipline outlives the model.

Gate the skill through five stages:

| Gate | What it forces |
| --- | --- |
| Scope | Devil's advocate before any steps are listed |
| Evidence | Gather before reasoning |
| Adversarial reasoning | Attack your own draft answer |
| Verify | Evidence in hand before declaring done |
| Report | An honest read on how sure it is, not optimism |

Scoping is the gate that earns its place. Scoping is not planning. A plan lists steps; scoping first names every assumption that might be false and every unknown the plan walks past. The difference is invisible when things go right and decisive when they do not.

Auditing discipline to bake in: recognizing something from training does not mean it is current. A file implied to exist is not a file verified to exist. Check that what you did is what you think you did, against what the tools actually returned. Encoded as a skill, this discipline improves a mid-tier model and runs on anything, including models you host yourself.

## Route by table

Keep an explicit routing table for your toolkit, one row per model, scored 1 to 5 on three axes:

- Cost.
- Intelligence: reasoning strength, how well it follows you, reviews code, holds a long chain of reasoning.
- Taste: creativity, interface judgment, framing.

Taste gets its own column because it does not track intelligence. Collapse them and you route design work to a strong-but-tasteless model and hard debugging to a tasteful-but-weak one. Hand the table to your orchestrator and let it delegate against it.

## Spend by effort, and watch the ceiling

The pairing of model and effort is the real unit of choice, not the model name: published score-versus-cost curves show a top model on low effort landing near the previous tier on high.

Effort has a ceiling. Past a point, maximum effort buys longer runs, second-guessing, and worse output than the tier below on high. The tell is a response that argues against its own correct first answer. When you see it, route down.

Source guide: site/src/content/guides/rent-the-model-own-the-method.mdx
