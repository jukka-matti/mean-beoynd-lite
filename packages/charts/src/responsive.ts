/**
 * Responsive utilities for @variscout/charts
 *
 * NOTE: These utilities have been moved to @variscout/core/responsive.
 * This file re-exports them for backward compatibility.
 * For new code, import directly from '@variscout/core' or '@variscout/core/responsive'.
 */

// Re-export everything from core
export {
  getResponsiveMargins,
  getResponsiveFonts,
  getScaledFonts,
  getResponsiveTickCount,
  getBreakpoints,
  type ChartMargins,
  type ChartFonts,
  type ChartType,
  type Breakpoints,
} from '@variscout/core';
