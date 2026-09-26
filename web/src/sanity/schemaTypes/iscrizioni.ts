import { defineType, defineField } from 'sanity';

/**
 * Iscrizioni della stagione: un solo documento.
 * L'interruttore "aperte" governa insieme l'apertura della home, il pulsante
 * "Iscriviti" nel menu e la sezione iscrizioni del settore giovanile.
 */
export const iscrizioni = defineType({
  name: 'iscrizioni',
  title: 'Iscrizioni',
  type: 'document',
  groups: [
    { name: 'campagna', title: 'Campagna', default: true },
    { name: 'quote', title: 'Quote e pagamento' },
    { name: 'documenti', title: 'Requisiti e moduli' },
  ],
  fields: [
    defineField({ name: 'aperte', title: 'Iscrizioni aperte', type: 'boolean', group: 'campagna', initialValue: false,
      description: 'Accende l\'apertura "iscrizioni" in home e il pulsante "Iscriviti" nel menu.' }),
    defineField({ name: 'stagione', title: 'Stagione', type: 'string', group: 'campagna', description: 'Es. "2026/2027".' }),
    defineField({ name: 'occhiello', title: 'Sopratitolo', type: 'string', group: 'campagna', description: 'Es. "Da lunedì 14 settembre".' }),
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', group: 'campagna', initialValue: 'Ripartono i corsi' }),
    defineField({ name: 'testo', title: 'Testo breve', type: 'text', rows: 3, group: 'campagna' }),
    defineField({ name: 'immagine', title: 'Immagine di apertura (facoltativa)', type: 'image', group: 'campagna',
      options: { hotspot: true }, description: 'Senza immagine si usa lo sfondo verde del sito.' }),
    defineField({ name: 'linkModulo', title: 'Link al modulo online (facoltativo)', type: 'url', group: 'campagna',
      description: 'Se l\'iscrizione si fa online. Altrimenti "Iscriviti" porta alla sezione iscrizioni del sito.' }),
    defineField({ name: 'periodi', title: 'Periodo di validità', type: 'text', rows: 4, group: 'campagna',
      description: 'Es. "Annuale: dal 15 settembre al 15 giugno. Trimestrale (solo Esordienti): …"' }),
    defineField({
      name: 'lezioneProva',
      title: 'Lezione di prova',
      type: 'object',
      group: 'campagna',
      options: { collapsible: true },
      fields: [
        { name: 'attiva', type: 'boolean', title: 'Si può fare una lezione di prova', initialValue: false },
        { name: 'testo', type: 'text', rows: 3, title: 'Come funziona' },
      ],
    }),

    defineField({
      name: 'tariffe',
      title: 'Quote',
      type: 'array',
      group: 'quote',
      of: [{ type: 'object', fields: [
        { name: 'tipologia', type: 'string', title: 'Tipologia / frequenza', validation: (r: any) => r.required() },
        { name: 'fornitura', type: 'string', title: 'Abbigliamento incluso', description: 'Es. "BASE: maglietta e pantaloncino".' },
        { name: 'nuovi', type: 'number', title: 'Nuovi iscritti (€)' },
        { name: 'rinnovi', type: 'number', title: 'Rinnovi (€)' },
      ], preview: {
        select: { title: 'tipologia', fornitura: 'fornitura', nuovi: 'nuovi', rinnovi: 'rinnovi' },
        prepare: ({ title, fornitura, nuovi, rinnovi }: any) => ({ title, subtitle: [fornitura, nuovi != null ? `${nuovi} € / ${rinnovi ?? '–'} €` : ''].filter(Boolean).join(' · ') }),
      } }],
    }),
    defineField({ name: 'noteQuote', title: 'Note alle quote', type: 'text', rows: 2, group: 'quote',
      description: 'Es. "Sconto del 10% sul secondo figlio".' }),
    defineField({ name: 'pagamento', title: 'Come pagare', type: 'blockContent', group: 'quote',
      description: 'Bonifico, causale, ricevuta per la detrazione. L\'IBAN va qui solo se la società vuole pubblicarlo.' }),

    defineField({ name: 'requisiti', title: 'Cosa serve per iscriversi', type: 'array', group: 'documenti',
      of: [{ type: 'string' }], description: 'Un requisito per riga, es. "Certificato medico agonistico (da Ragazzi in poi)".' }),
    defineField({ name: 'documenti', title: 'Moduli da scaricare', type: 'array', group: 'documenti',
      of: [{ type: 'reference', to: [{ type: 'documento' }] }] }),
  ],
  preview: {
    select: { aperte: 'aperte', stagione: 'stagione' },
    prepare: ({ aperte, stagione }) => ({ title: 'Iscrizioni', subtitle: `${stagione ?? ''} · ${aperte ? 'aperte' : 'chiuse'}` }),
  },
});
