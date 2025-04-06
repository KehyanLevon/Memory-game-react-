import "../assets/styles/Header.css";
import { timeModes, moveLimits } from "../data/difficulties";

function Header({
  onChangeDifficulty,
  difficulties,
  currentDifficulty,
  timeMode,
  moveLimit,
  onChangeTimeMode,
  onChangeMoveLimit,
}) {
  return (
    <div>
      <div>
        <p>🔥 Difficulty:</p>
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.id}
            className={`difficulty-button ${currentDifficulty.id === difficulty.id ? "active" : ""}`}
            onClick={() => onChangeDifficulty(difficulty)}
          >
            {difficulty.name}
          </button>
        ))}
        <p>⏱ Time:</p>
        {timeModes.map((value) => (
          <button
            key={value}
            className={`difficulty-button ${value === timeMode ? "active" : ""}`}
            onClick={() => onChangeTimeMode(value)}
          >
            {value === "∞" ? "∞" : `${value / 60}м`}
          </button>
        ))}

        <p>🔢 Attempts:</p>
        {moveLimits.map((value) => (
          <button
            key={value}
            className={`difficulty-button ${value === moveLimit ? "active" : ""}`}
            onClick={() => onChangeMoveLimit(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Header;
