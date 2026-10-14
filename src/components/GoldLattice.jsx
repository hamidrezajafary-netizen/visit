/**
 * Fine gold lattice — an architectural node grid that hints at connected
 * networks. Used as a very low-opacity pattern behind the back of the card,
 * bled off one corner.
 */
const ROWS = 4;
const COLS = 7;

const NODES = [];
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    NODES.push([10 + col * 22 + (row % 2) * 11, 10 + row * 23]);
  }
}

const at = (row, col) => row * COLS + col;

const EDGES = [];
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    if (col + 1 < COLS) EDGES.push([at(row, col), at(row, col + 1)]);
    if (row + 1 < ROWS) {
      EDGES.push([at(row, col), at(row + 1, col)]);
      if (col - 1 >= 0) EDGES.push([at(row, col), at(row + 1, col - 1)]);
    }
  }
}

export default function GoldLattice({ className = '' }) {
  return (
    <svg
      className={`gold-lattice ${className}`.trim()}
      viewBox="0 0 165 90"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="0.7">
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
          />
        ))}
      </g>
      <g fill="currentColor">
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" />
        ))}
      </g>
    </svg>
  );
}
