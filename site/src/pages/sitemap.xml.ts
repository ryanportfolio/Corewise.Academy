import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { TRACKS } from '../data/tracks';
import { TAGS } from '../data/tags';
import { SITE_URL, SITE_UPDATED } from '../data/site';

const day = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).filter((g) => g.data.status === 'published');
  const entries: { path: string; lastmod: string }[] = [
    { path: '/', lastmod: SITE_UPDATED },
    { path: '/about/', lastmod: SITE_UPDATED },
    { path: '/how-its-built/', lastmod: SITE_UPDATED },
    ...TRACKS.map((t) => ({ path: `/tracks/${t.slug}/`, lastmod: SITE_UPDATED })),
    ...TAGS.map((t) => ({ path: `/tags/${t.slug}/`, lastmod: SITE_UPDATED })),
    ...guides.map((g) => ({ path: `/guides/${g.id}/`, lastmod: day(g.data.lastUpdated) })),
  ];
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map((e) => `  <url><loc>${SITE_URL}${e.path}</loc><lastmod>${e.lastmod}</lastmod></url>`)
      .join('\n') +
    `\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
