import { Chess, Move } from 'chess.js';
import { EngineEvaluation, MoveAnalysis } from '../engine/types';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';

export interface LevelConfig {
    depth: number;
    multiPV: number;
    skillLevel: number; // Stockfish Skill Level (0-20)
    errorProbability: number; // Chance to make a sub-optimal move (0-1)
    allowUndo: boolean; // New
    name: string;
    description: string;
}

export const LEVELS: Record<DifficultyLevel, LevelConfig> = {
    beginner: {
        depth: 5,
        multiPV: 1,
        skillLevel: 5,
        errorProbability: 0.3,
        allowUndo: true,
        name: 'Beginner',
        description: 'Makes frequent mistakes. Good for learning basics.',
    },
    intermediate: {
        depth: 10,
        multiPV: 1,
        skillLevel: 10,
        errorProbability: 0.1,
        allowUndo: true,
        name: 'Intermediate',
        description: 'Solid play but misses tactical opportunities.',
    },
    advanced: {
        depth: 15,
        multiPV: 3,
        skillLevel: 15,
        errorProbability: 0.05,
        allowUndo: false,
        name: 'Advanced',
        description: 'Strong tactical play. Hard to beat.',
    },
    master: {
        depth: 20,
        multiPV: 3,
        skillLevel: 20,
        errorProbability: 0.0,
        allowUndo: false,
        name: 'Master',
        description: 'Near perfect play. Maximum challenge.',
    }
};

export interface GameState {
    // Core Board State
    game: Chess; // We might store just FEN and reconstruction commands to keep store serializable, but Chess instance is convenient
    fen: string;
    turn: 'w' | 'b';
    isGameOver: boolean;
    result: string | null; // "1-0", "0-1", "1/2-1/2" or null
    history: { uci: string; san: string; fen: string; evaluation: EngineEvaluation | null }[]; // UCI for engine, SAN for UI, FEN, and evaluation

    // Engine & Analysis
    evaluation: EngineEvaluation | null;
    lastEvaluation: EngineEvaluation | null; // Eval before the last move
    isAnalyzing: boolean;
    lastMoveAnalysis: MoveAnalysis | null;

    // Configuration
    difficulty: DifficultyLevel;
    orientation: 'white' | 'black';
    gameMode: 'analysis' | 'pve' | 'pvp'; // new
    autoQueen: boolean;
    showLegalMoves: boolean;
    showEvalBar: boolean;

    // Puzzle / Mistake Tracking
    mistakes: {
        fen: string;
        movePlayed: string;
        betterMove: string;
        evalDiff: number;
    }[];
        // Move navigation (replay)
        currentMoveIndex: number; // -1 means live/latest
}

export interface GameActions {
    // Moves
    makeMove: (source: string, target: string, promotion?: string) => boolean;
    undoMove: () => void;
    resetGame: () => void;

    // Settings
    setDifficulty: (level: DifficultyLevel) => void;
    setGameMode: (mode: 'analysis' | 'pve' | 'pvp') => void;
    setOrientation: (orientation: 'white' | 'black') => void;
    toggleOption: (option: keyof Pick<GameState, 'autoQueen' | 'showLegalMoves' | 'showEvalBar'>) => void;

    // Engine
    setAnalysis: (evaluation: EngineEvaluation) => void;
    setAnalyzing: (isAnalyzing: boolean) => void;
    addMistake: (mistake: GameState['mistakes'][0]) => void;
    setLastMoveAnalysis: (analysis: MoveAnalysis | null) => void;
        /**
         * Set the current move index for navigation/replay.
         * @param index The move index to navigate to (-1 for latest)
         */
        setCurrentMoveIndex: (index: number) => void;

    /**
     * Set the evaluation for a move in the history by index.
     * @param moveIndex Index of the move in history
     * @param evaluation EngineEvaluation to set
     */
    setMoveEvaluation: (moveIndex: number, evaluation: EngineEvaluation) => void;
}

// Combined Store Type
export type GameStore = GameState & GameActions;
