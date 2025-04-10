import "../assets/styles/GameBoard.css";
import { useEffect, useState } from "react";
import Card from "./Card";
import cardPool from "../data/emojiCards";

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateCardContent(pairCount) {
  const selected = shuffle(cardPool).slice(0, pairCount);
  const pairs = [...selected, ...selected].map((card, index) => ({
    id: card.id + "-" + index,
    emoji: card.emoji,
    flipped: false,
    matched: false,
  }));
  return shuffle(pairs);
}

function GameBoard({ difficulty, timeLimit, moveLimit, onGameEnd, onRestart, onFirstClick }) {
  const size = difficulty.size;
  const pairCount = (size * size) / 2;

  const [cards, setCards] = useState(() => generateCardContent(pairCount));
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit === "∞" ? 0 : timeLimit);
  const [timerId, setTimerId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);


  useEffect(() => {
    setCards(generateCardContent(pairCount));
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
    setAttempts(0);
    setGameStarted(false);
    setGameOver(false);
    if (timerId) clearInterval(timerId);
    setTimeLeft(timeLimit === "∞" ? 0 : timeLimit);
    return () => timerId && clearInterval(timerId);
  }, [difficulty, timeLimit, moveLimit]);

  useEffect(() => {
    if (firstCard && secondCard) {
      checkMatch(firstCard, secondCard);
    }
  }, [secondCard]);

  const checkMatch = (cardA, cardB) => {
    setDisabled(true);
    setAttempts((a) => a + 1);

    if (cardA.emoji === cardB.emoji) {
      setCards((prev) =>
        prev.map((card) =>
          card.emoji === cardA.emoji ? { ...card, matched: true } : card
        )
      );
      clearSelection();
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === cardA.id || card.id === cardB.id
              ? { ...card, flipped: false }
              : card
          )
        );
        clearSelection();
      }, 1000);
    }
  };
  
  const clearSelection = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (timeLimit === "∞") return prev + 1;
        if (prev > 1) return prev - 1;
        clearInterval(id);
        endGame();
        return 0;
      });
    }, 1000);

    setTimerId(id);
    return () => clearInterval(id);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const allMatched = cards.length > 0 && cards.every((c) => c.matched);
    const outOfMoves = moveLimit !== "∞" && attempts >= moveLimit;

    if (allMatched || outOfMoves) {
      endGame();
    }
  }, [cards, attempts, gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    onFirstClick?.();
  };

  const endGame = () => {
    if (timerId) clearInterval(timerId);
    if (gameOver) return;
    setGameOver(true);

    const accuracy = attempts > 0 ? ((pairCount / attempts) * 100).toFixed(1) : 0;
    
    onGameEnd({
      attempts,
      time: timeLeft,
      accuracy,
    })
  };  

  const handleCardClick = (card) => {
    if (disabled || card.flipped || card.matched || gameOver) return;

    if (!gameStarted) startGame();

    flipCardById(card.id);

    if (!firstCard) {
      setFirstCard(card);
    } else if (!secondCard) {
      setSecondCard(card);
    }
  };

  const flipCardById = (id) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
  };

  const formattedTime = () =>
    timeLimit === "∞"
      ? `⏱ Time: ${timeLeft} sec`
      : `⏳ Left: ${timeLeft} sec`;

  return (
    <>
      <div className="game-board-header">
        <p>{formattedTime()}</p>
        {moveLimit !== "∞" && <p>🔢 attempts: {attempts} / {moveLimit}</p>}
      </div>

      <div
        className="game-board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={() => handleCardClick(card)} />
        ))}
      </div>

      {gameOver && (
        <button className="play-again-button" onClick={onRestart}>
          🔄 Play again
        </button>
      )}
    </>
  );
}

export default GameBoard;
