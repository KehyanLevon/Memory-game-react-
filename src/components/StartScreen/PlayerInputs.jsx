import { useGameStore } from "../../store/gameStore";

function PlayerInputs() {
  const { players, setPlayerName, setPlayerColor } = useGameStore();

  return (
    <>
      {players.map((player, index) => (
        <div key={player.id}>
          <label>{`👤 ${player.id}:`}</label>
          <input
            value={player.name}
            onChange={(e) => setPlayerName(index, e.target.value)}
          />
          <input
            type="color"
            value={player.color}
            onChange={(e) => setPlayerColor(index, e.target.value)}
            title="Choose player color"
            className="player-setup"
          />
        </div>
      ))}
    </>
  );
}

export default PlayerInputs;
