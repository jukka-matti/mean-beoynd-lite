/**
 * Accessibility utilities for chart interactive elements
 *
 * Provides helper functions to add proper ARIA attributes and keyboard
 * support to SVG chart elements.
 */

import type { KeyboardEvent } from 'react';

/**
 * Props returned by getInteractiveA11yProps for SVG elements
 */
export interface InteractiveA11yProps {
  role?: 'button';
  'aria-label'?: string;
  tabIndex?: number;
  onKeyDown?: (event: KeyboardEvent) => void;
}

/**
 * Generate accessibility props for interactive SVG elements
 *
 * When an onClick handler is provided, this returns:
 * - role="button" - identifies the element as clickable
 * - aria-label - descriptive label for screen readers
 * - tabIndex={0} - makes element focusable via keyboard
 * - onKeyDown - handles Enter and Space key presses
 *
 * @param label - Descriptive label for screen readers (e.g., "Select Machine A")
 * @param onClick - Click handler (if undefined, returns empty object)
 * @returns Object with accessibility props to spread onto the element
 *
 * @example
 * <Bar
 *   onClick={() => onBarClick?.(d.key)}
 *   {...getInteractiveA11yProps(`Select ${d.key}`, onBarClick ? () => onBarClick(d.key) : undefined)}
 * />
 */
export function getInteractiveA11yProps(label: string, onClick?: () => void): InteractiveA11yProps {
  if (!onClick) return {};

  return {
    role: 'button',
    'aria-label': label,
    tabIndex: 0,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    },
  };
}

/**
 * Generate accessibility props for data points with additional context
 *
 * @param label - Base label (e.g., "Data point")
 * @param value - The value to include in the label
 * @param index - The index of the point
 * @param onClick - Click handler
 * @returns Object with accessibility props
 *
 * @example
 * <Circle
 *   {...getDataPointA11yProps('Measurement', d.y, i, onPointClick ? () => onPointClick(i) : undefined)}
 * />
 */
export function getDataPointA11yProps(
  label: string,
  value: number,
  index: number,
  onClick?: () => void
): InteractiveA11yProps {
  const fullLabel = `${label} ${index + 1}: ${value.toFixed(2)}`;
  return getInteractiveA11yProps(fullLabel, onClick);
}

/**
 * Generate accessibility props for chart bars
 *
 * @param key - The category/group key
 * @param value - The bar value
 * @param onClick - Click handler
 * @returns Object with accessibility props
 *
 * @example
 * <Bar
 *   {...getBarA11yProps(d.key, d.value, onBarClick ? () => onBarClick(d.key) : undefined)}
 * />
 */
export function getBarA11yProps(
  key: string,
  value: number,
  onClick?: () => void
): InteractiveA11yProps {
  const label = onClick ? `Select ${key} (${value})` : `${key}: ${value}`;
  return getInteractiveA11yProps(label, onClick);
}

/**
 * Generate accessibility props for boxplot groups
 *
 * @param key - The group key
 * @param median - The median value
 * @param n - Sample size
 * @param onClick - Click handler
 * @returns Object with accessibility props
 *
 * @example
 * <Group
 *   {...getBoxplotA11yProps(d.key, d.median, d.values.length, onBoxClick ? () => onBoxClick(d.key) : undefined)}
 * />
 */
export function getBoxplotA11yProps(
  key: string,
  median: number,
  n: number,
  onClick?: () => void
): InteractiveA11yProps {
  const label = onClick
    ? `Select ${key} (median: ${median.toFixed(2)}, n=${n})`
    : `${key}: median ${median.toFixed(2)}, n=${n}`;
  return getInteractiveA11yProps(label, onClick);
}

/**
 * Generate accessibility props for scatter plot points
 *
 * @param x - X-axis value
 * @param y - Y-axis value
 * @param index - Point index
 * @param onClick - Click handler
 * @returns Object with accessibility props
 */
export function getScatterPointA11yProps(
  x: number,
  y: number,
  index: number,
  onClick?: () => void
): InteractiveA11yProps {
  const label = onClick
    ? `Select point ${index + 1} (x: ${x.toFixed(2)}, y: ${y.toFixed(2)})`
    : `Point ${index + 1}: x=${x.toFixed(2)}, y=${y.toFixed(2)}`;
  return getInteractiveA11yProps(label, onClick);
}
