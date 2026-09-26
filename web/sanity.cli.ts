import { defineCliConfig } from 'sanity/cli';
import { loadEnv } from 'vite';

// Comandi "npx sanity …" (import/export dei dati, login): stesso progetto del
// sito, letto dal .env. Nessun id scritto nel codice.
const env = loadEnv('development', process.cwd(), '');

export default defineCliConfig({
  api: {
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
  },
});
