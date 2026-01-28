/**
 * PerformanceSummary - Summary bar for performance mode
 *
 * Shows total channels, average Cpk, and channels below target.
 * User sets Cpk target themselves - no automatic health classification.
 */

import React from 'react';
import { useData } from '../context/DataContext';

const PerformanceSummary: React.FC = () => {
  const { performanceResult, selectedMeasure, setSelectedMeasure, measureLabel } = useData();

  if (!performanceResult) {
    return null;
  }

  const { summary } = performanceResult;
  const { totalChannels, overall, needsAttentionCount } = summary;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
      {/* Summary stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="text-slate-400">
          <span className="font-medium text-slate-200">{totalChannels}</span>{' '}
          {measureLabel.toLowerCase()}s
        </div>
        <div className="text-slate-400 border-l border-slate-600 pl-4">
          Avg Cpk:{' '}
          <span className="font-mono font-medium text-slate-200">{overall.meanCpk.toFixed(2)}</span>
        </div>
        {needsAttentionCount > 0 && (
          <div className="text-amber-400 border-l border-slate-600 pl-4">
            <span className="font-medium">{needsAttentionCount}</span> below target
          </div>
        )}
      </div>

      {/* Clear selection button */}
      {selectedMeasure && (
        <button
          onClick={() => setSelectedMeasure(null)}
          className="text-xs text-slate-400 hover:text-slate-200 underline"
        >
          Clear selection
        </button>
      )}
    </div>
  );
};

export default PerformanceSummary;
