import React, { useState, useMemo, useCallback } from 'react';
import { ChevronRight, ChevronDown, RotateCcw, Beaker } from 'lucide-react';
import { simulateDirectAdjustment } from '@variscout/core';
import Slider from './ui/Slider';

interface WhatIfSimulatorProps {
  /** Current process statistics */
  currentStats: { mean: number; stdDev: number; cpk?: number };
  /** Specification limits for capability calculations */
  specs?: { usl?: number; lsl?: number; target?: number };
  /** Whether the simulator should be expanded by default */
  defaultExpanded?: boolean;
}

/**
 * Get Cpk color based on value thresholds
 */
function getCpkColor(cpk: number): string {
  if (cpk >= 1.33) return 'text-green-400';
  if (cpk >= 1.0) return 'text-amber-400';
  return 'text-red-400';
}

/**
 * Format number for display with appropriate precision
 */
function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * What-If Simulator Panel
 *
 * Allows users to explore process improvement scenarios by adjusting:
 * 1. Mean shift - Moving the process center toward a target
 * 2. Variation reduction - Reducing process spread
 *
 * Shows projected statistics including Cpk, yield, and PPM with
 * improvement percentages and color-coded capability indicators.
 */
const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentStats,
  specs,
  defaultExpanded = false,
}) => {
  // Panel expansion state
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Slider states
  const [meanShift, setMeanShift] = useState(0);
  const [variationReduction, setVariationReduction] = useState(0);

  // Calculate mean slider range
  const meanRange = useMemo(() => {
    // Determine target for slider range
    let target: number | undefined;

    if (specs?.target !== undefined) {
      target = specs.target;
    } else if (specs?.usl !== undefined && specs?.lsl !== undefined) {
      target = (specs.usl + specs.lsl) / 2;
    }

    // Calculate range based on target or standard deviation
    if (target !== undefined) {
      const distance = target - currentStats.mean;
      // Allow 20% overshoot past target
      const overshoot = Math.abs(distance) * 0.2;

      if (distance >= 0) {
        // Need to shift up toward target
        return {
          min: -currentStats.stdDev * 2,
          max: distance + overshoot,
        };
      } else {
        // Need to shift down toward target
        return {
          min: distance - overshoot,
          max: currentStats.stdDev * 2,
        };
      }
    }

    // Default to +/- 3 sigma
    const range = currentStats.stdDev * 3 || 1;
    return { min: -range, max: range };
  }, [currentStats.mean, currentStats.stdDev, specs]);

  // Calculate mean step (about 20 steps across the range)
  const meanStep = useMemo(() => {
    const range = meanRange.max - meanRange.min;
    const step = range / 20;
    // Round to a nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
    return Math.max(magnitude * Math.round(step / magnitude), 0.01);
  }, [meanRange]);

  // Calculate projection
  const projection = useMemo(() => {
    return simulateDirectAdjustment(currentStats, { meanShift, variationReduction }, specs);
  }, [currentStats, meanShift, variationReduction, specs]);

  // Calculate current yield for display
  const currentYield = useMemo(() => {
    const baseline = simulateDirectAdjustment(
      currentStats,
      { meanShift: 0, variationReduction: 0 },
      specs
    );
    return baseline.projectedYield;
  }, [currentStats, specs]);

  // Reset handler
  const handleReset = useCallback(() => {
    setMeanShift(0);
    setVariationReduction(0);
  }, []);

  // Check if any adjustment is active
  const hasAdjustment = meanShift !== 0 || variationReduction !== 0;

  // Format mean shift for display
  const formatMeanShift = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatNumber(value, 1)}`;
  };

  // Format variation reduction as percentage
  const formatVariationReduction = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <div className="rounded-lg border border-edge bg-surface/50 overflow-hidden">
      {/* Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-surface-tertiary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown size={14} className="text-content-muted" />
          ) : (
            <ChevronRight size={14} className="text-content-muted" />
          )}
          <Beaker size={14} className="text-blue-400" />
          <span className="text-sm font-medium text-content">What-If Simulator</span>
        </div>

        {/* Show indicator when adjustment is active */}
        {hasAdjustment && !isExpanded && <span className="text-xs text-blue-400">Active</span>}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-4">
          {/* Mean adjustment slider */}
          <Slider
            label="Adjust Mean"
            value={meanShift}
            onChange={setMeanShift}
            min={meanRange.min}
            max={meanRange.max}
            step={meanStep}
            formatValue={formatMeanShift}
          />

          {/* Variation reduction slider */}
          <Slider
            label="Reduce Variation"
            value={variationReduction}
            onChange={setVariationReduction}
            min={0}
            max={0.5}
            step={0.05}
            formatValue={formatVariationReduction}
          />

          {/* Projection results panel */}
          <div className="p-3 rounded-lg bg-surface-tertiary/50 border border-edge/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-content-secondary">
                Current → Projected
              </span>
              {hasAdjustment && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[10px] text-content-muted hover:text-content transition-colors"
                  title="Reset adjustments"
                >
                  <RotateCcw size={10} />
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs font-mono">
              {/* Mean */}
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">Mean:</span>
                <div className="flex items-center gap-2">
                  <span className="text-content-muted">{formatNumber(currentStats.mean, 1)}</span>
                  <span className="text-content-muted">→</span>
                  <span
                    className={
                      hasAdjustment && meanShift !== 0 ? 'text-content' : 'text-content-muted'
                    }
                  >
                    {formatNumber(projection.projectedMean, 1)}
                  </span>
                </div>
              </div>

              {/* Standard Deviation */}
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">σ:</span>
                <div className="flex items-center gap-2">
                  <span className="text-content-muted">{formatNumber(currentStats.stdDev, 2)}</span>
                  <span className="text-content-muted">→</span>
                  <span
                    className={
                      hasAdjustment && variationReduction !== 0
                        ? 'text-content'
                        : 'text-content-muted'
                    }
                  >
                    {formatNumber(projection.projectedStdDev, 2)}
                  </span>
                  {variationReduction > 0 && (
                    <span className="text-green-400">
                      (-{Math.round(variationReduction * 100)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Cpk (only if specs available) */}
              {currentStats.cpk !== undefined && projection.projectedCpk !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-content-secondary">Cpk:</span>
                  <div className="flex items-center gap-2">
                    <span className={getCpkColor(currentStats.cpk)}>
                      {formatNumber(currentStats.cpk, 2)}
                    </span>
                    <span className="text-content-muted">→</span>
                    <span className={getCpkColor(projection.projectedCpk)}>
                      {formatNumber(projection.projectedCpk, 2)}
                    </span>
                    {projection.improvements.cpkImprovementPct !== undefined && hasAdjustment && (
                      <span
                        className={
                          projection.improvements.cpkImprovementPct >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        ({projection.improvements.cpkImprovementPct >= 0 ? '+' : ''}
                        {Math.round(projection.improvements.cpkImprovementPct)}%)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Yield (only if specs available) */}
              {currentYield !== undefined && projection.projectedYield !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-content-secondary">Yield:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-content-muted">{formatNumber(currentYield, 1)}%</span>
                    <span className="text-content-muted">→</span>
                    <span className={hasAdjustment ? 'text-content' : 'text-content-muted'}>
                      {formatNumber(projection.projectedYield, 1)}%
                    </span>
                    {projection.improvements.yieldImprovementPct !== undefined &&
                      hasAdjustment &&
                      Math.abs(projection.improvements.yieldImprovementPct) >= 0.1 && (
                        <span
                          className={
                            projection.improvements.yieldImprovementPct >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }
                        >
                          ({projection.improvements.yieldImprovementPct >= 0 ? '+' : ''}
                          {formatNumber(projection.improvements.yieldImprovementPct, 1)}%)
                        </span>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Helper text */}
          <p className="text-[10px] text-content-muted leading-relaxed">
            Explore process improvement by adjusting mean (shift toward target) and reducing
            variation (tighter control). Projections assume normal distribution.
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;
