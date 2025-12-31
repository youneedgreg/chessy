import React from 'react';

interface FeedbackPanelProps {
  explanation?: string;
  details?: string[];
  tactics?: string[];
  calm?: boolean;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ explanation, details = [], tactics = [], calm = true }) => {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-2">
      <h3 className="text-xs font-bold text-blue-700 mb-1">Instructional Feedback</h3>
      {explanation && (
        <div className="text-sm text-blue-900 mb-2">
          {explanation}
        </div>
      )}
      {details.length > 0 && (
        <ul className="list-disc pl-5 text-xs text-blue-800 mb-2">
          {details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
      {tactics.length > 0 && (
        <div className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded p-2 mt-2">
          <strong>Tactical Warning:</strong>
          <ul className="list-disc pl-5">
            {tactics.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      {calm && (
        <div className="text-[10px] text-blue-400 mt-2 italic">Keep learning! Every move is a chance to improve.</div>
      )}
    </div>
  );
};

export default FeedbackPanel;
