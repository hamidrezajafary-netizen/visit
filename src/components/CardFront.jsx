import LogoMark from './LogoMark.jsx';
import NetworkMotif from './NetworkMotif.jsx';

/** Front of the card: mark, brand name, supporting line and tagline. */
export default function CardFront({ card }) {
  return (
    <div className="face face--front">
      <NetworkMotif />
      <header className="front-head">
        <LogoMark className="front-logo" />
      </header>
      <div className="front-body">
        <h1 className="front-wordmark">{card.company}</h1>
        <p className="front-supporting">{card.supporting}</p>
        <span className="front-rule" />
        <p className="front-tagline">{card.tagline}</p>
      </div>
    </div>
  );
}
