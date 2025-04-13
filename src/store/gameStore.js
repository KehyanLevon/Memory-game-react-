import { create } from "zustand";
import { persist } from "zustand/middleware";
import { difficulties, timeModes, moveLimits } from "../data/difficulties";
import statuses from "../data/statuses";
import defaultPlayers from "../data/defaultPlayers";

export const useGameStore = create(
  persist(
    (set, get) => ({
      difficulties,
      timeModes,
      moveLimits,
      difficulty: difficulties[0],
      timeLimit: timeModes[0],
      mistakesLimitSelected: moveLimits[0],
      players: structuredClone(defaultPlayers),
      currentPlayerIndex: 0,
      status: statuses.setup,
      winner: null,
      gameStarted: false,
      images: [],

      setImages: (images) => set({ images }),
      resetImages: () => set({ images: [] }),

      setPlayerName: (index, name) => {
        const updated = structuredClone(get().players);
        updated[index].name = name;
        set({ players: updated });
      },

      setPlayerColor: (index, color) => {
        const updated = structuredClone(get().players);
        updated[index].color = color;
        set({ players: updated });
      },

      setDifficulty: (difficulty) => set({ difficulty }),
      setTimeLimit: (value) => {
        const updated = get().players.map((p) => ({ ...p, timeLeft: value }));
        set({ timeLimit: value, players: updated });
      },

      setMoveLimit: (value) => set({ mistakesLimitSelected: value }),
      setStatus: (status) => set({ status }),
      setGameStarted: (value) => set({ gameStarted: value }),

      resetGame: () => {
        const currentPlayers = get().players;
        const timeLimit = get().timeLimit;

        const reset = currentPlayers.map((player) => ({
          ...player,
          timeLeft: timeLimit,
          matched: 0,
          mistakes: 0,
          accuracy: 0,
          timer: null,
        }));

        set({
          players: reset,
          currentPlayerIndex: 0,
          status: statuses.setup,
          winner: null,
          gameStarted: false,
          images: [],
        });
      },

      startTimer: (index) => {
        const { timeLimit, players, stopTimer, checkGameEnd } = get();

        if (players[index].timer !== null) return;

        const intervalId = setInterval(() => {
          const currentPlayers = get().players;
          const player = currentPlayers[index];

          const updatedPlayers = currentPlayers.map((p, i) => {
            if (i !== index) return p;
            if (timeLimit === "∞" && player.timeLeft === "∞") {
              player.timeLeft = 0;
            }
            const newTime = timeLimit === "∞" ? p.timeLeft + 1 : p.timeLeft - 1;

            return { ...p, timeLeft: newTime };
          });

          set({ players: updatedPlayers });

          const newTime = updatedPlayers[index].timeLeft;

          if (timeLimit !== "∞" && newTime <= 0) {
            stopTimer(index);
            checkGameEnd();

            const state = get();
            const nextPlayer = 1 - index;
            const next = state.players[nextPlayer];
            const gameFinished = state.status === statuses.finished;
            const nextOutOfTime = timeLimit !== "∞" && next.timeLeft <= 0;
            const nextOutOfMistakes =
              state.mistakesLimitSelected !== "∞" &&
              next.mistakes >= state.mistakesLimitSelected;

            if (!gameFinished && !(nextOutOfTime && nextOutOfMistakes)) {
              setTimeout(() => get().switchPlayer(), 100);
            }
          }
        }, 1000);
        const updatedWithTimer = get().players.map((p, i) =>
          i === index ? { ...p, timer: intervalId } : p
        );
        set({ players: updatedWithTimer });
      },

      stopTimer: (index) => {
        const timer = get().players[index].timer;
        if (timer) clearInterval(timer);
        const updated = get().players.map((p, i) =>
          i === index ? { ...p, timer: null } : p
        );
        set({ players: updated });
      },

      incrementMatched: () => {
        const index = get().currentPlayerIndex;
        const updated = get().players.map((p, i) =>
          i === index ? { ...p, matched: p.matched + 1 } : p
        );
        set({ players: updated });
        get().updateAccuracy();
        get().checkGameEnd();
      },

      incrementmistakes: () => {
        const index = get().currentPlayerIndex;
        const updated = get().players.map((p, i) =>
          i === index ? { ...p, mistakes: p.mistakes + 1 } : p
        );
        set({ players: updated });
        get().updateAccuracy();
        get().checkGameEnd();
      },

      updateAccuracy: () => {
        const { currentPlayerIndex, players } = get();
        const player = players[currentPlayerIndex];
        const total = player.matched + player.mistakes;
        const updated = get().players.map((p, i) =>
          i === currentPlayerIndex
            ? {
                ...p,
                accuracy:
                  total > 0 ? +((player.matched / total) * 100).toFixed(1) : 0,
              }
            : p
        );
        set({ players: updated });
      },

      switchPlayer: () => {
        const {
          currentPlayerIndex,
          players,
          stopTimer,
          startTimer,
          mistakesLimitSelected,
          timeLimit,
        } = get();

        const prev = currentPlayerIndex;
        const next = 1 - prev;

        const nextPlayer = players[next];
        const outOfTime = timeLimit !== "∞" && nextPlayer.timeLeft <= 0;
        const outOfMistakes =
          mistakesLimitSelected !== "∞" &&
          nextPlayer.mistakes >= mistakesLimitSelected;

        if (outOfTime || outOfMistakes) return;

        stopTimer(prev);
        startTimer(next);
        set({ currentPlayerIndex: next });
      },

      endTurn: () => {
        get().incrementmistakes();
        get().switchPlayer();
      },

      checkGameEnd: () => {
        const {
          players,
          difficulty,
          mistakesLimitSelected,
          timeLimit,
          stopTimer,
          endGame,
        } = get();
        const totalPairs = (difficulty.size * difficulty.size) / 2;
        const totalMatched = players[0].matched + players[1].matched;

        const mistakesOver =
          mistakesLimitSelected !== "∞" &&
          players.every((p) => p.mistakes >= mistakesLimitSelected);

        const timeUp =
          timeLimit !== "∞" && players.every((p) => p.timeLeft <= 1);

        if (totalMatched >= totalPairs || mistakesOver || timeUp) {
          stopTimer(0);
          stopTimer(1);
          endGame();
        }
      },

      endGame: () => {
        const [p1, p2] = get().players;
        let winner = null;
        if (p1.matched > p2.matched) winner = p1.name;
        else if (p2.matched > p1.matched) winner = p2.name;
        else winner = "Tie";

        set({ status: statuses.finished, winner });
      },
    }),
    { name: "memory-game-store" }
  )
);
