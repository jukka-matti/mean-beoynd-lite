import React, { useMemo } from 'react';
import { ArrowLeft, Beaker } from 'lucide-react';
import { useData } from '../context/DataContext';
import { calculateStats } from '@variscout/core';
import WhatIfSimulator from './WhatIfSimulator';

interface WhatIfPageProps {
  onBack: () => void;
}

const WhatIfPage: React.FC<WhatIfPageProps> = ({ onBack }) => {
  const { filteredData, rawData, outcome, specs, filters } = useData();

  const currentStats = useMemo(() => {
    if (!outcome || filteredData.length === 0) return null;

    const values = filteredData
      .map(row => {
        const val = row[outcome];
        return typeof val === 'number' ? val : parseFloat(String(val));
      })
      .filter(v => !isNaN(v));

    if (values.length === 0) return null;
    return calculateStats(values, specs.usl, specs.lsl);
  }, [filteredData, outcome, specs]);

  const activeFilterCount = Object.keys(filters).length;

  // Guard: no data or no specs
  if (!outcome || rawData.length === 0) {
    return (
      <div className="flex flex-col h-full bg-surface text-content">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-edge">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors"
          >
            <ArrowLeft size={18} className="text-content-secondary" />
          </button>
          <Beaker size={18} className="text-blue-400" />
          <h1 className="text-sm font-semibold text-content">What-If Simulator</h1>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-sm text-content-muted text-center">
            Load data and set specification limits first.
          </p>
        </div>
      </div>
    );
  }

  const hasSpecs = specs.usl !== undefined || specs.lsl !== undefined;

  return (
    <div className="flex flex-col h-full bg-surface text-content">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} className="text-content-secondary" />
          </button>
          <Beaker size={18} className="text-blue-400" />
          <h1 className="text-sm font-semibold text-content">What-If Simulator</h1>
        </div>
        <div className="flex items-center gap-3 text-xs text-content-muted">
          <span>{outcome}</span>
          <span className="text-content-secondary">n = {filteredData.length}</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-lg mx-auto space-y-4">
          {!hasSpecs && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400">
              Set specification limits (USL/LSL) to see Cpk and yield projections.
            </div>
          )}

          {currentStats && (
            <WhatIfSimulator currentStats={currentStats} specs={specs} defaultExpanded={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatIfPage;
