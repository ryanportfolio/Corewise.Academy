# Editing excerpts from a guide to business software

Audience: people using coding agents to build small business applications. Each numbered item is an independent excerpt. Treat the stated context as complete; do not assume a missing surrounding article supplies a definition.

## P01

An order dashboard can look finished while counting the wrong event. Settle what the business means by an order, give the agent a way to check that rule, and inspect what happens when the rule changes. Each step checks a different part of the software you are asking it to build.

## P02

The first trial should stay local and use sample data. Choose an initial task with a result you can inspect and mistakes you can correct.

## P03

### Failures can reveal absences

Ask the agent to explain why a draft order appeared in the total.

## P04

Choose a starting feature with an outcome you can evaluate and errors you can repair.

## P05

Ask the agent to show the calculation behind the dashboard total. This action makes the relationship between the stated requirement and the resulting implementation available for inspection.

## P06

Give the reader a view of the result so they can form an understanding of what the system has produced.

## P07

The act of recording the reason for the choice creates a basis for the later reconsideration of that choice.

## P08

You can introduce a changed condition and inspect the persistence of the surrounding behavior.

## P09

Use three sample orders: one draft, one accepted but unpaid, and one paid. The accepted-order total should be two.

## P10

An idempotency key lets a service recognize a repeated request. Reusing the key should return the first order instead of creating another one.

## P11

Pocock reports faster replies in his own setup. That result does not establish which setting will work best for your project.

## P12

The source's exact wording is "Questions can expose omissions." The guide quotes that sentence as an example of vague advice. Preserve the quotation; edit only the surrounding explanation if needed.
