/** Pagine legali: esistono solo quando il testo è compilato nel pannello. */
export const PAGINE_LEGALI = {
  privacy: { campo: 'privacy', titolo: 'Privacy e cookie', occhiello: 'Informativa' },
  safeguarding: { campo: 'safeguarding', titolo: 'Safeguarding', occhiello: 'Tutela dei minori' },
} as const;
export type PaginaLegale = keyof typeof PAGINE_LEGALI;
