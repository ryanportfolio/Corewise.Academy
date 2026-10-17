# Review 1: P01-P12

## What the reader can recover

These are independent excerpts, so there is no recoverable whole-article argument or title to assess.

| ID | Main point and next action | Conditions or limits recoverable from the excerpt |
| --- | --- | --- |
| P01 | Agree what an order means, check its implementation, and inspect a rule change. | A finished-looking dashboard can count the wrong event. |
| P02 | Choose an inspectable, correctable first task. | Keep the trial local and use sample data. |
| P03 | Ask why a draft order appeared in the total. | The heading does not identify what is absent or how a failure reveals it. |
| P04 | Choose a feature whose result can be assessed and whose mistakes can be corrected. | No further condition is given. |
| P05 | Ask for the calculation behind the dashboard total. | The second sentence says this permits inspection but gives no additional check. |
| P06 | Show a result to a reader. | Neither the result nor what the reader needs to understand is identified. |
| P07 | Record a decision's reason so it can be reconsidered later. | No further condition is given. |
| P08 | Change a condition and inspect other behavior. | The excerpt does not identify the condition or the behavior to preserve. |
| P09 | Use three specified order states and expect an accepted-order total of two. | Payment status does not exclude an accepted order from this count. |
| P10 | Reuse an idempotency key to recognize a retry and avoid another order. | The behavior is stated as an expectation: "should return." |
| P11 | Treat Pocock's faster replies as a result from his own setup. | That result does not determine the best setting for the reader's project. |
| P12 | Preserve the quoted source sentence when discussing its vagueness. | Only surrounding explanation may be edited. |

## Findings

- **P01, Suggestion.** "Each step checks a different part of the software you are asking it to build." This restates the preceding sequence without helping the reader perform it. Delete this sentence. Retain the opening example and all three actions.
- **P03, Requirement.** "Failures can reveal absences" is an unnatural, abstract heading. The instruction names a counted draft order, while the heading leaves the missing thing unspecified. Replace the heading with "Ask why a draft order was counted." Do not infer a missing requirement from the failure alone.
- **P04, Suggestion.** "an outcome you can evaluate and errors you can repair" is understandable, but "repair errors" sounds strained and the phrasing is formal for this audience. Use "a result you can check and mistakes you can fix." This is a phrasing preference, not a missing instruction.
- **P05, Suggestion.** "This action makes the relationship between the stated requirement and the resulting implementation available for inspection." The sentence laboriously explains the purpose already apparent in asking to see the calculation. Delete it. If the author intends a further comparison, name that comparison instead.
- **P06, Requirement.** "Give the reader a view of the result so they can form an understanding of what the system has produced." Both halves say to show a result, but neither identifies useful evidence. Ask the author: What result should be shown, and what should the reader check in it? Replace the sentence with that specific instruction. Merely changing "form an understanding" to "understand" would leave the missing action unresolved.
- **P07, Requirement.** "The act of recording the reason for the choice creates a basis for the later reconsideration of that choice." The nominalizations make a simple instruction needlessly difficult to read. Use "Write down why you made the choice so you can reconsider it later."
- **P08, Requirement.** "introduce a changed condition and inspect the persistence of the surrounding behavior" is awkward and hides the check in abstract nouns. Use "Change one condition and check whether the other behavior still works as expected." Before publication as a standalone instruction, identify the condition and the behavior that should stay the same.

## Deliberately retained

- **P02:** Already gives a plain selection rule and concrete limits. Keep "local" and "sample data."
- **P09:** The three records and expected count make the check executable. Keep the distinction between accepted and paid.
- **P10:** Keep "idempotency key." It is a useful technical term explained immediately. Keep "should"; do not turn the stated expectation into a verified guarantee. This editorial review does not establish a service's actual retry behavior.
- **P11:** Keep both attribution and the limit on generalizing from one setup. They are evidence, not disposable hedging.
- **P12:** Preserve "Questions can expose omissions." exactly. It is a quotation being examined, not the guide's unqualified advice. The surrounding instruction needs no edit.

