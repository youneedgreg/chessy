import { EngineEvaluation, MoveAnalysis, TacticalFlag } from '../engine/types';

export const CLASSIFICATIONS = {
    BRILLIANT: 'brilliant',
    GOOD: 'good',
    INACCURACY: 'inaccuracy',
    MISTAKE: 'mistake',
    BLUNDER: 'blunder',
} as const;

export function classifyMove(
    evalBefore: number,
    evalAfter: number,
    playerColor: 'w' | 'b'
): MoveAnalysis['grade'] {
    // Normalize evaluation from active player's perspective
    // If white is moving, positive is good. If black, negative is good.
    const scoreBefore = playerColor === 'w' ? evalBefore : -evalBefore;
    const scoreAfter = playerColor === 'w' ? evalAfter : -evalAfter;

    const delta = scoreAfter - scoreBefore;

    if (delta >= 0) return 'good'; // Improvements are always at least good

    const absDelta = Math.abs(delta);

    if (absDelta <= 20) return 'good';
    if (absDelta <= 50) return 'inaccuracy';
    if (absDelta <= 150) return 'mistake';
    return 'blunder';
}

// Tactical pattern detection (mock implementation for now)
export function detectTactics(fen: string, lastMove: string): TacticalFlag[] {
    // Logic to detect pins, forks, etc. will be implemented here
    return [];
}
