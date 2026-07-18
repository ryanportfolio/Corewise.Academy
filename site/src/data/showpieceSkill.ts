// The /showpiece skill file, offered for copy on the design-concept guide.
// Em dashes are swapped for house punctuation (site-wide ban); wording is
// otherwise the skill as distilled from the about-page build session.
export const SHOWPIECE_SKILL = `---
description: Recipe for making one-of-a-kind creative artifacts (PDF, site,
  deck, poster, video, any medium) that read as crafted, not AI slop. Use when
  the user says /showpiece, asks to "make something super creative", "push
  what's possible with X", wants a portfolio-grade / recruiter-facing artifact,
  or says "avoid AI slop". This is a thinking method, not a style; it produced
  the Approved Works drawing set and generalizes to any subject and medium.
---

# Showpiece: method for one-of-a-kind artifacts

Not a style guide. The drawing-set aesthetic is one output of this method;
copying it would itself be slop. The method is what transfers. Work the steps
in order; each one gates the next.

## Step 1: Find the load-bearing conceit

One metaphor, drawn from something **true about the subject**, that the whole
artifact lives inside.

- Start from the subject's most distinctive true fact, not from visuals.
  (Approved Works: "AI agents draft, an independent agent checks, a human
  approves" became an engineering drawing set with DRAWN BY / CHECKED BY /
  APPROVED title blocks.)
- **The test: the conceit must answer design questions for you.** What
  typeface? What does color mean? What goes in the margin? How are pages
  numbered? If the conceit only decorates and decides nothing, discard it and
  dig again.
- Generate 3+ candidate conceits before committing. Judge them on: truth to
  subject, decision-generating power, and distance from anything a template
  would produce. If the user asked for heavy exploration, run competing
  directions as parallel agents and judge with independent lenses.
- The conceit should permit **wit**: small details that reward close reading
  (a revision table that logs the artifact's own edits, a scale cell reading
  "1 TICK = 1 PR"). Wit is the strongest anti-slop signal because templates
  cannot do it.

## Step 2: Write the constraint contract

Before any layout, write binding rules the artifact must obey everywhere.
Constraints create coherence; coherence reads as intent; intent is what slop
lacks.

- Give visual elements **semantics**, then never violate them. (Line
  convention: solid = shipped, dashed = cancelled, phantom = unreleased. One red,
  spent only on human decision points.)
- Set budgets: one accent color with a stated meaning, one type system, one
  easing curve, N decorative notes per page max.
- Treat a contract violation as a **bug**, not a taste call. In review passes,
  hunt for violations explicitly.

## Step 3: Lock facts before form

- Collect every number, name, and claim the artifact will show. Verify each
  against the primary source **before** designing around it. Never design
  around an unverified number; reflowing later is expensive and tempts you to
  keep the wrong number.
- **Countable honesty:** if a graphic depicts N of something, draw exactly N
  real ones, and make N auditable. Decorative fake data is slop and, in front
  of an expert audience, a credibility hole.
- Write a tiny verify script that counts/checks the claims embedded in the
  artifact's source or output and fails loudly on mismatch. The artifact gets
  its own eval harness.

## Step 4: Earn the visuals with real machinery

- Build effects from actual math (true 3D projection, real geometry, seeded
  deterministic randomness), not filters, stock textures, or library defaults.
  Real machinery survives zoom-in, stays consistent across instances, and can
  do things (provable determinism, weight-encoded meaning) that pasted
  effects cannot.
- Prefer generated-from-data over drawn-by-hand: when the graphic is computed
  from the true numbers, honesty and beauty stop competing.
- Know the render target's quirks empirically: render a specimen early and
  inspect it (font fallbacks, missing glyphs, collapsed variable-font axes,
  antialiasing eating thin dashes). Assume nothing survives the pipeline
  untested.

## Step 5: Adversarial passes, minimum three

- Critique the **final rendered output** at full fidelity (rasterized pages,
  real-browser screenshots), never the source code or your memory of it. Most
  defects live only in the render.
- Use independent fresh-context reviewers with **distinct lenses**: the target
  audience's eyes, craft/typography, and a dedicated anti-slop detector.
  Distinct lenses catch what redundant ones miss.
- Every pass must produce concrete defects AND at least one opportunity to
  deepen the conceit. A pass that returns "looks good" was a wasted pass;
  instruct reviewers that finding nothing is failure.
- Fix blockers, re-render, re-verify counts, repeat. Stop only when a pass
  surfaces no contract violations and no factual errors.

## Step 6: Escalate across media, don't re-theme

Porting the artifact to a new medium (PDF to web, deck to video): keep the
conceit and the contract identical, and add **only what the new medium
uniquely enables**: interaction, live proof, steerable views, real-time
verification. The new version is the same work "upgraded", not a redesign. If
a feature was possible in the old medium, adding it now is noise.

## Anti-slop tells (hunt these in every pass)

- Default gradients, glassmorphism, purple-blue "AI product" palettes,
  centered hero + floating blobs.
- Decoration with no semantics; effects without a system; conventions applied
  inconsistently.
- Fake or unverifiable data in graphics; placeholder-flavored microcopy.
- Template symmetry: everything centered, everything rounded, nothing earns
  its position.
- Style borrowed from a past success instead of derived from this subject's
  truth (including this skill's own drawing-set look).

## Anti-patterns

- Don't pick visuals first and retrofit a story; conceit precedes style.
- Don't skip source-verifying a number because it "was right last time".
- Don't review source code as a proxy for the rendered artifact.
- Don't accept a review pass that found nothing.
- Don't carry a conceit to a new subject; re-derive from the new subject's
  truth.
`;
