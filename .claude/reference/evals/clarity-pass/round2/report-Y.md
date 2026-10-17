# Review 1: P01-P12

## What the excerpts establish

These independent excerpts advise a practical coding-agent user to define what an order means, try work locally with sample data, inspect calculations and changed behavior, and treat one developer's results as limited evidence. Their intended actions vary by excerpt. Some name an executable check; others ask the reader to supply the task, output, or behavior that the advice should identify. P11 preserves the important limit that one setup does not establish the best setting for another project. P12 requires preserving an exact quotation.

## Requirements

- **P01, Requirement.** "Each step checks a different part of the software you are asking it to build." The preceding sentences already name the work. This recap introduces an unspecified "different part" without explaining anything further. Delete this sentence. Retain the concrete opening and the instruction to agree on the order definition and inspect a changed rule.
- **P02, Requirement.** "Choose an initial task with a result you can inspect and mistakes you can correct." The local/sample-data limit is useful, but the second sentence gives a novice no way to choose a task. Ask the author: "Which first task should this reader try? Name it here and retain the local, sample-data limits." A synonym swap would leave the decision with the reader.
- **P03, Requirement.** "Failures can reveal absences." The heading makes the reader translate both nouns into the specific problem named immediately below. Replace it with "Find why a draft order was counted". Retain the question beneath it.
- **P04, Requirement.** "Choose a starting feature with an outcome you can evaluate and errors you can repair." This has the same unresolved choice as P02 and no additional context. Ask the author to name a suitable first feature and the observable result that would establish its completion. Do not merely replace "outcome" with "result".
- **P05, Requirement.** "This action makes the relationship between the stated requirement and the resulting implementation available for inspection." This laboriously restates what showing the calculation does. Delete it. The first sentence supplies a clear action.
- **P06, Requirement.** "Give the reader a view of the result so they can form an understanding of what the system has produced." Neither the result nor the way to inspect it is named. Ask: "What output should the reader see, and how should it be shown?" Replace this with the actual display or demonstration instruction once those are known. "Show the reader the result" would improve the rhythm but leave the advice incomplete.
- **P07, Requirement.** "The act of recording the reason for the choice creates a basis for the later reconsideration of that choice." The meaning is useful; the noun-heavy construction is stiff. Replace with "Write down why you chose it so you can reconsider that reason later." If the choice has a name in the actual guide, use that name instead of "it".
- **P08, Requirement.** "You can introduce a changed condition and inspect the persistence of the surrounding behavior." "Inspect the persistence" is an awkward way to describe a regression check. Replace with "Change one condition, then check that the behavior meant to stay the same still works." This preserves the general principle without inventing a particular feature.

## Deliberately retained

- **P09.** "Use three sample orders: one draft, one accepted but unpaid, and one paid. The accepted-order total should be two." This gives both inputs and an expected result. No edit.
- **P10.** "An idempotency key lets a service recognize a repeated request." The next sentence explains the consequence using an order. The technical term earns its place through that explanation. No edit.
- **P11.** "That result does not establish which setting will work best for your project." This is an explicit and consequential limit on the reported result. No edit.
- **P12.** Retain "Questions can expose omissions." exactly. Here it is a quotation being discussed, not an authored instruction. The surrounding explanation already tells the reader why it appears.

No optional suggestions. Editorial requirements remain; this is not a PASS.

# Review 2: H01-H10

## What the excerpts establish

These excerpts concern choosing a first task, checking changes, handling failed attempts, and interpreting evidence. H02 provides an executable bug check and a next action if it fails. H05 explains repeat requests and the limit of a payment endpoint's idempotency-key retention. H07 limits an evaluation to 20 tasks in one repository. Other excerpts correctly recommend checking and correcting work but leave the reader to invent the checks or correction. H09 explicitly preserves and critiques a checklist's quotation.

## Requirements

