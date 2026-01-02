import React from 'react';
import { useGameStore } from '@/store/gameStore';

export default function GameSummary() {
    const { result, currentOpening, history, difficulty } = useGameStore();

    const winner = result === '1-0' ? 'White' : result === '0-1' ? 'Black' : 'Draw';
    const resultText = result === '1/2-1/2' ? 'Draw' : `${winner} Won`;

    // Simple stats
    const mistakes = history.filter(m => m.analysis?.grade === 'mistake').length;
    const blunders = history.filter(m => m.analysis?.grade === 'blunder').length;

    const handleSimulateAnalysis = () => {
        if (history.length === 0) {
            // Load a short demo game (Scholar's Mate)
            const moves = [
                ['e2', 'e4'], ['e7', 'e5'],
                ['f1', 'c4'], ['b8', 'c6'],
                ['d1', 'h5'], ['g8', 'f6'],
                ['h5', 'f7']
            ];

            let moveIdx = 0;
            const playNext = () => {
                if (moveIdx >= moves.length) {
                    // After moves are played, populate analysis
                    setTimeout(() => {
                        useGameStore.getState().history.forEach((_, i) => {
                            const grades = ['good', 'inaccuracy', 'mistake', 'blunder', 'brilliant'] as const;
                            const randomGrade = grades[Math.floor(Math.random() * grades.length)];
                            const mockEval = {
                                evaluation: Math.floor(Math.random() * 400) - 200,
                                bestMove: 'e2e4',
                                depth: 10,
                                lines: []
                            };
                            const mockAnalysis = {
                                grade: randomGrade,
                                playerMove: 'e2e4', // dummy
                                engineBestMove: 'e2e4', // dummy
                                evalBefore: 0,
                                evalAfter: 0,
                                evalDelta: 0,
                                tacticalFlags: []
                            };
                            useGameStore.getState().setMoveEvaluation(i, mockEval, mockAnalysis, [], "Simulated analysis reason");
                        });
                    }, 500);
                    return;
                }
                const [from, to] = moves[moveIdx];
                useGameStore.getState().makeMove(from, to);
                moveIdx++;
                setTimeout(playNext, 100);
            };
            playNext();
            return;
        }

        history.forEach((_, i) => {
            const grades = ['good', 'inaccuracy', 'mistake', 'blunder', 'brilliant'] as const;
            const randomGrade = grades[Math.floor(Math.random() * grades.length)];
            const mockEval = {
                evaluation: Math.floor(Math.random() * 400) - 200,
                bestMove: 'e2e4',
                depth: 10,
                lines: []
            };
            const mockAnalysis = {
                grade: randomGrade,
                playerMove: 'e2e4', // dummy
                engineBestMove: 'e2e4', // dummy
                evalBefore: 0,
                evalAfter: 0,
                evalDelta: 0,
                tacticalFlags: []
            };

            useGameStore.getState().setMoveEvaluation(i, mockEval, mockAnalysis, [], "Simulated analysis reason");
        });
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl text-white">
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                    {resultText}
                </h2>
                {(!history[0]?.analysis || history.length === 0) && (
                    <button
                        onClick={handleSimulateAnalysis}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                        title="Populate mock analysis data"
                    >
                        {history.length === 0 ? 'Load Demo Game' : 'Simulate Analysis'}
                    </button>
                )}
            </div>
            <div className="text-lg text-gray-200 mb-4">
                {currentOpening || 'Unknown Opening'}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Difficulty</div>
                    <div className="font-medium capitalize">{difficulty}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Moves</div>
                    <div className="font-medium">{Math.ceil(history.length / 2)}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Mistakes</div>
                    <div className="font-medium text-orange-400">{mistakes}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Blunders</div>
                    <div className="font-medium text-red-500">{blunders}</div>
                </div>
            </div>
        </div>
    );
}
