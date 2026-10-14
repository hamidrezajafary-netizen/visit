import GoldLattice from './GoldLattice.jsx';
import LogoMark from './LogoMark.jsx';
import { GlobeIcon, LinkIcon, MailIcon, PhoneIcon } from './Icons.jsx';

/**
 * Back: identity and contact details over the deep purple stock, a faint gold
 * lattice, a QR tile when a destination is set, and the gilded address strip
 * along the bottom edge.
 */
export default function CardBack({ card, qrDataUrl }) {
  const contacts = [
    { Icon: PhoneIcon, value: card.phone, label: 'Phone' },
    { Icon: MailIcon, value: card.email, label: 'Email' },
    { Icon: GlobeIcon, value: card.website, label: 'Website' },
    { Icon: LinkIcon, value: card.social, label: 'Social' },
  ].filter((row) => row.value && row.value.trim());

  return (
    <div className="face face--back">
      <GoldLattice className="back-lattice" />

      <div className="back-inner">
        <header className="back-head">
          <LogoMark className="back-logo" />
          <span className="back-wordmark">{card.company}</span>
          <span className="back-hairline" />
        </header>

        <div className="back-main">
          <div className="back-info">
            <h2 className="back-name">{card.name}</h2>
            <p className="back-title">{card.title}</p>

            <ul className="back-contacts">
              {contacts.map(({ Icon, value, label }) => (
                <li key={label}>
                  <Icon width="1em" height="1em" />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {qrDataUrl ? (
            <div className="back-qr">
              <div className="qr-tile">
                <img className="qr-img" src={qrDataUrl} alt="QR code" />
              </div>
              {card.qrCaption ? <p className="qr-caption">{card.qrCaption}</p> : null}
            </div>
          ) : null}
        </div>

        {card.showStatus && card.status ? (
          <p className="back-status">
            <span className="status-dot" />
            {card.status}
          </p>
        ) : null}
      </div>

      <div className="back-strip" aria-hidden={!card.address}>
        <span className="back-strip-text">{card.address}</span>
      </div>
    </div>
  );
}
