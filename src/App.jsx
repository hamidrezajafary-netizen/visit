import { useEffect, useMemo, useRef, useState } from 'react';
import BusinessCard from './components/BusinessCard.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import LogoMark from './components/LogoMark.jsx';
import PreviewStage from './components/PreviewStage.jsx';
import { luminance, mix, readableInk, withAlpha } from './lib/color.js';
import {
  DEFAULT_BRAND,
  DEFAULT_CARD,
  DISPLAY_FONT,
  FONT_STACKS,
  PRINT,
  QR_TILE,
} from './lib/defaults.js';
import { exportPdf, exportPng } from './lib/exporters.js';
import { makeQr } from './lib/qr.js';

export default function App() {
  const [card, setCard] = useState(DEFAULT_CARD);
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [view, setView] = useState('both');
  const [scene, setScene] = useState('stone');
  const [guides, setGuides] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  // Off-screen, always-mounted copies used for export at a fixed scale.
  const trimFront = useRef(null);
  const trimBack = useRef(null);
  const bleedFront = useRef(null);
  const bleedBack = useRef(null);

  const theme = useMemo(() => {
    const onPrimary = readableInk(brand.primary);
    const onSurface = readableInk(brand.surface);
    return {
      '--primary': brand.primary,
      '--surface': brand.surface,
      '--accent': brand.accent,
      '--accent-light': mix(brand.accent, '#FFFFFF', 0.34),
      '--accent-dark': mix(brand.accent, '#000000', 0.34),
      // Dark ink for text sitting on the gold strip, so it stays legible whatever
      // accent the user picks.
      '--strip-ink': mix(brand.accent, '#000000', 0.75),
      '--qr-tile': QR_TILE,
      '--on-primary': onPrimary,
      '--on-primary-muted': withAlpha(onPrimary, 0.62),
      '--on-surface': onSurface,
      '--on-surface-muted': withAlpha(onSurface, 0.6),
      '--hairline': withAlpha(brand.accent, 0.3),
      '--gold-soft': withAlpha(brand.accent, 0.16),
      '--font': FONT_STACKS[brand.font] || FONT_STACKS.Inter,
      '--font-display': DISPLAY_FONT,
    };
  }, [brand]);

  // Regenerate the QR whenever the destination changes. An empty value removes
  // the tile entirely, so the card presents cleanly without one.
  useEffect(() => {
    const value = qrUrl.trim();
    if (!value) {
      setQrDataUrl(null);
      return undefined;
    }
    let active = true;
    const timer = setTimeout(() => {
      const dark = luminance(brand.primary) < 0.45 ? brand.primary : '#2A2438';
      makeQr(value, { dark, light: QR_TILE })
        .then((url) => {
          if (active) setQrDataUrl(url);
        })
        .catch(() => {
          if (active) setQrDataUrl(null);
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [qrUrl, brand.primary]);

  const runExport = async (key, task) => {
    setError('');
    setBusy(key);
    try {
      await task();
    } catch (err) {
      console.error(err);
      setError('Export failed. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const handlePng = (side) =>
    runExport(`png-${side}`, () =>
      exportPng(
        side === 'front' ? trimFront.current : trimBack.current,
        side,
        side === 'front' ? brand.primary : brand.surface,
      ),
    );

  const handlePdf = () =>
    runExport('pdf', () =>
      exportPdf({
        front: bleedFront.current,
        back: bleedBack.current,
        frontBg: brand.primary,
        backBg: brand.surface,
      }),
    );

  const handleReset = () => {
    setCard(DEFAULT_CARD);
    setBrand(DEFAULT_BRAND);
    setQrUrl('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand-lockup" style={{ '--accent': brand.accent }}>
          <LogoMark className="brand-mark" />
          <div>
            <p className="brand-name">Maison AI</p>
            <p className="brand-sub">Business Card Studio</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn"
            onClick={() => handlePng('front')}
            disabled={Boolean(busy)}
          >
            {busy === 'png-front' ? 'Exporting…' : 'PNG · Front'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => handlePng('back')}
            disabled={Boolean(busy)}
          >
            {busy === 'png-back' ? 'Exporting…' : 'PNG · Back'}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handlePdf}
            disabled={Boolean(busy)}
          >
            {busy === 'pdf' ? 'Building PDF…' : 'PDF · Print (both sides · 3 mm bleed)'}
          </button>
        </div>
      </header>

      {error ? <p className="alert">{error}</p> : null}

      <main className="app-main">
        <PreviewStage
          view={view}
          onView={setView}
          scene={scene}
          onScene={setScene}
          guides={guides}
          onGuides={setGuides}
          card={card}
          theme={theme}
          qrDataUrl={qrDataUrl}
        />
        <ControlPanel
          card={card}
          onCard={setCard}
          brand={brand}
          onBrand={setBrand}
          qrUrl={qrUrl}
          onQrUrl={setQrUrl}
          onReset={handleReset}
        />
      </main>

      <footer className="app-foot">
        <p>
          Printed on thick soft-touch matte stock; the emblem, wordmark, rules and address strip are
          built as gold foil. The live browser AI receptionist, storefront and order/booking flows
          are built and manually tested — production telephony, multi-tenant provisioning and
          in-store translation are planned, not deployed.
        </p>
        <p className="app-foot-meta">
          Trim {PRINT.trimWidth} × {PRINT.trimHeight} mm · bleed {PRINT.bleed} mm · safe margin{' '}
          {PRINT.safeMargin} mm
        </p>
      </footer>

      {/* Screen-reader hidden export rig: always mounted so either side can be
          captured from any view, at a fixed scale independent of the preview. */}
      <div className="export-rig" aria-hidden="true">
        <BusinessCard
          side="front"
          card={card}
          theme={theme}
          qrDataUrl={qrDataUrl}
          bleedRef={bleedFront}
          trimRef={trimFront}
        />
        <BusinessCard
          side="back"
          card={card}
          theme={theme}
          qrDataUrl={qrDataUrl}
          bleedRef={bleedBack}
          trimRef={trimBack}
        />
      </div>
    </div>
  );
}
