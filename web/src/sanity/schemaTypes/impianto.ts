import { defineType, defineField } from 'sanity';
import { foto } from './foto';

/** Luogo di allenamento. Oggi è uno solo; l'elenco permette di aggiungerne altri. */
export const impianto = defineType({
  name: 'impianto',
  title: 'Impianto',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', description: 'Es. "Centro sportivo XXV Aprile".', validation: (r) => r.required() }),
    defineField({ name: 'indirizzo', title: 'Indirizzo', type: 'text', rows: 2, description: 'Es. "Via XXV Aprile, 20841 Carate Brianza (MB)".' }),
    defineField({ name: 'ingresso', title: 'Come si entra', type: 'string', description: 'Es. "Ingresso da via Giuseppe di Vittorio". Messo in evidenza nella pagina.' }),
    defineField({ name: 'descrizione', title: 'Descrizione', type: 'text', rows: 4 }),
    defineField({ name: 'dotazioni', title: 'Cosa c\'è', type: 'array', of: [{ type: 'string' }],
      description: 'Una voce per riga, es. "Pista a 6 corsie", "Pedana del salto in lungo".' }),
    defineField({ name: 'comeArrivare', title: 'Come arrivare', type: 'text', rows: 3, description: 'Parcheggio, mezzi pubblici, bici.' }),
    defineField({ name: 'mappa', title: 'Posizione sulla mappa', type: 'text', rows: 2,
      description: 'Incolla il codice "Incorpora una mappa" di Google Maps, oppure scrivi coordinate o indirizzo.' }),
    defineField({ name: 'foto', title: 'Foto', type: 'array', options: { layout: 'grid' },
      of: [foto('impianto', { fields: [{ name: 'alt', type: 'string', title: 'Didascalia' }] })] }),
    defineField({ name: 'ordine', title: 'Ordine', type: 'number', description: 'Il primo è l\'impianto principale (in home).' }),
  ],
  orderings: [{ title: 'Ordine', name: 'ordine', by: [{ field: 'ordine', direction: 'asc' }] }],
  preview: { select: { title: 'nome', subtitle: 'indirizzo', media: 'foto.0' } },
});
