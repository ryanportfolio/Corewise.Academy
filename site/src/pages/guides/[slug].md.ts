// Raw agent artifact for a guide: /guides/<slug>.md
// Same text the guide page's copy plate offers. Only guides with an artifact
// (a real skill or a distilled agent guide) get a file; the rest 404.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { agentArtifactFor } from '../../data/agentArtifacts';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides
    .filter((g) => g.data.status === 'published')
    .filter((g) => agentArtifactFor(g.id))
    .map((g) => ({ params: { slug: g.id }, props: { guide: g } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(agentArtifactFor(props.guide.id)!.content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
