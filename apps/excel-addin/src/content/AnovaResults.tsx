/**
 * ANOVA Results Component for Excel Add-in Content Dashboard
 *
 * Displays one-way ANOVA results below the charts.
 * Shows group means, F-statistic, p-value, effect size, and plain-language insight.
 */

import React, { useMemo } from 'react';
import type { AnovaResult } from '@variscout/core';
import { useContentTheme, type ThemeTokens } from './ThemeContext';

interface AnovaResultsProps {
  result: AnovaResult | null;
  factorLabel: string;
}

/**
 * Format p-value for display
 */
const formatPValue = (p: number): string => {
  if (p < 0.001) return '< 0.001';
  if (p < 0.01) return p.toFixed(3);
  return p.toFixed(2);
};

/**
 * Get effect size interpretation based on eta-squared
 */
const getEffectSizeLabel = (eta: number): string => {
  if (eta >= 0.14) return 'large';
  if (eta >= 0.06) return 'medium';
  return 'small';
};

/**
 * Create styles object based on theme tokens
 */
const createStyles = (theme: ThemeTokens): Record<string, React.CSSProperties> => ({
  container: {
    backgroundColor: theme.colorNeutralBackground2,
    border: `1px solid ${theme.colorNeutralStroke1}`,
    borderRadius: theme.borderRadiusM,
    padding: theme.spacingM,
    marginTop: theme.spacingM,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacingS,
  },
  title: {
    fontSize: theme.fontSizeCaption,
    fontWeight: theme.fontWeightSemibold,
    color: theme.colorNeutralForeground2,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeSignificant: {
    fontSize: theme.fontSizeCaption,
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: theme.borderRadiusS,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: theme.colorStatusSuccessForeground,
  },
  badgeNot: {
    fontSize: theme.fontSizeCaption,
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: theme.borderRadiusS,
    backgroundColor: theme.colorNeutralBackground3,
    color: theme.colorNeutralForeground2,
  },
  groupsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${theme.spacingXS}px ${theme.spacingM}px`,
    marginBottom: theme.spacingS,
    fontSize: theme.fontSizeSmall,
  },
  group: {
    color: theme.colorNeutralForeground1,
  },
  groupName: {
    color: theme.colorNeutralForeground2,
  },
  groupMean: {
    fontFamily: 'monospace',
  },
  groupN: {
    color: theme.colorNeutralForeground3,
    marginLeft: 4,
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacingM,
    fontSize: theme.fontSizeBody,
    color: theme.colorNeutralForeground2,
  },
  yesText: {
    color: theme.colorStatusSuccessForeground,
    fontWeight: theme.fontWeightSemibold,
  },
  noText: {
    color: theme.colorNeutralForeground1,
  },
  statsDetail: {
    color: theme.colorNeutralForeground3,
  },
  effectSize: {
    fontSize: theme.fontSizeSmall,
    color: theme.colorNeutralForeground3,
  },
  insight: {
    marginTop: theme.spacingS,
    fontSize: theme.fontSizeBody,
    color: theme.colorBrandForeground1,
    fontWeight: 500,
  },
});

const AnovaResults: React.FC<AnovaResultsProps> = ({ result, factorLabel }) => {
  const { theme } = useContentTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!result) return null;

  const { groups, pValue, isSignificant, insight, etaSquared, fStatistic } = result;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>ANOVA: {factorLabel}</span>
        <span style={isSignificant ? styles.badgeSignificant : styles.badgeNot}>
          {isSignificant ? 'Significant' : 'Not Significant'}
        </span>
      </div>

      {/* Group means and sample sizes */}
      <div style={styles.groupsRow}>
        {groups.map(group => (
          <span key={group.name} style={styles.group}>
            <span style={styles.groupName}>{group.name}:</span>{' '}
            <span style={styles.groupMean}>{group.mean.toFixed(1)}</span>
            <span style={styles.groupN}> (n={group.n})</span>
          </span>
        ))}
      </div>

      {/* Significance result with F-statistic and p-value */}
      <div style={styles.statsRow}>
        <span>
          Different?{' '}
          <span style={isSignificant ? styles.yesText : styles.noText}>
            {isSignificant ? 'YES' : 'NO'}
          </span>
          <span style={styles.statsDetail}>
            {' '}
            (F = {fStatistic.toFixed(2)}, p = {formatPValue(pValue)})
          </span>
        </span>
        {etaSquared > 0 && (
          <span style={styles.effectSize}>
            η² = {etaSquared.toFixed(2)} ({getEffectSizeLabel(etaSquared)} effect)
          </span>
        )}
      </div>

      {/* Plain-language insight when significant */}
      {isSignificant && insight && <div style={styles.insight}>{insight}</div>}
    </div>
  );
};

export default AnovaResults;