# Review 2: H01-H10

## What the reader can recover

| ID | Main point and next action | Conditions or limits recoverable from the excerpt |
| --- | --- | --- |
| H01 | Match checking to the edit and its possible consequences. | No usable method for selecting checks is supplied. |
| H02 | Repeat the failing empty-filter case and try a nonempty filter. | Fix either failing case before making other changes. |
| H03 | Read the summary and inspect the result before acceptance. | The excerpt does not say what to compare or how to frame the follow-up. |
| H04 | Ask for changed files and one sentence explaining each change. | No further condition is needed to perform that request. |
| H05 | Retry the create-payment request with the same key. | The key-retention period limits duplicate protection; idempotence concerns intended effect. |
| H06 | Specify a deliverable whose completion both parties can recognize. | Exploratory work need not have a single pass-or-fail outcome. |
| H07 | Interpret 14 passing fixes out of 20 as a result from the supplied evaluation. | It establishes neither success in another project nor completeness of the checks. |
| H08 | Begin with a task that fits the reader's confidence and grow from there. | A first-time reader still lacks a concrete way to choose that task. |
| H09 | Replace a vague checklist instruction with a repeatable bug check. | The original checklist wording remains quoted for discussion. |
| H10 | Diagnose a failure and direct the correction accordingly. | The cause may initially be unclear; the supplied context distinguishes missing information from implementation errors. |

## Findings

- **H01, Requirement.** "Apply a proportionate validation strategy" and "select checks that reflect those considerations" give the reader a principle twice without a way to apply it. Use a plain opening: "Choose checks that cover what changed and what could break." Then name the checks for the kinds of edit discussed in the guide. Author question: Which edits and consequences should the reader distinguish here? Do not fill that gap with another sentence telling them to use judgment.
- **H03, Requirement.** "Pay attention to any areas that may need improvement, then ask a follow-up question that helps address the remaining concerns." This delegates the entire review method to the reader. Replace it with "Compare the result with the task's expected outcome. If they differ, show the agent the difference and ask it to correct it before you accept the change." Retain the first sentence's instruction to inspect the result.
- **H04, Suggestion.** "This gives you a clear view of the modifications and helps you understand what changed across the affected files." This repeats the preceding request. Delete it; the first sentence is sufficient.
- **H06, Requirement.** "a work request whose completion state can be established without reliance on broad qualitative interpretation" makes the central instruction harder to understand than the task it describes. The next sentence also uses abstract phrasing to carry a useful caveat. Replace both with: "Describe what the agent should deliver and how you will decide it is complete. Exploratory work may have no single pass-or-fail result, but you and the agent should still agree on the deliverable." Preserve the distinction between exploration and a fixed outcome.
- **H08, Requirement.** "suitable boundaries," "a manageable level of complexity," and "your current confidence" provide no selection method for someone who has never used an agent. Replace the opening with "Choose one backlog item with a result you can check, such as correcting a label or fixing a bug with repeatable steps." Follow with "Try a larger task after you can inspect and correct the agent's changes." The examples are proposed editorial additions; the author should choose ones that fit the actual backlog.
- **H10, Requirement.** "Retain active ownership of the correction process by assessing the available evidence and providing remedial direction that is responsive to the type of difficulty encountered." The phrase sounds administrative and never tells the reader what to do with the two possible causes stated in the context. Retain the first sentence, then use: "Ask the agent to show what failed and explain what information it needs. If a requirement is missing, clarify it. If the implementation does not match the request, show the mismatch and ask for a correction." Do not imply every initial failure has an immediately obvious cause.

## Deliberately retained

