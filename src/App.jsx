import { useEffect, useState } from "react";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import Stats from "./components/Stats";
import { difficulties, timeModes, moveLimits} from "./data/difficulties";
import "./assets/styles/App.css";

function App() {
  const [stats, setStats] = useState(null);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [timeMode, setTimeMode] = useState(timeModes[0]);
  const [moveLimit, setMoveLimit] = useState(moveLimits[0]);
  const [gameKey, setGameKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (stats) {
      setGameStarted(false);
    }
  }, [stats]);

  const resetGame = () => {
    setStats(null);
    setGameStarted(false);
    setGameKey(prev => prev + 1);
  };

  const confirmAndReset = (callback) => {
    if (gameStarted) {
      const confirmed = window.confirm("Changing will reset the current game. Continue?");
      if (!confirmed) return;
    }
    callback();
    resetGame();
  };

  const handleChangeDifficulty = (newDifficulty) => {
    if (newDifficulty.id === difficulty.id) return;
    confirmAndReset(() => setDifficulty(newDifficulty));
  };

  const handleChangeTimeMode = (value) => {
    if (value === timeMode) return;
    confirmAndReset(() => setTimeMode(value));
  };

  const handleChangeMoveLimit = (value) => {
    if (value === moveLimit) return;
    confirmAndReset(() => setMoveLimit(value));
  };

  return (
    <div className="app-container">
      <Header
        difficulties={difficulties}
        currentDifficulty={difficulty}
        timeMode={timeMode}
        moveLimit={moveLimit}
        onChangeDifficulty={handleChangeDifficulty}
        onChangeTimeMode={handleChangeTimeMode}
        onChangeMoveLimit={handleChangeMoveLimit}
      />
      <GameBoard
        key={gameKey}
        difficulty={difficulty}
        timeLimit={timeMode}
        moveLimit={moveLimit}
        onSetStats={setStats}
        onRestart={resetGame}
        onFirstClick={() => setGameStarted(true)}
      />
      {stats && (
        <Stats
          attempts={stats.attempts}
          time={stats.time}
          accuracy={stats.accuracy}
        />
      )}
    </div>
  );
}

export default App;
