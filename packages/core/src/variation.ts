/**
 * Variation tracking calculations for drill-down analysis
 *
 * Provides pure, framework-agnostic functions for calculating:
 * - Cumulative variation through drill paths (multiplicative η²)
 * - Factor variations for drill suggestions
 *
 * Used by:
 * - PWA: Full breadcrumb experience with useVariationTracking hook
 * - Excel Add-in: Variation % indicator on boxplot
 * - Azure: Future full breadcrumb experience
 */

import { getEtaSquared } from './stats';
import { VARIATION_THRESHOLDS, getVariationImpactLevel, getVariationInsight } from './navigation';

/**
 * Result of drill variation calculation
 */
export interface DrillVariationResult {
  /**
   * Array of variation data for each drill level
   * Index 0 is root (100%), subsequent indices match filter order
   */
  levels: DrillLevelVariation[];

  /**
   * Final cumulative variation percentage (product of all η²)
   * This is the total % of original variation isolated to current path
   */
  cumulativeVariationPct: number;

  /**
   * Impact level based on cumulative variation
   */
  impactLevel: 'high' | 'moderate' | 'low';

  /**
   * Insight text for the current cumulative variation
   */
  insightText: string;
}

/**
 * Variation data for a single drill level
 */
export interface DrillLevelVariation {
  /** Factor name (null for root level) */
  factor: string | null;

  /** Filter values at this level (null for root) */
  values: (string | number)[] | null;

  /** Local η² at this level (100 for root) */
  localVariationPct: number;

  /** Cumulative η² up to and including this level */
  cumulativeVariationPct: number;
}

/**
 * Calculate cumulative variation percentages through a drill path
 *
 * At each drill level, calculates:
 * 1. Local η² - how much variation the factor explains at that level
 * 2. Cumulative η² - product of all local η² values
 *
 * This enables the "variation funnel" insight: drilling 3 levels deep
 * to isolate e.g. 46% of total variation into one specific condition.
 *
 * @param rawData - Original unfiltered data
 * @param filters - Current filters as Record<factor, values[]>
 * @param outcome - The outcome column name
 * @returns Drill variation result with levels, cumulative %, and insights
 *
 * @example
 * const result = calculateDrillVariation(data, { Shift: ['Night'], Machine: ['C'] }, 'Weight');
 * // result.cumulativeVariationPct = 46.5
 * // result.insightText = "Fix this combination to address more than half..."
 */
export function calculateDrillVariation(
  rawData: any[],
  filters: Record<string, (string | number)[]>,
  outcome: string
): DrillVariationResult | null {
  if (!outcome || rawData.length < 2) {
    return null;
  }

  const levels: DrillLevelVariation[] = [
    {
      factor: null,
      values: null,
      localVariationPct: 100,
      cumulativeVariationPct: 100,
    },
  ];

  let cumulativePct = 100;
  let currentData = rawData;

  // Get ordered filter entries
  const filterEntries = Object.entries(filters).filter(
    ([_, values]) => values && values.length > 0
  );

  // Process each filter level
  for (const [factor, values] of filterEntries) {
    // Calculate local η² for this factor on the current data
    const etaSquared = getEtaSquared(currentData, factor, outcome);
    const localPct = etaSquared * 100;

    // Update cumulative (multiply, not add)
    cumulativePct = (cumulativePct * localPct) / 100;

    levels.push({
      factor,
      values,
      localVariationPct: localPct,
      cumulativeVariationPct: cumulativePct,
    });

    // Filter data for next level
    currentData = currentData.filter(row => values.includes(row[factor]));

    if (currentData.length < 2) {
      break;
    }
  }

  const impactLevel = getVariationImpactLevel(cumulativePct);
  const insightText = getVariationInsight(cumulativePct);

  return {
    levels,
    cumulativeVariationPct: cumulativePct,
    impactLevel,
    insightText,
  };
}

