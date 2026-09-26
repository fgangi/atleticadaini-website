import { defineType, defineField } from 'sanity';

/** Album fotografico: ha una pagina propria in /gallery/<indirizzo>/. */
export const galleryAlbum = defineType({
  name: 'galleryAlbum',
  title: 'Album',
  type: 'document',
  fields: [
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Indirizzo della pagina',
      type: 'slug',
      options: { source: 'titolo', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'data',
      title: 'Data',
      type: 'date',
      description: 'Per gli album storici basta una data indicativa (es. 1° gennaio 1960): serve all\'ordinamento.',
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: 'storico',
      title: 'Album storico',
      type: 'boolean',
      description: 'Gli album storici compaiono anche nella pagina Storia e vengono elencati a parte.',
      initialValue: false,
    }),
    defineField({ name: 'descrizione', title: 'Descrizione', type: 'text', rows: 3 }),
    defineField({ name: 'copertina', title: 'Copertina', type: 'image', options: { hotspot: true },
      description: 'Se manca, si usa la prima foto dell\'album.' }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Didascalia' }] }],
      options: { layout: 'grid' },
    }),
  ],
  orderings: [{ title: 'Più recenti', name: 'dataDesc', by: [{ field: 'data', direction: 'desc' }] }],
  preview: {
    select: { title: 'titolo', data: 'data', media: 'copertina', foto: 'foto.0', storico: 'storico' },
    prepare: ({ title, data, media, foto, storico }) => ({
      title,
      subtitle: [storico ? 'Storico' : '', data ? new Date(data).getFullYear() : ''].filter(Boolean).join(' · '),
      media: media ?? foto,
    }),
  },
});
