import type { APIRoute } from 'astro';
import { sfetch } from '../lib/sanity';
import { settingsQuery } from '../lib/queries';
import { tesserati } from '../lib/tesserati';

/**
 * Il numero di tesserati pubblicato in questa versione del sito. Lo legge il
 * controllo giornaliero su GitHub (.github/workflows/aggiorna-sito.yml):
 * rigenera il sito solo se su FIDAL il numero è cambiato.
 * "daFidal" è falso quando il numero è scritto a mano nel pannello.
 */
export const GET: APIRoute = async () => {
  const settings = await sfetch<any>(settingsQuery, {}, null);
  const t = await tesserati(settings);
  const corpo = {
    codiceFidal: settings?.codiceFidal ?? null,
    numero: t?.numero ?? null,
    daFidal: !(typeof settings?.tesserati?.numero === 'number' && settings.tesserati.numero > 0),
  };
  return new Response(JSON.stringify(corpo), { headers: { 'Content-Type': 'application/json' } });
};
