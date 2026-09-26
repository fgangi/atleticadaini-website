import type { APIRoute } from 'astro';

/**
 * Sito di prova (PUBLIC_INDICIZZABILE diverso da "true"): blocca tutto, per
 * non fare concorrenza al sito attuale su Google. Sito definitivo: tutto
 * indicizzabile tranne il pannello, con l'indirizzo della sitemap.
 */
export const GET: APIRoute = ({ site }) => {
  const indicizzabile = import.meta.env.PUBLIC_INDICIZZABILE === 'true';
  const corpo = indicizzabile
    ? `User-agent: *\nDisallow: /admin/\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : `# Sito di prova: non indicizzare\nUser-agent: *\nDisallow: /\n`;
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
