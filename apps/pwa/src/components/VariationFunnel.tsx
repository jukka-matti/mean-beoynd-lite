import React, { useMemo, useState, useCallback } from 'react';
import {
  findOptimalFactors,
  type OptimalFactorResult,
  getVariationImpactLevel,
  VARIATION_THRESHOLDS,
} from '@variscout/core';
import { Filter, Target, ChevronRight, ExternalLink, X } from 'lucide-react';

interface VariationFunnelProps {
  /** Raw data for variation analysis */
  data: any[];
  /** Available factor columns */
  factors: string[];
  /** Outcome column name */
  outcome: string;
  /** Column aliases for display */
  columnAliases?: Record<string, string>;
  /** Target percentage to explain (default: 70) */
  targetPct?: number;
  /** Called when user applies selected filters */
  onApplyFilters?: (filters: Record<string, (string | number)[]>) => void;
  /** Called when user clicks a factor to drill into it */
  onDrillFactor?: (factor: string, value: string | number) => void;
  /** Called when user wants to open in popout window */
  onOpenPopout?: () => void;
  /** Called when user closes the panel */
  onClose?: () => void;
  /** Whether this is rendered in a popout window */
  isPopout?: boolean;
}

/**
 * Get color for factor bar based on its contribution
 */
function getFactorBarColor(variationPct: number): string {
  const level = getVariationImpactLevel(variationPct);
  switch (level) {
    case 'high':
      return 'bg-green-500';
    case 'moderate':
      return 'bg-amber-500';
    case 'low':
    default:
      return 'bg-blue-500';
  }
}

/**
 * Get text color for factor based on its contribution
 */
function getFactorTextColor(variationPct: number): string {
  const level = getVariationImpactLevel(variationPct);
  switch (level) {
    case 'high':
      return 'text-green-400';
    case 'moderate':
      return 'text-amber-400';
    case 'low':
    default:
      return 'text-blue-400';
  }
}

/**
 * Variation Funnel Panel
 *
 * Helps users identify the optimal 1-3 filter settings that explain ~70% of variation.
 * Shows a ranked list of factors by η² with visual bars and cumulative tracking.
 *
 * Features:
 * - Ranked factors sorted by η² (highest first)
 * - Cumulative tracking showing product of η² as factors are added
 * - 70% target line indicator
 * - Click to select factors
 * - Apply button to set selected filters in main view
 */
