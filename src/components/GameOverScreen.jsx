import { useGameStore } from "../store/gameStore";
import "../assets/styles/GameOverScreen.css";
function GameOverScreen() {
  const { players, winner, resetGame, timeLimit, currentPlayerIndex } =
    useGameStore();
  const currentPlayer = players[currentPlayerIndex];
  const timeFormated =
    timeLimit === "∞"
      ? "⏱ Time: " + currentPlayer.timeLeft + "s"
      : "⏳ Left: " + currentPlayer.timeLeft + "s";
  return (
    <div className="game-over">
      <h2>🏁 Game Over</h2>
      <p>🎉 {winner === "Tie" ? "It's a tie!" : `${winner} wins!`}</p>

      {players.map((player) => (
        <div className="stats" key={player.id}>
          <h3 style={{ color: player.color }}>{player.name}</h3>
          <p>✅ Matched: {player.matched}</p>
          <p>{timeFormated}</p>
          <p>❌ Mistakes: {player.mistakes}</p>
          <p>🎯 Accuracy: {player.accuracy}</p>
        </div>
      ))}

      <button onClick={resetGame}>🔄 Play Again</button>
    </div>
  );
}

export default GameOverScreen;
