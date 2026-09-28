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
    defineField({ name: 'ruolo', title: 'Ruolo', type: 'string', description: 'Es. "Responsabile settore giovanile", "Presidente".' }),
    defineField({ name: 'area', title: 'Area', type: 'string', options: { list: AREE_TEAM, layout: 'radio' },
      initialValue: 'tecnici', validation: (r) => r.required() }),
    defineField({ name: 'qualifica', title: 'Qualifica', type: 'string', description: 'Es. "Istruttore FIDAL", "Laurea in Scienze motorie".' }),
    defineField({ name: 'specialita', title: 'Specialità seguite', type: 'string', description: 'Es. "Velocità e ostacoli".' }),
    defineField({ name: 'telefono', title: 'Telefono (facoltativo)', type: 'string',
      description: 'Compare nella scheda con il pulsante per chiamare: serve per le gare e l\'organizzazione. Anche senza +39.' }),
    defineField({ name: 'foto', title: 'Foto', ...foto('persona') }),
    defineField({ name: 'ordine', title: 'Ordine', type: 'number', description: 'Numero più basso = prima.' }),
  ],
  orderings: [{ title: 'Ordine', name: 'ordine', by: [{ field: 'ordine', direction: 'asc' }] }],
  preview: { select: { title: 'nome', subtitle: 'ruolo', media: 'foto' } },
});
