// Every guide doubles as an agent skill: this converts a guide's MDX body
// into a self-contained SKILL.md an agent can read (copy button on the guide
// page, raw file at /guides/<slug>.md). Components become plain markdown;
// frontmatter extras (objectives, self-check, sources) become sections.
import type { CollectionEntry } from 'astro:content';
import { SITE_URL, SITE_NAME, EDITOR_NAME } from '../data/site';
import { trackBySlug, LEVELS } from '../data/tracks';

type Guide = CollectionEntry<'guides'>;

const attr = (attrs: string, name: string) => {
  const m = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : '';
};

const absolutize = (href: string) => (href.startsWith('/') ? `${SITE_URL}${href}` : href);

function bodyToMarkdown(src: string): string {
  let out = src.replace(/\r\n/g, '\n');

  // Import lines only exist at the top of the body, before any code fence.
  out = out.replace(/^import .*$\n?/gm, '');

  // Chalk margin notes are decorative asides; drop them.
  out = out.replace(/<Chalk>[\s\S]*?<\/Chalk>\s*\n?/g, '');

  // Pull quotes become attributed blockquotes.
  out = out.replace(/<PullQuote\s+([\s\S]*?)\/>/g, (_, attrs) => {
    const quote = attr(attrs, 'quote');
    const creator = attr(attrs, 'creator');
    const video = attr(attrs, 'video');
    const href = attr(attrs, 'href');
    const timestamp = attr(attrs, 'timestamp');
    return `> "${quote}"\n> (${creator}, [${video}](${href}), ${timestamp})`;
  });

  // Embedded skill plates only make sense on the web page.
  out = out.replace(/<SkillCopy\s+([\s\S]*?)\/>/g, (_, attrs) => {
    const name = attr(attrs, 'name');
    return `(The full ${name} skill file is copyable on the web version of this guide.)`;
  });

  // The field exercise becomes a normal section.
  out = out.replace(
    /<Exercise>\s*\n?([\s\S]*?)<\/Exercise>/g,
    (_, inner) => `## Field exercise: try this\n\n${inner.trim()}\n`,
  );

  // Lede paragraph unwraps to plain text.
  out = out.replace(/<p class="lede">\s*\n?([\s\S]*?)<\/p>/g, (_, inner) => inner.trim());

  // Keep section numbers: guide prose refers back to them ("Section 01").
  out = out.replace(/<span class="sec-no">(\d+)<\/span>\s*/g, '$1 · ');

  // Inline links become markdown links with absolute URLs.
  out = out.replace(
    /<a href="([^"]+)">([\s\S]*?)<\/a>/g,
    (_, href, text) => `[${text.replace(/\s+/g, ' ').trim()}](${absolutize(href)})`,
  );

  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

export function guideToAgentSkill(guide: Guide): string {
  const d = guide.data;
  const track = trackBySlug(d.track)!;
  const level = LEVELS.find((l) => l.id === d.level)!;
  const url = `${SITE_URL}/guides/${guide.id}/`;

  const body = bodyToMarkdown(guide.body ?? '');
  const leftover = body.match(/<[A-Z][A-Za-z]*[\s>/]/);
  if (leftover) {
    throw new Error(`agentSkill: unconverted component "${leftover[0]}" in guide "${guide.id}"`);
  }

  const description = `${d.description} A ${SITE_NAME} guide (${track.name} layer, ${level.label} depth). Read when the topic applies to the task at hand.`;

  const prereqs = d.prerequisites.length
    ? [
        '',
        `Read first: ${d.prerequisites
          .map((p) => `${SITE_URL}/guides/${p.slug}/`)
          .join(' and ')}`,
      ]
    : [];

  const sources = d.sources.length
    ? d.sources.map((s) => `- ${s.creator}, "${s.video}" (${s.url}), watched ${s.watched}`)
    : ['- Original work by the editor, no video source.'];

  return [
    '---',
    `name: ${guide.id}`,
    'description: >-',
    `  ${description}`,
    '---',
    '',
    `# ${d.title}`,
    '',
    `From ${SITE_NAME}, edited by ${EDITOR_NAME}. Web version: ${url}`,
    ...prereqs,
    '',
    body,
    '',
    '## After this guide, you can',
    '',
    ...d.objectives.map((o) => `- ${o}`),
    '',
    '## Self-check',
    '',
    ...d.selfCheck.flatMap((f) => [`**Q: ${f.q}**`, '', f.a, '']),
    '## Sources',
    '',
    ...sources,
    '',
  ].join('\n');
}
