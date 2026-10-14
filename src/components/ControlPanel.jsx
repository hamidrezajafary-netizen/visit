import { FONT_CHOICES, PALETTES } from '../lib/defaults.js';

function Field({ label, value, onChange, type = 'text', placeholder, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

function Section({ title, children }) {
  return (
    <section className="panel-section">
      <h2 className="panel-title">{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}

/** All editing controls. Nothing here is required to view the card. */
export default function ControlPanel({ card, onCard, brand, onBrand, qrUrl, onQrUrl, onReset }) {
  const setCard = (key) => (value) => onCard({ ...card, [key]: value });
  const setBrand = (key) => (value) => onBrand({ ...brand, [key]: value });

  return (
    <aside className="panel">
      <Section title="Identity">
        <Field label="Brand name" value={card.company} onChange={setCard('company')} />
        <Field label="Tagline" value={card.tagline} onChange={setCard('tagline')} />
        <Field label="Supporting line" value={card.supporting} onChange={setCard('supporting')} />
      </Section>

      <Section title="Contact">
        <Field label="Full name" value={card.name} onChange={setCard('name')} />
        <Field label="Job title" value={card.title} onChange={setCard('title')} />
        <Field
          label="Phone"
          value={card.phone}
          onChange={setCard('phone')}
          placeholder="+358 …"
        />
        <Field
          label="Email"
          value={card.email}
          onChange={setCard('email')}
          placeholder="name@example.com"
        />
        <Field
          label="Website"
          value={card.website}
          onChange={setCard('website')}
          placeholder="example.com"
        />
        <Field
          label="Social media"
          value={card.social}
          onChange={setCard('social')}
          placeholder="@yourhandle"
        />
        <Field
          label="Address"
          value={card.address}
          onChange={setCard('address')}
          hint="Shown in the gold strip along the bottom of the back."
        />
      </Section>

      <Section title="QR code">
        <Field
          label="QR destination"
          value={qrUrl}
          onChange={onQrUrl}
          placeholder="https://example.com"
          hint="Optional — the QR tile only appears once a destination is set."
        />
        <Field label="QR caption" value={card.qrCaption} onChange={setCard('qrCaption')} />
      </Section>

      <Section title="Brand">
        <div className="palettes">
          {PALETTES.map((palette) => {
            const active =
              palette.primary.toLowerCase() === brand.primary.toLowerCase() &&
              palette.accent.toLowerCase() === brand.accent.toLowerCase();
            return (
              <button
                key={palette.name}
                type="button"
                className={`palette${active ? ' is-active' : ''}`}
                onClick={() =>
                  onBrand({
                    ...brand,
                    primary: palette.primary,
                    accent: palette.accent,
                    surface: palette.surface,
                  })
                }
                title={palette.name}
              >
                <span className="swatch" style={{ background: palette.primary }} />
                <span className="swatch" style={{ background: palette.accent }} />
              </button>
            );
          })}
        </div>

        <div className="color-row">
          <label className="color-field">
            <span className="field-label">Deep purple / front</span>
            <span className="color-input">
              <input
                type="color"
                value={brand.primary}
                onChange={(e) => setBrand('primary')(e.target.value)}
              />
              <code>{brand.primary.toUpperCase()}</code>
            </span>
          </label>
          <label className="color-field">
            <span className="field-label">Champagne gold accent</span>
            <span className="color-input">
              <input
                type="color"
                value={brand.accent}
                onChange={(e) => setBrand('accent')(e.target.value)}
              />
              <code>{brand.accent.toUpperCase()}</code>
            </span>
          </label>
          <label className="color-field">
            <span className="field-label">Back background</span>
            <span className="color-input">
              <input
                type="color"
                value={brand.surface}
                onChange={(e) => setBrand('surface')(e.target.value)}
              />
              <code>{brand.surface.toUpperCase()}</code>
            </span>
          </label>
        </div>

        <label className="field">
          <span className="field-label">Typography</span>
          <select
            className="select"
            value={brand.font}
            onChange={(e) => setBrand('font')(e.target.value)}
          >
            {FONT_CHOICES.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Reset to defaults
        </button>
      </Section>

      <Section title="Prototype status line">
        <label className="switch">
          <input
            type="checkbox"
            checked={card.showStatus}
            onChange={(e) => setCard('showStatus')(e.target.checked)}
          />
          <span>Show on the back</span>
        </label>
        <Field
          label="Status text"
          value={card.status}
          onChange={setCard('status')}
          hint="Off by default. Keeps the card honest about what is built vs. planned."
        />
      </Section>
    </aside>
  );
}
