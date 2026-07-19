// Raw agent-skill rendition of each guide: /guides/<slug>.md
// Same text the guide page's copy plate offers, fetchable directly.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { guideToAgentSkill } from '../../lib/agentSkill';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides
    .filter((g) => g.data.status === 'published')
    .map((g) => ({ params: { slug: g.id }, props: { guide: g } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(guideToAgentSkill(props.guide), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
