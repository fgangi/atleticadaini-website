import { useCallback, useState } from 'react';
import { useClient, useFormValue, type BooleanInputProps } from 'sanity';

/**
 * Spunta "In evidenza" esclusiva: attivandola su una notizia, viene tolta
 * automaticamente da tutte le altre. Così in home ce n'è sempre una sola.
 */
export function InEvidenzaUnica(props: BooleanInputProps) {
  const { onChange, renderDefault } = props;
  const client = useClient({ apiVersion: '2024-10-01' });
  const idCorrente = String(useFormValue(['_id']) ?? '');
  const [stato, setStato] = useState<'idle' | 'lavoro' | 'fatto' | 'errore'>('idle');

  // id senza il prefisso "drafts." per confrontare bozza e pubblicato
  const base = idCorrente.replace(/^drafts\./, '');

  const gestisci = useCallback(
    async (event: any) => {
      onChange(event);
      const attivata = event?.patch?.value === true || event?.value === true;
      if (!attivata || !base) return;
      setStato('lavoro');
      try {
        const altri: string[] = await client.fetch(
          `*[_type == "news" && inEvidenza == true && !(_id in $miei)]._id`,
          { miei: [base, `drafts.${base}`] }
        );
        if (altri.length) {
          await client
            .transaction(
              altri.map((id) => ({ patch: { id, set: { inEvidenza: false } } })) as any
            )
            .commit();
        }
        setStato('fatto');
        setTimeout(() => setStato('idle'), 2500);
      } catch {
        setStato('errore');
      }
    },
    [onChange, client, base]
  );

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {renderDefault({ ...props, onChange: gestisci })}
      {stato === 'lavoro' && <Nota testo="Aggiorno le altre notizie…" />}
      {stato === 'fatto' && <Nota testo="✓ Tolta dalle altre notizie: in evidenza c'è solo questa." />}
      {stato === 'errore' && (
        <Nota testo="Non sono riuscito ad aggiornare le altre notizie: controllale a mano." errore />
      )}
    </div>
  );
}

function Nota({ testo, errore }: { testo: string; errore?: boolean }) {
  return (
    <span style={{ fontSize: 12, opacity: 0.8, color: errore ? '#d33' : 'inherit' }}>{testo}</span>
  );
}