- **H01, Requirement.** "Apply a proportionate validation strategy to each edit" and "select checks that reflect those considerations." These sentences repeat the instruction to choose appropriate checks without giving the choice a usable criterion. Replace with "For a bug fix, repeat the steps that caused the bug and check a related case that should still work. For a calculation change, use inputs with a known answer. For an interface change, inspect the changed screen in the running app." These are concrete choices a guide can adapt to the edit types it covers.
- **H03, Requirement.** "Pay attention to any areas that may need improvement, then ask a follow-up question that helps address the remaining concerns." The reader is deciding whether to accept code; this advice never says what would justify acceptance or a follow-up. Replace the paragraph with "Read the agent's summary and compare the running result with the task's acceptance criteria. If a criterion fails, give the agent the steps you followed, the expected result, and what happened. Ask it to fix that case before you accept the change." If this guide has not established acceptance criteria, ask the author to provide the expected result before this step.
- **H04, Requirement.** "This gives you a clear view of the modifications and helps you understand what changed across the affected files." This is an empty recap of the preceding instruction. Delete it. Retain the instruction to list files and explain each change in one sentence.
- **H06, Requirement.** "Use a work request whose completion state can be established without reliance on broad qualitative interpretation" and "permit a shared understanding of completion." Both express a useful constraint in institutional language. Replace with "State what the agent should deliver and how you will decide it is done. For exploratory work, name the questions the report must answer, even if there is no single right answer." This retains the caveat about exploration and gives the reader something to put in the request.
- **H08, Requirement.** "suitable boundaries", "a manageable level of complexity", and "Match the scope to your current confidence" offer no selection rule to someone who has never used an agent. Replace with "Choose one backlog item that changes a single screen and has a result you can describe before editing, such as fixing an incorrect label or adding an empty-state message. Leave changes to payments or access permissions for a later task." The examples make the selection criterion usable. If those examples do not fit the intended backlog, the author should name a comparable first task from that backlog.
- **H10, Requirement.** "Retain active ownership of the correction process by assessing the available evidence and providing remedial direction that is responsive to the type of difficulty encountered." This makes the user invent the diagnosis and response, although the stated context supplies the relevant distinction. Retain "The reason for a failed attempt will not always be clear immediately." Then replace the second sentence with "Ask the agent to show the expected result, what happened, and any information it lacked. If a missing decision caused the failure, answer that question before it edits again. If the expected behavior is already clear, ask it to reproduce the failure and fix the code." This preserves uncertainty while providing a next action.

## Deliberately retained

- **H02.** "then try the same page with a nonempty filter" is a specific nearby case, and "If either case fails" gives a clear correction rule. No edit.
- **H05.** "An idempotent operation has the same intended effect when repeated as it does when performed once." This is the most technical retained passage, but the next sentence applies it to a lost payment response. The key-retention warning is consequential and readable. Retain the definition, endpoint instruction, and warning.
- **H07.** "14 of 20 fixes passed the repository's checks" identifies what was measured. "or whether those checks caught every bug" prevents a false inference from passing checks. Both limits matter. No edit.
- **H09.** Retain the exact quotation "Exercise appropriate judgment when reviewing agent output." Its surrounding sentences explain the deficiency and supply a specific replacement. "Acceptance criteria" is useful here because it refers to the task's stated expected behavior; the sentence does not ask the user to invent a review from nothing.

No optional suggestions. Editorial requirements remain; this is not a PASS.

# Review 3: full guide

## What a reader can recover

The title promises software organized around business rules, and the guide delivers that through an order dashboard example. Its main point is that agreeing on business terms and requirements is only part of building software: the user must also inspect running behavior and check that later rule changes preserve the cases that should still work.

The intended next action is a local prototype using sample data. The reader should answer the agent's questions, correct an order glossary, agree on inputs and expected results, approve implementation, inspect the running app, then change one requirement and inspect the result again. The provided prompt and exercise make those steps executable.

Essential limits are visible: different departments can use the same term differently; a glossary needs the process owner's agreement; Pocock describes his own experience; a specification does not prove an implementation; unavailable services or browser access leave behavior unchecked; a prototype is not evidence of production readiness; model settings need comparison on the reader's own task. The prompt also requires approval before accounts, real records, or deployment.

The business vocabulary is explained without assuming domain-driven-design knowledge. The guide's structure, tables, prompt, exercise, and self-checks fit its title. The optional model-setting discussion is brief enough to remain relevant because it returns to what the agent could verify.

## Requirements

1. **Lede: redundant abstract recap.** "Each step checks a different part of the software you are asking it to build." The preceding sentence already names the decisions and checks. "Different part" supplies no useful distinction. Delete this final lede sentence. This is the P01 issue in the full guide.

