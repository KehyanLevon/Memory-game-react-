import { useGameStore } from "../store/gameStore";
import statuses from "../data/statuses"
import "../assets/styles/RollModal.css";

function RollModal() {
  const { setStatus, switchPlayer } = useGameStore();

  const rollToStart = () => {
    if (Math.random() < 0.5) switchPlayer();
    setStatus(statuses.playing);
  };

  return (
    <div className="modal">
      <h2>
        🎲 Who Starts?<br />
        <button onClick={rollToStart}>Roll to Start</button>
      </h2>
      
    </div>
  );
}

export default RollModal;
