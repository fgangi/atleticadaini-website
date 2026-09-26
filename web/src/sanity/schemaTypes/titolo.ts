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
    defineField({ name: 'descrizione', title: 'Titolo / manifestazione', type: 'string', description: 'Es. "Campione italiano · Campionati Italiani Allievi, Molfetta · 400 m".' }),
  ],
  orderings: [{ title: 'Anno', name: 'annoDesc', by: [{ field: 'anno', direction: 'desc' }] }],
  preview: { select: { title: 'atleta', subtitle: 'descrizione', anno: 'anno' },
    prepare: ({ title, subtitle, anno }) => ({ title: `${title} (${anno ?? ''})`, subtitle }) },
});
