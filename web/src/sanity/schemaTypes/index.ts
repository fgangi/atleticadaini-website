import { blockContent } from './blockContent';
import { siteSettings } from './siteSettings';
import { iscrizioni } from './iscrizioni';
import { openDay } from './openDay';
import { storia } from './storia';
import { news } from './news';
import { corso } from './corso';
import { membroTeam } from './membroTeam';
import { impianto } from './impianto';
import { record } from './record';
import { titolo } from './titolo';
import { galleryAlbum } from './galleryAlbum';
import { documento } from './documento';

/** Documenti unici: nel pannello si aprono direttamente, non si creano. */
export const SINGOLI = ['siteSettings', 'iscrizioni', 'openDay', 'storia'];

export const schemaTypes = [
  siteSettings, iscrizioni, openDay, storia,
  news, corso, membroTeam, impianto, record, titolo, galleryAlbum, documento,
  // Oggetti riutilizzabili
  blockContent,
];
