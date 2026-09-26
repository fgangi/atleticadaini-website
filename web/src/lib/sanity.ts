import { sanityClient } from 'sanity:client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';

const client = sanityClient;
const builder = createImageUrlBuilder(client);

/** URL di un'immagine Sanity, con trasformazioni a catena. */
export function urlFor(source: any) {
  return builder.image(source);
}

/** Immagine pronta all'uso (o null se assente). */
export function img(source: any, w = 800, h?: number): string | null {
  if (!source?.asset) return null;
  let b = urlFor(source).width(w).auto('format').fit('max');
  if (h) {
    b = b.height(h).fit('crop');
    if (!source.hotspot && !source.crop) {
      // Senza punto focale scelto nel pannello: sulle foto verticali il taglio
      // parte dall'alto (dove di solito stanno i volti), sulle altre 'entropy'
      // trova da sola la parte interessante. Con il punto focale non si chiama
      // .crop(): la libreria applica già ritaglio e hotspot del pannello.
      const m = String(source.asset?._ref ?? '').match(/-(\d+)x(\d+)-/);
      const verticale = m ? Number(m[2]) > Number(m[1]) : false;
      b = b.crop(verticale ? 'top' : 'entropy');
    }
  }
  return b.url();
}

/**
 * Esegue una query GROQ. Se il progetto Sanity non è collegato (id di
 * esempio nel .env o rete assente) restituisce il valore di riserva: il sito
 * continua a generarsi e mostra gli stati "vuoti" invece di fallire.
 */
export async function sfetch<T>(query: string, params: Record<string, any> = {}, fallback: T): Promise<T> {
  try {
    return (await client.fetch<T>(query, params)) ?? fallback;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[sanity] query non riuscita (progetto non collegato?):', (err as Error).message);
    }
    return fallback;
  }
}

/** Converte il testo ricco (Portable Text) in HTML. */
export function richText(blocks: any): string {
  if (!blocks) return '';
  try {
    return toHTML(blocks, {
      components: {
        types: {
          image: ({ value }: any) => {
            const src = img(value, 1200);
            return src ? `<img src="${src}" alt="${escape(value?.alt ?? '')}" loading="lazy" />` : '';
          },
        },
        marks: {
          // I link esterni si aprono in una scheda nuova, quelli interni no
          link: ({ children, value }: any) => {
            const href = String(value?.href ?? '#');
            const esterno = /^https?:\/\//i.test(href);
            return `<a href="${escape(href)}"${esterno ? ' target="_blank" rel="noopener"' : ''}>${children}</a>`;
          },
        },
      },
    });
  } catch {
    return '';
  }
}

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * Costruisce l'URL da usare nell'iframe della mappa. Accetta:
 *  - il codice <iframe ...> copiato da Google Maps ("Condividi → Incorpora una mappa")
 *  - l'URL di embed (https://www.google.com/maps/embed?pb=...)
 *  - coordinate "lat,lng" o un indirizzo/nome luogo
 */
export function mapEmbedSrc(value?: string | null): string | null {
  if (!value) return null;
  const v = value.trim();
  const fromIframe = v.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  const raw = fromIframe ? fromIframe[1] : v;
  const url = raw.replace(/&amp;/g, '&');
  if (/^https?:\/\//i.test(url)) return url;
  return `https://www.google.com/maps?q=${encodeURIComponent(url)}&z=16&output=embed`;
}

/** Link che apre il navigatore di Google Maps verso un indirizzo. */
export function indicazioniUrl(destinazione?: string | null): string | null {
  if (!destinazione) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinazione.replace(/\s*\n\s*/g, ', '))}`;
}

/**
 * Converte l'inquadratura scelta nel pannello in `object-position` CSS:
 * il ritaglio avviene nel browser, esattamente come nell'anteprima del pannello.
 */
export function posizione(p?: { x?: number; y?: number } | null): string {
  const x = typeof p?.x === 'number' ? p.x : 50;
  const y = typeof p?.y === 'number' ? p.y : 50;
  return `${x}% ${y}%`;
}

/**
 * Fuso della società. Le pagine sono generate su server esteri (UTC): senza
 * indicarlo, le date vicine alla mezzanotte finirebbero sul giorno sbagliato.
 */
export const FUSO = 'Europe/Rome';

/** Data in formato italiano leggibile. */
export function formatData(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: FUSO });
}

/**
 * Numeri di telefono sempre col prefisso italiano, qualunque sia la forma
 * scritta nel pannello ("339 3507848", "+39 339…", "0039 339…"): da un
 * telefono estero o da WhatsApp il numero senza +39 non funzionerebbe.
 */
function cifreItaliane(n: string): string {
  let c = n.replace(/[^\d+]/g, '');
  if (c.startsWith('00')) c = '+' + c.slice(2);
  if (!c.startsWith('+')) c = '+39' + c;
  return c;
}
export const telHref = (n: string) => 'tel:' + cifreItaliane(n);
/** Forma leggibile: "+39 339 350 7848" (cellulari a gruppi 3-3-4). */
export function formatTel(n: string): string {
  const c = cifreItaliane(n);
  if (!c.startsWith('+39')) return c;
  const resto = c.slice(3);
  const gruppi = /^3\d{9}$/.test(resto) ? [resto.slice(0, 3), resto.slice(3, 6), resto.slice(6)] : [resto];
  return ['+39', ...gruppi].join(' ');
}

/** Testo semplice da un testo ricco (per estratti e descrizioni). */
export function testoSemplice(blocks: any): string {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b) => b?._type === 'block')
    .map((b) => (b.children ?? []).map((c: any) => c.text ?? '').join(''))
    .join('\n\n')
    .trim();
}
