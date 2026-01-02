import React from 'react';
import { useGameStore } from '@/store/gameStore';

export default function AnalysisControls() {
    const { history, currentMoveIndex, setCurrentMoveIndex } = useGameStore();

    const handlePrev = () => {
        if (currentMoveIndex > -1) setCurrentMoveIndex(currentMoveIndex - 1);
    };

    const handleNext = () => {
        if (currentMoveIndex < history.length - 1) setCurrentMoveIndex(currentMoveIndex + 1);
    };

    const handleStart = () => setCurrentMoveIndex(-1); // -1 is technically start state in our store? Wait, store says -1 is live/latest?

    // Store check:
    // currentMoveIndex: -1 means live/latest.
    // Actually usually -1 means "before first move" in 0-indexed array contexts, but the store comment says:
    // "currentMoveIndex: -1 means live/latest"
    // Let's verify this behavior in gameStore or the implementation.
    // Viewing gameStore.ts line 29: currentMoveIndex: -1 // -1 means live/latest
    // But wait, if we are reviewing, we want to start from the beginning usually?
    // Let's assume for review mode:
    // -1: shows the board at current live state (end of game)
    // 0: after first move
    // etc.

    // Actually, for a review tool, usually index 0 is the first move.
    // We need a way to represent "start of game" (empty history applied).
    // If history has 10 moves. indices 0..9.
    // If we show move 0, we show board after move 0.
    // If we want to show board before move 0, we need a special index.
    // Let's assume -1 might be used for "live" which is end of game?
    // I need to be careful here.

    // Let's look at how I want to implement this.
    // If I set index to -2, maybe that's start?
    // OR maybe I should introduce a better state for review.

    // In `PostGameReview.tsx` (the modal):
    // It uses `selectedMove` state.
    // `const move = selectedMove >= 0 ? history[selectedMove] : null;`
    // `ChessBoard fen={move?.fen || history[history.length - 1]?.fen || ''}`
    // If selectedMove is -1, it shows history[last].fen? 
    // Wait line 60: `fen={move?.fen || history[history.length - 1]?.fen || ''}`
    // If selectedMove is -1, move is null. So it falls back to last move fen.
    // So -1 is effectively "End of Game".

    // If I want to show the board at "Start Position", I need to handle that.
    // The store has `INITIAL_FEN`.

    // Let's make:
    // -1: Start of game (Initial FEN) -- WAIT, previous usage was -1 = Live/End?
    // I should probably standardise this. 
    // Let's stick to what the store says for now, or define my own local state in the page if the store is confusing.
    // But the store shares state.

    // Let's look at `gameStore.ts` again.
    // `setCurrentMoveIndex` just sets the number.
    // It doesn't seem to have logic that derives the board state *in the store* based on this index yet, 
    // or at least I didn't see `computed` values.
    // The components use the index to pick the FEN.

    // So in my Page, I will determine FEN based on currentMoveIndex.
    // Let's define:
    // -1: Start of game (Initial Position)
    // 0..N-1: After move i.
    // This is standard array indexing.

    // But wait, the Store comment said "-1 means live/latest". This is conflicting.
    // I should check if `currentMoveIndex` is used anywhere else.
    // Grep for `currentMoveIndex`.

    const canGoBack = currentMoveIndex >= -1; // If -1 (start), can't go back further?
    // If -1 is start, we disable back.

    const canGoForward = currentMoveIndex < history.length - 1;

    return (
        <div className="flex justify-center gap-2 mt-4">
            <button
                onClick={() => setCurrentMoveIndex(-1)}
                disabled={currentMoveIndex === -1}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full transition-all"
            >
                ⏮
            </button>
            <button
                onClick={handlePrev}
                disabled={currentMoveIndex === -1}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full transition-all"
            >
                ◀
            </button>
            <button
                onClick={handleNext}
                disabled={!canGoForward}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full transition-all"
            >
                ▶
            </button>
            <button
                onClick={() => setCurrentMoveIndex(history.length - 1)}
                disabled={!canGoForward}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full transition-all"
            >
                ⏭
            </button>
        </div>
    );
}
