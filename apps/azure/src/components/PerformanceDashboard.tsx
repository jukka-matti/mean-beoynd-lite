/**
 * PerformanceDashboard - Main layout for performance mode
 *
 * Displays multi-channel performance analysis with:
 * - Summary bar with health counts
 * - I-Chart showing Cpk by channel
 * - Boxplot for selected channel or worst channels
 * - Pareto ranking channels by Cpk
 * - Capability histogram for selected channel
 */

import React, { useCallback, useState } from 'react';
import { useData } from '../context/DataContext';
import PerformanceSummary from './PerformanceSummary';
import PerformanceIChart from './charts/PerformanceIChart';
import PerformanceBoxplot from './charts/PerformanceBoxplot';
import PerformancePareto from './charts/PerformancePareto';
import PerformanceCapability from './charts/PerformanceCapability';
import PerformanceSetupPanel from './PerformanceSetupPanel';
import ErrorBoundary from './ErrorBoundary';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface PerformanceDashboardProps {
  /** Callback when exiting performance mode */
  onExitPerformanceMode?: () => void;
  /** Callback when drilling to standard I-Chart for a measure */
  onDrillToMeasure?: (measureId: string) => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  onExitPerformanceMode,
  onDrillToMeasure,
}) => {
  const { performanceResult, selectedMeasure, setSelectedMeasure, specs, measureColumns } =
    useData();

  // Cp/Cpk toggle state
  const [capabilityMetric, setCapabilityMetric] = useState<'cp' | 'cpk'>('cpk');

  const handleMeasureClick = useCallback(
    (measureId: string) => {
      // Toggle selection - clicking again deselects
      setSelectedMeasure(selectedMeasure === measureId ? null : measureId);
    },
    [selectedMeasure, setSelectedMeasure]
  );

  // Show setup panel if no measures configured
  if (!performanceResult || measureColumns.length === 0) {
    return (
      <div className="h-full bg-slate-900 overflow-auto">
        <PerformanceSetupPanel variant="inline" />
      </div>
    );
  }

  // Show warning if no specs defined (but still show charts - they just won't have Cpk)
  const noSpecs = specs.usl === undefined && specs.lsl === undefined;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Warning banner if no specs */}
      {noSpecs && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 border-b border-amber-600/30 text-amber-300 text-sm">
          <AlertTriangle size={16} />
          <span>Set specification limits (USL/LSL) to enable Cpk calculations</span>
        </div>
      )}

      {/* Summary bar */}
      <PerformanceSummary />

      {/* Chart grid */}
      <div className="flex-1 grid grid-rows-2 grid-cols-1 lg:grid-cols-3 gap-2 p-2 min-h-0">
        {/* Top row: I-Chart spanning full width */}
        <div className="lg:col-span-3 min-h-0 bg-slate-800/50 rounded-lg overflow-hidden">
          <div className="h-full p-2">
            <div className="flex items-center justify-between mb-1 px-2">
              <h3 className="text-xs font-medium text-slate-400">
                {capabilityMetric === 'cp' ? 'Cp' : 'Cpk'} by Measure
                {selectedMeasure && (
                  <span className="ml-2 text-slate-500">(Selected: {selectedMeasure})</span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {/* Cp/Cpk Toggle */}
                <div className="flex rounded overflow-hidden border border-slate-600">
                  <button
                    onClick={() => setCapabilityMetric('cpk')}
                    className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                      capabilityMetric === 'cpk'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Cpk
                  </button>
                  <button
                    onClick={() => setCapabilityMetric('cp')}
                    className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                      capabilityMetric === 'cp'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Cp
                  </button>
                </div>
                {/* Drill to I-Chart button */}
                {selectedMeasure && onDrillToMeasure && (
                  <button
                    onClick={() => onDrillToMeasure(selectedMeasure)}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                  >
                    View in I-Chart
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
            <div className="h-[calc(100%-1.5rem)]">
              <ErrorBoundary componentName="PerformanceIChart">
                <PerformanceIChart
                  onChannelClick={handleMeasureClick}
                  capabilityMetric={capabilityMetric}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Bottom row: Three charts */}
        <div className="min-h-0 bg-slate-800/50 rounded-lg overflow-hidden">
          <div className="h-full p-2">
            <h3 className="text-xs font-medium text-slate-400 mb-1 px-2">
              {selectedMeasure ? `${selectedMeasure} Distribution` : 'Worst Measures'}
            </h3>
            <div className="h-[calc(100%-1.5rem)]">
              <ErrorBoundary componentName="PerformanceBoxplot">
                <PerformanceBoxplot onChannelClick={handleMeasureClick} />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        <div className="min-h-0 bg-slate-800/50 rounded-lg overflow-hidden">
          <div className="h-full p-2">
            <h3 className="text-xs font-medium text-slate-400 mb-1 px-2">
              Measure Ranking (Worst First)
            </h3>
            <div className="h-[calc(100%-1.5rem)]">
              <ErrorBoundary componentName="PerformancePareto">
                <PerformancePareto onChannelClick={handleMeasureClick} />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        <div className="min-h-0 bg-slate-800/50 rounded-lg overflow-hidden">
          <div className="h-full p-2">
            <h3 className="text-xs font-medium text-slate-400 mb-1 px-2">
              {selectedMeasure ? `${selectedMeasure} Capability` : 'Measure Capability'}
            </h3>
            <div className="h-[calc(100%-1.5rem)]">
              <ErrorBoundary componentName="PerformanceCapability">
                <PerformanceCapability />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
