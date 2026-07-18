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
