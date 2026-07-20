# Copy rules

Editorial rules for every word that ships on the site. These apply to guide prose,
frontmatter strings, UI labels, page titles, meta descriptions, alt text: anything a
visitor can read.

## Em dashes are banned (editor ruling, 2026-07-17)

No em dash (U+2014) anywhere on the site, ever. It reads as an AI-writing tell and
the publication's bar is zero AI-slop perception.

- Prose: replace with a period, comma, colon, or parentheses, whichever reads best.
  Recast the sentence if needed.
- Label-style separators ("Vol. I · MMXXVI", "BROAD · naked eye", page titles):
  use " · " (middot with spaces), the existing house separator.
- No lookalike substitutes: no en dash (U+2013) standing in for an em dash, no
  double hyphen.

## Headings never end with a period (editor ruling, 2026-07-17)

No trailing period on any heading: h1-h6, section titles, kickers, panel labels,
figure titles. "The pipeline behind the atlas." → "The pipeline behind the atlas".
Applies sitewide, all pages and guides. Question marks and other terminal marks
are allowed only when the heading genuinely is a question.

Periods never appear on big font at all, including mid-text: hero and display
lines drop internal sentence periods too ("Start anywhere. Every guide builds."
→ "Start anywhere / Every guide builds" as stacked lines). And headings
stay short enough to sit on one line at their rendered size; if a heading
wraps, shorten the words, not the font. Hard caps, browser-measured at
desktop width (editor ruling, 2026-07-18): guide titles ≤ 41 chars, section
headings ≤ 32 chars. Enforced by `site/scripts/heading-length.mjs`, which
runs in `npm run build` and `npm run lint:copy` alongside the em-dash gate.

Enforcement: `site/scripts/no-em-dash.mjs` runs first in `npm run build`
(`npm run lint:copy` runs it alone) and fails the build with file:line:col for every
hit in `site/src`. Vercel runs the same build, so a violation cannot deploy. The
/ingest and /create-guide skills both restate the rule at writing time; the gate is
the backstop, not the process.

## Titles are plain and specific (editor ruling, 2026-07-17)

Every title (guide, page, section) says what the reader gets, in plain words,
before any wordplay. The test: a reader who has not opened the piece can say what
it is about from the title alone. If decoding requires the body, retitle.

- Evocative is welcome only on top of specific ("Thinking on a budget" names its
  topic; "The firmament moved" decodes to nothing, so nobody clicks).
- The description is a concrete promise, not atmosphere, and it is not a rescue
  hatch for a cryptic title.
- Terms of art ("conceit", "harness", "substrate") do not carry a title; use the
  everyday phrase.
- Guide slug matches the title.

No build gate for this one; the /ingest and /create-guide skills restate it at
writing time, and the PR review is the backstop.

## Plain language (editor ruling, 2026-07-17)

Clear, to the point, plain words. Fewer words beat more words everywhere on the site.

- **Say what it is, not what it is not.** "Several sources become one original
  guide" beats "Synthesis, not summary". Negative-definition headings are banned.
