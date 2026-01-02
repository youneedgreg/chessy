import React, { useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function MistakesTimeline() {
    const { history, currentMoveIndex, setCurrentMoveIndex } = useGameStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to current move
    useEffect(() => {
        if (scrollRef.current && currentMoveIndex >= 0) {
            // Simple logic to keep current move in view
            // In a real app we might want smoother centering
        }
    }, [currentMoveIndex]);

    const getBarColor = (move: any) => {
        const grade = move.analysis?.grade;
        if (grade === 'blunder') return 'bg-red-500';
        if (grade === 'mistake') return 'bg-orange-500';
        if (grade === 'inaccuracy') return 'bg-yellow-400';
        if (grade === 'brilliant') return 'bg-purple-500';
        // Fallback based on eval? For now just gray/white
        return 'bg-gray-400';
    };

    const getHeight = (move: any) => {
        // Logic to make significant moves taller? 
        // Or maybe just uniform blocks like lichess analysis bar
        // Let's do a uniform bar for now, but color coded
        return 'h-4';
    };

    return (
        <div className="w-full bg-black/20 rounded-lg p-2 overflow-x-auto" ref={scrollRef}>
            <div className="flex items-end h-16 gap-[1px] min-w-max">
                {history.map((move, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentMoveIndex(index)}
                        className={`
                        w-4 rounded-t-sm transition-all hover:opacity-80
                        ${getBarColor(move)}
                        ${currentMoveIndex === index ? 'opacity-100 ring-2 ring-white/50 z-10' : 'opacity-70'}
                        ${move.analysis?.grade === 'blunder' || move.analysis?.grade === 'brilliant' ? 'h-full' : 'h-8'}
                    `}
                        title={`${index + 1}. ${move.san} - ${move.analysis?.grade || 'Normal'}`}
                    />
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                <span>Start</span>
                <span>End</span>
            </div>
        </div>
    );
}
