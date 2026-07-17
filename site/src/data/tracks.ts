// The five constellations — the fixed curriculum skeleton.
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
  { id: 'broad', label: 'Broad', shelf: 'naked eye' },
  { id: 'practitioner', label: 'Practitioner', shelf: 'telescope' },
  { id: 'deep', label: 'Deep', shelf: 'observatory' },
] as const;

export type LevelId = (typeof LEVELS)[number]['id'];

export const TRACKS: Track[] = [
  {
    slug: 'foundations',
    numeral: 'I',
    name: 'Foundations',
    constellation: 'THE LENS',
    description:
      'How these minds actually work: capabilities, limits, and the mental models that keep you honest. Ground truth before telescope time.',
    sky: { cx: -3.4, cy: 0.9, spread: 1.0 },
  },
  {
    slug: 'prompting',
    numeral: 'II',
    name: 'Prompting & Context',
    constellation: 'THE LOOM',
    description:
      'From plain asks to engineered context: instructions, references, and retrieved material, woven so the model attends to what matters.',
    sky: { cx: -1.5, cy: -0.5, spread: 1.15 },
  },
  {
    slug: 'agents',
    numeral: 'III',
    name: 'Agents & Automation',
    constellation: 'THE COURIER',
    description:
      'Tools, MCP, and multi-step workflows: teaching the mind to run errands without losing the plot.',
    sky: { cx: 0.4, cy: 0.8, spread: 0.95 },
  },
  {
    slug: 'building',
    numeral: 'IV',
    name: 'Building with AI',
    constellation: 'THE FORGE',
    description:
      'APIs, retrieval, evals, and shipping: where charts become instruments other people can steer by.',
    sky: { cx: 2.1, cy: -0.6, spread: 1.05 },
  },
  {
    slug: 'practice',
    numeral: 'V',
    name: 'Practice',
    constellation: 'THE METRONOME',
    description:
      'Daily habits, verification, taste — and the discipline of knowing when to leave the telescope covered.',
    sky: { cx: 3.6, cy: 0.7, spread: 0.85 },
  },
];

export const trackBySlug = (slug: string) => TRACKS.find((t) => t.slug === slug);