const VariationFunnel: React.FC<VariationFunnelProps> = ({
  data,
  factors,
  outcome,
  columnAliases = {},
  targetPct = 70,
  onApplyFilters,
  onDrillFactor,
  onOpenPopout,
  onClose,
  isPopout = false,
}) => {
  // Calculate optimal factors
  const optimalFactors = useMemo(() => {
    return findOptimalFactors(data, factors, outcome, targetPct, 5);
  }, [data, factors, outcome, targetPct]);

  // Track selected factors
  const [selectedFactors, setSelectedFactors] = useState<Set<string>>(() => {
    // Auto-select optimal factors by default
    return new Set(optimalFactors.map(f => f.factor));
  });

  // Calculate cumulative for selected factors only
  const selectedStats = useMemo(() => {
    const selected = optimalFactors.filter(f => selectedFactors.has(f.factor));
    let cumulativeRemaining = 100;

    const withCumulative = selected.map(f => {
      const contribution = (cumulativeRemaining * f.variationPct) / 100;
      cumulativeRemaining = cumulativeRemaining - contribution;
      return {
        ...f,
        selectedCumulativePct: 100 - cumulativeRemaining,
      };
    });

    return {
      factors: withCumulative,
      totalExplained: 100 - cumulativeRemaining,
    };
  }, [optimalFactors, selectedFactors]);

  // Toggle factor selection
  const handleToggleFactor = useCallback((factor: string) => {
    setSelectedFactors(prev => {
      const next = new Set(prev);
      if (next.has(factor)) {
        next.delete(factor);
      } else {
        next.add(factor);
      }
      return next;
    });
  }, []);

  // Apply selected filters
  const handleApplyFilters = useCallback(() => {
    if (!onApplyFilters) return;

    const filters: Record<string, (string | number)[]> = {};
    for (const f of optimalFactors) {
      if (selectedFactors.has(f.factor) && f.bestValue !== undefined) {
        filters[f.factor] = [f.bestValue];
      }
    }
    onApplyFilters(filters);
  }, [optimalFactors, selectedFactors, onApplyFilters]);

  // Handle direct drill on factor
  const handleDrillFactor = useCallback(
    (factor: string, value: string | number | undefined) => {
      if (onDrillFactor && value !== undefined) {
        onDrillFactor(factor, value);
      }
    },
    [onDrillFactor]
  );

  // Get display name for factor
  const getFactorName = (factor: string) => columnAliases[factor] || factor;

  // Check if we've reached the target
  const meetsTarget = selectedStats.totalExplained >= targetPct;

  if (optimalFactors.length === 0) {
    return (
      <div className="flex flex-col h-full bg-surface-secondary">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Variation Funnel</h2>
          </div>
          <div className="flex items-center gap-1">
            {!isPopout && onOpenPopout && (
              <button
                onClick={onOpenPopout}
                className="p-1.5 text-content-muted hover:text-white hover:bg-surface-tertiary rounded transition-colors"
                title="Open in new window"
              >
                <ExternalLink size={14} />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-content-muted hover:text-white hover:bg-surface-tertiary rounded transition-colors"
                title="Close"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-content-secondary text-sm text-center">
            No variation data available.
            <br />
            Load data with categorical factors to analyze.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Variation Funnel</h2>
        </div>
        <div className="flex items-center gap-1">
          {!isPopout && onOpenPopout && (
            <button
              onClick={onOpenPopout}
              className="p-1.5 text-content-muted hover:text-white hover:bg-surface-tertiary rounded transition-colors"
              title="Open in new window"
            >
              <ExternalLink size={14} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-content-muted hover:text-white hover:bg-surface-tertiary rounded transition-colors"
              title="Close"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Total variation baseline */}
        <div className="mb-4">
          <div className="text-xs text-content-secondary mb-1">Total Variation (100%)</div>
          <div className="h-3 w-full bg-surface-tertiary rounded-full" />
        </div>

        {/* Factor list */}
        <div className="space-y-3">
          {optimalFactors.map((factor, index) => {
            const isSelected = selectedFactors.has(factor.factor);
            const barColor = getFactorBarColor(factor.variationPct);
            const textColor = getFactorTextColor(factor.variationPct);

            return (
              <div
                key={factor.factor}
                className={`
                  p-3 rounded-lg border transition-all cursor-pointer
                  ${
                    isSelected
                      ? 'bg-surface-tertiary/50 border-blue-500/50'
                      : 'bg-surface/50 border-edge hover:border-edge-secondary'
                  }
                `}
                onClick={() => handleToggleFactor(factor.factor)}
              >
                {/* Factor header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* Checkbox */}
                    <div
                      className={`
                        w-4 h-4 rounded border flex items-center justify-center
                        ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-content-muted'}
                      `}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Factor name */}
                    <span className="text-sm font-medium text-white">
                      {getFactorName(factor.factor)}
                    </span>
                  </div>

                  {/* Variation percentage */}
                  <span className={`text-sm font-mono ${textColor}`}>
                    {Math.round(factor.variationPct)}%
                  </span>
                </div>

                {/* Bar */}
                <div className="h-2 w-full bg-surface-tertiary/50 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-300`}
                    style={{ width: `${factor.variationPct}%` }}
                  />
                </div>

                {/* Best value suggestion */}
                {factor.bestValue !== undefined && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-content-muted">
                      Highest impact:{' '}
                      <span className="text-content">{String(factor.bestValue)}</span>
                    </span>
                    {onDrillFactor && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDrillFactor(factor.factor, factor.bestValue);
                        }}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Drill <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Target line indicator */}
        <div className="my-4 flex items-center gap-2">
          <div className="flex-1 border-t border-dashed border-amber-500/50" />
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Target size={12} />
            <span>{targetPct}% Target</span>
          </div>
          <div className="flex-1 border-t border-dashed border-amber-500/50" />
        </div>

        {/* Cumulative summary */}
        <div
          className={`
            p-3 rounded-lg border
            ${meetsTarget ? 'bg-green-500/10 border-green-500/30' : 'bg-surface/50 border-edge'}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-content-secondary">Combined Explained</span>
            <span
              className={`text-sm font-mono font-semibold ${meetsTarget ? 'text-green-400' : 'text-content'}`}
            >
              {Math.round(selectedStats.totalExplained)}%
            </span>
          </div>

          {/* Summary bar */}
          <div className="h-3 w-full bg-surface-tertiary/50 rounded-full overflow-hidden relative">
            {/* Target marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-500/50 z-10"
              style={{ left: `${targetPct}%` }}
            />
            {/* Fill */}
            <div
              className={`h-full ${meetsTarget ? 'bg-green-500' : 'bg-blue-500'} rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(selectedStats.totalExplained, 100)}%` }}
            />
          </div>

          <p className="text-xs text-content-muted mt-2">
            {selectedFactors.size === 0
              ? 'Select factors above to calculate combined variation'
              : meetsTarget
                ? `These ${selectedFactors.size} factor${selectedFactors.size > 1 ? 's' : ''} explain ${Math.round(selectedStats.totalExplained)}% of your variation`
                : `Need ${Math.round(targetPct - selectedStats.totalExplained)}% more to reach target`}
          </p>
        </div>
      </div>

      {/* Footer with Apply button */}
      {onApplyFilters && selectedFactors.size > 0 && (
        <div className="px-4 py-3 border-t border-edge">
          <button
            onClick={handleApplyFilters}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Filter size={14} />
            Apply {selectedFactors.size} Filter{selectedFactors.size > 1 ? 's' : ''}
          </button>
          <p className="text-xs text-content-muted text-center mt-2">
            Filters to highest-impact values for selected factors
          </p>
        </div>
      )}
    </div>
  );
};

export default VariationFunnel;
