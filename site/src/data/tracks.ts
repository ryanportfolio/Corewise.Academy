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
      'How these models actually work: capabilities, limits, and the mental models that keep you honest.',
    sky: { cx: -3.4, cy: 0.9, spread: 1.0 },
  },
  {
    slug: 'prompting',
    numeral: 'II',
    name: 'Prompting & Context',
    constellation: 'THE LOOM',
    description:
      'From plain asks to engineered context: instructions, references, and retrieved material, arranged so the model attends to what matters.',
    sky: { cx: -1.5, cy: -0.5, spread: 1.15 },
  },
  {
    slug: 'agents',
    numeral: 'III',
    name: 'Agents & Automation',
    constellation: 'THE COURIER',
    description:
      'Tools, MCP, and multi-step workflows: getting reliable results from a model that acts on its own.',
    sky: { cx: 0.4, cy: 0.8, spread: 0.95 },
  },
  {
    slug: 'building',
    numeral: 'IV',
    name: 'Building with AI',
    constellation: 'THE FORGE',
    description:
      'APIs, retrieval, evals, and shipping AI features other people can rely on.',
    sky: { cx: 2.1, cy: -0.6, spread: 1.05 },
  },
  {
    slug: 'practice',
    numeral: 'V',
    name: 'Practice',
    constellation: 'THE METRONOME',
    description:
      'Daily habits, verification, taste, and knowing when not to use the model.',
    sky: { cx: 3.6, cy: 0.7, spread: 0.85 },
  },
];

export const trackBySlug = (slug: string) => TRACKS.find((t) => t.slug === slug);
