import React from 'react';
import { getVariationImpactLevel, getVariationInsight } from '@variscout/core';

interface VariationBarProps {
  /** Current isolated variation percentage (0-100) */
  isolatedPct: number;
  /** Whether to show labels below the bar (hidden on mobile) */
  showLabels?: boolean;
  /** Custom class name for container */
  className?: string;
}

/**
 * Get color for variation bar based on impact level
 * - Green (>= 50%): High impact - more than half the problem isolated
 * - Amber (30-50%): Moderate impact - significant chunk
 * - Blue (< 30%): Low impact - one of several factors
 */
function getBarColor(impactLevel: 'high' | 'moderate' | 'low'): string {
  switch (impactLevel) {
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
 * Get text color for variation labels based on impact level
 */
function getTextColor(impactLevel: 'high' | 'moderate' | 'low'): string {
  switch (impactLevel) {
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
 * Stacked bar showing isolated vs unexplained variation
 *
 * Design:
 * [||||||||░░░░░░░░░░░░] 30% isolated | 70% unexplained
 *
 * The bar provides visual context for the cumulative variation percentage:
 * - Left segment (colored): isolated variation
 * - Right segment (gray): unexplained/remaining variation
 *
 * Color coding based on impact:
 * - Green (>= 50%): "More than half your problem is HERE"
 * - Amber (30-50%): "Significant chunk isolated"
 * - Blue (< 30%): "One of several contributors"
 */
const VariationBar: React.FC<VariationBarProps> = ({
  isolatedPct,
  showLabels = true,
  className = '',
}) => {
  const impactLevel = getVariationImpactLevel(isolatedPct);
  const barColor = getBarColor(impactLevel);
  const textColor = getTextColor(impactLevel);
  const insightText = getVariationInsight(isolatedPct);
  const unexplainedPct = 100 - isolatedPct;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Bar container */}
      <div className="relative group">
        {/* Background bar */}
        <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
          {/* Isolated segment */}
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-300`}
            style={{ width: `${Math.max(isolatedPct, 1)}%` }}
          />
        </div>

        {/* Tooltip */}
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg
            bg-slate-800 border border-slate-700 shadow-xl
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-all duration-200 z-50
            text-xs pointer-events-none
          "
        >
          <div className={`font-semibold ${textColor} mb-1`}>
            {Math.round(isolatedPct)}% of total variation isolated
          </div>
          <p className="text-slate-300">{insightText}</p>
          <div className="mt-2 pt-2 border-t border-slate-700 text-slate-500">
            {impactLevel === 'high' && 'High impact - strong case for action'}
            {impactLevel === 'moderate' && 'Moderate impact - worth investigating'}
            {impactLevel === 'low' && 'One of several contributing factors'}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-slate-700" />
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between text-[10px] text-slate-500">
          <span className={textColor}>{Math.round(isolatedPct)}% isolated</span>
          <span>{Math.round(unexplainedPct)}% unexplained</span>
        </div>
      )}
    </div>
  );
};

export default VariationBar;
