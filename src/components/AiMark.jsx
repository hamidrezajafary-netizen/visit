/**
 * Hero mark: concentric hexagonal lattices joined by radial spokes.
 * Reads as artificial intelligence, architecture and a connected network at the
 * same time, drawn only in fine gold lines so it looks foil-stamped.
 *
 * Geometry is generated at module scope so the drawing is deterministic.
 */
const centre = 50;

function hexagon(radius, offsetDeg) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((offsetDeg + i * 60) * Math.PI) / 180;
    return [centre + radius * Math.cos(angle), centre + radius * Math.sin(angle)];
  });
}

const OUTER = hexagon(45, 0);
const MID = hexagon(26, 30);
const CORE = hexagon(11, 0);

const toPoints = (pts) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

const OUTER_POINTS = toPoints(OUTER);
const MID_POINTS = toPoints(MID);
const CORE_POINTS = toPoints(CORE);

export default function AiMark({ className = '' }) {
  return (
    <svg
      className={`ai-mark ${className}`.trim()}
      viewBox="1 8 98 84"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeLinejoin="round">
        {OUTER.map(([x, y]) => (
          <line key={`spoke-${x}-${y}`} x1={centre} y1={centre} x2={x} y2={y} strokeWidth="0.5" opacity="0.28" />
        ))}
        <polygon points={MID_POINTS} strokeWidth="0.8" opacity="0.42" />
        <polygon points={CORE_POINTS} strokeWidth="0.9" opacity="0.7" />
        <polygon points={OUTER_POINTS} strokeWidth="1.15" opacity="0.9" />
      </g>
      <g fill="currentColor">
        {OUTER.map(([x, y]) => (
          <circle key={`node-${x}-${y}`} cx={x} cy={y} r="2.3" />
        ))}
        <rect x="46.6" y="46.6" width="6.8" height="6.8" rx="0.8" transform="rotate(45 50 50)" />
      </g>
    </svg>
  );
}
