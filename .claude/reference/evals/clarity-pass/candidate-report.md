## Excerpt review

Recoverable meaning: choose a small local trial, define and inspect expected behavior, record reasons for decisions, and check what survives a change. P09 supplies an exact expected count. P10 explains duplicate-request handling. P11 limits a reported result to its source. P12 explicitly protects a quotation.

Requirements remain:

| ID | Finding | Specific edit |
| --- | --- | --- |
| P01 | **Requirement.** “Each step checks a different part of the software you are asking it to build.” This recap adds no information about those parts. The preceding sentences already give the actions. | Delete the final sentence. Retain the opening example and instructions. |
| P03 | **Requirement.** “Failures can reveal absences” makes the reader translate two abstractions before reaching the concrete instruction. “Absences” could mean missing records, requirements, or checks. | Use the heading “Find out why the total includes a draft.” Retain the body sentence. |
| P04 | **Requirement.** “Choose a starting feature with an outcome you can evaluate and errors you can repair.” The meaning is recoverable, but “evaluate an outcome” and “repair errors” sound more formal than this advice needs. | “Choose a first feature with a result you can inspect and mistakes you can correct.” |
| P05 | **Requirement.** “This action makes the relationship between the stated requirement and the resulting implementation available for inspection.” This restates the benefit of the preceding instruction through abstract nouns. | Delete the second sentence. “Ask the agent to show the calculation behind the dashboard total” gives a complete, useful instruction. |
| P06 | **Requirement.** “Give the reader a view of the result so they can form an understanding of what the system has produced.” “Give a view” and “form an understanding” bury the simple action. | “Show the reader what the system produced.” |
| P07 | **Requirement.** “The act of recording the reason for the choice creates a basis for the later reconsideration of that choice.” The noun-heavy construction makes an ordinary instruction laborious. | “Record why you made the choice so you can reconsider it later.” |
| P08 | **Requirement.** “You can introduce a changed condition and inspect the persistence of the surrounding behavior.” “Persistence of the surrounding behavior” requires translation into the actual check. | “Change one condition and check whether the other behavior stays the same.” |

Deliberately retained:

- **P02:** “The first trial should stay local and use sample data. Choose an initial task with a result you can inspect and mistakes you can correct.” Both sentences give useful constraints in natural language.
- **P09:** “The accepted-order total should be two.” The three records make the expected result immediately checkable.
- **P10:** “An idempotency key lets a service recognize a repeated request.” The technical term earns its place through a clear explanation and the duplicate-order consequence.
- **P11:** “That result does not establish which setting will work best for your project.” This is a consequential limit, stated directly.
- **P12:** “Questions can expose omissions.” Retain the exact quotation. Here the phrase is the subject of criticism, rather than the guide's own advice. The surrounding instruction makes that distinction clear.

No optional suggestions.

## Full-guide review

Recoverable main point: business software needs agreed definitions, checks of actual behavior, and code that remains manageable when those definitions change. A specification records intent but does not prove the app works.

Intended next action: choose one local feature using sample data; have the agent interview the user; agree on terms and expected results; approve implementation; inspect the running app; then change a requirement and check the affected and unaffected cases.

Essential limits are clear: department-specific definitions can differ; Pocock's workflow and model-setting results describe his own experience; unavailable services or browser access leave behavior unverified; and a prototype does not establish production readiness. The title fits the body. The glossary explains the domain-driven-design vocabulary without assuming prior expertise. The prompt, exercise, and self-check answers support the same task.

### Requirements

1. **Delete the empty recap in the lede.**

   > “Each step checks a different part of the software you are asking it to build.”

   It neither names those parts nor adds a condition. The opening example and preceding instructions already establish the guide's purpose.

   **Edit:** Delete this sentence.

2. **State the specification limit without describing its rhetorical function.**

   > “His account of a failed spec-driven workflow gives a useful limit: a detailed description of the desired software can coexist with code that gets harder to change.”

   “Gives a useful limit” sounds like commentary about the explanation. “Can coexist with” also distances the sentence from the concrete experience it attributes.

   **Edit:** “In his account, code became harder to change despite detailed specifications.”

   The attribution and limit remain intact. Section 03 supplies the fuller account and its caveat.

3. **Replace the abstract benefit statement in section 01.**

   > “Questions can expose omissions; building can expose more.”

   The interview advice already explains the first half. The second half leaves the reader to supply what to build and what it might reveal.

   **Edit:** “Build a small trial to find decisions the interview missed.”

   Retain the following instruction to keep unresolved decisions visible and revise requirements.

4. **Name the business term before giving the general naming instruction in section 02.**

   > “Give a business concept the same name in the conversation, requirements, interface, and code.”

   “Business concept” makes this audience translate the category before acting. The dashboard example already supplies the term needed.

   **Edit:** “If the people handling orders call an order ‘accepted,’ use ‘accepted order’ in the requirements, app, and code.”

   Keep the following attribution to domain-driven design and the definition of ubiquitous language. Those passages explain the practice and its boundaries.

5. **Make the model-setting caveat a direct limit on the reported result.**

   > “This establishes his preference, without measuring the best setting for your task.”

   “Establishes his preference” comments on what the paragraph proves, although the preceding sentence already states his preference. “Measuring the best setting” is also awkward: a comparison measures results to identify a setting.

   **Edit:** “Those results do not show which setting will work best for your task.”

   Retain the report of faster replies and lower token use, its connection to useful checks, and the following comparison advice.

### Deliberately retained wording

- > “A small rule change requiring edits in many unrelated places is a reason to inspect the design.”

  This is one of the guide's broader judgments, but it names an observable symptom and a proportionate response. It does not claim that every multi-file change proves a design problem.

- > “The practice is called **ubiquitous language**, meaning a vocabulary agreed by the people who know the work and the people building the software.”

  The term is unfamiliar but defined immediately. The next sentences explain department boundaries and avoid implying that the reader needs microservices.

- > “Treat the prototype as evidence of understanding; production readiness needs its own checks.”

  This is compact and somewhat general, but the distinction matters. It prevents a working demonstration from becoming an unsupported production claim.

- > “A higher effort setting still leaves missing browser evidence unverified.”

  The sentence preserves an important practical limit. It connects model choice to the guide's verification advice without adding another example.

- The pull quotation stays unchanged, including its original wording. The source titles, code block, identifiers, and attributed technical qualifications need no editorial rewrite.

No optional suggestions. This is the initial review only; the requirements above remain unresolved.
