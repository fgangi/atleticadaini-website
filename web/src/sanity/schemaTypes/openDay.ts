import { defineType, defineField } from 'sanity';
import { foto } from './foto';

/**
 * Open days e lezioni di prova: un solo documento.
 * L'interruttore "attivo" accende la pagina /open-days/, il pulsante nel menu e
 * i richiami in home e nel settore giovanile.
 */
export const openDay = defineType({
  name: 'openDay',
  title: 'Open days',
  type: 'document',
  groups: [
    { name: 'pagina', title: 'Pagina', default: true },
    { name: 'date', title: 'Date' },
    { name: 'info', title: 'Info utili' },
  ],
  fields: [
    defineField({ name: 'attivo', title: 'Mostra gli open days sul sito', type: 'boolean', group: 'pagina', initialValue: true,
      description: 'Spento: spariscono la pagina, il pulsante nel menu e i richiami in home.' }),
    defineField({ name: 'occhiello', title: 'Sopratitolo', type: 'string', group: 'pagina', initialValue: 'Open days' }),
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', group: 'pagina', initialValue: 'Vieni a provare l\'atletica' }),
    defineField({ name: 'testo', title: 'Testo di apertura', type: 'text', rows: 3, group: 'pagina' }),
    defineField({ name: 'immagine', title: 'Foto per i link condivisi (facoltativa)', group: 'pagina', ...foto('condivisione'),
      description: 'Compare quando qualcuno manda il link della pagina su WhatsApp o sui social.' }),

    defineField({
      name: 'date',
      title: 'Date degli open days',
      type: 'array',
      group: 'date',
      description: 'Le date passate spariscono da sole. Senza date future compare il testo "tutto l\'anno".',
      of: [{ type: 'object', fields: [
        { name: 'giorno', type: 'date', title: 'Giorno', validation: (r: any) => r.required() },
        { name: 'orario', type: 'string', title: 'Orario', description: 'Es. "17:30–18:30".' },
        { name: 'perChi', type: 'string', title: 'Per chi', description: 'Es. "Esordienti, 4–11 anni".' },
        { name: 'nota', type: 'string', title: 'Nota' },
      ], preview: { select: { title: 'giorno', subtitle: 'perChi' } } }],
    }),
    defineField({ name: 'tuttoAnno', title: 'Testo quando non ci sono date', type: 'text', rows: 3, group: 'date',
      description: 'Es. "Si può venire a provare in ogni periodo dell\'anno: scrivici e ti diciamo il giorno giusto."' }),

    defineField({ name: 'whatsapp', title: 'Numero WhatsApp per prenotare', type: 'string', group: 'info',
      description: 'Anche senza +39. Se vuoto si usa il primo telefono delle impostazioni.' }),
    defineField({ name: 'referente', title: 'Nome del referente (facoltativo)', type: 'string', group: 'info',
      description: 'Se c\'è, sotto il pulsante compare "Ti risponde … al numero". Vuoto: "Scrivici su WhatsApp al numero".' }),
    defineField({ name: 'messaggio', title: 'Messaggio WhatsApp già scritto', type: 'string', group: 'info',
      initialValue: 'Ciao! Vorrei far provare l\'atletica a mio figlio/mia figlia. Ha … anni.',
      description: 'Chi tocca "Prenota" trova questo testo pronto da inviare; per una data precisa il sito aggiunge il giorno.' }),
    defineField({ name: 'cosaPortare', title: 'Cosa portare', type: 'array', of: [{ type: 'string' }], group: 'info',
      description: 'Una cosa per riga, valida tutto l\'anno.' }),
    defineField({ name: 'cosaPortareInverno', title: 'Cosa portare: in più d\'inverno', type: 'array', of: [{ type: 'string' }], group: 'info',
      description: 'Compare sotto "Cosa portare" con il titolo "D\'inverno aggiungi". Es. "Guanti".' }),
    defineField({ name: 'documenti', title: 'Moduli per la prova', type: 'array', group: 'info',
      of: [{ type: 'reference', to: [{ type: 'documento' }] }], description: 'Es. la liberatoria per la lezione di prova.' }),
    defineField({
      name: 'faq',
      title: 'Domande frequenti',
      type: 'array',
      group: 'info',
      of: [{ type: 'object', fields: [
        { name: 'domanda', type: 'string', title: 'Domanda', validation: (r: any) => r.required() },
        { name: 'risposta', type: 'text', rows: 3, title: 'Risposta', validation: (r: any) => r.required() },
        { name: 'testoLink', type: 'string', title: 'Parole da trasformare in link (facoltativo)',
          description: 'Scritte identiche a come sono nella risposta, es. "Corsi e orari".' },
        { name: 'link', type: 'string', title: 'Pagina a cui porta il link',
          description: 'Es. "/settore-giovanile/#corsi" per una pagina del sito, oppure un indirizzo completo.' },
      ], preview: { select: { title: 'domanda', subtitle: 'risposta' } } }],
    }),
  ],
  preview: { select: { attivo: 'attivo' }, prepare: ({ attivo }) => ({ title: 'Open days', subtitle: attivo ? 'attivo' : 'spento' }) },
});
