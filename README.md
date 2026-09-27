# Atletica Daini — sito

Nuovo sito dell'A.S.D. Daini Carate Brianza (atletica leggera, dal 1945).
Pagine statiche generate da **Astro**; i contenuti si aggiornano dal pannello **Sanity**
(su `/admin`) e il sito è pubblicato su **Cloudflare Pages**.

```
web/
├─ src/pages/              Pagine (home, società, settore giovanile, record, impianto, news, gallery, contatti)
├─ src/components/         Header, footer, schede, apertura, mappa, "Anteprima stati" (solo sviluppo)
├─ src/lib/                Collegamento a Sanity, query, funzioni di supporto
├─ src/sanity/schemaTypes/ Moduli del pannello (notizie, iscrizioni, corsi, record, …)
├─ src/styles/             global.css (colori, sfondi) e font.css (caratteri)
├─ public/                 Loghi, icone, immagine per i link condivisi
├─ sanity.config.ts        Configurazione del pannello
└─ astro.config.mjs
archivio-sito-vecchio/     Copia del WordPress attuale (non versionata)
```

## Sviluppo in locale

Richiede Node.js 22.12 o successivo.

```bash
cd web
cp .env.example .env     # poi inserire l'id del progetto Sanity
npm install
npm run dev              # sito su http://localhost:4321, pannello su /admin
```

`npm run build` genera il sito in `web/dist`, `npm run preview` lo mostra.

In sviluppo, in basso a destra, la barra **Anteprima stati** simula iscrizioni
aperte o chiuse. È pensata per aggiungere altre anteprime quando serviranno.

## Configurazione (nessun dato di account nel codice)

| Variabile | Valore |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | id del progetto Sanity |
| `PUBLIC_SANITY_DATASET` | `production` |
| `PUBLIC_SITE_URL` | indirizzo pubblico del sito (canonical, sitemap, anteprime) |
| `PUBLIC_INDICIZZABILE` | `true` solo sul sito definitivo; altrimenti noindex, `robots.txt` che blocca tutto e intestazione `X-Robots-Tag` |

Passare il sito alla società significa cambiare questi valori, non il codice.

## Pubblicazione (Cloudflare Pages)

Root directory `web`, comando `npm run build`, cartella `dist`, variabili come sopra
più `NODE_VERSION=22`. L'indirizzo del sito va aggiunto ai **CORS origins** del
progetto Sanity (con "Allow credentials") perché il pannello funzioni anche online.

## Da sostituire quando arriveranno i materiali definitivi

- Logo: `public/loghi/` (provvisorio), icone `public/favicon*`, `public/apple-touch-icon.png`,
  `public/anteprima-link.png`. Nel pannello si possono caricare logo e versione per fondi scuri.
- Colori e sfondi: variabili in cima a `src/styles/global.css`.
- Caratteri: `src/styles/font.css`.
