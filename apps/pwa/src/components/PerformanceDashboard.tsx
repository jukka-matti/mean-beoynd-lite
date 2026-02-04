/**
 * PerformanceDashboard - Main layout for performance mode
 *
 * Displays multi-channel performance analysis with:
 * - Summary bar with health counts
 * - I-Chart showing Cpk by channel (full width)
 * - Boxplot showing worst 15 channels (full width)
 *
 * Optimized for 100+ column datasets - click any chart to drill to standard Dashboard.
 */

import React, { useCallback, useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import PerformanceSummary from './PerformanceSummary';
import PerformanceIChart from './charts/PerformanceIChart';
import PerformanceBoxplot from './charts/PerformanceBoxplot';
import PerformanceSetupPanel from './PerformanceSetupPanel';
import ErrorBoundary from './ErrorBoundary';
import {
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

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
  const {
    performanceResult,
    selectedMeasure,
    setSelectedMeasure,
    specs,
    measureColumns,
    cpkThresholds,
  } = useData();

  // Cp/Cpk toggle state (includes 'both' option)
  const [capabilityMetric, setCapabilityMetric] = useState<'cp' | 'cpk' | 'both'>('cpk');

  // Cpk target threshold state
  const [cpkTarget, setCpkTarget] = useState<number>(1.33);

  // Focus mode state
  type FocusedChart = 'ichart' | 'boxplot' | null;
  const [focusedChart, setFocusedChart] = useState<FocusedChart>(null);

  // Chart order for navigation
  const chartOrder: FocusedChart[] = ['ichart', 'boxplot'];

  const handleNextChart = useCallback(() => {
    if (!focusedChart) return;
    const currentIndex = chartOrder.indexOf(focusedChart);
    const nextIndex = (currentIndex + 1) % chartOrder.length;
    setFocusedChart(chartOrder[nextIndex]);
  }, [focusedChart]);

  const handlePrevChart = useCallback(() => {
    if (!focusedChart) return;
    const currentIndex = chartOrder.indexOf(focusedChart);
    const prevIndex = (currentIndex - 1 + chartOrder.length) % chartOrder.length;
    setFocusedChart(chartOrder[prevIndex]);
  }, [focusedChart]);

  // Keyboard navigation for focus mode
  useEffect(() => {
    if (!focusedChart) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocusedChart(null);
      } else if (e.key === 'ArrowRight') {
        handleNextChart();
      } else if (e.key === 'ArrowLeft') {
        handlePrevChart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedChart, handleNextChart, handlePrevChart]);

  const handleMeasureClick = useCallback(
    (measureId: string) => {
      // Toggle selection - clicking again deselects
      setSelectedMeasure(selectedMeasure === measureId ? null : measureId);
    },
    [selectedMeasure, setSelectedMeasure]
  );

  const handleBoxplotClick = useCallback(
    (measureId: string) => {
      // Show confirmation and drill to Dashboard
      if (
        window.confirm(
          `Analyze ${measureId} in detail? This will switch to standard Dashboard view.`
        )
      ) {
        onDrillToMeasure?.(measureId);
      }
    },
    [onDrillToMeasure]
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

      {/* Chart area - either focused view or grid */}
      {focusedChart ? (
        /* Focused single chart view */
        <div className="flex-1 flex p-4 h-full relative group/focus min-h-0">
          {/* Navigation Buttons (Overlay) */}
          <button
            onClick={handlePrevChart}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-3 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full shadow-lg border border-slate-600 opacity-0 group-hover/focus:opacity-100 transition-opacity"
            title="Previous Chart (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextChart}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-3 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full shadow-lg border border-slate-600 opacity-0 group-hover/focus:opacity-100 transition-opacity"
            title="Next Chart (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>

          {focusedChart === 'ichart' && (
            <div className="flex-1 bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-xl shadow-black/20 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-300">
                  {capabilityMetric === 'cp'
                    ? 'Cp'
                    : capabilityMetric === 'cpk'
                      ? 'Cpk'
                      : 'Cp & Cpk'}{' '}
                  by Measure
                  {selectedMeasure && (
                    <span className="ml-2 text-slate-500">(Selected: {selectedMeasure})</span>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  {/* Cp/Cpk/Both Toggle */}
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
                    <button
                      onClick={() => setCapabilityMetric('both')}
                      className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                        capabilityMetric === 'both'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      Both
                    </button>
                  </div>

                  {/* Cpk Target Adjustment */}
                  <div className="flex items-center gap-2 text-sm">
                    <label htmlFor="cpk-target-focused" className="text-slate-400">
                      Target Cpk:
                    </label>
                    <input
                      id="cpk-target-focused"
                      type="number"
                      min="0.5"
                      max="3.0"
                      step="0.01"
                      value={cpkTarget}
                      onChange={e => setCpkTarget(parseFloat(e.target.value) || 1.33)}
                      className="w-20 px-2 py-1 bg-slate-700 text-slate-100 border border-slate-600 rounded text-center"
                      title="Industry standard: 1.33 (4σ), 1.67 (5σ), 2.00 (6σ)"
                    />
                  </div>

                  {selectedMeasure && onDrillToMeasure && (
                    <button
                      onClick={() => onDrillToMeasure(selectedMeasure)}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                    >
                      View in I-Chart
                      <ArrowRight size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => setFocusedChart(null)}
                    className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors bg-slate-700/50"
                    title="Exit Focus Mode (Escape)"
                  >
                    <Minimize2 size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ErrorBoundary componentName="PerformanceIChart">
                  <PerformanceIChart
                    onChannelClick={handleMeasureClick}
                    capabilityMetric={capabilityMetric}
                    cpkTarget={cpkTarget}
                    cpkThresholds={cpkThresholds}
                  />
                </ErrorBoundary>
              </div>
            </div>
          )}

          {focusedChart === 'boxplot' && (
            <div className="flex-1 bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-xl shadow-black/20 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-300">
                  Worst 30 Measures (Click to Analyze)
                </h3>
                <button
                  onClick={() => setFocusedChart(null)}
                  className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors bg-slate-700/50"
                  title="Exit Focus Mode (Escape)"
                >
                  <Minimize2 size={20} />
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ErrorBoundary componentName="PerformanceBoxplot">
                  <PerformanceBoxplot onChannelClick={handleBoxplotClick} maxDisplayed={Infinity} />
                </ErrorBoundary>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Normal grid layout */
        <div className="flex-1 grid grid-rows-2 gap-2 p-2 min-h-0">
          {/* Top row: I-Chart spanning full width */}
          <div className="col-span-full min-h-0 bg-slate-800/50 rounded-lg overflow-hidden">
            <div className="h-full p-2">
              <div className="flex items-center justify-between mb-1 px-2">
                <div className="flex items-center gap-1">
                  <h3 className="text-xs font-medium text-slate-400">
                    {capabilityMetric === 'cp'
                      ? 'Cp'
                      : capabilityMetric === 'cpk'
                        ? 'Cpk'
                        : 'Cp & Cpk'}{' '}
                    by Measure
                    {selectedMeasure && (
                      <span className="ml-2 text-slate-500">(Selected: {selectedMeasure})</span>
                    )}
                  </h3>
                  <span
                    className="text-xs text-slate-500 cursor-help"
                    title="Measures ranked by Cpk (lowest first). Click point to analyze in detail."
                  >
                    ⓘ
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Cp/Cpk/Both Toggle */}
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
                    <button
                      onClick={() => setCapabilityMetric('both')}
                      className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                        capabilityMetric === 'both'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      Both
                    </button>
                  </div>

                  {/* Cpk Target Adjustment */}
                  <div className="flex items-center gap-2 text-sm">
                    <label htmlFor="cpk-target-grid" className="text-slate-400">
                      Target Cpk:
                    </label>
                    <input
                      id="cpk-target-grid"
                      type="number"
                      min="0.5"
                      max="3.0"
                      step="0.01"
                      value={cpkTarget}
                      onChange={e => setCpkTarget(parseFloat(e.target.value) || 1.33)}
                      className="w-20 px-2 py-1 bg-slate-700 text-slate-100 border border-slate-600 rounded text-center"
                      title="Industry standard: 1.33 (4σ), 1.67 (5σ), 2.00 (6σ)"
                    />
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
                  <button
                    onClick={() => setFocusedChart('ichart')}
                    className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Maximize Chart"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
              </div>
              <div className="h-[calc(100%-1.5rem)]">
                <ErrorBoundary componentName="PerformanceIChart">
                  <PerformanceIChart
                    onChannelClick={handleMeasureClick}
                    capabilityMetric={capabilityMetric}
                    cpkTarget={cpkTarget}
                    cpkThresholds={cpkThresholds}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* Bottom row: Single Boxplot chart */}
          <div className="col-span-full min-h-0 bg-slate-800/50 rounded-lg overflow-hidden">
            <div className="h-full p-2">
              <div className="flex items-center justify-between mb-1 px-2">
                <h3 className="text-xs font-medium text-slate-400">
                  Worst 15 Measures (Click to Analyze)
                </h3>
                <button
                  onClick={() => setFocusedChart('boxplot')}
                  className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Maximize Chart"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
              <div className="h-[calc(100%-1.5rem)]">
                <ErrorBoundary componentName="PerformanceBoxplot">
                  <PerformanceBoxplot onChannelClick={handleBoxplotClick} maxDisplayed={15} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;
