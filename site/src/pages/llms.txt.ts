import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { TRACKS } from '../data/tracks';
import { SITE_URL } from '../data/site';

export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).filter((g) => g.data.status === 'published');
  const byTrack = (slug: string) =>
    guides
      .filter((g) => g.data.track === slug)
      .sort((a, b) => a.data.number - b.data.number)
      .map((g) => `- [${g.data.title}](${SITE_URL}/guides/${g.id}/): ${g.data.description}`)
      .join('\n');
  const body = [
    '# CoreWise Academy',
    '',
    '> CoreWise Academy is a free library of original guides on working with AI, organized into five layers (Foundations, Prompting & Context, Agents & Automation, Building with AI, Practice) at three depths (Broad, Practitioner, Deep). Edited by Ryan D. Allen.',
    '',
    `- [About the editor](${SITE_URL}/about/)`,
    `- [How guides get made](${SITE_URL}/how-its-built/)`,
    '',
    ...TRACKS.flatMap((t) => {
      const list = byTrack(t.slug);
      return list ? [`## ${t.name}`, '', `- [Layer page](${SITE_URL}/tracks/${t.slug}/): ${t.description}`, list, ''] : [];
    }),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
