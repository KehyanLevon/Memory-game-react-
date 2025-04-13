import { useGameStore } from "../../store/gameStore";
import statuses from "../../data/statuses";
import OptionGroup from "./OptionGroup";
import PlayerInputs from "./PlayerInputs";
import "../../assets/styles/StartScreen.css";

function StartScreen() {
  const {
    difficulties,
    timeModes,
    moveLimits,
    difficulty,
    timeLimit,
    mistakesLimitSelected,
    setDifficulty,
    setTimeLimit,
    setMoveLimit,
    setStatus,
  } = useGameStore();

  const handleStart = () => setStatus(statuses.roll);

  return (
    <div className="start-screen">
      <h2>🧠 Memory Game Setup</h2>

      <PlayerInputs />

      <OptionGroup
        title="🎯 Difficulty:"
        options={difficulties}
        selected={difficulty}
        onSelect={setDifficulty}
        format={(d) => d.name}
      />

      <OptionGroup
        title="⏱ Time per player:"
        options={timeModes}
        selected={timeLimit}
        onSelect={setTimeLimit}
        format={(t) => (t === "∞" ? "∞" : `${t}s`)}
      />

      <OptionGroup
        title="❌ Mistakes per player:"
        options={moveLimits}
        selected={mistakesLimitSelected}
        onSelect={setMoveLimit}
      />

      <button onClick={handleStart}>▶️ Play</button>
    </div>
  );
}

export default StartScreen;
