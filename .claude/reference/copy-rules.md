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
wraps, shorten the words, not the font.

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
  carry the structure a long block hides.
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
- **Never talk down to the reader.** No "adults learn what they can use"-style
  framing that explains the reader to themselves.
- **Theme never beats clarity.** Decorative labels are welcome only next to plain
  function words, never instead of them. "Upon leaving this room, you can" loses
  to "After this guide, you can".

## Cross-linking (editor ruling, 2026-07-17)

When a guide touches a topic another guide covers (token spend, memory, skills,
migration errors, prompting fundamentals), link to that guide inline at the
mention, with the guide's title as the link text. Every new guide gets a
cross-link pass before its PR; the /crosslink skill sweeps the whole catalogue.
