import { TacticalFlag } from '../engine/types';

export interface Arrow {
    from: string;
    to: string;
    color: string;
    style?: 'solid' | 'dashed';
}

export function getArrowColorByLevel(level: string): string {
    switch (level) {
        case 'beginner':
            return '#00c853'; // green
        case 'intermediate':
            return '#2979ff'; // blue
        case 'advanced':
            return '#ffb300'; // orange
        default:
            return '#ff1744'; // red
    }
}

export function shouldShowBestMoveArrow(level: string): boolean {
    return level === 'beginner';
}

export function createBestMoveArrow(from: string, to: string, level: string): Arrow | null {
    if (!shouldShowBestMoveArrow(level)) return null;
    return {
        from,
        to,
        color: getArrowColorByLevel(level),
        style: 'solid',
    };
}

export function createTacticalArrows(tactics: TacticalFlag[], move: { from: string; to: string }, level: string): Arrow[] {
    // Example: show a red arrow for pins, blue for forks, etc.
    const arrows: Arrow[] = [];
    for (const tactic of tactics) {
        if (tactic === 'pin') {
            arrows.push({ from: move.from, to: move.to, color: '#d50000', style: 'dashed' });
        } else if (tactic === 'fork') {
            arrows.push({ from: move.from, to: move.to, color: '#2962ff', style: 'dashed' });
        } else if (tactic === 'skewer') {
            arrows.push({ from: move.from, to: move.to, color: '#ff6d00', style: 'dashed' });
        } // Add more as needed
    }
    return arrows;
}

// Usage in UI: filter arrows by shouldShowBestMoveArrow(level) and render with appropriate color/style.
