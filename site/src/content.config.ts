import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { tagLabels } from './data/tags';

// Guide frontmatter contract: the ingest skill writes this shape; the
// templates render it. A course is NOT a separate type: courseSlug +
// courseOrder sequence guides within a track.
const guides = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    track: z.enum(['foundations', 'prompting', 'agents', 'building', 'practice']),
    level: z.enum(['broad', 'practitioner', 'deep']),
    number: z.number().int().positive(), // catalogue Nº
    minutes: z.number().int().positive(),
    tags: z.array(z.enum(tagLabels)).min(1), // vocabulary lives in data/tags.ts
    objectives: z.array(z.string()).min(1), // measurable, Bloom's-taxonomy verbs
    prerequisites: z
      .array(z.object({ slug: z.string(), note: z.string().optional() }))
      .default([]),
    // Empty = original work (first-party field notes, no video source).
    sources: z
      .array(
        z.object({
          url: z.string().url(),
          creator: z.string(),
          video: z.string(), // work title; also used for non-video sources (articles)
          timestamps: z.array(z.string()).default([]), // empty for sources without timecodes
        }),
      )
      .default([]),
    selfCheck: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .length(3),
    status: z.enum(['draft', 'review', 'published']).default('draft'),
    lastUpdated: z.coerce.date(),
    courseSlug: z.string().optional(),
    courseOrder: z.number().int().optional(),
  }),
});

export const collections = { guides };
