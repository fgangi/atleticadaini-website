// Tag template per evidenziare le query GROQ (nessuna dipendenza esterna).
const groq = String.raw;

export const settingsQuery = groq`*[_id == "siteSettings"][0]{
  nome, denominazione, descrizione, fraseFooter, annoFondazione, logo, logoChiaro, codiceFiscale, partitaIva, codiceFidal,
  enti, email, telefoni, sede, social, linkUtili, puntiForza, cinquePerMille, slider,
  "haPrivacy": count(privacy) > 0, "haSafeguarding": count(safeguarding) > 0
}`;

// Documento unico delle iscrizioni; i moduli arrivano già con l'indirizzo del file
export const iscrizioniQuery = groq`*[_id == "iscrizioni"][0]{
  aperte, stagione, occhiello, titolo, testo, immagine, linkModulo, periodi, lezioneProva,
  tariffe, noteQuote, pagamento, requisiti,
  "documenti": documenti[]->{ _id, titolo, descrizione, "url": file.asset->url, "est": file.asset->extension }
}`;

export const corsiQuery = groq`*[_type == "corso"] | order(ordine asc, nome asc){
  _id, nome, eta, sottotitolo, descrizione, orari, foto, giovanile, "luogo": luogo->nome
}`;

export const teamQuery = groq`*[_type == "membroTeam"] | order(ordine asc, nome asc){
  _id, nome, ruolo, area, qualifica, specialita, foto
}`;

export const impiantiQuery = groq`*[_type == "impianto"] | order(ordine asc, nome asc){
  _id, nome, indirizzo, ingresso, descrizione, dotazioni, comeArrivare, mappa, foto
}`;

export const storiaQuery = groq`*[_id == "storia"][0]{
  introduzione, riconoscimenti,
  capitoli[]{ _key, periodo, titolo, testo, immagine, "album": album->{ titolo, "slug": slug.current } }
}`;

export const recordQuery = groq`*[_type == "record"] | order(ordine asc, specialita asc){
  _id, specialita, categoria, sesso, sezione, prestazione, atleta, staffetta, annoNascita, eta, anno, data, luogo
}`;

export const titoliQuery = groq`*[_type == "titolo"] | order(anno desc, atleta asc){
  _id, tipo, atleta, anno, descrizione
}`;

const campiNews = groq`_id, titolo, "slug": slug.current, data, sezione, estratto, copertina, posizioneAnteprima, inEvidenza`;

export const newsUltimeQuery = groq`*[_type == "news" && defined(slug.current)] | order(data desc)[0...$limit]{ ${campiNews} }`;

export const newsInEvidenzaQuery = groq`*[_type == "news" && inEvidenza == true && defined(slug.current)] | order(data desc)[0]{ ${campiNews} }`;

export const newsBySlugQuery = groq`*[_type == "news" && slug.current == $slug][0]{
  titolo, data, sezione, estratto, copertina, corpo,
  "allegati": allegati[]{ titolo, "url": asset->url, "nome": asset->originalFilename }
}`;

export const newsSlugsQuery = groq`*[_type == "news" && defined(slug.current)]{ "slug": slug.current }`;

export const albumListQuery = groq`*[_type == "galleryAlbum" && defined(slug.current)] | order(data desc){
  _id, titolo, "slug": slug.current, data, storico, "copertina": coalesce(copertina, foto[0]), "conteggio": count(foto)
}`;

export const albumBySlugQuery = groq`*[_type == "galleryAlbum" && slug.current == $slug][0]{
  titolo, data, storico, descrizione, foto
}`;

export const albumSlugsQuery = groq`*[_type == "galleryAlbum" && defined(slug.current)]{ "slug": slug.current }`;

/**
 * Cosa esiste davvero: menu, footer e sitemap mostrano una voce solo se la
 * pagina ha contenuto. Una voce che porta a una pagina vuota è peggio di una
 * voce in meno.
 */
export const presenzeQuery = groq`{
  "album": count(*[_type == "galleryAlbum" && defined(slug.current)]),
  "record": count(*[_type == "record"]) + count(*[_type == "titolo"]),
  "team": count(*[_type == "membroTeam"]),
  "corsi": count(*[_type == "corso"]),
  "quote": count(*[_id == "iscrizioni"][0].tariffe),
  "storia": count(*[_id == "storia" && (count(introduzione) > 0 || count(capitoli) > 0)]),
  "privacy": count(*[_id == "siteSettings" && count(privacy) > 0]),
  "safeguarding": count(*[_id == "siteSettings" && count(safeguarding) > 0]),
  "iscrizioniAperte": *[_id == "iscrizioni"][0].aperte == true,
  "linkModulo": *[_id == "iscrizioni"][0].linkModulo
}`;
