/**
 * ANOVA Results Component for Excel Add-in Content Dashboard
 *
 * Displays one-way ANOVA results below the charts.
 * Shows group means, F-statistic, p-value, effect size, and plain-language insight.
 */

import React from 'react';
import type { AnovaResult } from '@variscout/core';
import { darkTheme } from '../lib/darkTheme';

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

const AnovaResults: React.FC<AnovaResultsProps> = ({ result, factorLabel }) => {
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: darkTheme.colorNeutralBackground2,
    border: `1px solid ${darkTheme.colorNeutralStroke1}`,
    borderRadius: darkTheme.borderRadiusM,
    padding: darkTheme.spacingM,
    marginTop: darkTheme.spacingM,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: darkTheme.spacingS,
  },
  title: {
    fontSize: darkTheme.fontSizeCaption,
    fontWeight: darkTheme.fontWeightSemibold,
    color: darkTheme.colorNeutralForeground2,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeSignificant: {
    fontSize: darkTheme.fontSizeCaption,
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: darkTheme.borderRadiusS,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: darkTheme.colorStatusSuccessForeground,
  },
  badgeNot: {
    fontSize: darkTheme.fontSizeCaption,
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: darkTheme.borderRadiusS,
    backgroundColor: darkTheme.colorNeutralBackground3,
    color: darkTheme.colorNeutralForeground2,
  },
  groupsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${darkTheme.spacingXS}px ${darkTheme.spacingM}px`,
    marginBottom: darkTheme.spacingS,
    fontSize: darkTheme.fontSizeSmall,
  },
  group: {
    color: darkTheme.colorNeutralForeground1,
  },
  groupName: {
    color: darkTheme.colorNeutralForeground2,
  },
  groupMean: {
    fontFamily: 'monospace',
  },
  groupN: {
    color: darkTheme.colorNeutralForeground3,
    marginLeft: 4,
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: darkTheme.spacingM,
    fontSize: darkTheme.fontSizeBody,
    color: darkTheme.colorNeutralForeground2,
  },
  yesText: {
    color: darkTheme.colorStatusSuccessForeground,
    fontWeight: darkTheme.fontWeightSemibold,
  },
  noText: {
    color: darkTheme.colorNeutralForeground1,
  },
  statsDetail: {
    color: darkTheme.colorNeutralForeground3,
  },
  effectSize: {
    fontSize: darkTheme.fontSizeSmall,
    color: darkTheme.colorNeutralForeground3,
  },
  insight: {
    marginTop: darkTheme.spacingS,
    fontSize: darkTheme.fontSizeBody,
    color: darkTheme.colorBrandForeground1,
    fontWeight: 500,
  },
};

export default AnovaResults;
