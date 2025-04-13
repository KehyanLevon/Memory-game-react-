import { useGameStore } from "../../store/gameStore";

function GameBoardHeader() {
  const { players, currentPlayerIndex, timeLimit } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];

  const timeFormated =
    timeLimit === "∞"
      ? "⏱ Time: " + currentPlayer.timeLeft + "s"
      : "⏳ Left: " + currentPlayer.timeLeft + "s";
  return (
    <div className="game-board-header">
      <p>
        <span style={{ color: currentPlayer.color }}>{currentPlayer.name}</span>
        <span>'s Turn | {timeFormated} | </span>
        <span>❌ {currentPlayer.mistakes} mistakes | </span>
        <span>✅ {currentPlayer.matched} matched | </span>
        <span>🎯 {currentPlayer.accuracy}% accuracy</span>
      </p>
    </div>
  );
}

export default GameBoardHeader;
