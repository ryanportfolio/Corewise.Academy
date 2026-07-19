---
description: Rewrite user-visible copy so a reader with zero domain knowledge gets it on first read. Use when the user says /stranger-test, calls copy ambiguous or confusing for the average person, or before writing captions, legends, or labels.
---

# Stranger test — copy must land with zero context

Every sentence of user-visible copy gets one read from a stranger who knows nothing about the craft, the tool, or the metaphor behind it. If that read fails or lands on the wrong meaning, the sentence is broken, even when every individual word is plain.

Born from a real failure. A figure caption said "Outputs are weight-graded: heavy convergence, medium divergence, fine for what only one model saw." The author meant drafting line weights. The reader parsed "fine" as "acceptable." A first rewrite, "Line weight marks agreement: heavy where the models agree, medium where they split, thin where only one saw it," was still too ambiguous: an average reader does not know what "line weight" is or why lines would encode anything.

This skill goes deeper than word swaps. `/plain-words` fixes fancy words; this fixes sentences whose words are plain but whose meaning still needs insider context to decode.

## Step 1: Find the insider frame

Read the sentence and name the knowledge it silently assumes: a craft vocabulary (drafting, typography, nautical), a system's internal names, a metaphor the author built elsewhere, or a convention like "line thickness encodes importance." If understanding depends on any of these, the sentence fails the test.

## Step 2: Check for double readings

A word with a domain meaning and an everyday meaning ("fine," "weight," "bleed," "kill") defaults to the everyday one in a stranger's head. Broken parallel structure makes this worse: when a list changes shape mid-sentence, the reader re-parses the last item with everyday grammar. Either reading being wrong means rewrite.

## Step 3: Rewrite from what the reader can see

Describe the observable thing and say plainly what it means, in that order. Do not name the convention; show its effect.

- Broken: "Outputs are weight-graded: heavy convergence, medium divergence, fine for what only one model saw."
- Still broken: "Line weight marks agreement: heavy where the models agree, medium where they split, thin where only one saw it."
- Fixed: "Thicker lines mean more models agreed: the thickest carry what every model said, the thinnest what only one model noticed."

The fixed version works because "thicker" is visible on the page and "more models agreed" is the meaning, stated directly. No legend, no craft term, no decoding step.

## Step 4: Rerun the test on the rewrite

The first rewrite usually swaps words but keeps the insider frame. Read the new sentence as the stranger again. Ask: does this sentence require the reader to already know why the visual looks the way it does? If yes, go back to Step 3.

## Step 5: Sweep siblings

A failed sentence rarely fails alone. Check the surrounding caption, section, or page for copy leaning on the same frame, and fix those too.

## Anti-patterns

- Don't stop at plain words. Plain words inside an insider frame still fail the test.
- Don't add a legend or definition to rescue a term. Replace the term with what the reader sees.
- Don't assume the site's own coinages are known. The stranger has never seen any other page.
- Don't preserve a metaphor because the author likes it. The reader's first parse wins.
- Don't apply this to code, API names, or error strings. User-visible prose only.
