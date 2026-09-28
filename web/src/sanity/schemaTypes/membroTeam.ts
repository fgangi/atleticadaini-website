import { defineType, defineField } from 'sanity';
import { foto } from './foto';

export const AREE_TEAM = [
  { title: 'Allenatori e istruttori', value: 'tecnici' },
  { title: 'Consiglio direttivo', value: 'direttivo' },
  { title: 'Segreteria e collaboratori', value: 'segreteria' },
];

/** Persona del team (tecnici, direttivo, segreteria). */
export const membroTeam = defineType({
  name: 'membroTeam',
  title: 'Persona del team',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome e cognome', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'ruolo', title: 'Ruolo', type: 'string', description: 'Es. "Istruttore", "Allenatore", "Presidente". Compare sotto il nome.' }),
    defineField({ name: 'area', title: 'Area', type: 'string', options: { list: AREE_TEAM, layout: 'radio' },
      initialValue: 'tecnici', validation: (r) => r.required() }),
    defineField({ name: 'carica', title: 'Carica nel consiglio direttivo (facoltativa)', type: 'string',
      hidden: ({ document }: any) => document?.area === 'direttivo',
      description: 'Per chi ha anche un ruolo nel consiglio, es. un allenatore che è "Vicepresidente": compare anche nel consiglio direttivo con questa carica.' }),
    defineField({ name: 'corsi', title: 'Gruppi che allena', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'corso' }] }],
      hidden: ({ document }: any) => (document?.area ?? 'tecnici') !== 'tecnici',
      description: 'Nella pagina Team gli allenatori compaiono divisi per gruppo. Chi allena più gruppi compare in ognuno.' }),
    defineField({ name: 'telefono', title: 'Telefono (facoltativo)', type: 'string',
      description: 'Compare nella scheda con il pulsante per chiamare: serve per le gare e l\'organizzazione. Anche senza +39.' }),
    defineField({ name: 'foto', title: 'Foto', ...foto('persona') }),
    defineField({ name: 'ordine', title: 'Ordine', type: 'number', description: 'Numero più basso = prima.' }),
  ],
  orderings: [{ title: 'Ordine', name: 'ordine', by: [{ field: 'ordine', direction: 'asc' }] }],
  preview: { select: { title: 'nome', subtitle: 'ruolo', media: 'foto' } },
});
