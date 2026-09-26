import { defineType, defineArrayMember } from 'sanity';

/** Testo ricco riutilizzabile (notizie, storia, pagine legali). */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Testo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normale', value: 'normal' },
        { title: 'Titolo', value: 'h2' },
        { title: 'Sottotitolo', value: 'h3' },
        { title: 'Citazione', value: 'blockquote' },
      ],
      lists: [
        { title: 'Elenco puntato', value: 'bullet' },
        { title: 'Elenco numerato', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Grassetto', value: 'strong' },
          { title: 'Corsivo', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            // Accetta anche indirizzi interni al sito (/settore-giovanile/) e mailto:
            fields: [{ name: 'href', type: 'url', title: 'Indirizzo',
              validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }) }],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Descrizione dell\'immagine (per chi non vede)' }],
    }),
  ],
});
