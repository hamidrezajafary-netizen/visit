import AiMark from './AiMark.jsx';

/**
 * Front: a single centred gold emblem over the deep purple stock, with the
 * MAISON AI wordmark lockup in the lower centre.
 */
export default function CardFront({ card }) {
  return (
    <div className="face face--front">
      <AiMark className="front-mark" />

      <h1 className="front-wordmark">{card.company}</h1>
      <p className="front-supporting">{card.supporting}</p>

      <span className="front-rule" aria-hidden="true">
        <i />
      </span>

      <p className="front-tagline">{card.tagline}</p>
    </div>
  );
}
