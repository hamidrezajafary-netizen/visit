import { useEffect, useMemo, useRef, useState } from 'react';
import BusinessCard from './components/BusinessCard.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import LogoMark from './components/LogoMark.jsx';
import PreviewStage from './components/PreviewStage.jsx';
import { luminance, mix, readableInk, withAlpha } from './lib/color.js';
import { DEFAULT_BRAND, DEFAULT_CARD, FONT_STACKS, PRINT } from './lib/defaults.js';
import { exportPdf, exportPng } from './lib/exporters.js';
import { makeQr } from './lib/qr.js';

export default function App() {
  const [card, setCard] = useState(DEFAULT_CARD);
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [view, setView] = useState('both');
  const [scene, setScene] = useState('studio');
  const [guides, setGuides] = useState(true);
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
    const ink = readableInk(brand.primary);
    return {
      '--primary': brand.primary,
      '--accent': brand.accent,
      '--surface': brand.surface,
      '--on-primary': ink,
      '--on-primary-muted': withAlpha(ink, 0.74),
      '--on-surface': brand.primary,
      '--on-surface-muted': mix(brand.primary, brand.surface, 0.45),
      '--hairline': withAlpha(brand.primary, 0.16),
      '--font': FONT_STACKS[brand.font] || FONT_STACKS.Inter,
    };
  }, [brand]);

  // Regenerate the QR whenever the destination changes. An empty value restores
  // the placeholder frame, so the card is never left showing a stale code.
  useEffect(() => {
    const value = qrUrl.trim();
    if (!value) {
      setQrDataUrl(null);
      return undefined;
    }
    let active = true;
    const timer = setTimeout(() => {
      const dark = luminance(brand.primary) < 0.45 ? brand.primary : '#111827';
      makeQr(value, { dark })
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

  const exportRigCard = { ...card, qrCaption: card.qrCaption };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand-lockup">
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
            {busy === 'pdf' ? 'Building PDF…' : 'PDF · Print (both sides)'}
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
          The live browser AI receptionist, storefront and order/booking flows are built and
          manually tested. Production telephony, multi-tenant provisioning and in-store
          translation are planned, not deployed — the status line on the back states this.
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
          card={exportRigCard}
          theme={theme}
          qrDataUrl={qrDataUrl}
          bleedRef={bleedFront}
          trimRef={trimFront}
        />
        <BusinessCard
          side="back"
          card={exportRigCard}
          theme={theme}
          qrDataUrl={qrDataUrl}
          bleedRef={bleedBack}
          trimRef={trimBack}
        />
      </div>
    </div>
  );
}
