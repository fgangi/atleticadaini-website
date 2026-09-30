import { defineType, defineField } from 'sanity';
import { foto } from './foto';

/**
 * Corso / gruppo di allenamento. Gli orari si scrivono solo qui: home e
 * settore giovanile li leggono entrambi, così non possono contraddirsi.
 */
export const corso = defineType({
  name: 'corso',
  title: 'Corso',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', description: 'Es. "Esordienti".', validation: (r) => r.required() }),
    defineField({ name: 'eta', title: 'Età', type: 'string', description: 'Es. "4–11 anni" o "nati 2015–2020".' }),
    // Tre righe brevi al posto di un paragrafo: per chi è, cosa si fa, a cosa serve.
    // Si leggono al volo e chi aggiorna il pannello non può allungarle troppo
    defineField({ name: 'punti', title: 'Tre punti', type: 'array', of: [{ type: 'string' }],
      description: 'Nell\'ordine: per chi è (es. "Dalle medie al primo anno delle superiori"), cosa si fa (es. "Giochi di corsa, salti e lanci"), a cosa serve (es. "Per scoprire la specialità più adatta"). Frasi brevi.',
      validation: (r) => r.max(4).warning('Meglio tre punti: di più non si leggono al volo.') }),
    // Testi di prima, non più mostrati sul sito: nascosti ma conservati
    defineField({ name: 'sottotitolo', title: 'In breve (non più usato)', type: 'string', hidden: true }),
    defineField({ name: 'descrizione', title: 'Descrizione (non più usata)', type: 'text', rows: 5, hidden: true }),
    defineField({
      name: 'orari',
      title: 'Giorni e orari',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'giorni', type: 'string', title: 'Giorni', description: 'Es. "Martedì e giovedì".', validation: (r: any) => r.required() },
        { name: 'orario', type: 'string', title: 'Orario', description: 'Es. "17:30–18:30".', validation: (r: any) => r.required() },
        { name: 'nota', type: 'string', title: 'Nota', description: 'Es. "Monosettimanale o bisettimanale".' },
      ], preview: { select: { title: 'giorni', subtitle: 'orario' } } }],
    }),
    defineField({ name: 'luogo', title: 'Dove', type: 'reference', to: [{ type: 'impianto' }],
      description: 'Se vuoto si intende l\'impianto principale.' }),
    defineField({ name: 'foto', title: 'Foto', ...foto('corso') }),
    defineField({ name: 'giovanile', title: 'Settore giovanile', type: 'boolean', initialValue: true,
      description: 'Spento per i gruppi agonistici (Allievi e oltre): compaiono a parte.' }),
    defineField({ name: 'ordine', title: 'Ordine', type: 'number', description: 'Numero più basso = prima.' }),
  ],
  orderings: [{ title: 'Ordine', name: 'ordine', by: [{ field: 'ordine', direction: 'asc' }] }],
  preview: { select: { title: 'nome', subtitle: 'eta', media: 'foto' } },
});
