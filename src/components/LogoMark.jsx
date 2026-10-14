/**
 * Maison AI mark: an "M" drawn as three connected nodes.
 * The geometry (M + joined points) hints at AI and connected communication
 * without any literal illustration.
 */
export default function LogoMark({ className = '' }) {
  return (
    <svg
      className={`logo-mark ${className}`.trim()}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 39V13.5L24 31.5L38 13.5V39"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="13.5" r="3.1" fill="currentColor" />
      <circle cx="38" cy="13.5" r="3.1" fill="currentColor" />
      <circle cx="24" cy="31.5" r="3.1" fill="var(--accent)" />
    </svg>
  );
}
