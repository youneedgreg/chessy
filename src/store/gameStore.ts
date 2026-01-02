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
    currentMoveIndex: -1, // -1 means live/latest
    currentOpening: null, // Current detected opening
    redoStack: [],
    setCurrentMoveIndex: (index) => {
        set({ currentMoveIndex: index });
    },

    // Actions
    makeMove: (source: string, target: string, promotion: string = 'q') => {
        console.log('[gameStore.makeMove] Called with:', { source, target, promotion });
        const { game, evaluation, history } = get();
        console.log('[gameStore.makeMove] Current state:', {
            currentFen: game.fen(),
            turn: game.turn(),
            historyLength: history.length
        });

        // Clone to avoid mutation issues (though chess.js is mutable, we want distinct state updates)
        const gameCopy = new Chess(game.fen());
        console.log('[gameStore.makeMove] Created game copy with FEN:', gameCopy.fen());

        try {
            const move = gameCopy.move({
                from: source,
                to: target,
                promotion: promotion,
            });
            console.log('[gameStore.makeMove] Move result:', move);

            if (move) {
                // Build new move history with richer data
                // Simply append the new move to existing history
                const newMoveEntry = {
                    uci: move.lan,
                    san: move.san,
                    fen: gameCopy.fen(), // Current position AFTER this move
                    evaluation: null, // Will be filled in later by engine analysis
                    analysis: null,
                    tacticalFlags: undefined,
                    explanation: undefined,
                };

                const prevHistory = [...history, newMoveEntry];

                const newState = {
                    game: gameCopy,
                    fen: gameCopy.fen(),
                    turn: gameCopy.turn(),
                    isGameOver: gameCopy.isGameOver(),
                    result: gameCopy.isGameOver()
                        ? (gameCopy.isCheckmate()
                            ? (gameCopy.turn() === 'w' ? '0-1' : '1-0')
                            : '1/2-1/2')
                        : null,
                    history: prevHistory,
                    lastEvaluation: evaluation, // Save prev eval
                    evaluation: null, // Clear current eval until re-analysis
                };

                console.log('[gameStore.makeMove] Setting new state:', {
                    newFen: newState.fen,
                    newTurn: newState.turn,
                    newHistoryLength: newState.history.length,
                    lastMove: newMoveEntry
                });

                set(newState);
                console.log('[gameStore.makeMove] State set successfully, returning true');
                return true;
            } else {
                console.log('[gameStore.makeMove] Move was null/undefined - invalid move');
            }
        } catch (e) {
            console.error('[gameStore.makeMove] Exception occurred:', e);
            return false;
        }
        console.log('[gameStore.makeMove] Returning false');
        return false;
    },

    undoMove: () => {
        const { game, history, redoStack } = get();
        if (history.length === 0) return;
        // Remove last move from history and push to redoStack
        const newHistory = history.slice(0, -1);
        const undoneMove = history[history.length - 1];
        const newRedoStack = [undoneMove, ...redoStack];
        // Rebuild game state from newHistory
        const gameCopy = new Chess();
        newHistory.forEach(m => gameCopy.move(m.uci));
        set({
            game: gameCopy,
            fen: gameCopy.fen(),
            turn: gameCopy.turn(),
            isGameOver: false,
            result: null,
            history: newHistory,
            redoStack: newRedoStack,
            evaluation: null, // Clear eval on undo
            lastMoveAnalysis: null,
        });
    },

    redoMove: () => {
        const { game, history, redoStack } = get();
        if (redoStack.length === 0) return;
        // Pop move from redoStack and add to history
        const [redoMove, ...restRedo] = redoStack;
        const newHistory = [...history, redoMove];
        // Rebuild game state from newHistory
        const gameCopy = new Chess();
        newHistory.forEach(m => gameCopy.move(m.uci));
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
            history: newHistory,
            redoStack: restRedo,
            evaluation: null, // Clear eval on redo
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
            currentOpening: null,
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
    },

    setCurrentOpening: (opening: string | null) => {
        set({ currentOpening: opening });
    },

    setMoveEvaluation: (moveIndex, evaluation, analysis = null, tacticalFlags = null, explanation = null) => {
        set((state) => {
            if (!state.history[moveIndex]) return {};
            const updatedHistory = state.history.map((move, idx) =>
                idx === moveIndex
                    ? { ...move, evaluation, analysis: analysis || move.analysis, tacticalFlags: tacticalFlags || move.tacticalFlags, explanation: explanation || move.explanation }
                    : move
            );
            return { history: updatedHistory };
        });
    }
}));