- **The negation pivot is banned in every disguise** (editor ruling, 2026-07-17).
  The tell is any sentence that spends its first half denying something nobody
  claimed, then pivots to the real point: "It's not just X, it's Y", "The
  interesting part is not the drawing set. It is how you get the next one",
  "This isn't about A; it's about B", "less about X than Y", "What matters
  isn't X", "The real question isn't X". Splitting it across two sentences or
  swapping the wording does not make it fine; the shape is the tell. Fix: delete
  the denial half and open with the point ("The interesting part is how you get
  the next drawing set for a different subject"). A negation survives only when
  it corrects a real, named misconception the reader actually holds, and even
  then the correction comes after the positive claim.
- **Write it straight.** The house model is the plain declarative essay
  (Morgan Housel's Collab Fund posts are the reference: "'Smart' is the ability
  to solve problems." "That was life."). Make the claim, then earn it with a
  concrete example. Short sentences carry the point; long ones carry the
  evidence. No throat-clearing before the claim, no reframing after it.
- **Lead with the point.** A lede or paragraph earns its wind-up only after the
  point has landed. If the payoff sentence could open the paragraph, move it there
  and cut what it replaced.
- **No ten-dollar words.** If the editor has to look it up ("andragogy"), it does
  not ship. Everyday phrase first; a term of art only when it is the reader's own
  vocabulary, glossed at first use.
- **Fancy words lose to plain ones** (editor ruling, 2026-07-18, from the
  "Ancillary works" → "Works in progress" rename and the sitewide sweep that
  followed). Latinate dress-ups (prohibition, corroborated, subsequent,
  verbatim), insider terms (exfiltration, happy case, load-bearing as a
  metaphor), and literary flourishes (disarmingly) get replaced with the plain
  everyday phrase. The /plain-words skill holds the full trap list and the
  sweep procedure.
- **No jargon, no invented coinages** (editor ruling, 2026-07-18). A made-up
  label ("deliberation dial") or insider word ("colophon") is a defect even when
  the author finds it charming: the reader has to ask what it means, so it fails.
  Specific and simple beats unnecessary complexity, every time. The test for any
  phrase: would a smart reader outside AI tooling have to ask? Then replace it
  with the plain phrase ("deliberation dial" → "how hard the model thinks").
- **No walls of text** (editor ruling, 2026-07-18). A dense block gets skimmed
  and forgotten, so it fails no matter how good the sentences are. Paragraphs
  run 1-4 sentences; a paragraph past ~60 words needs a reason to exist at that
  length. Break at each new idea. Let lists, short paragraphs, and white space
  carry the structure a long block hides. The positive side of this rule, when
  to reach for a table, a list, or a visual, is its own section below
  ("Break information into the form that fits").
- **State the rule, skip the flourish** (editor ruling, 2026-07-18, from the
  editor's own rewrite of the compression-contract passage). Cut, every time:
  aphorism capstones ("The cheapest token is the one never written"), dramatic
  justifications bolted onto self-evident rules ("a paraphrased error message
  is a lie"), praise of the writing's own advice ("a genuinely radical clause"),
  coined names nobody needs ("call it ultra"), and qualifiers that restate a
  rule already given. A list of rules reads as flat plain declaratives.
- **Don't tour the mechanism** (editor ruling, 2026-07-18). When a thing has
  levels or stages, say that it has them and what the end state buys; walk the
  reader through each stop only when they must choose between stops. An
  illustrative example earns its place only if the claim is unclear without it;
  one example is the ceiling.
- **Cut the scaffolding** (editor ruling, 2026-07-20, from the editor's
  session-long trim of the knowledge-base guide). Guide prose is reference mode,
  not teaching mode: state the claim, give at most one illustration, move on.
  Cut, every time: the ramp-up example that warms up to a simple idea ("how tall
  is Nick" before naming what RAG is), any second illustration of a point already
  made, mechanism explanations of why a thing works under the hood, reassurance
  and hand-holding ("you do not need a specialist", "one is enough to start",
  time budgets like "five to ten minutes"), and story color or proof-stats that
  are not load-bearing. Prefer "etc." to an exhaustive list. Sections routinely
  lose half their words with the meaning intact. This is the structural mirror of
  "State the rule, skip the flourish": that one cuts ornamental lines, this one
  cuts the ramps, spare examples, and reassurance around the point.
- **"Die" and "kill" are banned in site copy** (editor ruling, 2026-07-18).
  Death-metaphor verbs ("die", "dies", "killed") hide what actually happens.
  Say the specific thing: filler words are cut, a model is retired, a project
  is cancelled, a transcript is gone when the session ends. Applies to every
  figurative stand-in where a specific plain verb exists.
- **Name the thing before any conceptual label** (editor ruling, 2026-07-18).
  Referring to a tool or practice by an abstraction ("The contract we actually
  run is...") reads as insider talk; most readers get nothing from it, and the
  editor would not say it aloud. Open with the plain subject and verb ("We use
  a skill called caveman for this"), then attach any framing.
- **Never talk down to the reader.** No "adults learn what they can use"-style
  framing that explains the reader to themselves.
- **Theme never beats clarity.** Decorative labels are welcome only next to plain
  function words, never instead of them. "Upon leaving this room, you can" loses
  to "After this guide, you can".

## Break information into the form that fits (editor ruling, 2026-07-19)

A wall of text is a presentation failure, not only a length one. Readers skim a
dense block and keep almost none of it, so information that has a shape gets shown
in that shape instead of buried in sentences. This is the rule people actually learn
from: scannable, and pleasant to look at.

Match the form to the content:

| The content is | Present it as |
|---|---|
| Two or more things compared on the same dimensions | A table |
| Steps in order, or parallel items of equal weight | A list |
| A term and what it means | A short line, bold term first |
| Copy-ready code, a prompt, or config | A fenced block, or a `SkillCopy` plate for long ones |
| A set of short question-and-answer pairs | The `Faq` component |
| A quotable line from a source | `PullQuote` |
| A hands-on task | `Exercise` |

Reach for a diagram or an image when it explains something a paragraph cannot: a
flow, a before-and-after, a spatial layout. No diagram component exists yet, so if a
guide needs a recurring visual, propose a reusable component rather than one-off
markup, and give every image real alt text (which the em-dash and copy rules still
govern).

Two limits keep this from sliding into decoration. Structure only genuine structure:
a one-row table, or a single idea chopped into list fragments, reads worse than a
plain sentence. And the house voice stays the plain declarative essay, so prose
carries the argument while a table, a list, or a visual carries the part that truly
is a table, a list, or a picture. When a guide is mostly unbroken paragraphs, that is
the signal to restructure, not to add ornaments.

No build gate for this one; the /ingest and /create-guide skills restate it at
writing time, and the PR review is the backstop.

## Provenance and artifacts (editor rulings, 2026-07-18)

From the design-concept guide rewrite: the guide narrated a tidy method as the
origin of the about page, when the method was actually distilled after the fact.

- **Tell the making the way it happened.** A claim about how something was built
  is a fact and gets verified like one. A method extracted after the work is
  presented as extracted afterward, never as the recipe that produced it.
- **Ship the artifact, not a description of it.** When the lesson exists as a
  usable file (a prompt, a skill, a config, a script), embed it copy-ready with
  commentary on why it works. Short artifacts go in a fenced block; long ones
  get a preview plate with a copy CTA (`site/src/components/SkillCopy.astro` is
  the pattern). Embedded artifacts obey the site gates: swap em dashes out and
  disclose the swap, and never label an edited artifact verbatim.
- **Personal prompts are tidied for print.** The editor's raw working prompts
  get a light rewrite before publication (wording polish, substance untouched)
  and the guide discloses it ("tidied for print").
- **Fenced text blocks: one line per paragraph.** Guide `pre` styling wraps
  (`pre-wrap`); hard line breaks inside a paragraph render as ragged
  mid-sentence breaks at every viewport width.

## Self-contained passages, no word tics, one name per concept (editor rulings, 2026-07-18, 2026-07-19)

- **Every passage lands without private context.** If a paragraph only makes
  sense to someone who has already seen the artifact it references (the about
  page, a past session, an internal file), show the thing in the guide or cut
  the passage. Test: can a first-time reader act on it?
- **Sweep for word tics.** A word repeated across a draft ("true" 8 times,
  "truth" 4, "real" 3, in one 900-word guide) means the prose is orbiting an
  abstraction instead of giving instructions. On the finished draft, count
  repeats of abstract nouns and adjectives and rewrite the sentences that lean
  on them into concrete statements.
- **One name per concept** (editor ruling, 2026-07-19, from the model-recheck
  guide audit). Pick one word for each thing and use it every time. That guide
  called one idea, the score-versus-cost plot, four different names across the
  draft ("frontier", "efficient edge", "map", "curve"), and called one model
  variant both "size" and "tier". Every rename makes the reader re-learn what is
  actually one thing, and hides that it is one thing. Choose the plainest name
  once, then repeat it, including inside a comparison: "the middle size at high
  effort" versus "the smallest size at its top effort" hides that "high" and
  "top" name the same setting. This is the mirror of the word-tic sweep: a tic
  repeats one vague word, this repeats one concept under changing words.
- **Every reference resolves** (editor ruling, 2026-07-19, same audit). Each
  "it", "they", "that", "this", "them", and bare "do not / does not" must point
  to exactly one thing the reader can name. "Once price is in the picture, they
  do not" left both "they" and "do not [what]" dangling. On the finished draft,
  read every pronoun and pointing word and confirm its antecedent is the nearest
  sensible noun; if it is not, name the thing instead of pointing at it.

## Quotes and titles are copied by hand (2026-07-18)

Guide Chalk lines and pull-quotes are quoted verbatim in `site/src/data/trackNotes.ts`
and on the homepage (`site/src/pages/index.astro`), and guide titles appear as
cross-link text in other guides and in trackNotes. None of it is generated. After
changing a Chalk line, pull-quote, or title, grep `site/src` for the old wording and
update every copy, or the site misquotes itself.

## Cross-linking (editor ruling, 2026-07-17)

When a guide touches a topic another guide covers (token spend, memory, skills,
migration errors, prompting fundamentals), link to that guide inline at the
mention, with the guide's title as the link text. Every new guide gets a
cross-link pass before its PR; the /crosslink skill sweeps the whole catalogue.
