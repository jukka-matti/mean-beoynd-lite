/**
 * Hooks barrel export for Azure app
 */

// Filter Navigation
export {
  useFilterNavigation,
  type UseFilterNavigationOptions,
  type UseFilterNavigationReturn,
} from './useFilterNavigation';

export { useChartScale } from './useChartScale';
export { useDataIngestion } from './useDataIngestion';

// Re-exported directly from @variscout/hooks (no Azure wrapper needed)
export {
  useVariationTracking,
  type VariationTrackingResult,
  type FilterChipData,
  useResponsiveChartMargins,
  useResponsiveChartFonts,
  useResponsiveTickCount,
  useResponsiveBreakpoints,
  type ChartMargins,
  type ChartFonts,
  type ChartType,
} from '@variscout/hooks';
