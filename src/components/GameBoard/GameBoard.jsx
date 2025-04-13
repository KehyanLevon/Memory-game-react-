import { useEffect, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { useImages } from "../../api/use-images";
import Card from "./Card";
import GameBoardHeader from "./GameBoardHeader";
import "../../assets/styles/GameBoard.css";

function GameBoard() {
  const {
    difficulty,
    players,
    currentPlayerIndex,
    incrementMatched,
    endTurn,
    startTimer,
    gameStarted,
    setGameStarted,
  } = useGameStore();

  const size = difficulty.size;
  const pairCount = (size * size) / 2;

  const { data: images, isLoading } = useImages(pairCount);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!images) return;

    const shuffled = [...images, ...images]
      .slice(0, pairCount * 2)
      .map((img, index) => ({
        id: img.id + "-" + index,
        originalId: img.id,
        url: img.download_url,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
  }, [images]);

  useEffect(() => {
    if (flipped.length === 2) {
      setDisabled(true);
      setTimeout(() => {
        const [a, b] = flipped;
        if (a.originalId === b.originalId) {
          setMatched((prev) => [...prev, a.originalId]);
          incrementMatched();
        } else {
          endTurn();
        }
        setFlipped([]);
        setDisabled(false);
      }, 800);
    }
  }, [flipped]);

  const handleCardClick = (card) => {
    if (
      disabled ||
      flipped.find((c) => c.id === card.id) ||
      matched.includes(card.originalId)
    )
      return;

    if (!gameStarted) {
      setGameStarted(true);
      startTimer(currentPlayerIndex);
    }

    setFlipped((prev) => [...prev, card]);
  };

  if (isLoading) return <p>Loading...</p>;

  const currentPlayer = players[currentPlayerIndex];

  return (
    <>
      <GameBoardHeader />

      <div
        className="game-board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            flipped={
              flipped.find((c) => c.id === card.id) ||
              matched.includes(card.originalId)
            }
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
    </>
  );
}

export default GameBoard;
