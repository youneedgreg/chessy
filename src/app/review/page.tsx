'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import ChessBoard from '@/components/ChessBoard';
import GameSummary from '@/components/Review/GameSummary';
import MistakesTimeline from '@/components/Review/MistakesTimeline';
import AnalysisControls from '@/components/Review/AnalysisControls';
import ExplanationDrawer from '@/components/ExplanationDrawer';

export default function ReviewPage() {
    const {
        history,
        currentMoveIndex,
        setCurrentMoveIndex,
        mistakes
    } = useGameStore();

    // Initialize review
    useEffect(() => {
        // Start at the beginning of the game for review? Or end?
        // Let's start at the first mistake if any, otherwise start of game.
        // For now, let's start at -1 (initial position).
        if (history.length > 0 && currentMoveIndex === -1) {
            // We might want to persist the state from the previous game page, 
            // so we don't force reset here unless we want to.
            // But if currentMoveIndex is -1 (live), and game is over, maybe we want to keep it?
            // Let's default to showing the result (end of game).
            setCurrentMoveIndex(history.length - 1);
        }
    }, []);

    const currentMove = currentMoveIndex >= 0 ? history[currentMoveIndex] : null;

    // Determine FEN to show
    // If index is -1, show INITIAL_FEN (or whatever the start was)
    // If index is i, show history[i].fen
    const currentFen = currentMove ? currentMove.fen : (
        // Fallback for index -1 (start)
        // We need the initial FEN. The store has it but we might not export it directly easily
        // actually history[0] has the fen AFTER move 0.
        // We can create a new Chess() to get start fen?
        // Or just hardcode standard start fen for now.
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8 flex flex-col items-center">
            <header className="w-full max-w-6xl flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Game Analysis
                </h1>
                <Link href="/play" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm">
                    Back to Game
                </Link>
            </header>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 h-full flex-grow">
                {/* Left Column: Board */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex-grow flex items-center justify-center">
                        <ChessBoard
                            fen={currentFen}
                            disableAnimations={false}
                            boardOrientation={useGameStore.getState().orientation} // Access direct state for non-reactive read or use hook
                            // We need arrows for best move/mistakes?
                            arrows={
                                // TODO: Add arrows based on analysis
                                []
                            }
                        />
                    </div>
                    <AnalysisControls />
                    <MistakesTimeline />
                </div>

                {/* Right Column: Analysis & Summary */}
                <div className="flex flex-col gap-6">
                    <GameSummary />

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex-grow overflow-y-auto min-h-[300px]">
                        <h3 className="text-xl font-bold mb-4 text-gray-200">Move Analysis</h3>
                        {currentMove ? (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl font-mono font-bold">{Math.floor(currentMoveIndex / 2) + 1}.{currentMoveIndex % 2 === 0 ? '' : '..'}</span>
                                    <span className="text-3xl font-bold text-yellow-400">{currentMove.san}</span>
                                </div>

                                {currentMove.analysis && (
                                    <div className={`
                                inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-wider
                                ${currentMove.analysis.grade === 'blunder' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                                            currentMove.analysis.grade === 'mistake' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                                                currentMove.analysis.grade === 'brilliant' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                                                    'bg-gray-500/20 text-gray-400'}
                            `}>
                                        {currentMove.analysis.grade}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {currentMove.evaluation && (
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Evaluation</div>
                                            <div className="text-xl font-mono">
                                                {currentMove.evaluation.mate
                                                    ? `M${currentMove.evaluation.mate}`
                                                    : (currentMove.evaluation.evaluation > 0 ? '+' : '') + (currentMove.evaluation.evaluation / 100).toFixed(2)}
                                            </div>
                                        </div>
                                    )}

                                    {currentMove.explanation && (
                                        <div className="bg-blue-500/10 p-4 rounded-lg border-l-4 border-blue-500">
                                            <p className="text-blue-100 italic">"{currentMove.explanation}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 italic flex items-center justify-center h-40">
                                Start of game
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
