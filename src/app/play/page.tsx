'use client';

import { useState, useCallback } from 'react';
import ChessBoard from '@/components/ChessBoard';
import EvaluationBar from '@/components/EvaluationBar';
import { Square } from 'chess.js';
import { useGameStore } from '@/store/gameStore';
import { useChessEngine } from '@/hooks/useChessEngine';
import { LEVELS, DifficultyLevel } from '@/store/types';

export default function PlayPage() {
    // Global Game State
    const {
        game,
        fen,
        makeMove,
        undoMove, // New
        resetGame,
        difficulty,
        setDifficulty,
        evaluation,
        history,
        result
    } = useGameStore();

    // Initialize Engine
    useChessEngine();

    // Local UI State for highlighting
    const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});

    const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
        const success = makeMove(sourceSquare, targetSquare);
        if (success) {
            setOptionSquares({});
        }
        return success;
    }, [makeMove]);

    const onMouseOverSquare = (square: string) => {
        const moves = game.moves({
            square: square as Square,
            verbose: true,
        });

        if (moves.length === 0) return;

        const newSquares: Record<string, React.CSSProperties> = {};

        moves.map((move) => {
            const targetPiece = game.get(move.to as Square);
            const sourcePiece = game.get(square as Square);

            newSquares[move.to] = {
                background:
                    targetPiece && sourcePiece && targetPiece.color !== sourcePiece.color
                        ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
                        : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                borderRadius: '50%',
            };
            return move;
        });

        newSquares[square] = {
            background: 'rgba(255, 255, 0, 0.4)',
        };

        setOptionSquares(newSquares);
    };

    const onMouseOutSquare = () => {
        setOptionSquares({});
    };

    const handleReset = () => {
        resetGame();
        setOptionSquares({});
    };

    const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDifficulty(e.target.value as DifficultyLevel);
    };

    const canUndo = LEVELS[difficulty].allowUndo && history.length > 0;

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Main Board Area - Dominates the screen on mobile/tablet */}
            <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-bg-secondary relative">
                <div className="flex items-center gap-4 w-full max-w-3xl justify-center h-full">
                    {/* Evaluation Bar */}
                    <div className="h-[min(80vh,80vw)] w-6 hidden md:block">
                        <EvaluationBar
                            evaluation={evaluation?.evaluation || 0}
                            mate={evaluation?.mate}
                        />
                    </div>

                    <div className="w-full max-w-[min(80vh,100%)]">
                        <ChessBoard
                            fen={fen}
                            onPieceDrop={onDrop}
                            customSquareStyles={optionSquares}
                            onMouseOverSquare={onMouseOverSquare}
                            onMouseOutSquare={onMouseOutSquare}
                        />
                    </div>
                </div>
            </main>

            {/* Sidebar / Bottom Panel - Adapts to device */}
            <aside className="
                flex flex-col
                w-full lg:w-96
                h-[30vh] lg:h-full
                border-t lg:border-t-0 lg:border-l border-text-secondary/20
                bg-background p-4 lg:p-6
                overflow-y-auto
                gap-4
            ">
                <div className="flex-shrink-0">
                    <h1 className="text-2xl font-bold font-sans mb-1">Stockfish Trainer</h1>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span>Level:</span>
                        <select
                            value={difficulty}
                            onChange={handleDifficultyChange}
                            className="bg-transparent border-b border-text-secondary/30 focus:outline-none focus:border-accent"
                        >
                            {(Object.keys(LEVELS) as DifficultyLevel[]).map((level) => (
                                <option key={level} value={level}>
                                    {LEVELS[level].name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-[10px] text-text-secondary mt-1 opacity-70">
                        {LEVELS[difficulty].description}
                    </div>
                    {result && <div className="mt-2 text-accent font-bold text-lg">{result}</div>}
                </div>

                <div className="flex-1 overflow-y-auto bg-bg-secondary/30 rounded p-4 text-sm font-mono text-text-secondary shadow-inner">
                    <h3 className="text-[10px] uppercase tracking-widest mb-3 opacity-50">History</h3>
                    {history.length === 0 ? (
                        <div className="opacity-50 italic text-xs">Game started. White to move.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                            {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                                <div key={i} className="flex col-span-2 items-center gap-2 border-b border-white/5 pb-1">
                                    <span className="w-6 text-[10px] text-gray-500">{i + 1}.</span>
                                    <span className="flex-1 text-white font-medium">{history[i * 2]?.san}</span>
                                    <span className="flex-1 text-gray-400">{history[i * 2 + 1]?.san || ''}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Analysis Info */}
                {evaluation && (
                    <div className="p-3 bg-black/40 rounded-lg text-[10px] font-mono border border-white/5">
                        <div className="flex justify-between mb-1">
                            <span className="opacity-50">Evaluation</span>
                            <span className={evaluation.evaluation >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {evaluation.mate ? `M${Math.abs(evaluation.mate)}` : (evaluation.evaluation / 100).toFixed(1)}
                            </span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="opacity-50">Best Move</span>
                            <span className="text-accent">{evaluation.bestMove}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-50">Depth</span>
                            <span>{evaluation.depth}</span>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-text-secondary/20 grid grid-cols-2 gap-2">
                    <button
                        onClick={undoMove}
                        disabled={!canUndo}
                        className="px-4 py-2 bg-text-secondary/10 hover:bg-text-secondary/20 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs font-medium transition-colors"
                    >
                        Undo
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-text-secondary/10 hover:bg-text-secondary/20 rounded text-xs font-medium transition-colors"
                    >
                        Reset
                    </button>
                    <button className="col-span-2 px-4 py-3 bg-accent text-white hover:bg-accent/90 rounded text-sm font-bold transition-transform active:scale-95 shadow-lg">
                        Analyze Game
                    </button>
                </div>
            </aside>
        </div>
    );
}
