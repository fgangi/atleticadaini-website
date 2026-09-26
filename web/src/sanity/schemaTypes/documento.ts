import { defineType, defineField } from 'sanity';

/** File da scaricare (moduli, informative, regolamenti, locandine). */
export const documento = defineType({
  name: 'documento',
  title: 'Documento',
  type: 'document',
  fields: [
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', description: 'Es. "Modulo di iscrizione 2026/2027".', validation: (r) => r.required() }),
    defineField({ name: 'file', title: 'File', type: 'file', validation: (r) => r.required() }),
    defineField({ name: 'descrizione', title: 'A cosa serve', type: 'string', description: 'Es. "Da compilare e consegnare in segreteria".' }),
  ],
  preview: { select: { title: 'titolo', subtitle: 'descrizione' } },
});
