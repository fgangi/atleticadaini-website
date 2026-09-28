/**
 * Numero di atleti tesserati per i contatori (home e "Chi siamo").
 * 1. Se nel pannello c'è un numero scritto a mano, vale quello (con la stagione).
 * 2. Altrimenti si legge "N° atleti" dalla pagina pubblica della società sul
 *    sito FIDAL, con il codice società del pannello, a ogni generazione del sito.
 * Se FIDAL non risponde o cambia la pagina, il contatore non compare: il sito
 * si genera comunque.
 */
let fidal: Promise<number | null> | null = null;

function daFidal(codice: string): Promise<number | null> {
  // Una sola richiesta per generazione, condivisa da tutte le pagine
  return (fidal ??= (async () => {
    try {
      const r = await fetch(`https://www.fidal.it/societa/x/${encodeURIComponent(codice)}`, {
        signal: AbortSignal.timeout(8000),
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; sito Atletica Daini)' },
      });
      if (!r.ok) return null;
      const m = (await r.text()).match(/N°\s*atleti:\s*(?:<[^>]+>\s*)*(\d+)/);
      return m ? Number(m[1]) : null;
    } catch {
      return null;
    }
  })());
}

export type Tesserati = { numero: number; dicitura: string };

export async function tesserati(settings: any): Promise<Tesserati | null> {
  const t = settings?.tesserati;
  if (typeof t?.numero === 'number' && t.numero > 0) {
    return { numero: t.numero, dicitura: t.stagione ? `atleti tesserati nella stagione ${t.stagione}` : 'atleti tesserati' };
  }
  if (!settings?.codiceFidal) return null;
  const n = await daFidal(settings.codiceFidal);
  return n && n > 0 ? { numero: n, dicitura: `atleti tesserati FIDAL nel ${new Date().getFullYear()}` } : null;
}
