import type { APIRoute } from 'astro';
import { sfetch } from '../lib/sanity';
import { newsSlugsQuery, albumSlugsQuery, presenzeQuery } from '../lib/queries';

/**
 * Mappa del sito per i motori di ricerca, rigenerata a ogni pubblicazione:
 * le pagine fisse, le news e gli album. Le pagine che compaiono solo con
 * contenuto (record, storia, team, gallery, privacy) seguono la stessa regola del menu.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site!;
  const [news, album, p] = await Promise.all([
    sfetch<{ slug: string }[]>(newsSlugsQuery, {}, []),
    sfetch<{ slug: string }[]>(albumSlugsQuery, {}, []),
    sfetch<any>(presenzeQuery, {}, {}),
  ]);
  const percorsi = [
    '/', '/societa/', '/settore-giovanile/', '/impianto/', '/news/', '/contatti/',
    ...(p?.storia ? ['/societa/storia/'] : []),
    ...(p?.team ? ['/societa/team/'] : []),
    ...(p?.record ? ['/record/'] : []),
    ...(p?.openDay ? ['/open-days/'] : []),
    ...(p?.privacy ? ['/privacy/'] : []),
    ...(p?.safeguarding ? ['/safeguarding/'] : []),
    ...(album.length ? ['/gallery/'] : []),
    ...album.filter((a) => a.slug).map((a) => `/gallery/${a.slug}/`),
    ...news.filter((n) => n.slug).map((n) => `/news/${n.slug}/`),
  ];
  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${percorsi.map((x) => `  <url><loc>${new URL(x, base).href}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(corpo, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
