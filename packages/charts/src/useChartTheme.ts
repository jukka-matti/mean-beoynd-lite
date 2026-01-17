import { useState, useEffect, useMemo } from 'react';
import { getChromeColors, getDocumentTheme, type ChromeColorValues } from './colors';

export interface ChartThemeColors {
  /** Whether dark theme is active */
  isDark: boolean;
  /** Chrome colors for current theme */
  chrome: ChromeColorValues;
  /** Font scale multiplier (from data-chart-scale attribute) */
  fontScale: number;
}

/**
 * Get the current chart font scale from document attribute
 */
function getDocumentFontScale(): number {
  if (typeof document === 'undefined') return 1;
  const scale = document.documentElement.getAttribute('data-chart-scale');
  if (!scale) return 1;
  const parsed = parseFloat(scale);
  return isNaN(parsed) ? 1 : parsed;
}

/**
 * Hook to get theme-aware chart colors
 * Automatically updates when theme changes
 */
export function useChartTheme(): ChartThemeColors {
  const [theme, setTheme] = useState<'light' | 'dark'>(getDocumentTheme);
  const [fontScale, setFontScale] = useState<number>(getDocumentFontScale);

  useEffect(() => {
    // Check initial values
    setTheme(getDocumentTheme());
    setFontScale(getDocumentFontScale());

    // Watch for theme and font scale changes
    const observer = new MutationObserver(() => {
      setTheme(getDocumentTheme());
      setFontScale(getDocumentFontScale());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-chart-scale'],
    });

    return () => observer.disconnect();
  }, []);

  const colors = useMemo(
    () => ({
      isDark: theme === 'dark',
      chrome: getChromeColors(theme === 'dark'),
      fontScale,
    }),
    [theme, fontScale]
  );

  return colors;
}
