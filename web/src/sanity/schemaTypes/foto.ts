import { InquadraturaFoto } from '../components/InquadraturaFoto';
import { FORMATI, dimensioni } from '../../lib/formati';

/**
 * Campo foto unico per tutto il pannello: caricamento normale più la scelta
 * del punto importante, con le anteprime dei formati in cui la foto compare.
 * Si usa sia come campo (`defineField({ name, title, ...foto('news') })`)
 * sia come elemento di un elenco (`of: [foto('album')]`).
 */
type Extra = { telefono?: boolean; apertura?: boolean; fields?: any[] };

export function foto(formato: keyof typeof FORMATI, extra: Extra = {}): any {
  return {
    type: 'image',
    options: { hotspot: true, formati: FORMATI[formato], telefono: !!extra.telefono },
    components: { input: InquadraturaFoto },
    fields: [
      ...(extra.fields ?? []),
      // Punto facoltativo solo per il telefono: lo imposta la casella nel pannello
      ...(extra.telefono ? [{ name: 'telefono', type: 'object', hidden: true,
        fields: [{ name: 'x', type: 'number' }, { name: 'y', type: 'number' }] }] : []),
    ],
    ...(extra.apertura ? { validation: (r: any) => r.custom(controllaApertura).warning() } : {}),
  };
}

// Avvisi (non blocchi) per le foto dell'apertura: verticali o piccole
// vengono tagliate molto o sembrano sgranate sugli schermi grandi
function controllaApertura(v: any) {
  const d = dimensioni(v?.asset?._ref);
  if (!d) return true;
  if (d.h > d.w) return 'Foto verticale: nell\'apertura verrà tagliata molto. Meglio una foto orizzontale.';
  if (d.w < 2000) return `Foto piccola (${d.w} px di larghezza): sugli schermi grandi potrebbe sembrare sgranata. Meglio almeno 2000 px.`;
  return true;
}
