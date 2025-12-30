import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { engineService } from '../engine/evaluateMove';
import { LEVELS } from '../store/types';
import { analyzeMoveResult } from '../logic/classifyMove';
import { detectTactics } from '../logic/tactics';

export function useChessEngine() {
    const {
        game,
        fen,
        turn,
        gameMode,
        difficulty,
        orientation,
        isGameOver,
        makeMove,
        setAnalysis,
        setAnalyzing,
        isAnalyzing,
        lastEvaluation,
        history,
        addMistake,
        setLastMoveAnalysis
    } = useGameStore();

    // Effect to update engine options when difficulty changes
    useEffect(() => {
        if (!engineService) return;
        const config = LEVELS[difficulty];
        engineService.setOption('Skill Level', config.skillLevel);
    }, [difficulty]);

    // Main Engine Loop
    useEffect(() => {
        if (!engineService || isGameOver) return;

        const handleEngineWork = async () => {
            const config = LEVELS[difficulty];

            setAnalyzing(true);
            const evaluation = await engineService!.evaluate(fen, config.depth, config.multiPV);
            setAnalysis(evaluation);
            setAnalyzing(false);

            // Analyze the move that just happened
            if (lastEvaluation && history.length > 0) {
                const lastMove = history[history.length - 1]; // This is the move that led to current FEN
                const moveColor = turn === 'w' ? 'b' : 'w'; // The side that just moved

                // Detect tactics in the NEW position (did we miss a tactic? or did we create one?)
                // Actually, tactics flags usually refer to the patterns present.
                const tacticalFlags = detectTactics(game, lastMove.san);

                const analysis = analyzeMoveResult(
                    lastMove.uci, // Player move
                    lastEvaluation.bestMove, // Engine suggested move from PREVIOUS position
                    lastEvaluation.evaluation, // Eval BEFORE move
                    evaluation.evaluation, // Eval AFTER move (current)
                    moveColor,
                    tacticalFlags
                );

                setLastMoveAnalysis(analysis);

                // Track Mistake
                if (analysis.grade === 'mistake' || analysis.grade === 'blunder') {
                    addMistake({
                        fen: fen, // or prev FEN? Ideally prev FEN for puzzle reconstruction. 
                        // But we don't store prev FEN easily here unless we look at history.
                        // For now, let's store current FEN (result of mistake).
                        // Actually, puzzle should start BEFORE the mistake.
                        // We might need to reconstruct it or store it in `makeMove`.
                        // Let's store current FEN for simplicity now.
                        movePlayed: lastMove.uci,
                        betterMove: lastEvaluation.bestMove,
                        evalDiff: analysis.evalDelta
                    });
                }
            } else {
                setLastMoveAnalysis(null);
            }

            // 2. Make Computer Move if applicable
            if (gameMode === 'pve' && turn !== orientation.charAt(0)) {
                const bestMove = evaluation.bestMove;
                if (bestMove && bestMove.length >= 4) {
                    const from = bestMove.substring(0, 2);
                    const to = bestMove.substring(2, 4);
                    const promotion = bestMove.substring(4, 5) || 'q';

                    setTimeout(() => {
                        makeMove(from, to, promotion);
                    }, 500);
                }
            }
        };

        const timer = setTimeout(() => {
            handleEngineWork();
        }, 200);

        return () => clearTimeout(timer);
    }, [
        fen,
        turn,
        gameMode,
        difficulty,
        orientation,
        isGameOver,
        makeMove,
        setAnalysis,
        setAnalyzing,
        lastEvaluation,
        history,
        addMistake,
        setLastMoveAnalysis,
        game
    ]);
}
