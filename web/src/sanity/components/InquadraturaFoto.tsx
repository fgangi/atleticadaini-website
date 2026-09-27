import { useRef, useState } from 'react';
import { set, unset, useClient, type ObjectInputProps } from 'sanity';
import { createImageUrlBuilder } from '@sanity/image-url';
import { dimensioni, type Formato } from '../../lib/formati';

/**
 * Sotto il normale caricamento della foto: si tocca la foto sul punto che deve
 * restare sempre visibile (di solito i volti) e si vedono subito i ritagli in
 * tutti i formati in cui compare sul sito.
 *
 * Il punto è l'"hotspot" di Sanity, lo stesso che il sito usa per ritagliare
 * le foto sul server: un solo dato, valido per ogni formato. Le anteprime
 * rifanno lo stesso calcolo di @sanity/image-url, quindi coincidono col sito.
 * Opzione `telefono`: un secondo punto facoltativo, solo per il telefono.
 */
type Punto = { x: number; y: number };
type Opzioni = { formati?: Formato[]; telefono?: boolean };
type Ritaglio = { left?: number; top?: number; right?: number; bottom?: number };

export function InquadraturaFoto(props: ObjectInputProps) {
  const { value, onChange, readOnly } = props as ObjectInputProps & { value?: any };
  const opzioni = (props.schemaType.options ?? {}) as Opzioni;
  const formati = opzioni.formati ?? [];
  const client = useClient({ apiVersion: '2024-10-01' });

  const ref = value?.asset?._ref as string | undefined;
  const dim = dimensioni(ref);
  const url = ref ? createImageUrlBuilder(client).image({ asset: { _ref: ref } }).width(900).auto('format').url() : null;

  // Punto salvato; durante il trascinamento se ne tiene uno locale e si salva
  // solo al rilascio, per non mandare un salvataggio a ogni pixel
  const salvato: Punto | null = typeof value?.hotspot?.x === 'number' ? { x: value.hotspot.x, y: value.hotspot.y } : null;
  const [bozza, setBozza] = useState<Punto | null>(null);
  const punto = bozza ?? salvato;

  const salvatoTel: Punto | null = typeof value?.telefono?.x === 'number' ? { x: value.telefono.x, y: value.telefono.y } : null;
  const [bozzaTel, setBozzaTel] = useState<Punto | null>(null);
  const puntoTel = bozzaTel ?? salvatoTel;

  const salva = (p: Punto) => {
    const h = value?.hotspot ?? {};
    onChange(set({ _type: 'sanity.imageHotspot', width: h.width ?? 0.3, height: h.height ?? 0.3, x: p.x, y: p.y }, ['hotspot']));
    setBozza(null);
  };
  const salvaTel = (p: Punto) => { onChange(set({ x: p.x, y: p.y }, ['telefono'])); setBozzaTel(null); };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {props.renderDefault(props)}

      {url && dim && formati.length > 0 && (
        <div style={pannello}>
          <div style={{ display: 'grid', gap: 4 }}>
            <strong style={{ fontSize: 15 }}>Cosa deve restare sempre visibile?</strong>
            <p style={nota}>
              Tocca la foto sul punto più importante, di solito i volti. Sotto vedi come apparirà in ogni parte del sito.
            </p>
          </div>

          <Scelta url={url} punto={punto} readOnly={!!readOnly} onMuovi={setBozza} onFine={salva} etichetta="Punto importante della foto" />

          <p style={{ ...nota, fontWeight: 600 }}>
            {salvato
              ? 'Punto scelto.'
              : 'Nessun punto scelto: il sito sceglie da solo la parte con più dettagli. Le anteprime qui sotto sono solo indicative.'}
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {formati.map((f) => {
              const tel = opzioni.telefono && f.ratio < 1 && puntoTel ? puntoTel : null;
              return <Anteprima key={f.nome} formato={f} url={url} dim={dim} crop={value?.crop} punto={tel ?? punto ?? { x: 0.5, y: 0.5 }} />;
            })}
          </div>

          {salvato && !readOnly && (
            <div>
              <button type="button" style={bottone} onClick={() => { setBozza(null); onChange(unset(['hotspot'])); }}>
                Togli il punto e lascia scegliere al sito
              </button>
            </div>
          )}

          {opzioni.telefono && (
            <div style={{ display: 'grid', gap: 10, borderTop: '1px solid rgba(128,128,128,.25)', paddingTop: 14 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, cursor: readOnly ? 'default' : 'pointer' }}>
                <input type="checkbox" disabled={!!readOnly} checked={!!salvatoTel}
                  onChange={(e) => (e.target.checked ? salvaTel(punto ?? { x: 0.5, y: 0.5 }) : onChange(unset(['telefono'])))} />
                Sul telefono serve un punto diverso
              </label>
              {salvatoTel && (
                <>
                  <p style={nota}>Solo se sul telefono resta tagliato qualcosa di importante. Tocca la foto sul punto da tenere al centro sul telefono.</p>
                  <Scelta url={url} punto={puntoTel} readOnly={!!readOnly} onMuovi={setBozzaTel} onFine={salvaTel} etichetta="Punto importante sul telefono" piccola />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Foto intera: si tocca o si trascina il segno; con la tastiera, frecce. */
function Scelta({ url, punto, readOnly, onMuovi, onFine, etichetta, piccola = false }: {
  url: string; punto: Punto | null; readOnly: boolean; etichetta: string; piccola?: boolean;
  onMuovi: (p: Punto) => void; onFine: (p: Punto) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const ultimo = useRef<Punto | null>(null);
  const [trascina, setTrascina] = useState(false);

  const daEvento = (e: React.PointerEvent): Punto => {
    const r = box.current!.getBoundingClientRect();
    const c = (n: number) => Math.round(Math.min(1, Math.max(0, n)) * 1000) / 1000;
    return { x: c((e.clientX - r.left) / r.width), y: c((e.clientY - r.top) / r.height) };
  };
  const muovi = (p: Punto) => { ultimo.current = p; onMuovi(p); };

  // Frecce: spostamento di 2%, salvato subito
  const tasto = (e: React.KeyboardEvent) => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!d || readOnly) return;
    e.preventDefault();
    const p = punto ?? { x: 0.5, y: 0.5 };
    onFine({ x: Math.min(1, Math.max(0, p.x + d[0] * 0.02)), y: Math.min(1, Math.max(0, p.y + d[1] * 0.02)) });
  };

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={readOnly ? -1 : 0}
      aria-label={etichetta}
      aria-valuetext={punto ? `${Math.round(punto.x * 100)}% da sinistra, ${Math.round(punto.y * 100)}% dall'alto` : 'nessun punto'}
      onKeyDown={tasto}
      onPointerDown={(e) => { if (readOnly) return; (e.target as HTMLElement).setPointerCapture(e.pointerId); setTrascina(true); muovi(daEvento(e)); }}
      onPointerMove={(e) => { if (trascina) muovi(daEvento(e)); }}
      onPointerUp={(e) => { if (!trascina) return; setTrascina(false); onFine(ultimo.current ?? daEvento(e)); }}
      onPointerCancel={() => setTrascina(false)}
      style={{ position: 'relative', width: 'fit-content', maxWidth: '100%', cursor: readOnly ? 'default' : 'crosshair', touchAction: 'none', lineHeight: 0, borderRadius: 6, overflow: 'hidden' }}
    >
      <img src={url} alt="" draggable={false}
        style={{ display: 'block', maxWidth: '100%', maxHeight: piccola ? 220 : 380, userSelect: 'none' }} />
      {punto && (
        <span aria-hidden="true" style={{
          position: 'absolute', left: `${punto.x * 100}%`, top: `${punto.y * 100}%`, width: 34, height: 34, marginLeft: -17, marginTop: -17,
          borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 2px #1B573B, 0 2px 8px rgba(0,0,0,.5)', background: 'rgba(224,201,85,.35)', pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

/** Ritaglio come lo fa il sito: riquadro centrato sul punto, senza uscire dalla foto. */
function rettangolo(W: number, H: number, crop: Ritaglio | undefined, p: Punto, ratio: number) {
  const cl = (crop?.left ?? 0) * W, ct = (crop?.top ?? 0) * H;
  const cw = W - (crop?.right ?? 0) * W - cl, ch = H - (crop?.bottom ?? 0) * H - ct;
  if (cw / ch > ratio) {
    const h = ch, w = h * ratio;
    const l = Math.min(Math.max(p.x * W - w / 2, cl), cl + cw - w);
    return { l, t: ct, w, h };
  }
  const w = cw, h = w / ratio;
  const t = Math.min(Math.max(p.y * H - h / 2, ct), ct + ch - h);
  return { l: cl, t, w, h };
}

function Anteprima({ formato, url, dim, crop, punto }: {
  formato: Formato; url: string; dim: { w: number; h: number }; crop?: Ritaglio; punto: Punto;
}) {
  const r = rettangolo(dim.w, dim.h, crop, punto, formato.ratio);
  const alta = formato.ratio < 1;
  return (
    <figure style={{ margin: 0, display: 'grid', gap: 6 }}>
      <div style={{ position: 'relative', width: alta ? 130 : formato.ratio > 1.8 ? 300 : 220, aspectRatio: String(formato.ratio), overflow: 'hidden', borderRadius: 6, background: '#111' }}>
        <img src={url} alt="" draggable={false} style={{
          position: 'absolute', maxWidth: 'none',
          width: `${(dim.w / r.w) * 100}%`, height: `${(dim.h / r.h) * 100}%`,
          left: `${(-r.l / r.w) * 100}%`, top: `${(-r.t / r.h) * 100}%`,
        }} />
        {/* Dove sta il testo sopra la foto: su PC a sinistra, su tablet e telefono ovunque */}
        {formato.velo && (
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: formato.velo === 'sinistra'
            ? 'linear-gradient(90deg, rgba(18,58,40,.9) 0%, rgba(18,58,40,.8) 55%, rgba(18,58,40,.2) 100%)'
            : 'rgba(18,58,40,.55)' }} />
        )}
      </div>
      <figcaption style={{ fontSize: 12, opacity: 0.75 }}>{formato.nome}</figcaption>
    </figure>
  );
}

const nota: React.CSSProperties = { fontSize: 13, opacity: 0.8, margin: 0, lineHeight: 1.5 };
const pannello: React.CSSProperties = { display: 'grid', gap: 14, padding: 14, border: '1px solid rgba(128,128,128,.3)', borderRadius: 8 };
const bottone: React.CSSProperties = {
  fontSize: 13, padding: '8px 12px', borderRadius: 5, cursor: 'pointer',
  border: '1px solid rgba(128,128,128,.4)', background: 'transparent', color: 'inherit',
};
