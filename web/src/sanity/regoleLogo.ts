import type { Rule } from 'sanity';

/**
 * Regole per i loghi caricati nel pannello.
 *
 * Il sito ritaglia da solo i margini vuoti e uniforma l'altezza dei loghi
 * dello stesso livello, quindi chi carica non deve preparare nulla. Restano
 * però due cose che il codice non può risolvere, ed è su quelle che avvisiamo:
 * un file troppo piccolo diventa sfocato, e uno con la cornice o il fondo
 * colorato resterà un rettangolo visibile.
 *
 * Sono avvisi, non errori: non impediscono di salvare. Il caso limite esiste
 * (un ente che fornisce solo quel file) e bloccarlo sarebbe peggio.
 */
export const DESCRIZIONE_LOGO = [
  'Meglio un PNG con sfondo trasparente, versione a colori (non quella bianca).',
  'Va bene anche con fondo bianco uniforme: il sito toglie il margine da solo.',
  'Almeno 600px sul lato lungo. Da evitare cornici e fondi colorati.',
].join(' ');

/** Lato lungo sotto il quale l'immagine si vede sgranata sugli schermi moderni. */
const LATO_MINIMO = 600;

export function validaLogo(r: Rule) {
  return r.custom(async (valore: any, contesto: any) => {
    const ref = valore?.asset?._ref;
    if (!ref) return true;

    // Le dimensioni stanno già nel riferimento: image-<id>-<w>x<h>-<estensione>
    const m = String(ref).match(/-(\d+)x(\d+)-/);
    const avvisi: string[] = [];
    if (m) {
      const lato = Math.max(Number(m[1]), Number(m[2]));
      if (lato < LATO_MINIMO) {
        avvisi.push(`immagine piccola (${lato}px sul lato lungo, meglio almeno ${LATO_MINIMO})`);
      }
    }

    // La trasparenza si legge dai dati dell'immagine, non dal nome del file
    try {
      const client = contesto?.getClient?.({ apiVersion: '2024-10-01' });
      if (client) {
        const opaca = await client.fetch(
          '*[_id == $id][0].metadata.isOpaque',
          { id: ref },
        );
        if (opaca === true) {
          avvisi.push('sfondo non trasparente: va bene se è bianco uniforme, non se ha cornice o fondo colorato');
        }
      }
    } catch {
      // Se la verifica non riesce non si blocca nulla: resta solo il controllo sulle dimensioni
    }

    return avvisi.length ? avvisi.join(' · ') : true;
  }).warning();
}
