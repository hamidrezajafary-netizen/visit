/**
 * Default card content.
 *
 * Contact details are deliberately editable placeholders — no real email, phone
 * number, website, address or social handle is invented anywhere.
 *
 * `status` keeps the card honest about the prototype: the browser AI
 * receptionist and order/booking flows are built and manually tested, while
 * production telephony, multi-tenant provisioning and in-store translation are
 * still planned. It is hidden by default so the card can present as a pure
 * brand piece, and it is one click away in the panel.
 */
export const DEFAULT_CARD = {
  company: 'Maison AI',
  supporting: 'AI-Powered Customer Experience Platform',
  tagline: 'Make Every Customer Feel Understood.',
  name: '[Your Full Name]',
  title: '[Your Job Title]',
  phone: '[Your Phone Number]',
  email: '[Your Email Address]',
  website: '[Your Website]',
  social: '[Your Instagram or LinkedIn]',
  address: '[Your Business Address]',
  status: 'Working prototype · Piloting in Tampere',
  showStatus: false,
  qrCaption: 'Scan to view the live demo',
};

/** Deep black-purple with champagne gold, per the reference direction. */
export const DEFAULT_BRAND = {
  primary: '#241429',
  accent: '#D0AA68',
  surface: '#241429',
  font: 'Inter',
};

export const FONT_STACKS = {
  Inter: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  Manrope: "'Manrope', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  'Plus Jakarta Sans':
    "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
};

export const FONT_CHOICES = Object.keys(FONT_STACKS);

/**
 * Refined serif reserved for the front wordmark — the rest of the card keeps the
 * user's own typography choice. Bundled via @fontsource so it stays same-origin
 * and therefore embeds in the PNG/PDF export.
 */
export const DISPLAY_FONT = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";

export const PALETTES = [
  { name: 'Midnight Plum', primary: '#241429', accent: '#D0AA68', surface: '#241429' },
  { name: 'Onyx & Gold', primary: '#141118', accent: '#C9A227', surface: '#141118' },
  { name: 'Deep Amethyst', primary: '#2C1636', accent: '#DCBB8C', surface: '#2C1636' },
  { name: 'Espresso Bronze', primary: '#221610', accent: '#BE9159', surface: '#221610' },
];

/** The cream tile the QR code sits on, so it stays scannable on dark stock. */
export const QR_TILE = '#F7F2E9';

/** Print geometry, in millimetres — 3.5 × 2 in (89 × 51 mm). */
export const PRINT = {
  trimWidth: 89,
  trimHeight: 51,
  bleed: 3,
  safeMargin: 5,
  get bleedWidth() {
    return this.trimWidth + this.bleed * 2;
  },
  get bleedHeight() {
    return this.trimHeight + this.bleed * 2;
  },
  dpi: 300,
};
