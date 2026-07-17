import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Guide frontmatter contract — the ingest skill writes this shape; the
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
    objectives: z.array(z.string()).min(1), // measurable, Bloom's-taxonomy verbs
    prerequisites: z
      .array(z.object({ slug: z.string(), note: z.string().optional() }))
      .default([]),
    sources: z
      .array(
        z.object({
          url: z.string().url(),
          creator: z.string(),
          video: z.string(),
          timestamps: z.array(z.string()).min(1),
          watched: z.string(), // e.g. "June 2026"
        }),
      )
      .min(1),
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
