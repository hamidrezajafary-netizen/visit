import CardBack from './CardBack.jsx';
import CardFront from './CardFront.jsx';

/**
 * One card face, laid out in real millimetres.
 *
 *   .card-bleed  = 91 × 61 mm  (trim + 3 mm bleed on every side)
 *   .card-trim   = 85 × 55 mm, with a 6 mm safe margin inside it
 *
 * Every dimension inside the card is `calc(n * var(--mm))`, so the same markup
 * renders identically at preview size and at 300 DPI for export — only --mm changes.
 *
 * The bleed element is what gets captured for the print PDF; the trim element is
 * captured for the trim-size PNG. Guides are a screen-only overlay, so the export
 * rig passes guides={false}.
 */
export default function BusinessCard({
  side,
  card,
  theme,
  qrDataUrl,
  guides = false,
  bleedRef,
  trimRef,
}) {
  return (
    <div className={`card-bleed card-bleed--${side}`} style={theme} ref={bleedRef}>
      <div className="card-trim" ref={trimRef}>
        {side === 'front' ? (
          <CardFront card={card} />
        ) : (
          <CardBack card={card} qrDataUrl={qrDataUrl} />
        )}
      </div>

      {guides ? (
        <div className="card-guides" aria-hidden="true">
          <span className="guide guide--bleed" />
          <span className="guide guide--trim" />
          <span className="guide guide--safe" />
        </div>
      ) : null}
    </div>
  );
}
