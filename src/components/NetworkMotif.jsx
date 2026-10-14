const NODES = [
  [10, 52],
  [24, 38],
  [38, 46],
  [52, 28],
  [66, 40],
  [80, 18],
  [92, 32],
  [104, 48],
  [30, 16],
  [74, 58],
  [58, 12],
];

const EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [8, 1],
  [8, 3],
  [10, 3],
  [10, 5],
  [9, 4],
  [9, 6],
];

/**
 * Faint node-and-line constellation: the "connected communication" motif that
 * sits behind the front of the card. Static coordinates keep it deterministic.
 */
export default function NetworkMotif({ className = '' }) {
  return (
    <svg
      className={`network-motif ${className}`.trim()}
      viewBox="0 0 120 72"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--accent)" strokeWidth="0.6" opacity="0.6">
        {EDGES.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
      </g>
      <g fill="var(--accent)">
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.1 : 1.35} />
        ))}
      </g>
    </svg>
  );
}
