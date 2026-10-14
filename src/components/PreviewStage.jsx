import BusinessCard from './BusinessCard.jsx';

const VIEWS = [
  ['front', 'Front'],
  ['back', 'Back'],
  ['both', 'Both'],
];

const SCENES = [
  ['stone', 'Stone studio · 3D'],
  ['plain', 'Flat neutral'],
  ['studio', 'Studio light'],
  ['paper', 'Warm paper'],
  ['dark', 'Studio dark'],
];

/** Scenes that present the card as a tilted, stacked 3D product shot. */
const MOCKUP_SCENES = new Set(['stone']);

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
  const isMockup = MOCKUP_SCENES.has(scene);

  const side = (which, label) => (
    <figure className="stage-item" key={which}>
      <div className={`mockup${isMockup ? ' mockup--3d' : ''}`}>
        <div className="mockup-stack">
          {isMockup ? <span className="sheet sheet--paper" aria-hidden="true" /> : null}
          {isMockup ? <span className="sheet sheet--gold" aria-hidden="true" /> : null}
          <div className={`card-mock${guides ? ' card-mock--square' : ''}`}>
            <BusinessCard
              side={which}
              card={card}
              theme={theme}
              qrDataUrl={qrDataUrl}
              guides={guides}
            />
          </div>
        </div>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );

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
          <input type="checkbox" checked={guides} onChange={(e) => onGuides(e.target.checked)} />
          <span>Print guides</span>
        </label>
      </div>

      <div
        className={`stage scene-${scene} ${view === 'both' ? 'is-both' : 'is-single'}`}
        style={theme}
      >
        {showFront ? side('front', 'Front') : null}
        {showBack ? side('back', 'Back') : null}
      </div>

      <div className="stage-foot">
        <p className="stage-note">89 × 51 mm (3.5 × 2 in) · 3 mm bleed · 5 mm safe margin · 300 DPI</p>
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
