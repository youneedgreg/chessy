import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export default function MoveFeedbackOverlay() {
    const { lastMoveAnalysis, turn } = useGameStore();
    const [visible, setVisible] = useState(false);
    const [animate, setAnimate] = useState(false);
    const lastMoveIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (lastMoveAnalysis && lastMoveAnalysis.playerMove !== lastMoveIdRef.current) {
            lastMoveIdRef.current = lastMoveAnalysis.playerMove;

            // Only show feedback for the player who just moved
            // If it's white's turn now, Black just moved.
            // We usually want to show feedback for the human player. 
            // Assuming human vs computer, we might want to check game mode.
            // For now, show for all moves that have analysis.

            setVisible(true);
            setAnimate(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 2500); // Show for 2.5 seconds

            return () => clearTimeout(timer);
        }
    }, [lastMoveAnalysis]);

    if (!visible || !lastMoveAnalysis) return null;

    const { grade } = lastMoveAnalysis;

    const getBadgeStyle = (grade: string) => {
        switch (grade) {
            case 'brilliant':
                return {
                    bg: 'bg-teal-500/20',
                    border: 'border-teal-400',
                    text: 'text-teal-100',
                    glow: 'shadow-[0_0_30px_rgba(45,212,191,0.6)]',
                    icon: '💎',
                    label: 'Brilliant'
                };
            case 'good':
                return {
                    bg: 'bg-emerald-500/20',
                    border: 'border-emerald-400',
                    text: 'text-emerald-100',
                    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.4)]',
                    icon: '✅',
                    label: 'Good'
                };
            case 'inaccuracy':
                return {
                    bg: 'bg-yellow-500/20',
                    border: 'border-yellow-400',
                    text: 'text-yellow-100',
                    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.4)]',
                    icon: '⚠️',
                    label: 'Inaccuracy'
                };
            case 'mistake':
                return {
                    bg: 'bg-orange-500/20',
                    border: 'border-orange-400',
                    text: 'text-orange-100',
                    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.5)]',
                    icon: '❌',
                    label: 'Mistake'
                };
            case 'blunder':
                return {
                    bg: 'bg-red-600/30',
                    border: 'border-red-500',
                    text: 'text-red-100',
                    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.7)]',
                    icon: '💀',
                    label: 'Blunder'
                };
            default:
                return null;
        }
    };

    const style = getBadgeStyle(grade);
    if (!style) return null;

    return (
        <div className="absolute top-4 right-4 pointer-events-none z-50 flex flex-col items-end">
            <div
                className={`
                    backdrop-blur-md px-4 py-2 rounded-xl border ${style.bg} ${style.border} ${style.text} ${style.glow}
                    transform transition-all duration-500 ease-out flex items-center gap-3
                    ${animate ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'}
                `}
                onTransitionEnd={() => setAnimate(false)}
            >
                <span className="text-2xl filter drop-shadow-lg">{style.icon}</span>
                <div>
                    <div className="font-bold text-lg tracking-wide uppercase drop-shadow-md">{style.label}</div>
                    {/* Optional: Add delta or simple text */}
                </div>
            </div>
        </div>
    );
}