- **H02:** The empty and nonempty cases give the reader exact next actions and a stopping condition. No extra explanation is needed.
- **H05:** Keep "idempotent," its definition, "intended effect," the endpoint-specific instruction, and the retention caveat. Simplifying these away would change the technical claim.
- **H07:** Keep the numbers, the evaluation's limited scope, and the warning that passing checks need not catch every bug. The supplied context supports these qualifications.
- **H09:** Keep the original checklist quotation exactly. The surrounding explanation identifies the problem and offers a specific replacement. No finding.

# Review 3: Full guide

## What the reader can recover

**Main point:** Business software needs agreed business meanings, checks of observable behavior, and code that remains practical to change. A written specification alone does not supply all three.

**Intended next action:** Choose one local prototype using sample data. Have the agent inspect the project, ask about missing decisions, write a glossary and proposed behavior checks, and return a plan for review. After approval, inspect the running result, change one requirement, and check the changed and unaffected cases.

**Conditions and caveats:** The process owner confirms definitions. Different departments may use the same term differently. Pocock's experiences describe his own workflow and setup. The agent needs working services and browser access to produce the corresponding evidence. Model effort cannot replace missing evidence. Production readiness needs separate checks. The trial prompt requires permission before connecting accounts, changing real records, or deploying.

The title accurately describes the guide. The order moves coherently from decisions to vocabulary, maintainability, verification, stakeholder review, and a trial. The glossary supplies the context a reader needs without prior domain-driven-design knowledge. The frontmatter objectives, self-check answers, and exercise agree with that argument. I found no missing editorial step that blocks the trial as described.

## Findings

- **G01, Suggestion, lede.** "Each step checks a different part of the software you are asking it to build." This adds little after the concrete three-action sentence. Delete it, as in P01.
- **G02, Requirement, section 04.** "This establishes his preference, without measuring the best setting for your task." The construction "establishes his preference" is stiff, and the sentence makes a result appear to perform a measurement. Replace it with "Those results describe his setup; they do not tell you which setting will work best for your task." Keep the preceding attribution, reported outcomes, and connection to useful checks.
- **G03, Suggestion, section 04.** The two paragraphs beginning "Pocock uses Opus 5.5 at medium effort" and "Anthropic's effort documentation" shift from business rules and runnable evidence to model selection. The link to a separate model-choice guide already offers a place for that discussion. Consider shortening this passage to the attributed setup-specific result, the link, and "A higher effort setting still leaves missing browser evidence unverified." The existing passage is understandable and qualified; this is a scope preference, not a requirement.

## Deliberately retained

- The order-dashboard opening. It states a concrete failure and gives the rest of the guide a shared example.
- The decision table and glossary. Their different jobs justify keeping both: one records unanswered decisions; the other fixes agreed meanings and boundary cases.
- "Questions can expose omissions; building can expose more." Unlike the isolated heading in P03, this sentence follows a concrete table of decisions and immediately tells the reader to revise requirements when a trial exposes another. Its context supplies the meaning.
- "ubiquitous language" and the defined-business-area qualification. The term is explained, and the departmental example prevents a misleading rule that every department must use one global definition.
- The qualification about using this practice without adopting microservices. It limits the architecture implied by the linked source for the stated small-app audience.
- Pocock's quoted words in the PullQuote. Do not edit their grammar or capitalization as if they were the guide author's prose.
- The limits on the spec-driven-development account and client-contract advice. They explain what the cited experience can support.
- The behavior-evidence table and instructions to record checks the agent could not run. These turn a broad verification principle into inspectable evidence.
- The trial prompt's approval stages, local/sample-data limits, and explicit permission boundaries. They affect what the reader authorizes.
- The exercise's changed-requirement step. It checks a distinct objective: whether the code can accommodate change while preserving other behavior.
- The self-check answers. They preserve the distinctions between definitions, implementation evidence, missing access, and model effort.

## Review status

One initial editorial review only. G02 remains a required edit in the supplied full guide. The excerpt requirements are listed separately above. No source facts, links, code, runtime behavior, or mechanical checks were verified. No final-version verification has occurred, so this is not an editorial PASS.

