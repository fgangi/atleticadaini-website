import { defineType, defineField } from 'sanity';
import { foto } from './foto';
import { InEvidenzaUnica } from '../components/InEvidenzaUnica';

export const SEZIONI_NEWS = [
  { title: 'Società', value: 'societa' },
  { title: 'Settore giovanile', value: 'giovanile' },
  { title: 'Agonisti', value: 'agonisti' },
];

/** Notizia / articolo. */
export const news = defineType({
  name: 'news',
  title: 'Notizia',
  type: 'document',
  fields: [
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Indirizzo della pagina',
      type: 'slug',
      description: 'Si genera dal titolo con "Generate". Diventa /news/<indirizzo>/: meglio non cambiarlo dopo la pubblicazione, i link condivisi smetterebbero di funzionare.',
      options: { source: 'titolo', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'data',
      title: 'Data di pubblicazione',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sezione',
      title: 'Sezione',
      type: 'string',
      options: { list: SEZIONI_NEWS, layout: 'radio' },
      initialValue: 'societa',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'copertina', title: 'Immagine di copertina', ...foto('news'),
      description: 'Nella pagina dell\'articolo la foto resta intera; nelle anteprime si ritaglia attorno al punto scelto.' }),
    defineField({
      name: 'estratto',
      title: 'Estratto',
      type: 'text',
      rows: 3,
      description: 'Breve riassunto per le anteprime e per Google (meglio sotto i 160 caratteri).',
      validation: (r) => r.max(220).warning('Oltre i 160 caratteri Google lo taglia.'),
    }),
    defineField({ name: 'corpo', title: 'Testo', type: 'blockContent' }),
    defineField({
      name: 'allegati',
      title: 'Allegati (PDF, locandine)',
      type: 'array',
      of: [{ type: 'file', fields: [{ name: 'titolo', type: 'string', title: 'Titolo' }] }],
    }),
    defineField({
      name: 'inEvidenza',
      title: 'In evidenza in home',
      type: 'boolean',
      description: 'Solo una notizia per volta: attivandola qui, viene tolta automaticamente dalle altre.',
      initialValue: false,
      components: { input: InEvidenzaUnica },
    }),
  ],
  orderings: [{ title: 'Più recenti', name: 'dataDesc', by: [{ field: 'data', direction: 'desc' }] }],
  preview: {
    select: { title: 'titolo', sezione: 'sezione', media: 'copertina', data: 'data' },
    prepare: ({ title, sezione, media, data }) => ({
      title,
      subtitle: [SEZIONI_NEWS.find((s) => s.value === sezione)?.title, data ? new Date(data).toLocaleDateString('it-IT') : '']
        .filter(Boolean).join(' · '),
      media,
    }),
  },
});
