// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { writeFile } from 'node:fs/promises';

import react from '@astrojs/react';
import sanity from '@sanity/astro';

// Tutti i dati di account arrivano dall'ambiente (.env in locale, variabili
// del progetto su Cloudflare): passare il sito alla società è solo un cambio
// di configurazione, senza toccare il codice.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SITE_URL, PUBLIC_INDICIZZABILE } = loadEnv(
  process.env.NODE_ENV || 'development',
  process.cwd(),
  ''
);
const indicizzabile = PUBLIC_INDICIZZABILE === 'true';

// Solo in sviluppo: fa rispondere il dev server come Cloudflare Pages.
// Online un indirizzo senza slash finale viene reindirizzato a quello con lo
// slash (/impianto -> /impianto/); il dev server di Astro invece rispondeva
// "404" a qualsiasi indirizzo senza slash, anche alle pagine esistenti.
const slashFinaleComeOnline = {
  name: 'slash-finale-come-online',
  // Astro inserisce la propria regola sullo slash nella fase finale dei
  // plugin: questo gira dopo e si mette davanti, o non riceverebbe la richiesta.
  enforce: 'post',
  apply: 'serve',
  configureServer(server) {
    return () => {
      server.middlewares.stack.unshift({ route: '', handle: (req, res, next) => {
        const [percorso, query] = (req.url ?? '').split('?');
        const interno = /^\/(@|_astro|node_modules|src\/)/.test(percorso) || percorso.startsWith('/__');
        const file = /\.[a-z0-9]+$/i.test(percorso);
        if (!interno && !file && percorso !== '/' && !percorso.endsWith('/')) {
          res.statusCode = 308;
          res.setHeader('Location', `${percorso}/${query ? `?${query}` : ''}`);
          res.end();
          return;
        }
        next();
      } });
    };
  },
};

// Sito di prova: oltre al meta noindex nelle pagine, Cloudflare manda
// l'intestazione X-Robots-Tag su ogni file (anche PDF e immagini, che il meta
// non copre). Il file _headers si scrive a fine build perché Astro ignora le
// pagine che iniziano con "_".
const intestazioniProva = {
  name: 'intestazioni-sito-di-prova',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (indicizzabile) return;
      await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex, nofollow\n');
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE_URL || 'http://localhost:4321',
  // Pagine servite con lo slash finale: allinea sviluppo e produzione
  trailingSlash: 'always',
  // Espone il dev server sulla rete locale (prove dal telefono via IP del PC)
  server: { host: true },
  // La barra strumenti di Astro in sviluppo non si caricava (errore 504 di
  // Vite a ogni pagina) e copriva "Anteprima stati": non serve, la togliamo.
  devToolbar: { enabled: false },
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-10-01',
      // In sviluppo dati freschi; in produzione la build è comunque statica
      useCdn: false,
      // Pannello redazione raggiungibile su /admin
      studioBasePath: '/admin',
    }),
    react(),
    intestazioniProva,
  ],
  vite: { plugins: [slashFinaleComeOnline] },
});
