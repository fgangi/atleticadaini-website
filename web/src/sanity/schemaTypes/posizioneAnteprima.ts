import { defineType, defineField } from 'sanity';
import { PosizioneAnteprima as InputPosizione } from '../components/PosizioneAnteprima';

/**
 * Punto dell'immagine da mantenere visibile nelle anteprime, in percentuale.
 * Sul sito diventa la proprietà CSS `object-position`.
 */
export const posizioneAnteprima = defineType({
  name: 'posizioneAnteprima',
  title: 'Inquadratura anteprima',
  type: 'object',
  components: { input: InputPosizione },
  fields: [
    defineField({ name: 'x', title: 'Orizzontale (%)', type: 'number' }),
    defineField({ name: 'y', title: 'Verticale (%)', type: 'number' }),
  ],
});
