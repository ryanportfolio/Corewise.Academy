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
- **Lead with the point.** A lede or paragraph earns its wind-up only after the
  point has landed. If the payoff sentence could open the paragraph, move it there
  and cut what it replaced.
- **No ten-dollar words.** If the editor has to look it up ("andragogy"), it does
  not ship. Everyday phrase first; a term of art only when it is the reader's own
  vocabulary, glossed at first use.
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
