/**
 * BoxplotStatsTable - Expandable statistics table for Boxplot charts
 *
 * Shows detailed statistics comparison for each group when the chart is expanded.
 * Highlights highest variability groups with indicators.
 */

import React, { useMemo } from 'react';
import type { BoxplotGroupData, SpecLimits } from '../types';
import { useChartTheme } from '../useChartTheme';

export interface BoxplotStatsTableProps {
  /** Boxplot data with values for each group */
  data: BoxplotGroupData[];
  /** Specification limits (optional, for reference) */
  specs?: SpecLimits;
  /** Variation contributions by group (optional) */
  categoryContributions?: Map<string | number, number>;
}

interface GroupStats {
  key: string;
  n: number;
  mean: number;
  median: number;
  stdDev: number;
  iqr: number;
  outliers: number;
  contribution?: number;
}

/**
 * Calculate extended statistics for a boxplot group
 */
function calculateGroupStats(group: BoxplotGroupData, contribution?: number): GroupStats {
  const values = group.values;
  const n = values.length;

  if (n === 0) {
    return {
      key: group.key,
      n: 0,
      mean: 0,
      median: group.median,
      stdDev: 0,
      iqr: 0,
      outliers: 0,
      contribution,
    };
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / n;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1 || 1);
  const stdDev = Math.sqrt(variance);
  const iqr = group.q3 - group.q1;

  return {
    key: group.key,
    n,
    mean,
    median: group.median,
    stdDev,
    iqr,
    outliers: group.outliers.length,
    contribution,
  };
}

/**
 * BoxplotStatsTable Component
 *
 * Displays a statistics comparison table for boxplot groups.
 * Highlights the group with highest variability (StdDev).
 */
export const BoxplotStatsTable: React.FC<BoxplotStatsTableProps> = ({
  data,
  specs: _specs,
  categoryContributions,
}) => {
  const { chrome } = useChartTheme();

  // Calculate stats for each group
  const groupStats = useMemo(() => {
    return data.map(group => calculateGroupStats(group, categoryContributions?.get(group.key)));
  }, [data, categoryContributions]);

  // Find highest values for highlighting
  const maxStdDev = useMemo(() => {
    return Math.max(...groupStats.map(g => g.stdDev));
  }, [groupStats]);

  const hasOutliers = useMemo(() => {
    return groupStats.some(g => g.outliers > 0);
  }, [groupStats]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: '12px',
        borderTop: `1px solid ${chrome.gridLine}`,
        paddingTop: '12px',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '4px 8px',
                borderBottom: `1px solid ${chrome.gridLine}`,
                color: chrome.labelPrimary,
                fontWeight: 600,
              }}
            >
              Group
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '4px 8px',
                borderBottom: `1px solid ${chrome.gridLine}`,
                color: chrome.labelPrimary,
                fontWeight: 600,
              }}
            >
              n
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '4px 8px',
                borderBottom: `1px solid ${chrome.gridLine}`,
                color: chrome.labelPrimary,
                fontWeight: 600,
              }}
            >
              Mean
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '4px 8px',
                borderBottom: `1px solid ${chrome.gridLine}`,
                color: chrome.labelPrimary,
                fontWeight: 600,
              }}
            >
              Median
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '4px 8px',
                borderBottom: `1px solid ${chrome.gridLine}`,
                color: chrome.labelPrimary,
                fontWeight: 600,
              }}
            >
              StdDev
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '4px 8px',
                borderBottom: `1px solid ${chrome.gridLine}`,
                color: chrome.labelPrimary,
                fontWeight: 600,
              }}
            >
              IQR
            </th>
            {hasOutliers && (
              <th
                style={{
                  textAlign: 'right',
                  padding: '4px 8px',
                  borderBottom: `1px solid ${chrome.gridLine}`,
                  color: chrome.labelPrimary,
                  fontWeight: 600,
                }}
              >
                Outliers
              </th>
            )}
            {categoryContributions && (
              <th
                style={{
                  textAlign: 'right',
                  padding: '4px 8px',
                  borderBottom: `1px solid ${chrome.gridLine}`,
                  color: chrome.labelPrimary,
                  fontWeight: 600,
                }}
              >
                Var %
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {groupStats.map(stats => {
            const isHighestStdDev = stats.stdDev === maxStdDev && maxStdDev > 0;
            const hasOutlierWarning = stats.outliers > 0;

            return (
              <tr
                key={stats.key}
                style={{
                  backgroundColor: isHighestStdDev ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                }}
              >
                <td
                  style={{
                    textAlign: 'left',
                    padding: '6px 8px',
                    color: chrome.labelPrimary,
                    fontWeight: isHighestStdDev ? 600 : 400,
                  }}
                >
                  {stats.key}
                  {isHighestStdDev && (
                    <span style={{ color: '#f59e0b', marginLeft: '4px' }}>&#9888;</span>
                  )}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: chrome.labelSecondary,
                  }}
                >
                  {stats.n}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: chrome.labelSecondary,
                  }}
                >
                  {stats.mean.toFixed(2)}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: chrome.labelSecondary,
                  }}
                >
                  {stats.median.toFixed(2)}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: isHighestStdDev ? '#ef4444' : chrome.labelSecondary,
                    fontWeight: isHighestStdDev ? 600 : 400,
                  }}
                >
                  {stats.stdDev.toFixed(3)}
                  {isHighestStdDev && <span style={{ marginLeft: '2px' }}>&#8593;</span>}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: chrome.labelSecondary,
                  }}
                >
                  {stats.iqr.toFixed(3)}
                </td>
                {hasOutliers && (
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '6px 8px',
                      color: hasOutlierWarning ? '#f59e0b' : chrome.labelSecondary,
                      fontWeight: hasOutlierWarning ? 600 : 400,
                    }}
                  >
                    {stats.outliers}
                    {hasOutlierWarning && <span style={{ marginLeft: '2px' }}>&#9888;</span>}
                  </td>
                )}
                {categoryContributions && (
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '6px 8px',
                      color: (stats.contribution ?? 0) > 30 ? '#f87171' : chrome.labelSecondary,
                      fontWeight: (stats.contribution ?? 0) > 30 ? 600 : 400,
                    }}
                  >
                    {stats.contribution !== undefined ? `${Math.round(stats.contribution)}%` : '-'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          marginTop: '8px',
          fontSize: '10px',
          color: chrome.labelMuted,
        }}
      >
        <span style={{ color: '#ef4444' }}>&#8593;</span> = highest variability
        {hasOutliers && (
          <span style={{ marginLeft: '12px' }}>
            <span style={{ color: '#f59e0b' }}>&#9888;</span> = needs attention
          </span>
        )}
      </div>
    </div>
  );
};

export default BoxplotStatsTable;
