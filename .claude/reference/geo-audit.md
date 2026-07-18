# GEO audit: every page holds 100/100

The site is scored by the willaicite geo-audit tool (github.com/ryanportfolio/willaicite).
As of 2026-07-17 all 20 pages score 100/100 on production. Every new page or guide must
keep that. Offline check before merging content:

```
# in the willaicite repo
cd site && npm run build           # Academy build first
npx tsx scripts/score-dist.ts <path-to-Academy>/site/dist
```

## What the layout already provides (Base.astro, do not duplicate)

Canonical URL, Open Graph + twitter meta, meta author, JSON-LD @graph
(Organization, WebSite, Person, BreadcrumbList, Article with dates/author,
FAQPage from the `faq` prop), footer contact link, robots.txt, sitemap.xml,
llms.txt, og.png. Guides feed `faq`/dates/crumbs from frontmatter automatically.

## Per-page content checklist (the part a new guide must supply)

- Description: 50-170 chars, opens with a definitional sentence
  ("X is/are/means ...", subject at most 6 words before the verb). The dek
  renders this, so it doubles as the answer statement near the top.
- selfCheck: exactly 3 items; every q question-formatted (starts with
  who/what/why/how/when/where/which/can/does/is/are/should/will OR ends "?").
  These render as the FAQ h3s, so this is what satisfies question-headings.
- One table in the body (GFM markdown table).
- At least one list in the body (objectives ul counts, but a body list is safer).
- Statistics: at least 6 digit+unit matches in the rendered article, units the
  scorer recognizes: % / percent / $ / times / x / seconds / minutes / hours /
  days / weeks / months / years / users / thousand / million / GB / MB / ms.
  "9 min" and bare counts ("27 criteria", "100 kB") do NOT match.
- Quotations: at least 3 = markdown blockquotes + curly-quoted “...” spans of
  5+ words (Chalk lines are auto-quoted and count as one).
- Outbound links: at least 5 external hrefs in the article (sources + a
  "Further reading" section), including at least 1 authoritative domain
  (wikipedia.org, arxiv.org, .gov, .edu, acm.org, ieee.org, nature.com).
- Topic echo: the content words of the title (4+ chars, not stopwords) must
  each recur at least twice in the body by 6-char prefix. Titles whose words
  the body never repeats fail topical focus.
- Title: guide title + " · CoreWise Academy" must stay at most 70 chars, and the
  guide-title segment must be LONGER than "CoreWise Academy" (16 chars) so it is
  picked as the topic segment.
- lastUpdated: keep honest, but note the scorer's freshness window is 90 days;
  substantive edits should bump it.

Non-guide pages (tracks, about, etc.) follow the same rubric; track pages get
their editorial matter from `site/src/data/trackNotes.ts`.
