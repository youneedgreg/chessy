// Chess Opening Detection
// Detects common chess openings based on move history

export interface Opening {
    name: string;
    moves: string[]; // SAN notation
    variation?: string;
}

// Common chess openings database
const OPENINGS: Opening[] = [
    // King's Pawn Openings
    { name: "King's Pawn Opening", moves: ['e4'] },
    { name: "King's Pawn Game", moves: ['e4', 'e5'] },
    { name: "Ruy Lopez", moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'] },
    { name: "Italian Game", moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'] },
    { name: "Scotch Game", moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'] },
    { name: "King's Gambit", moves: ['e4', 'e5', 'f4'] },
    { name: "Petrov Defense", moves: ['e4', 'e5', 'Nf3', 'Nf6'] },
    { name: "Philidor Defense", moves: ['e4', 'e5', 'Nf3', 'd6'] },
    { name: "French Defense", moves: ['e4', 'e6'] },
    { name: "Caro-Kann Defense", moves: ['e4', 'c6'] },
    { name: "Sicilian Defense", moves: ['e4', 'c5'] },
    { name: "Sicilian Dragon", moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'] },
    { name: "Pirc Defense", moves: ['e4', 'd6'] },
    { name: "Alekhine Defense", moves: ['e4', 'Nf6'] },
    { name: "Scandinavian Defense", moves: ['e4', 'd5'] },

    // Queen's Pawn Openings
    { name: "Queen's Pawn Opening", moves: ['d4'] },
    { name: "Queen's Pawn Game", moves: ['d4', 'd5'] },
    { name: "Queen's Gambit", moves: ['d4', 'd5', 'c4'] },
    { name: "Queen's Gambit Accepted", moves: ['d4', 'd5', 'c4', 'dxc4'] },
    { name: "Queen's Gambit Declined", moves: ['d4', 'd5', 'c4', 'e6'] },
    { name: "Slav Defense", moves: ['d4', 'd5', 'c4', 'c6'] },
    { name: "King's Indian Defense", moves: ['d4', 'Nf6', 'c4', 'g6'] },
    { name: "Nimzo-Indian Defense", moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'] },
    { name: "Grünfeld Defense", moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'] },
    { name: "Dutch Defense", moves: ['d4', 'f5'] },
    { name: "Benoni Defense", moves: ['d4', 'Nf6', 'c4', 'c5'] },
    { name: "London System", moves: ['d4', 'Nf6', 'Nf3', 'd5', 'Bf4'] },

    // Other Openings
    { name: "English Opening", moves: ['c4'] },
    { name: "Réti Opening", moves: ['Nf3'] },
    { name: "Bird's Opening", moves: ['f4'] },
    { name: "Zukertort Opening", moves: ['Nf3', 'd5'] },
];

/**
 * Detects the chess opening based on move history
 * @param history Array of moves in SAN notation (e.g., ['e4', 'e5', 'Nf3'])
 * @returns Opening name or null if no match found
 */
export function detectOpening(history: string[]): string | null {
    if (!history || history.length === 0) return null;

    // Find the longest matching opening
    let bestMatch: Opening | null = null;
    let bestMatchLength = 0;

    for (const opening of OPENINGS) {
        if (opening.moves.length > history.length) continue;

        // Check if all opening moves match the history
        const matches = opening.moves.every((move, index) => move === history[index]);

        if (matches && opening.moves.length > bestMatchLength) {
            bestMatch = opening;
            bestMatchLength = opening.moves.length;
        }
    }

    return bestMatch ? bestMatch.name : null;
}

/**
 * Gets opening information including variation
 * @param history Array of moves in SAN notation
 * @returns Opening object or null
 */
export function getOpeningInfo(history: string[]): Opening | null {
    if (!history || history.length === 0) return null;

    let bestMatch: Opening | null = null;
    let bestMatchLength = 0;

    for (const opening of OPENINGS) {
        if (opening.moves.length > history.length) continue;

        const matches = opening.moves.every((move, index) => move === history[index]);

        if (matches && opening.moves.length > bestMatchLength) {
            bestMatch = opening;
            bestMatchLength = opening.moves.length;
        }
    }

    return bestMatch;
}
