import { GameStore, MoveHistory } from '@/store/types';

export function generateJSON(store: GameStore): string {
    const data = {
        fen: store.fen,
        turn: store.turn,
        result: store.result,
        history: store.history,
        mistakes: store.mistakes,
        difficulty: store.difficulty,
        orientation: store.orientation,
        date: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
}

export function generatePGN(store: GameStore): string {
    const { history, result, orientation, difficulty } = store;
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '.');

    let pgn = '';

    // Headers
    pgn += `[Event "Chessy Game"]\n`;
    pgn += `[Site "Chessy App"]\n`;
    pgn += `[Date "${date}"]\n`;
    pgn += `[Round "-"]\n`;
    pgn += `[White "${orientation === 'white' ? 'Player' : `Engine (${difficulty})`}"]\n`;
    pgn += `[Black "${orientation === 'black' ? 'Player' : `Engine (${difficulty})`}"]\n`;
    pgn += `[Result "${result || '*'}"]\n`;
    pgn += `[Variant "Standard"]\n`;
    pgn += `\n`;

    // Moves
    let moveText = '';
    let moveNumber = 1;

    history.forEach((move, index) => {
        if (index % 2 === 0) {
            moveText += `${moveNumber}. ${move.san}`;
            moveNumber++;
        } else {
            moveText += ` ${move.san}`;
        }

        // Annotations
        const nag = getNAG(move);
        if (nag) moveText += ` ${nag}`;

        // Comments (Eval + Explanation)
        const comments = [];
        if (move.evaluation) {
            const evalText = move.evaluation.mate
                ? `M${Math.abs(move.evaluation.mate)}`
                : (move.evaluation.evaluation / 100).toFixed(2);
            comments.push(`[%eval ${evalText}]`);
        }
        if (move.explanation) {
            // Clean explanation of newlines/curlies
            comments.push(move.explanation.replace(/[\{\}]/g, ''));
        }

        if (comments.length > 0) {
            moveText += ` { ${comments.join(' ')} }`;
        }

        moveText += ' ';
    });

    // Formatting: break lines every 80 chars approximately
    const words = moveText.split(' ');
    let currentLine = '';

    words.forEach(word => {
        if (currentLine.length + word.length > 80) {
            pgn += currentLine.trim() + '\n';
            currentLine = '';
        }
        currentLine += word + ' ';
    });
    if (currentLine) pgn += currentLine.trim();

    // Result suffix
    if (result) {
        pgn += ` ${result}`;
    }

    return pgn;
}

function getNAG(move: MoveHistory): string {
    if (!move.analysis) return '';
    switch (move.analysis.grade) {
        case 'brilliant': return '$3'; // !!
        case 'good': return '$1'; // !
        case 'inaccuracy': return '$6'; // ?!
        case 'mistake': return '$2'; // ?
        case 'blunder': return '$4'; // ??
        default: return '';
    }
}
