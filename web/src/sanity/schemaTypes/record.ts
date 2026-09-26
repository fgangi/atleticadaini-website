import { defineType, defineField } from 'sanity';

export const CATEGORIE_RECORD = [
  { title: 'Assoluti', value: 'assoluti' },
  { title: 'Juniores', value: 'juniores' },
  { title: 'Allievi', value: 'allievi' },
  { title: 'Cadetti', value: 'cadetti' },
  { title: 'Ragazzi', value: 'ragazzi' },
];

/**
 * Record sociale: una riga della tabella di una categoria.
 * "Migliorato quest'anno" non si spunta: il sito lo ricava dall'anno.
 */
export const record = defineType({
  name: 'record',
  title: 'Record sociale',
  type: 'document',
  fields: [
    defineField({ name: 'specialita', title: 'Specialità', type: 'string', description: 'Es. "200 m", "Salto in alto", "4×100".', validation: (r) => r.required() }),
    defineField({ name: 'categoria', title: 'Categoria', type: 'string', options: { list: CATEGORIE_RECORD }, initialValue: 'assoluti', validation: (r) => r.required() }),
    defineField({ name: 'sesso', title: 'Sesso', type: 'string', options: { list: [{ title: 'Maschile', value: 'M' }, { title: 'Femminile', value: 'F' }], layout: 'radio' }, validation: (r) => r.required() }),
    defineField({ name: 'prestazione', title: 'Prestazione', type: 'string', description: 'Scritta come si legge: 21"46 · 1\'47"61 · 1h01\'37" · 6,85 m · 6160 p.', validation: (r) => r.required() }),
    defineField({ name: 'atleta', title: 'Atleta', type: 'string', description: 'Nome e cognome. Per le staffette usa il campo sotto.' }),
    defineField({ name: 'staffetta', title: 'Componenti della staffetta', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'annoNascita', title: 'Anno di nascita', type: 'number' }),
    defineField({ name: 'anno', title: 'Anno del record', type: 'number', validation: (r) => r.required().min(1945).max(2100) }),
    defineField({ name: 'data', title: 'Data esatta (se nota)', type: 'date' }),
    defineField({ name: 'luogo', title: 'Luogo', type: 'string' }),
    defineField({ name: 'ordine', title: 'Ordine nella tabella', type: 'number', description: 'Dalle distanze corte alle lunghe, poi concorsi, prove multiple e staffette.' }),
  ],
  orderings: [{ title: 'Categoria e ordine', name: 'catOrdine', by: [{ field: 'categoria', direction: 'asc' }, { field: 'sesso', direction: 'asc' }, { field: 'ordine', direction: 'asc' }] }],
  preview: {
    select: { specialita: 'specialita', prestazione: 'prestazione', atleta: 'atleta', categoria: 'categoria', sesso: 'sesso', anno: 'anno' },
    prepare: ({ specialita, prestazione, atleta, categoria, sesso, anno }) => ({
      title: `${specialita} · ${prestazione}`,
      subtitle: [CATEGORIE_RECORD.find((c) => c.value === categoria)?.title, sesso, atleta ?? 'Staffetta', anno].filter(Boolean).join(' · '),
    }),
  },
});