2. **Opening attribution: stiff framing.** "His account of a failed spec-driven workflow gives a useful limit: a detailed description of the desired software can coexist with code that gets harder to change." "Gives a useful limit" sounds like editorial scaffolding, and "can coexist" distances the reader from the concrete experience. Replace with "He describes keeping detailed specifications while the code became harder to change." The later section preserves the detail and the limit that this is one developer's experience.

3. **First-task instruction: generic advice duplicates its concrete example.** "Choose an initial task with a result you can inspect and mistakes you can correct." The same paragraph already supplies the appropriate task and limits. Delete this sentence. Change "For a software trial, a local dashboard using sample records gives you behavior to observe without changing real customer records" to "For a software trial, build a local dashboard using sample records before connecting it to real customer records." This gives the reader the first task directly and preserves the local/sample-data constraint. Retain Pocock's attributed recommendation and example of routine replies.

4. **Section 01: unnecessary abstract recap.** "Questions can expose omissions; building can expose more." The interview paragraphs have already explained questions that reveal missing requirements. This sentence recaps them in the exact abstract form the phrasing standard rejects. Delete it, and move its building link onto the action in the next sentence: "Keep unresolved decisions visible and [revise the requirements when a trial reveals one](https://www.youtube.com/watch?v=Z8lf5oWKfj0&t=1107s)." This retains the attribution link and the additional point about discovering decisions through a trial. Here the sentence is authored exposition, unlike the protected quotation in P12.

5. **Section 02: abstract opening where the guide already has an example.** "Give a business concept the same name in the conversation, requirements, interface, and code." The action is understandable but asks this audience to translate "business concept" into the order example. Replace with "If the people handling orders call an order 'accepted,' use 'accepted order' in the requirements, app, and code." Retain the following attribution, explanation of domain-driven design, definition of ubiquitous language, and departmental caveat. The technical term itself is not the problem.

6. **Section 04: awkward caveat about model preference.** "This establishes his preference, without measuring the best setting for your task." A preference is described rather than "established", and a setting is not what the account measures. Replace with "His results do not establish which setting will work best for your task." Keep the attribution to his setup and his reported faster replies and lower token use. This preserves the limit without stiff phrasing.

7. **Section 04 and self-check: name the unchecked behavior.** "A higher effort setting still leaves missing browser evidence unverified" confuses missing evidence with behavior awaiting verification. Replace with "A higher effort setting does not verify interface behavior the agent could not check in a browser." The self-check repeats the pattern in "Raising model effort does not supply the missing evidence." Replace that sentence with "Raising model effort does not check the service-dependent behavior or the interface." Retain the answer's instruction to run the missing checks in a working environment before accepting the claim. These edits preserve the access caveat and clarify what remains unknown.

## Deliberately retained and weakest passages checked

- "A small rule change requiring edits in many unrelated places is a reason to inspect the design." This is a broad design criterion, but it identifies the warning sign the reader can observe. Retain it; a general statement is useful here without a second example.
- "The practice is called ubiquitous language, meaning a vocabulary agreed by the people who know the work and the people building the software." The term is unfamiliar but immediately defined, followed by a departmental boundary and a concrete glossary. Retain it rather than substitute a vaguer label.
- "A rule change preserves other behavior" and "Checks for the new rule and the unaffected cases" are the least specific table entries. Retain them in this guide: section 03 already explains checking nearby behavior, and the prompt and exercise require selecting cases. They name the two kinds of evidence needed without pretending the exact new requirement is known in advance.
- "Treat the prototype as evidence of understanding; production readiness needs its own checks." This is general but consequential. The section concerns demonstrating understanding to a stakeholder, not a deployment checklist. Retain the boundary.
- "For this dashboard, show how the agreed order definitions change the totals." This gives section 05 an observable demonstration. Its following instruction to report implemented behavior, completed checks, and unresolved questions gives the stakeholder a useful correction point. Retain both.
- The PullQuote is an exact attributed quotation. Preserve its wording, including "code base". The prompt is code-fenced text; preserve it as instructed. It already specifies sample records, expected outputs, approval points, and unrun checks.
- The frontmatter objectives, description, prerequisite note, remaining self-checks, section headings, and exercise steps are readable and match the guide's practical outcome. No further editorial requirement found in them.

No optional suggestions. The guide needs the seven edits above and verification of the revised full draft. This initial review is not a PASS. Source facts, links, schema, and mechanical checks were outside this editorial review.
