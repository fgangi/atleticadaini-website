import { useCallback, useRef, useState } from 'react';
import { set, unset, useClient, useFormValue, type ObjectInputProps } from 'sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

/**
 * Controllo visuale per decidere che porzione della copertina si vede
 * nelle anteprime del sito: si trascina l'immagine dentro i riquadri,
 * che riproducono le proporzioni reali delle schede.
 *
 * Il valore è { x, y } in percentuale e sul sito diventa `object-position`.
 */

// Un solo formato: le schede news e il riquadro "in evidenza" hanno
// entrambi proporzioni 16:10, quindi l'inquadratura vale identica per tutti.
const FORMATI = [{ nome: 'Come apparirà nelle anteprime', ratio: 16 / 10 }];

type Pos = { x?: number; y?: number };

export function PosizioneAnteprima(props: ObjectInputProps) {
  const { value, onChange, readOnly } = props;
  const pos = value as Pos | undefined;
  const x = typeof pos?.x === 'number' ? pos.x : 50;
  const y = typeof pos?.y === 'number' ? pos.y : 50;

  const copertina = useFormValue(['copertina']) as any;
  const client = useClient({ apiVersion: '2024-10-01' });

  const url = copertina?.asset?._ref
    ? createImageUrlBuilder(client).image(copertina).width(1000).auto('format').url()
    : null;

  const aggiorna = useCallback(
    (nx: number, ny: number) => {
      const cx = Math.min(100, Math.max(0, Math.round(nx)));
      const cy = Math.min(100, Math.max(0, Math.round(ny)));
      onChange(cx === 50 && cy === 50 ? unset() : set({ _type: 'posizioneAnteprima', x: cx, y: cy }));
    },
    [onChange]
  );

  if (!url) {
    return (
      <div style={box}>
        <p style={nota}>Carica prima l'immagine di copertina: qui potrai scegliere cosa mostrare nelle anteprime.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <p style={nota}>
        Trascina l'immagine per scegliere la porzione visibile. Il riquadro ha le stesse proporzioni
        delle anteprime sul sito, in home e nell'elenco news.
      </p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {FORMATI.map((f) => (
          <Riquadro
            key={f.nome}
            nome={f.nome}
            ratio={f.ratio}
            url={url}
            x={x}
            y={y}
            readOnly={!!readOnly}
            onDrag={aggiorna}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ ...nota, margin: 0 }}>
          Posizione: <strong>{x}%</strong> orizzontale · <strong>{y}%</strong> verticale
        </span>
        <button type="button" style={bottone} disabled={!!readOnly} onClick={() => aggiorna(50, 50)}>
          Rimetti al centro
        </button>
      </div>
    </div>
  );
}

function Riquadro({
  nome, ratio, url, x, y, readOnly, onDrag,
}: {
  nome: string; ratio: number; url: string; x: number; y: number;
  readOnly: boolean; onDrag: (x: number, y: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [attivo, setAttivo] = useState(false);
  const inizio = useRef({ px: 0, py: 0, x: 50, y: 50 });

  const giu = (e: React.PointerEvent) => {
    if (readOnly) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    inizio.current = { px: e.clientX, py: e.clientY, x, y };
    setAttivo(true);
  };

  const muovi = (e: React.PointerEvent) => {
    if (!attivo || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // Trascinando verso il basso si scopre la parte alta della foto:
    // per questo il delta è invertito.
    const dx = ((e.clientX - inizio.current.px) / r.width) * 100;
    const dy = ((e.clientY - inizio.current.py) / r.height) * 100;
    onDrag(inizio.current.x - dx, inizio.current.y - dy);
  };

  const su = (e: React.PointerEvent) => {
    if (!attivo) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setAttivo(false);
  };

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', opacity: 0.6 }}>
        {nome}
      </span>
      <div
        ref={ref}
        onPointerDown={giu}
        onPointerMove={muovi}
        onPointerUp={su}
        onPointerCancel={su}
        style={{
          width: 360,
          maxWidth: '100%',
          aspectRatio: String(ratio),
          overflow: 'hidden',
          borderRadius: 6,
          border: '1px solid rgba(128,128,128,.35)',
          cursor: readOnly ? 'default' : attivo ? 'grabbing' : 'grab',
          touchAction: 'none',
          background: '#111',
        }}
      >
        <img
          src={url}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${x}% ${y}%`,
            userSelect: 'none',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}

const nota: React.CSSProperties = { fontSize: 13, opacity: 0.75, margin: 0, lineHeight: 1.5 };
const box: React.CSSProperties = {
  padding: 14, border: '1px dashed rgba(128,128,128,.4)', borderRadius: 6,
};
const bottone: React.CSSProperties = {
  fontSize: 12, padding: '6px 10px', borderRadius: 5, cursor: 'pointer',
  border: '1px solid rgba(128,128,128,.4)', background: 'transparent', color: 'inherit',
};
