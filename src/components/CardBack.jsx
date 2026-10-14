import LogoMark from './LogoMark.jsx';
import { GlobeIcon, MailIcon, PhoneIcon, PinIcon } from './Icons.jsx';

/** Back of the card: contact details, services and the QR tile. */
export default function CardBack({ card, qrDataUrl }) {
  const contacts = [
    { Icon: MailIcon, value: card.email, label: 'Email' },
    { Icon: PhoneIcon, value: card.phone, label: 'Phone' },
    { Icon: GlobeIcon, value: card.website, label: 'Website' },
    { Icon: PinIcon, value: card.location, label: 'Location' },
  ].filter((row) => row.value && row.value.trim());

  return (
    <div className="face face--back">
      <header className="back-head">
        <LogoMark className="back-logo" />
        <span className="back-wordmark">{card.company}</span>
        <span className="back-hairline" />
      </header>

      <div className="back-main">
        <div className="back-info">
          <h2 className="back-name">{card.name}</h2>
          <p className="back-title">{card.title}</p>
          {card.services ? <p className="back-services">{card.services}</p> : null}
          <ul className="back-contacts">
            {contacts.map(({ Icon, value, label }) => (
              <li key={label}>
                <Icon width="1em" height="1em" />
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="back-qr">
          <div className="qr-tile">
            {qrDataUrl ? (
              <img className="qr-img" src={qrDataUrl} alt="QR code" />
            ) : (
              <div className="qr-empty">QR</div>
            )}
          </div>
          {card.qrCaption ? <p className="qr-caption">{card.qrCaption}</p> : null}
        </div>
      </div>

      {card.showStatus && card.status ? (
        <footer className="back-foot">
          <span className="foot-dot" />
          {card.status}
        </footer>
      ) : null}
    </div>
  );
}
