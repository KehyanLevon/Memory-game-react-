function Card({ card, flipped, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        <div className="card-front">
          <img src={card.url} alt="card" />
        </div>
        <div className="card-back">❓</div>
      </div>
    </div>
  );
}

export default Card;
