import { defineType, defineField } from 'sanity';

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
    defineField({ name: 'sottotitolo', title: 'In breve', type: 'string', description: 'Es. "Avviamento allo sport attraverso il gioco".' }),
    defineField({ name: 'descrizione', title: 'Descrizione', type: 'text', rows: 5 }),
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
    defineField({ name: 'foto', title: 'Foto', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'giovanile', title: 'Settore giovanile', type: 'boolean', initialValue: true,
      description: 'Spento per i gruppi agonistici (Allievi e oltre): compaiono a parte.' }),
    defineField({ name: 'ordine', title: 'Ordine', type: 'number', description: 'Numero più basso = prima.' }),
  ],
  orderings: [{ title: 'Ordine', name: 'ordine', by: [{ field: 'ordine', direction: 'asc' }] }],
  preview: { select: { title: 'nome', subtitle: 'eta', media: 'foto' } },
});
