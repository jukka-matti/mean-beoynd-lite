/**
 * useSelectionState - Shared selection state logic for charts
 *
 * Extracts the common selection pattern used in Boxplot and ParetoChart
 * for determining opacity and selection state of chart elements.
 */

import { useMemo } from 'react';

/** Opacity values for selection states */
export const selectionOpacity = {
  /** Opacity for selected/active items */
  selected: 1,
  /** Opacity for dimmed/unselected items when a selection exists */
  dimmed: 0.3,
} as const;

export interface UseSelectionStateOptions {
  /** Array of currently selected keys */
  selectedKeys: string[];
}

export interface UseSelectionStateReturn {
  /**
   * Check if a specific key is selected
   * @param key - The key to check
   * @returns true if the key is in the selected array
   */
  isSelected: (key: string) => boolean;
  /**
   * Whether any selection exists
   * When true, non-selected items should be dimmed
   */
  hasSelection: boolean;
  /**
   * Get the appropriate opacity for an item based on selection state
   * @param key - The key of the item
   * @returns 1 if selected or no selection exists, 0.3 if not selected but selection exists
   */
  getOpacity: (key: string) => number;
}

/**
 * Hook for managing selection state in charts
 *
 * @example
 * const { isSelected, hasSelection, getOpacity } = useSelectionState({
 *   selectedKeys: selectedBars
 * });
 *
 * {data.map((d) => (
 *   <Bar
 *     fill={isSelected(d.key) ? chartColors.selected : chromeColors.boxDefault}
 *     opacity={getOpacity(d.key)}
 *   />
 * ))}
 */
export function useSelectionState({
  selectedKeys,
}: UseSelectionStateOptions): UseSelectionStateReturn {
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const hasSelection = selectedKeys.length > 0;

  const isSelected = useMemo(() => (key: string) => selectedSet.has(key), [selectedSet]);

  const getOpacity = useMemo(
    () => (key: string) => {
      if (!hasSelection) return selectionOpacity.selected;
      return selectedSet.has(key) ? selectionOpacity.selected : selectionOpacity.dimmed;
    },
    [hasSelection, selectedSet]
  );

  return {
    isSelected,
    hasSelection,
    getOpacity,
  };
}
