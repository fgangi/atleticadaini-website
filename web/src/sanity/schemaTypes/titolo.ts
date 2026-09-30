import { defineType, defineField } from 'sanity';

export const TIPI_TITOLO = [
  { title: 'Titolo (italiano, europeo, mondiale)', value: 'campione' },
  { title: 'Maglia azzurra', value: 'azzurro' },
];

/** Titolo conquistato o convocazione in nazionale di un atleta della società. */
export const titolo = defineType({
  name: 'titolo',
  title: 'Campione / azzurro',
  type: 'document',
  fields: [
    defineField({ name: 'tipo', title: 'Tipo', type: 'string', options: { list: TIPI_TITOLO, layout: 'radio' }, initialValue: 'campione', validation: (r) => r.required() }),
    defineField({ name: 'atleta', title: 'Atleta', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'anno', title: 'Anno', type: 'number', validation: (r) => r.required() }),
    // Tre campi separati invece di una riga con separatori: il sito li mostra su righe diverse
    defineField({ name: 'risultato', title: 'Risultato', type: 'string', description: 'Es. "Campione italiano", "8° classificato".' }),
    defineField({ name: 'gara', title: 'Gara', type: 'string', description: 'Es. "400m", "10km di marcia". Distanze scritte attaccate.' }),
    defineField({ name: 'manifestazione', title: 'Manifestazione e luogo', type: 'string', description: 'Es. "Campionati Italiani Allievi, Molfetta".' }),
    defineField({ name: 'nota', title: 'Nota (facoltativa)', type: 'string', description: 'Es. "Record d\'Europa 6h18\'24"".' }),
  ],
  orderings: [{ title: 'Anno', name: 'annoDesc', by: [{ field: 'anno', direction: 'desc' }] }],
  preview: { select: { title: 'atleta', risultato: 'risultato', gara: 'gara', anno: 'anno' },
    prepare: ({ title, risultato, gara, anno }) => ({ title: `${title} (${anno ?? ''})`, subtitle: [risultato, gara].filter(Boolean).join(', ') }) },
});
