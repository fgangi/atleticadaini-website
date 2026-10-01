/**
 * Formati in cui compaiono le foto sul sito (larghezza / altezza), misurati
 * nel browser. Li usano sia il sito, per ritagliare le foto, sia il pannello,
 * per mostrare in anteprima i ritagli mentre si sceglie il punto importante:
 * se cambia un riquadro nel sito, va aggiornato solo qui.
 */
export type Formato = { nome: string; ratio: number; velo?: 'sinistra' | 'pieno' };

// Apertura della home: su PC da 1,7 a 2,6 (si ritaglia a 2 e il resto lo
// adatta il browser), su tablet circa 1,1, su telefono circa 0,55
export const APERTURA = { pc: 2, tablet: 1.1, telefono: 0.55 };

// Foto di sfondo dell'intestazione delle pagine, nella forma della fascia: schermi
// grandi (da 1280 px, fascia alta un quarto della larghezza), PC piccoli (1024×400),
// tablet (768×360) e telefono (390×340)
export const PAGINA_FOTO = { pc: 4, pcPiccolo: 2.6, tablet: 2.1, telefono: 1.15 };

export const FORMATI: Record<string, Formato[]> = {
  apertura: [
    { nome: 'Su PC', ratio: APERTURA.pc, velo: 'sinistra' },
    { nome: 'Su tablet', ratio: APERTURA.tablet, velo: 'pieno' },
    { nome: 'Su telefono', ratio: APERTURA.telefono, velo: 'pieno' },
  ],
  news: [
    { nome: 'Anteprima della news', ratio: 16 / 10 },
    { nome: 'Link condiviso su WhatsApp e social', ratio: 1200 / 630 },
  ],
  album: [{ nome: 'Copertina e miniature', ratio: 4 / 3 }],
  persona: [{ nome: 'Scheda nel team', ratio: 400 / 480 }],
  corso: [{ nome: 'Scheda del corso', ratio: 16 / 10 }],
  impianto: [{ nome: 'Foto dell\'impianto', ratio: 4 / 3 }],
  collaborazione: [{ nome: 'Scheda della convenzione', ratio: 1 }],
  paginaFoto: [
    { nome: 'Su schermi grandi', ratio: PAGINA_FOTO.pc, velo: 'sinistra' },
    { nome: 'Su PC piccoli', ratio: PAGINA_FOTO.pcPiccolo, velo: 'sinistra' },
    { nome: 'Su tablet', ratio: PAGINA_FOTO.tablet, velo: 'pieno' },
    { nome: 'Su telefono', ratio: PAGINA_FOTO.telefono, velo: 'pieno' },
  ],
  condivisione: [{ nome: 'Link condiviso su WhatsApp e social', ratio: 1200 / 630 }],
};

/** Larghezza e altezza originali, lette dall'id della foto ("image-…-3200x2133-jpg"). */
export function dimensioni(ref?: string | null): { w: number; h: number } | null {
  const m = String(ref ?? '').match(/-(\d+)x(\d+)-/);
  return m ? { w: Number(m[1]), h: Number(m[2]) } : null;
}
