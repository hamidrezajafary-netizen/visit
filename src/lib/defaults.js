/**
 * Default card content.
 *
 * Contact details are deliberately left as editable placeholders — no real
 * email, phone number, website or social account is invented anywhere.
 *
 * `status` keeps the card honest about the prototype: the platform's browser AI
 * receptionist and order/booking flows are built and manually tested, while
 * production telephony, multi-tenant and in-store translation are still planned.
 */
export const DEFAULT_CARD = {
  company: 'Maison AI',
  supporting: 'AI-Powered Customer Experience Platform',
  tagline: 'Make Every Customer Feel Understood.',
  name: 'Vahidreza Jafary',
  title: 'Senior Cloud Architect | Founder',
  services: 'AI Receptionist · Multilingual Assistance · Smart Commerce',
  email: '[Your Email]',
  phone: '[Your Phone Number]',
  website: '[Your Website]',
  location: 'Tampere, Finland',
  status: 'Working prototype · Piloting in Tampere',
  showStatus: true,
  qrCaption: 'Scan to view the live demo',
};

export const DEFAULT_BRAND = {
  primary: '#0A1830',
  accent: '#3D7BFF',
  surface: '#F5F7FB',
  font: 'Inter',
};

export const FONT_STACKS = {
  Inter: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  Manrope: "'Manrope', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  'Plus Jakarta Sans':
    "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
};

export const FONT_CHOICES = Object.keys(FONT_STACKS);

export const PALETTES = [
  { name: 'Midnight', primary: '#0A1830', accent: '#3D7BFF', surface: '#F5F7FB' },
  { name: 'Graphite', primary: '#15181E', accent: '#5B8DEF', surface: '#F4F5F7' },
  { name: 'Deep Teal', primary: '#062A2E', accent: '#1FB6A6', surface: '#F2F7F6' },
  { name: 'Ink Plum', primary: '#1B1035', accent: '#8B6BFF', surface: '#F6F4FB' },
];

/** Print geometry, in millimetres. */
export const PRINT = {
  trimWidth: 85,
  trimHeight: 55,
  bleed: 3,
  safeMargin: 6,
  get bleedWidth() {
    return this.trimWidth + this.bleed * 2;
  },
  get bleedHeight() {
    return this.trimHeight + this.bleed * 2;
  },
  dpi: 300,
};
