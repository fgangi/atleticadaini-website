import { defineType, defineField } from 'sanity';
import { foto } from './foto';

/** Storia della società: un solo documento, raccontato per periodi. */
export const storia = defineType({
  name: 'storia',
  title: 'Storia',
  type: 'document',
  fields: [
    defineField({ name: 'introduzione', title: 'Introduzione', type: 'blockContent',
      description: 'Il racconto della fondazione. In home ne compare l\'inizio.' }),
    defineField({ name: 'fotoSquadra', title: 'Foto di squadra', ...foto('paginaFoto', { fields: [
      { name: 'alt', type: 'string', title: 'Cosa mostra la foto (per chi non vede)' },
    ] }), description: 'Sfondo dell\'intestazione di Chi siamo. Orizzontale, con la squadra nella parte bassa: in alto va il titolo.' }),
    defineField({
      name: 'capitoli',
      title: 'Periodi',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'periodo', type: 'string', title: 'Periodo', description: 'Es. "Anni \'60".', validation: (r: any) => r.required() },
        { name: 'titolo', type: 'string', title: 'Titolo' },
        { name: 'testo', type: 'text', rows: 5, title: 'Testo' },
        { name: 'immagine', type: 'image', title: 'Immagine', options: { hotspot: true } },
        { name: 'album', type: 'reference', title: 'Album collegato', to: [{ type: 'galleryAlbum' }] },
      ], preview: { select: { title: 'periodo', subtitle: 'titolo', media: 'immagine' } } }],
    }),
    defineField({
      name: 'riconoscimenti',
      title: 'Riconoscimenti',
      type: 'array',
      description: 'Es. "Società Campione d\'Italia di marcia" (1958), "Stella d\'argento CONI al merito sportivo".',
      of: [{ type: 'object', fields: [
        { name: 'titolo', type: 'string', title: 'Riconoscimento', validation: (r: any) => r.required() },
        { name: 'anno', type: 'string', title: 'Anno' },
        { name: 'descrizione', type: 'string', title: 'Descrizione' },
      ], preview: { select: { title: 'titolo', subtitle: 'anno' } } }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Storia' }) },
});
