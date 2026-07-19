# Brief the model like a brilliant new hire

Consult when writing or editing a prompt and the output is vague, off-format, or misses context you never stated. These are the prompt fundamentals that hold across every current Claude model. The model is a sharp new employee with zero context on your job, your conventions, or what "good" means here. Distilled from the CoreWise guide `brief-the-model`, whose source is Anthropic's Claude prompting best practices. For live model ids, use the `claude-api` skill rather than restating version-pinned names.

## Run the colleague test

If a coworker with minimal context would be confused by the prompt, the model will be too. Read the prompt as someone who just joined and knows nothing. Every spot they would stop and ask a question is a spot the model guesses.

- Want the above-and-beyond version, ask for it. Have a format in mind, describe it. The model cannot infer what you never stated.

## State the motivation, not just the rule

Give the reason behind a rule, not the bare rule. The model generalizes from a motivation to cases you never listed.

- "NEVER use ellipses" covers one symbol. "Your output will be read aloud by a text-to-speech engine, so avoid anything that does not read cleanly when spoken" also drops the emoji, stray markdown, and tables that read as noise.
- If prompts lean on forceful bans and the model over-corrects, see `stop-shouting-at-the-model` (agent guide: `prompting-newest-claude-models.md`).

## Show, tag, give a role

Three techniques that carry across every model.

- **Examples**: wrap three to five in `<example>` tags inside an `<examples>` block. Make them relevant and diverse, not near-copies. Demonstrations teach output shape better than description; diversity stops the model latching onto one shape.
- **XML tags**: when a prompt mixes instructions, context, and the thing to act on, tags stop the model from confusing one for another. Name them for what they hold (`<instructions>`, `<context>`, `<input>`), keep names consistent, nest for hierarchy. A document with its own embedded instructions will not be mistaken for yours if it sits inside `<input>`.
- **Role**: one sentence in the system parameter ("You are a helpful coding assistant specializing in Python") focuses tone and behavior. System parameter holds standing character; the user turn holds the task.

## Order documents, question last

For inputs past 20k tokens, put the longform documents at the top and the query at the very end. Anthropic reports end-placed queries improved response quality by up to 30 percent on complex multidocument tests.

- Give each document its own `<document>` tag with `<document_content>` and `<source>` subtags.
- For fact-pulling work, ask the model to pull relevant quotes into `<quotes>` tags before it answers, so each conclusion traces back to its source.

## The model does what you literally say

- "Can you suggest some changes" returns suggestions, not edits. Want the edit made, use the imperative: "Change this function to handle the null case."
- Same literalness governs formatting, and it steers best when you say what to do, not what to avoid. "Write in flowing prose paragraphs" beats "don't use bullet points."
- Want less markdown in the output, strip markdown from your own prompt. The model matches the style it is handed. Tell it the target, not the sin.

## The fundamentals side by side

| Fundamental | The move | Why it holds |
| --- | --- | --- |
| Colleague test | Read the prompt as a context-free coworker | Every unasked question becomes a guess |
| Motivation | State the why behind each rule | The model generalizes past the named case |
| Examples | 3 to 5 diverse, tagged demonstrations | Demonstrations beat description |
| Ordering | Documents on top, query at the end | Up to 30 percent better on multidocument tests |
| Literalness | Imperative phrasing, positive steering | The model does what you literally say |

Source guide: site/src/content/guides/brief-the-model.mdx
