import QRCode from 'qrcode';

/**
 * Renders a QR code as a data URL so it can be embedded in the card and still
 * survive an html-to-image export (no cross-origin fetch).
 */
export function makeQr(text, { dark = '#0A1830', light = '#FFFFFF' } = {}) {
  return QRCode.toDataURL(String(text), {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 640,
    color: { dark, light },
  });
}
