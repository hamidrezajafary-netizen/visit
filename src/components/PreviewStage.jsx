import BusinessCard from './BusinessCard.jsx';

const VIEWS = [
  ['front', 'Front'],
  ['back', 'Back'],
  ['both', 'Both'],
];

const SCENES = [
  ['studio', 'Studio light'],
  ['plain', 'Flat neutral'],
  ['paper', 'Warm paper'],
  ['dark', 'Studio dark'],
  ['desk', 'Dark desk'],
];

/** Preview area: side switcher, mockup background and print guides. */
export default function PreviewStage({
  view,
  onView,
  scene,
  onScene,
  guides,
  onGuides,
  card,
  theme,
  qrDataUrl,
}) {
  const showFront = view === 'front' || view === 'both';
  const showBack = view === 'back' || view === 'both';

  return (
    <section className="stage-col">
      <div className="stage-toolbar">
        <div className="seg" role="group" aria-label="Card side">
          {VIEWS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`seg-btn${view === value ? ' is-active' : ''}`}
              aria-pressed={view === value}
              onClick={() => onView(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="tool-field">
          <span className="tool-label">Background</span>
          <select className="select" value={scene} onChange={(e) => onScene(e.target.value)}>
            {SCENES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="switch">
          <input
            type="checkbox"
            checked={guides}
            onChange={(e) => onGuides(e.target.checked)}
          />
          <span>Print guides</span>
        </label>
      </div>

      <div className={`stage scene-${scene} ${view === 'both' ? 'is-both' : 'is-single'}`}>
        {showFront ? (
          <figure className="stage-item">
            <div className="card-mock">
              <BusinessCard
                side="front"
                card={card}
                theme={theme}
                qrDataUrl={qrDataUrl}
                guides={guides}
              />
            </div>
            <figcaption>Front</figcaption>
          </figure>
        ) : null}

        {showBack ? (
          <figure className="stage-item">
            <div className="card-mock">
              <BusinessCard
                side="back"
                card={card}
                theme={theme}
                qrDataUrl={qrDataUrl}
                guides={guides}
              />
            </div>
            <figcaption>Back</figcaption>
          </figure>
        ) : null}
      </div>

      <div className="stage-foot">
        <p className="stage-note">85 × 55 mm · 3 mm bleed · 6 mm safe margin · 300 DPI export</p>
        {guides ? (
          <p className="guide-legend">
            <span className="chip chip--trim" /> Trim
            <span className="chip chip--safe" /> Safe
            <span className="chip chip--bleed" /> Bleed
          </p>
        ) : null}
      </div>
    </section>
  );
}