/**
 * Calculate eta-squared for each factor on current filtered data
 *
 * Used for drill suggestions - factors with >50% variation should be
 * highlighted in charts as recommended drill targets.
 *
 * @param data - Current (possibly filtered) data
 * @param factors - Available factor columns to analyze
 * @param outcome - The outcome column name
 * @param excludeFactors - Factors to exclude (e.g., already filtered)
 * @returns Map of factor name to variation percentage (0-100)
 *
 * @example
 * const variations = calculateFactorVariations(filteredData, ['Shift', 'Machine', 'Operator'], 'Weight', ['Shift']);
 * // variations.get('Machine') = 67.5 -> highlight Machine in boxplot
 */
export function calculateFactorVariations(
  data: any[],
  factors: string[],
  outcome: string,
  excludeFactors: string[] = []
): Map<string, number> {
  const variations = new Map<string, number>();

  if (!outcome || data.length < 2) {
    return variations;
  }

  const excludeSet = new Set(excludeFactors);

  for (const factor of factors) {
    // Skip excluded factors
    if (excludeSet.has(factor)) continue;

    const etaSquared = getEtaSquared(data, factor, outcome);
    if (etaSquared > 0) {
      variations.set(factor, etaSquared * 100);
    }
  }

  return variations;
}

/**
 * Check if a factor should be highlighted as a drill target
 *
 * @param variationPct - The variation percentage for the factor
 * @returns true if variation is above HIGH_IMPACT threshold (50%)
 */
export function shouldHighlightDrill(variationPct: number): boolean {
  return variationPct >= VARIATION_THRESHOLDS.HIGH_IMPACT;
}

/**
 * Filter data by a set of filters
 * Utility function for applying drill filters to raw data
 *
 * @param data - Raw data array
 * @param filters - Filters as Record<factor, values[]>
 * @returns Filtered data array
 */
export function applyFilters(data: any[], filters: Record<string, (string | number)[]>): any[] {
  return data.filter(row => {
    return Object.entries(filters).every(([col, values]) => {
      if (!values || values.length === 0) return true;
      return values.includes(row[col]);
    });
  });
}

/**
 * Default minimum threshold for auto-switch (5%)
 * Factors with variation below this won't be suggested as next drill targets
 */
export const DRILL_SWITCH_THRESHOLD = 5;

/**
 * Get the next recommended factor for drill-down based on eta-squared
 *
 * After drilling into a factor (e.g., filtering to Machine A), this function
 * finds the remaining factor with highest variation in the filtered data.
 * This guides users through a "variation funnel" by automatically suggesting
 * the next most impactful analysis direction.
 *
 * @param factorVariations - Map of factor name to variation percentage (0-100)
 * @param currentFactor - The factor that was just drilled (will be excluded)
 * @param minThreshold - Minimum variation % to recommend (default: 5)
 * @returns The factor with highest variation above threshold, or null if none qualify
 *
 * @example
 * // After drilling into Machine A, find next best factor to show
 * const variations = new Map([['Shift', 67], ['Operator', 23], ['Machine', 45]]);
 * const next = getNextDrillFactor(variations, 'Machine'); // Returns 'Shift'
 *
 * @example
 * // When all remaining factors have low variation
 * const variations = new Map([['Shift', 3], ['Operator', 2]]);
 * const next = getNextDrillFactor(variations, 'Machine'); // Returns null
 */
export function getNextDrillFactor(
  factorVariations: Map<string, number>,
  currentFactor: string,
  minThreshold: number = DRILL_SWITCH_THRESHOLD
): string | null {
  let bestFactor: string | null = null;
  let bestVariation = minThreshold;

  for (const [factor, variation] of factorVariations) {
    // Skip the current factor (already drilled)
    if (factor === currentFactor) continue;

    // Find the factor with highest variation above threshold
    if (variation > bestVariation) {
      bestFactor = factor;
      bestVariation = variation;
    }
  }

  return bestFactor;
}
