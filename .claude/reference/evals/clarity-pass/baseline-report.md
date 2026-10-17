## Excerpt review

**Reader's understanding:** These excerpts advise starting with a local trial, defining what the business counts, inspecting calculations, and checking behavior after a change. Several excerpts describe those actions without naming them plainly. The local/sample-data limits, technical definition, source attribution, and quotation constraint are recoverable and useful.

| ID | Judgment | Wording and reader impact | Specific edit |
|---|---|---|---|
| P01 | Suggestion | “Each step checks a different part of the software you are asking it to build.” This adds no concrete distinction beyond the preceding instructions. | Delete the final sentence. Retain the dashboard example and three actions. |
| P03 | Requirement | “Failures can reveal absences” is an unnatural heading. “Absences” does not tell readers what the counting error may reveal. | Use “Find out why the draft was counted.” If the intended subject is missing requirements, name the missing requirement in the example. |
| P05 | Requirement | “This action makes the relationship between the stated requirement and the resulting implementation available for inspection.” This laboriously explains the instruction that precedes it. | Delete the second sentence. “Ask the agent to show the calculation behind the dashboard total” already gives an inspectable action. |
| P06 | Requirement | “Give the reader a view of the result so they can form an understanding of what the system has produced.” The sentence repeats its purpose without identifying what to show. | At minimum: “Show the reader the result.” For actionable guidance, specify which result and where the reader should see it. |
| P07 | Requirement | “The act of recording the reason for the choice creates a basis for the later reconsideration of that choice.” Nominalizations bury the action; the independent excerpt also leaves “the choice” unidentified. | “Record why you chose [option], so you can reconsider the decision later.” Supply the actual decision or option. |
| P08 | Requirement | “introduce a changed condition and inspect the persistence of the surrounding behavior” makes a simple check sound abstract. “Surrounding behavior” has no clear boundary. | “Change one condition and check whether the behavior that should stay the same still works.” Name the unaffected behavior if this is an instruction for a particular trial. |

**Deliberately retained:**

- **P02:** Local execution and sample data establish useful limits. “A result you can inspect and mistakes you can correct” is natural.
- **P04:** “An outcome you can evaluate and errors you can repair” is clear, ordinary wording. No edit needed merely to replace its vocabulary.
- **P09:** The three sample orders and expected total make the rule checkable. Retain the accepted-but-unpaid case.
- **P10:** Retain “idempotency key.” The next words explain its purpose, and the second sentence supplies the expected behavior.
- **P11:** Retain both attribution and the limit on generalizing the result.
- **P12:** Retain the exact quotation and its stated role as an example of vague advice. No surrounding edit needed.

## Full-guide review

**Reader's understanding:** Business software can appear complete while implementing the wrong business rule. The reader should run a local prototype with sample records, settle definitions with the person responsible for the work, inspect behavior in the running application, then change a requirement and check the affected and unaffected cases. Specifications record intent but do not establish working or maintainable software. Department-specific meanings, unavailable checks, and the limits of Pocock's personal experience all remain explicit.

The title fits the main argument. The dashboard example connects the glossary, implementation, verification, prompt, and exercise. A reader needs no prior domain-driven-design knowledge: the guide introduces the term and limits the practice's scope.

### Requirements

1. **Replace the abstract sentence about effort and evidence.**

   > “A higher effort setting still leaves missing browser evidence unverified.”

   Missing evidence is not itself behavior that can be verified. The intended limitation is clear from the surrounding passage, but this sentence blurs it.

   **Edit:** “A higher effort setting cannot verify interface behavior the agent could not inspect.”

### Suggestions

1. **Cut the lede's generic closing sentence.**

   > “Each step checks a different part of the software you are asking it to build.”

   The preceding sentences already state the actions. This sentence adds no named distinction. Delete it.

2. **State the introduction's limit directly.**

   > “His account of a failed spec-driven workflow gives a useful limit: a detailed description of the desired software can coexist with code that gets harder to change.”

   “Gives a useful limit” is an awkward way to introduce the qualification.

   **Edit:** “In his account, detailed specifications did not prevent the code from becoming harder to change.”

3. **Make the link about building carry the concrete advice.**

   > “Questions can expose omissions; building can expose more.”

   “Omissions” and “more” compress the useful point into general advice. The next sentence supplies the action.

   **Edit the two sentences together:** “Keep unresolved decisions visible and [revise the requirements when a trial reveals an unanswered question](https://www.youtube.com/watch?v=Z8lf5oWKfj0&t=1107s).”

4. **Consider shortening the model-setting detour in section 04.**

   > “Pocock uses Opus 5.5 at medium effort…”  
   > “Anthropic's effort documentation describes a tradeoff…”

   These two paragraphs shift from verifying business behavior to comparing model settings. The link to the separate model-choice guide already provides a destination for that topic.

   **Optional edit:** Keep the comparison link and the warning about uninspected interface behavior; remove the detailed setting discussion. If retained, the existing attribution and qualifications should remain.

### Deliberately retained

- **“Ubiquitous language,” its definition, and the department boundary.** These explain a useful term without assuming expertise.
- **The microservices qualification.** It prevents readers from treating the linked architecture as a prerequisite.
- **The distinction between accepted and paid orders.** It makes the central business rule concrete.
- **The specification counterexample and its limits.** The guide does not turn one developer's experience into a general prohibition.
- **The PullQuote, unchanged.** It is attributed source wording.
- **The runnable-app evidence table and instructions to record unavailable checks.** These distinguish a working demonstration from an unsupported completion claim.
- **The client-contract caveat and separate production-readiness check.** Both preserve the scope of the prototype claim.
- **The prompt, exercise, and self-check answers.** They supply the approval point, local/sample-data conditions, change trial, and final record needed to act on the guide.

This is the initial editorial review only. Final-version verification has not been performed.
