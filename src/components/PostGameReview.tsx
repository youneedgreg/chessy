import React from "react";
import { useGameStore } from '@/store/gameStore';
import ChessBoard from '@/components/ChessBoard';
import ExplanationDrawer from '@/components/ExplanationDrawer';
import { generateJSON, generatePGN } from '@/logic/export';

export default function PostGameReview({ onClose }: { onClose: () => void }) {
  const store = useGameStore();
  const { history } = store;
  const [selectedMove, setSelectedMove] = React.useState<number>(-1);
  const move = selectedMove >= 0 ? history[selectedMove] : null;

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = generateJSON(store);
    downloadFile(json, `chessy_game_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleExportPGN = () => {
    const pgn = generatePGN(store);
    downloadFile(pgn, `chessy_game_${new Date().toISOString().split('T')[0]}.pgn`, 'text/plain');
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white text-gray-900 rounded-lg shadow-xl p-6 max-w-3xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl hover:text-red-500 transition-colors">×</button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Post-Game Review</h2>
          <div className="flex gap-2 mr-8">
            <button
              onClick={handleExportPGN}
              className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded shadow hover:bg-primary/90 transition-colors"
            >
              Export PGN
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded shadow hover:bg-secondary/90 transition-colors"
            >
              Export JSON
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <ChessBoard fen={move?.fen || history[history.length - 1]?.fen || ''} disableAnimations />
            <div className="mt-4 flex flex-wrap gap-2">
              {history.map((m, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 rounded ${selectedMove === i ? 'bg-accent text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => setSelectedMove(i)}
                >
                  {m.san}
                </button>
              ))}
            </div>
          </div>
          <div className="w-80 h-[400px] overflow-y-auto pr-2">
            {move ? (
              <>
                <div className="mb-2">
                  <strong>Move:</strong> {move.san} ({move.uci})
                </div>
                <div className="mb-2">
                  <strong>Evaluation:</strong> {move.evaluation ? (move.evaluation.mate ? `M${Math.abs(move.evaluation.mate)}` : (move.evaluation.evaluation / 100).toFixed(2)) : 'N/A'}
                </div>
                {move.analysis && (
                  <div className="mb-2">
                    <strong>Grade:</strong> <span className="capitalize">{move.analysis.grade}</span>
                  </div>
                )}
                {move.tacticalFlags && move.tacticalFlags.length > 0 && (
                  <div className="mb-2">
                    <strong>Tactics:</strong> {move.tacticalFlags.join(', ')}
                  </div>
                )}
                {move.explanation && (
                  <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                    <strong>Explanation:</strong> {move.explanation}
                  </div>
                )}

                <div className="mt-4 border-t pt-4">
                  <ExplanationDrawer
                    open={!!move}
                    onClose={() => { }}
                    violatedPrinciple={move.analysis?.grade === 'mistake' || move.analysis?.grade === 'blunder' ? move.explanation : undefined}
                    tacticalTags={move.tacticalFlags}
                    whyMatters={move.explanation}
                  />
                </div>
              </>
            ) : (
              <div className="text-gray-500 italic text-center mt-10">Select a move to see details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
