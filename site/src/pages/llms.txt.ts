import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { TRACKS } from '../data/tracks';
import { SITE_URL } from '../data/site';
import { agentArtifactFor } from '../data/agentArtifacts';

export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).filter((g) => g.data.status === 'published');
  const byTrack = (slug: string) =>
    guides
      .filter((g) => g.data.track === slug)
      .sort((a, b) => a.data.number - b.data.number)
      .map((g) => `- [${g.data.title}](${SITE_URL}/guides/${g.id}/): ${g.data.description}`)
      .join('\n');
  // Every published guide has a .md route; these serve a ready-to-use file there
  // instead of the article. Derived from the same map the route reads, so the
  // list cannot drift from what is actually served.
  const trackOrder = new Map(TRACKS.map((t, i) => [t.slug, i]));
  const agentFiles = guides
    .flatMap((g) => {
      const artifact = agentArtifactFor(g.id);
      return artifact ? [{ guide: g, artifact }] : [];
    })
    .sort(
      (a, b) =>
        (trackOrder.get(a.guide.data.track) ?? TRACKS.length) - (trackOrder.get(b.guide.data.track) ?? TRACKS.length) ||
        a.guide.data.number - b.guide.data.number,
    );
  const agentFilesSection = agentFiles.length
    ? [
        '## Agent files',
        '',
        `These ${agentFiles.length} addresses serve a ready-to-use file instead of the article: an installable skill, or a version of the guide distilled for an agent to follow.`,
        '',
        ...agentFiles.map(
          ({ guide, artifact }) =>
            `- [${guide.data.title}](${SITE_URL}/guides/${guide.id}.md): ${
              artifact.kind === 'skill' ? 'installable skill' : 'agent guide'
            }, save as ${artifact.savePath}`,
        ),
        '',
      ]
    : [];
  const body = [
    '# CoreWise Academy',
    '',
    '> CoreWise Academy is a free library of original guides on working with AI, organized into five layers (Foundations, Prompting & Context, Agents & Automation, Building with AI, Practice) at three depths (Broad, Practitioner, Deep). Edited by Ryan D. Allen.',
    '',
    `- [About the editor](${SITE_URL}/about/)`,
    `- [How guides get made](${SITE_URL}/how-its-built/)`,
    '',
    `Every guide is also served as plain markdown for agents: swap the guide URL's trailing slash for ".md" (for example ${SITE_URL}/guides/brief-the-model.md).`,
    '',
    ...agentFilesSection,
    ...TRACKS.flatMap((t) => {
      const list = byTrack(t.slug);
      return list ? [`## ${t.name}`, '', `- [Layer page](${SITE_URL}/tracks/${t.slug}/): ${t.description}`, list, ''] : [];
    }),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
