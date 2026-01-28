import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ChevronRight, ChevronDown, RotateCcw, Beaker, Target, XCircle, Star } from 'lucide-react';
import { simulateDirectAdjustment } from '@variscout/core';
import Slider from './ui/Slider';

/**
 * Preset scenario for quick what-if analysis
 */
export interface SimulatorPreset {
  /** Button label */
  label: string;
  /** Short description shown on hover */
  description: string;
  /** Mean shift to apply */
  meanShift: number;
  /** Variation reduction (0-0.5) to apply */
  variationReduction: number;
  /** Icon name (optional) */
  icon?: 'target' | 'x-circle' | 'star';
}

/**
 * Imperative handle for controlling the simulator from parent
 */
export interface WhatIfSimulatorHandle {
  /** Apply a preset scenario */
  applyPreset: (preset: SimulatorPreset) => void;
  /** Expand the simulator panel */
  expand: () => void;
}

interface WhatIfSimulatorProps {
  /** Current process statistics */
  currentStats: { mean: number; stdDev: number; cpk?: number };
  /** Specification limits for capability calculations */
  specs?: { usl?: number; lsl?: number; target?: number };
  /** Whether the simulator should be expanded by default */
  defaultExpanded?: boolean;
  /** Optional presets for quick scenario buttons */
  presets?: SimulatorPreset[];
  /** Controlled expansion state (optional - if provided, component is controlled) */
  isExpanded?: boolean;
  /** Callback when expansion state changes */
  onExpandChange?: (expanded: boolean) => void;
  /** Initial preset to apply on mount */
  initialPreset?: SimulatorPreset | null;
}

/**
 * Get Cpk color based on value thresholds (Azure palette)
 */
function getCpkColor(cpk: number): string {
  if (cpk >= 1.33) return 'text-green-500';
  if (cpk >= 1.0) return 'text-amber-500';
  return 'text-red-400';
}

/**
 * Format number for display with appropriate precision
 */
function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Render preset icon based on type
 */
function PresetIcon({ icon }: { icon?: SimulatorPreset['icon'] }) {
  switch (icon) {
    case 'target':
      return <Target size={12} />;
    case 'x-circle':
      return <XCircle size={12} />;
    case 'star':
      return <Star size={12} />;
    default:
      return null;
  }
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
const WhatIfSimulator = forwardRef<WhatIfSimulatorHandle, WhatIfSimulatorProps>(
  (
    {
      currentStats,
      specs,
      defaultExpanded = false,
      presets,
      isExpanded: controlledExpanded,
      onExpandChange,
      initialPreset,
    },
    ref
  ) => {
    // Panel expansion state (uncontrolled by default, controlled if isExpanded prop provided)
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

    // Use controlled or uncontrolled expansion
    const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
    const setIsExpanded = useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        const newValue = typeof value === 'function' ? value(isExpanded) : value;
        if (controlledExpanded !== undefined) {
          onExpandChange?.(newValue);
        } else {
          setInternalExpanded(newValue);
        }
      },
      [controlledExpanded, isExpanded, onExpandChange]
    );

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

    // Apply preset handler
    const handleApplyPreset = useCallback((preset: SimulatorPreset) => {
      setMeanShift(preset.meanShift);
      setVariationReduction(preset.variationReduction);
    }, []);

    // Apply initial preset when provided
    useEffect(() => {
      if (initialPreset) {
        setMeanShift(initialPreset.meanShift);
        setVariationReduction(initialPreset.variationReduction);
      }
    }, [initialPreset]);

    // Expose imperative handle for parent control
    useImperativeHandle(
      ref,
      () => ({
        applyPreset: (preset: SimulatorPreset) => {
          setMeanShift(preset.meanShift);
          setVariationReduction(preset.variationReduction);
        },
        expand: () => {
          setIsExpanded(true);
        },
      }),
      [setIsExpanded]
    );

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
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden">
        {/* Collapsible header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown size={14} className="text-slate-500" />
            ) : (
              <ChevronRight size={14} className="text-slate-500" />
            )}
            <Beaker size={14} className="text-blue-400" />
            <span className="text-sm font-medium text-white">What-If Simulator</span>
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

            {/* Preset buttons */}
            {presets && presets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleApplyPreset(preset)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-slate-700
                           bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                    title={preset.description}
                  >
                    <PresetIcon icon={preset.icon} />
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Projection results panel */}
            <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Current → Projected</span>
                {hasAdjustment && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-white transition-colors"
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
                  <span className="text-slate-400">Mean:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{formatNumber(currentStats.mean, 1)}</span>
                    <span className="text-slate-500">→</span>
                    <span
                      className={hasAdjustment && meanShift !== 0 ? 'text-white' : 'text-slate-500'}
                    >
                      {formatNumber(projection.projectedMean, 1)}
                    </span>
                  </div>
                </div>

                {/* Standard Deviation */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">σ:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{formatNumber(currentStats.stdDev, 2)}</span>
                    <span className="text-slate-500">→</span>
                    <span
                      className={
                        hasAdjustment && variationReduction !== 0 ? 'text-white' : 'text-slate-500'
                      }
                    >
                      {formatNumber(projection.projectedStdDev, 2)}
                    </span>
                    {variationReduction > 0 && (
                      <span className="text-green-500">
                        (-{Math.round(variationReduction * 100)}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Cpk (only if specs available) */}
                {currentStats.cpk !== undefined && projection.projectedCpk !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cpk:</span>
                    <div className="flex items-center gap-2">
                      <span className={getCpkColor(currentStats.cpk)}>
                        {formatNumber(currentStats.cpk, 2)}
                      </span>
                      <span className="text-slate-500">→</span>
                      <span className={getCpkColor(projection.projectedCpk)}>
                        {formatNumber(projection.projectedCpk, 2)}
                      </span>
                      {projection.improvements.cpkImprovementPct !== undefined && hasAdjustment && (
                        <span
                          className={
                            projection.improvements.cpkImprovementPct >= 0
                              ? 'text-green-500'
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
                    <span className="text-slate-400">Yield:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{formatNumber(currentYield, 1)}%</span>
                      <span className="text-slate-500">→</span>
                      <span className={hasAdjustment ? 'text-white' : 'text-slate-500'}>
                        {formatNumber(projection.projectedYield, 1)}%
                      </span>
                      {projection.improvements.yieldImprovementPct !== undefined &&
                        hasAdjustment &&
                        Math.abs(projection.improvements.yieldImprovementPct) >= 0.1 && (
                          <span
                            className={
                              projection.improvements.yieldImprovementPct >= 0
                                ? 'text-green-500'
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
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Explore process improvement by adjusting mean (shift toward target) and reducing
              variation (tighter control). Projections assume normal distribution.
            </p>
          </div>
        )}
      </div>
    );
  }
);

WhatIfSimulator.displayName = 'WhatIfSimulator';

export default WhatIfSimulator;
