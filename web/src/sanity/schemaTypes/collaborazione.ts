import { defineType, defineField } from 'sanity';
import { foto } from './foto';

/**
 * Professionisti e realtà che lavorano con la società (osteopata, mental
 * coach…) e sponsor. Tutto nella pagina /societa/collaborazioni/: gli
 * sponsor in cima, in un blocco a parte, che non compare finché non ce n'è uno.
 */
export const collaborazione = defineType({
  name: 'collaborazione',
  title: 'Collaborazione',
  type: 'document',
  fields: [
    defineField({ name: 'tipo', title: 'Tipo', type: 'string', initialValue: 'collaborazione',
      options: { list: [{ title: 'Collaborazione', value: 'collaborazione' }, { title: 'Sponsor', value: 'sponsor' }], layout: 'radio', direction: 'horizontal' },
      validation: (r) => r.required() }),
    defineField({ name: 'nome', title: 'Nome', type: 'string', description: 'Persona o azienda, es. "Bruno Segagni".', validation: (r) => r.required() }),
    defineField({ name: 'professione', title: 'Professione o attività', type: 'string', description: 'Es. "Osteopata D.O.", "Mental coach sportiva".' }),
    defineField({ name: 'foto', title: 'Foto', ...foto('collaborazione'), description: 'Per le persone. Per un\'azienda meglio il logo, qui sotto.' }),
    defineField({ name: 'logo', title: 'Logo (per aziende e sponsor)', type: 'image',
      description: 'Si vede intero, senza ritagli. Se c\'è, prende il posto della foto.' }),
    defineField({ name: 'descrizione', title: 'Cosa fa per i nostri atleti', type: 'text', rows: 3 }),
    defineField({ name: 'punti', title: 'Punti in evidenza (facoltativi)', type: 'array', of: [{ type: 'string' }],
      description: 'Uno per riga, es. "Gestione dell\'ansia pre-gara".' }),
    defineField({ name: 'indirizzo', title: 'Indirizzo', type: 'string', description: 'Es. "Via Dei Certosini 3, Giussano".' }),
    defineField({ name: 'luogo', title: 'Che cos\'è l\'indirizzo', type: 'string', initialValue: 'Studio',
      options: { list: ['Studio', 'Negozio', 'Sede'], layout: 'radio', direction: 'horizontal' },
      description: 'Compare sopra l\'indirizzo.' }),
    defineField({ name: 'telefono', title: 'Telefono', type: 'string', description: 'Anche senza +39.' }),
    defineField({ name: 'link', title: 'Sito web', type: 'url' }),
    defineField({ name: 'instagram', title: 'Profilo Instagram', type: 'url', description: 'Es. "https://www.instagram.com/nome/".' }),
    defineField({ name: 'ordine', title: 'Ordine', type: 'number', description: 'Numero più basso = prima.' }),
  ],
  orderings: [{ title: 'Ordine', name: 'ordine', by: [{ field: 'ordine', direction: 'asc' }] }],
  preview: { select: { title: 'nome', subtitle: 'professione', media: 'foto', tipo: 'tipo' },
    prepare: ({ title, subtitle, media, tipo }: any) => ({ title, media, subtitle: [tipo === 'sponsor' ? 'Sponsor' : null, subtitle].filter(Boolean).join(', ') }) },
});
