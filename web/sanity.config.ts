import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, SINGOLI } from './src/sanity/schemaTypes';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

/** Pannello ordinato come il sito: prima ciò che si aggiorna più spesso. */
const structure = (S: any) => {
  const singolo = (tipo: string, titolo: string) =>
    S.listItem().title(titolo).id(tipo).child(S.document().schemaType(tipo).documentId(tipo).title(titolo));
  return S.list()
    .title('Contenuti')
    .items([
      S.documentTypeListItem('news').title('Notizie'),
      singolo('iscrizioni', 'Iscrizioni'),
      S.documentTypeListItem('corso').title('Corsi e orari'),
      S.divider(),
      S.documentTypeListItem('record').title('Record sociali'),
      S.documentTypeListItem('titolo').title('Campioni e azzurri'),
      S.divider(),
      singolo('storia', 'Storia'),
      S.documentTypeListItem('membroTeam').title('Team'),
      S.documentTypeListItem('impianto').title('Impianti'),
      S.documentTypeListItem('galleryAlbum').title('Gallery'),
      S.documentTypeListItem('documento').title('Documenti da scaricare'),
      S.divider(),
      singolo('siteSettings', '⚙️ Impostazioni sito'),
    ]);
};

export default defineConfig({
  name: 'atleticadaini',
  title: 'Atletica Daini',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // I documenti unici non compaiono nel menu "crea nuovo"
    templates: (templates) => templates.filter((t) => !SINGOLI.includes(t.schemaType)),
  },
  document: {
    // …né si possono duplicare o cancellare per errore
    actions: (azioni, { schemaType }) =>
      SINGOLI.includes(schemaType) ? azioni.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : azioni,
  },
});
