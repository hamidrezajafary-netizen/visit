const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

export function PhoneIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6.2 3.5h3l1.4 3.6-2 1.4a11.5 11.5 0 005.9 5.9l1.4-2 3.6 1.4v3a2 2 0 01-2.2 2A16.5 16.5 0 014.2 5.7a2 2 0 012-2.2z" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  );
}

export function GlobeIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 3.9 5.8 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.8-3.9-9S9.4 5.7 12 3z" />
    </svg>
  );
}

export function LinkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10.2 13.8a4.2 4.2 0 006 0l3-3a4.2 4.2 0 10-6-6l-1.3 1.3" />
      <path d="M13.8 10.2a4.2 4.2 0 00-6 0l-3 3a4.2 4.2 0 106 6l1.3-1.3" />
    </svg>
  );
}
