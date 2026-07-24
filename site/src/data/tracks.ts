// The five constellations: the fixed curriculum skeleton.
// Content slots into this; the skeleton itself does not change.

export interface Track {
  slug: string;
  numeral: string;
  name: string;
  constellation: string;
  description: string;
  /** Approximate cluster position in the hero sky (world units). */
  sky: { cx: number; cy: number; spread: number };
}

export const LEVELS = [
  { id: 'broad', label: 'Broad' },
  { id: 'practitioner', label: 'Practitioner' },
  { id: 'deep', label: 'Deep' },
] as const;

export type LevelId = (typeof LEVELS)[number]['id'];

export const TRACKS: Track[] = [
  {
    slug: 'foundations',
    numeral: 'I',
    name: 'Foundations',
    constellation: 'THE LENS',
    description:
      'How AI models actually work: what they can do, where they fail, and how to tell the difference.',
    sky: { cx: -3.4, cy: 0.9, spread: 1.0 },
  },
  {
    slug: 'prompting',
    numeral: 'II',
    name: 'Prompting & Context',
    constellation: 'THE LOOM',
    description:
      'Getting the right material in front of the model: instructions, examples, and retrieved context, arranged so what matters stands out.',
    sky: { cx: -1.5, cy: -0.5, spread: 1.15 },
  },
  {
    slug: 'agents',
    numeral: 'III',
    name: 'Agents & Automation',
    constellation: 'THE COURIER',
    description:
      'Models that act on their own: tools, MCP, and multi-step workflows that hold up without you watching.',
    sky: { cx: 0.4, cy: 0.8, spread: 0.95 },
  },
  {
    slug: 'building',
    numeral: 'IV',
    name: 'Building with AI',
    constellation: 'THE FORGE',
    description:
      'Shipping AI features other people can rely on: APIs, retrieval, and evals that prove it works.',
    sky: { cx: 2.1, cy: -0.6, spread: 1.05 },
  },
  {
    slug: 'practice',
    numeral: 'V',
    name: 'Practice',
    constellation: 'THE METRONOME',
    description:
      'The daily habits: verification, taste, and knowing when not to use the model.',
    sky: { cx: 3.6, cy: 0.7, spread: 0.85 },
  },
];

export const trackBySlug = (slug: string) => TRACKS.find((t) => t.slug === slug);
