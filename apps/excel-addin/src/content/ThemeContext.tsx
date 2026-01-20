/**
 * ThemeContext for Content Add-in
 *
 * Provides system theme preference to all components in the Content Add-in.
 * Wraps useSystemTheme hook for easy access via useContentTheme().
 */

import React, { createContext, useContext } from 'react';
import { useSystemTheme, type UseSystemThemeResult, type ThemeTokens } from '../lib/useSystemTheme';
import { darkTheme } from '../lib/darkTheme';

/** Context value type */
interface ContentThemeContextValue extends UseSystemThemeResult {}

/** Default context value (dark theme fallback) */
const defaultValue: ContentThemeContextValue = {
  isDark: true,
  theme: darkTheme,
};

const ContentThemeContext = createContext<ContentThemeContextValue>(defaultValue);

/**
 * Provider component that wraps the Content Add-in
 */
export const ContentThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeState = useSystemTheme();

  return <ContentThemeContext.Provider value={themeState}>{children}</ContentThemeContext.Provider>;
};

/**
 * Hook to access theme state from any component
 *
 * @returns { isDark, theme } - Current theme state and tokens
 *
 * @example
 * const { theme, isDark } = useContentTheme();
 * const styles = useMemo(() => ({
 *   container: { backgroundColor: theme.colorNeutralBackground1 }
 * }), [theme]);
 */
export function useContentTheme(): ContentThemeContextValue {
  return useContext(ContentThemeContext);
}

/** Re-export ThemeTokens type for convenience */
export type { ThemeTokens };
