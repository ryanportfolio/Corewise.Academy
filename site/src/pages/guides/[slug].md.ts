// Raw markdown for a guide: /guides/<slug>.md, one for every published guide.
// Guides with an agent artifact (a real skill or a distilled agent guide) serve
// that file, the same text the guide page's copy plate offers. The rest serve a
// plain-markdown version of the guide itself.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { agentArtifactFor } from '../../data/agentArtifacts';
import { guideMarkdown } from '../../data/guideMarkdown';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides
    .filter((g) => g.data.status === 'published')
    .map((g) => ({ params: { slug: g.id }, props: { guide: g } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(agentArtifactFor(props.guide.id)?.content ?? guideMarkdown(props.guide), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
