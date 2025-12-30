'use client';

interface EvaluationBarProps {
    evaluation: number; // centipawns (positive = white advantage)
    mate?: number | null; // moves to mate (positive = white mates)
    orientation?: 'white' | 'black';
}

export default function EvaluationBar({
    evaluation,
    mate,
    orientation = 'white',
}: EvaluationBarProps) {
    // Calculate percentage fill
    // Standard scale: +/- 4 pawns (400 cp) covers most of the bar
    // Sigmoid function is often used to smooth it out

    let score = evaluation;
    if (mate) {
        // If mate found, bar should be full
        score = mate > 0 ? 10000 : -10000;
    }

    // Simple clamp for linear visual or sigmoid
    // Sigmoid: 1 / (1 + e^(-k * eval))
    // k = 0.004 roughly maps 100cp to ~60% win prob?
    // Let's use a simpler clamped linear or non-linear scaling for visual clarity
    // Lichess uses: 50 + 50 * (2 / (1 + exp(-0.004 * cp)) - 1)

    const winChance = 2 / (1 + Math.exp(-0.004 * score)) - 1;
    // winChance is -1 to 1

    const fillPercent = 50 + (winChance * 50);

    // If orientation is black, flip the bar logic? 
    // Usually eval bar shows White's advantage. 
    // If White is winning (score > 0), the White part (usually white color) grows.
    // If we want a single bar:
    // Background is Black color. Foreground is White color.
    // Height is fillPercent%.
    // If orientation is standard (White bottom), bottom is 0%.

    // We want the white bar to be the height.
    const whiteHeight = Math.max(0, Math.min(100, fillPercent));

    return (
        <div className="w-4 h-full bg-[#403d39] rounded-sm overflow-hidden relative shadow-inner">
            {/* White bar part */}
            <div
                className="w-full absolute bg-[#e8e8e8] transition-all duration-500 ease-in-out"
                style={{
                    height: `${whiteHeight}%`,
                    bottom: orientation === 'white' ? 0 : 'auto',
                    top: orientation === 'black' ? 0 : 'auto',
                }}
            />

            {/* Score label (optional, maybe hover?) */}
            {/* <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-gray-500 mix-blend-difference pointer-events-none">
                {mate ? `M${Math.abs(mate)}` : (evaluation / 100).toFixed(1)}
            </div> */}
        </div>
    );
}
