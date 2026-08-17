// The plain-markdown version of a guide, served at /guides/<slug>.md for agents.
// Guide bodies are MDX shaped for the page (Astro components, a few HTML tags,
// decorative section numbers), so the body is converted here instead of shipped
// raw. Fenced code blocks pass through untouched.
import type { CollectionEntry } from 'astro:content';
import { SITE_URL } from './site';
import { TRACKS, LEVELS } from './tracks';

type Guide = CollectionEntry<'guides'>;

const attrsOf = (raw: string): Record<string, string> =>
  Object.fromEntries([...raw.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

const absolute = (href: string) => (href.startsWith('/') ? `${SITE_URL}${href}` : href);

const oneLine = (text: string) => text.replace(/\s*\n\s*/g, ' ').trim();

const convert = (chunk: string) =>
  chunk
    // MDX component imports
    .replace(/^import[^\n]*\n/gm, '')
    // <PullQuote />: the quote, then who said it and where
    .replace(/<PullQuote\b([\s\S]*?)\/>/g, (_match, raw: string) => {
      const a = attrsOf(raw);
      const credit = [a.creator, a.video ? `"${a.video}"` : ''].filter(Boolean).join(', ');
      const at = a.timestamp ? ` at ${a.timestamp}` : '';
      return `> "${a.quote}"\n>\n> ${credit}${at}: ${absolute(a.href ?? '')}`;
    })
    // <Exercise>: the hands-on step every guide carries
    .replace(/<Exercise>\s*([\s\S]*?)\s*<\/Exercise>/g, (_match, inner: string) => `## Field exercise\n\n${inner}`)
    // <Chalk>: the margin aside
    .replace(/<Chalk>\s*([\s\S]*?)\s*<\/Chalk>/g, (_match, inner: string) => `> ${oneLine(inner)}`)
    .replace(/<p class="lede">\s*([\s\S]*?)\s*<\/p>/g, '$1')
    // <SkillCopy />: the file itself is a copy plate on the page
    .replace(/<SkillCopy\b([\s\S]*?)\/>/g, (_match, raw: string) => {
      const a = attrsOf(raw);
      return `> The ${a.name} file is on the guide page, ready to copy. Save it as ${a.savePath}.`;
    })
    // Figures with no text equivalent, and the skills-pack call to action
    .replace(/<(RoutineFlow|CompanionLog|SamplingFigure)\s*\/>/g, '> A figure sits here on the guide page.')
    .replace(/<FirmwareCta\s*\/>\n?/g, '')
    // Decorative section numbers inside headings
    .replace(/<span class="sec-no">[^<]*<\/span>/g, '')
    .replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_match, href: string, text: string) => `[${oneLine(text)}](${absolute(href)})`)
    .replace(/<\/?strong>/g, '**')
    .replace(/<\/?p>\n?/g, '')
    // Markdown links written relative to the site root
    .replace(/\]\((\/[^)]+)\)/g, (_match, href: string) => `](${SITE_URL}${href})`);

/** Convert the MDX body, leaving fenced code blocks exactly as written. */
const convertBody = (body: string) =>
  body
    // Sources are committed with CRLF, and every newline rule below counts on \n
    .replace(/\r\n/g, '\n')
    .split(/(^```[\s\S]*?^```)/gm)
    .map((part, i) => (i % 2 === 1 ? part : convert(part)))
    .join('')
    .trim();

export const guideMarkdown = (guide: Guide): string => {
  const d = guide.data;
  const track = TRACKS.find((t) => t.slug === d.track);
  const level = LEVELS.find((l) => l.id === d.level);
  const isoDate = d.lastUpdated.toISOString().slice(0, 10);
  const lines: string[] = [
    `# ${d.title}`,
    '',
    d.description,
    '',
    `${track?.name ?? d.track} · Layer ${track?.numeral ?? ''} · ${level?.label ?? d.level} · Nº ${String(d.number).padStart(3, '0')} · ${d.minutes} min read · Updated ${isoDate}`,
    '',
    `Guide page: ${SITE_URL}/guides/${guide.id}/`,
    '',
    '## After this guide, you can',
    '',
    ...d.objectives.map((o) => `- ${o}`),
    '',
  ];
  if (d.prerequisites.length) {
    lines.push(
      '## Read first',
      '',
      ...d.prerequisites.map((p) => `- ${SITE_URL}/guides/${p.slug}/${p.note ? `: ${p.note}` : ''}`),
      '',
    );
  }
  lines.push(convertBody(guide.body ?? ''), '', '## FAQ', '');
  for (const { q, a } of d.selfCheck) lines.push(`**${q}**`, '', a, '');
  lines.push('## Sources', '');
  lines.push(
    ...(d.sources.length
      ? d.sources.map(
          (s) =>
            `- ${s.creator}, "${s.video}": ${s.url}${s.timestamps.length ? ` (${s.timestamps.join(', ')})` : ''}`,
        )
      : ['First-party field notes, no outside source.']),
  );
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
};
