export type AnalysisLine = {
    multipv: number;
    bestMove: string;
    evaluation: number; // centipawns
    mate?: number; // moves to mate
    pv: string[]; // principal variation
};

export type EngineEvaluation = {
    bestMove: string;
    evaluation: number; // centipawns
    depth: number;
    mate?: number; // moves to mate
    ponder?: string;
    lines: AnalysisLine[];
};

export type TacticalFlag =
    | 'hanging'
    | 'fork'
    | 'pin'
    | 'skewer'
    | 'discovered_attack'
    | 'back_rank'
    | 'double_check';

export type MoveAnalysis = {
    playerMove: string;
    engineBestMove: string;
    evalBefore: number;
    evalAfter: number;
    evalDelta: number;
    grade: 'brilliant' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
    tacticalFlags: TacticalFlag[];
};

export type UCIResponse = {
    type: 'ready' | 'eval' | 'bestmove' | 'info';
    data: any;
};
