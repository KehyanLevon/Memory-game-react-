import { useGameStore } from "./store/gameStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StartScreen } from "./components/StartScreen";
import RollModal from "./components/RollModal";
import { GameBoard } from "./components/GameBoard";
import GameOverScreen from "./components/GameOverScreen";
import statuses from "./data/statuses"
import "./assets/styles/App.css";

const queryClient = new QueryClient();

function App() {
  const status = useGameStore((s) => s.status);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        {status === statuses.setup && <StartScreen />}
        {status === statuses.roll && <RollModal />}
        {status === statuses.playing && <GameBoard />}
        {status === statuses.finished && <GameOverScreen />}
      </div>
    </QueryClientProvider>
  );
}

export default App;
