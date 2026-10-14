function hexToRgb(hex) {
  let h = String(hex || '').replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return { r: 10, g: 24, b: 48 };
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** Relative luminance (0 = black, 1 = white), used to pick readable ink. */
export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Ink that stays legible on the given background. */
export function readableInk(hex) {
  return luminance(hex) > 0.5 ? '#0B1220' : '#FFFFFF';
}

export function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Linear mix between two hex colours; t = 0 returns `a`, t = 1 returns `b`. */
export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const blend = (x, y) => Math.round(x + (y - x) * t);
  return `rgb(${blend(A.r, B.r)}, ${blend(A.g, B.g)}, ${blend(A.b, B.b)})`;
}
