import { create } from 'zustand';
import { Chess } from 'chess.js';
import { GameStore, LEVELS, DifficultyLevel, GameState } from './types';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial State
    game: new Chess(),
    fen: INITIAL_FEN,
    turn: 'w',
    isGameOver: false,
    result: null,
    history: [],

    evaluation: null,
    lastEvaluation: null,
    isAnalyzing: false,
    lastMoveAnalysis: null,

    difficulty: 'beginner',
    orientation: 'white',
    gameMode: 'pve', // Default to Player vs Engine
    autoQueen: true,
    showLegalMoves: true,
    showEvalBar: true,

    mistakes: [],

    // Actions
    makeMove: (source: string, target: string, promotion: string = 'q') => {
        const { game, evaluation } = get();

        // Clone to avoid mutation issues (though chess.js is mutable, we want distinct state updates)
        const gameCopy = new Chess(game.fen());

        try {
            const move = gameCopy.move({
                from: source,
                to: target,
                promotion: promotion,
            });

            if (move) {
                // Update state
                set({
                    game: gameCopy,
                    fen: gameCopy.fen(),
                    turn: gameCopy.turn(),
                    isGameOver: gameCopy.isGameOver(),
                    result: gameCopy.isGameOver()
                        ? (gameCopy.isCheckmate()
                            ? (gameCopy.turn() === 'w' ? '0-1' : '1-0')
                            : '1/2-1/2')
                        : null,
                    history: gameCopy.history({ verbose: true }).map(m => ({ uci: m.lan, san: m.san })),
                    lastEvaluation: evaluation, // Save prev eval
                    evaluation: null, // Clear current eval until re-analysis
                });
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    },

    undoMove: () => {
        const { game } = get();
        const gameCopy = new Chess(game.fen());

        // Undo last move (half-move)
        const undo1 = gameCopy.undo();
        if (!undo1) return; // No moves to undo

        set({
            game: gameCopy,
            fen: gameCopy.fen(),
            turn: gameCopy.turn(),
            isGameOver: false,
            result: null,
            history: gameCopy.history({ verbose: true }).map(m => ({ uci: m.lan, san: m.san })),
            evaluation: null, // Clear eval on undo
            lastMoveAnalysis: null,
        });
    },

    resetGame: () => {
        set({
            game: new Chess(),
            fen: INITIAL_FEN,
            turn: 'w',
            isGameOver: false,
            result: null,
            history: [],
            evaluation: null,
            lastMoveAnalysis: null,
            mistakes: [],
        });
    },

    setDifficulty: (level: DifficultyLevel) => {
        set({ difficulty: level });
    },

    setGameMode: (mode) => {
        set({ gameMode: mode });
    },

    setOrientation: (orientation: 'white' | 'black') => {
        set({ orientation });
    },

    toggleOption: (option) => {
        set((state) => ({ [option]: !state[option] }));
    },

    setAnalysis: (evaluation) => {
        set({ evaluation });
    },

    setAnalyzing: (isAnalyzing) => {
        set({ isAnalyzing });
    },

    addMistake: (mistake) => {
        set((state) => ({ mistakes: [...state.mistakes, mistake] }));
    },

    setLastMoveAnalysis: (analysis) => {
        set({ lastMoveAnalysis: analysis });
    }
}));
