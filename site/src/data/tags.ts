// Topic tag vocabulary: the single source of truth for guide tags.
// content.config.ts derives its enum from `tagLabels`, so a typo in a
// guide's frontmatter fails the build instead of minting a new tag.
// `display` is the rendered casing (product names keep their casing).

export interface Tag {
  slug: string;
  label: string;
  display: string;
}

export const TAGS: Tag[] = [
  { slug: 'agent-safety', label: 'agent safety', display: 'agent safety' },
  { slug: 'automation', label: 'automation', display: 'automation' },
  { slug: 'career', label: 'career', display: 'career' },
  { slug: 'claude-code', label: 'claude code', display: 'Claude Code' },
  { slug: 'codex', label: 'codex', display: 'Codex' },
  { slug: 'cost-control', label: 'cost control', display: 'cost control' },
  { slug: 'delegation', label: 'delegation', display: 'delegation' },
  { slug: 'instruction-files', label: 'instruction files', display: 'instruction files' },
  { slug: 'knowledge-bases', label: 'knowledge bases', display: 'knowledge bases' },
  { slug: 'memory', label: 'memory', display: 'memory' },
  { slug: 'model-behavior', label: 'model behavior', display: 'model behavior' },
  { slug: 'model-choice', label: 'model choice', display: 'model choice' },
  { slug: 'planning', label: 'planning', display: 'planning' },
  { slug: 'skills', label: 'skills', display: 'skills' },
  { slug: 'teams', label: 'teams', display: 'teams' },
  { slug: 'verification', label: 'verification', display: 'verification' },
  { slug: 'writing-prompts', label: 'writing prompts', display: 'writing prompts' },
];

export const tagLabels = TAGS.map((t) => t.label) as [string, ...string[]];
export const tagBySlug = (slug: string) => TAGS.find((t) => t.slug === slug);
export const tagByLabel = (label: string) => TAGS.find((t) => t.label === label);
