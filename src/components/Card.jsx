import "../assets/styles/Card.css";

function Card({ card, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <div className={`card-inner ${card.flipped || card.matched ? 'flipped' : ''}`}>
        <div className="card-front">{card.emoji}</div>
        <div className="card-back">❓</div>
      </div>
    </div>
  );
}

export default Card;