/**
 * PerformanceStatsTable - Expandable statistics table for PerformanceBoxplot
 *
 * Shows detailed statistics comparison for each channel when the chart is expanded.
 * Displays Channel, Mean, Cpk, StdDev, n, and Health status.
 */

import React, { useMemo } from 'react';
import type { ChannelResult } from '../types';
import { useChartTheme } from '../useChartTheme';
import { chartColors } from '../colors';

export interface PerformanceStatsTableProps {
  /** Channel results with calculated statistics */
  channels: ChannelResult[];
}

/**
 * Get color for health status
 */
function getHealthColor(health: string): string {
  switch (health) {
    case 'critical':
      return chartColors.fail;
    case 'warning':
      return chartColors.warning;
    case 'capable':
      return chartColors.pass;
    case 'excellent':
      return chartColors.mean;
    default:
      return '#94a3b8';
  }
}

/**
 * Get label for health status
 */
function getHealthLabel(health: string): string {
  switch (health) {
    case 'critical':
      return 'Critical';
    case 'warning':
      return 'Warning';
    case 'capable':
      return 'Capable';
    case 'excellent':
      return 'Excellent';
    default:
      return 'Unknown';
  }
}

/**
 * PerformanceStatsTable Component
 *
 * Displays a statistics comparison table for performance channels.
 * Highlights channels with poor Cpk values.
 */
export const PerformanceStatsTable: React.FC<PerformanceStatsTableProps> = ({ channels }) => {
  const { chrome } = useChartTheme();

  // Find lowest Cpk for highlighting
  const lowestCpk = useMemo(() => {
    const cpkValues = channels.filter(c => c.cpk !== undefined).map(c => c.cpk!);
    return cpkValues.length > 0 ? Math.min(...cpkValues) : undefined;
  }, [channels]);

  if (channels.length === 0) {
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
              Channel
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
              Cpk
            </th>
            <th
              style={{
                textAlign: 'center',
                padding: '4px 8px',
                borderBottom: `1px solid ${chrome.gridLine}`,
                color: chrome.labelPrimary,
                fontWeight: 600,
              }}
            >
              Health
            </th>
          </tr>
        </thead>
        <tbody>
          {channels.map(channel => {
            const isLowestCpk =
              channel.cpk !== undefined && lowestCpk !== undefined && channel.cpk === lowestCpk;
            const healthColor = getHealthColor(channel.health);

            return (
              <tr
                key={channel.id}
                style={{
                  backgroundColor:
                    channel.health === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                }}
              >
                <td
                  style={{
                    textAlign: 'left',
                    padding: '6px 8px',
                    color: chrome.labelPrimary,
                    fontWeight: isLowestCpk ? 600 : 400,
                  }}
                >
                  {channel.label}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: chrome.labelSecondary,
                  }}
                >
                  {channel.n}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: chrome.labelSecondary,
                  }}
                >
                  {channel.mean.toFixed(2)}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: chrome.labelSecondary,
                  }}
                >
                  {channel.stdDev.toFixed(3)}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '6px 8px',
                    color: healthColor,
                    fontWeight: isLowestCpk ? 600 : 400,
                  }}
                >
                  {channel.cpk?.toFixed(2) ?? 'N/A'}
                  {isLowestCpk && <span style={{ marginLeft: '2px' }}>&#8595;</span>}
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    padding: '6px 8px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 500,
                      backgroundColor: `${healthColor}20`,
                      color: healthColor,
                    }}
                  >
                    {getHealthLabel(channel.health)}
                  </span>
                </td>
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
        <span style={{ color: chartColors.fail }}>&#8595;</span> = lowest Cpk
      </div>
    </div>
  );
};

export default PerformanceStatsTable;
