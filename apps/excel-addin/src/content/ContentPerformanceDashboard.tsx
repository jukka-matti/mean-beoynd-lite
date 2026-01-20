/**
 * ContentPerformanceDashboard - Performance Mode for Excel Content Add-in
 *
 * Displays multi-channel performance analysis charts using the base variants
 * from @variscout/charts for explicit sizing in the Excel embedding context.
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  PerformanceIChartBase,
  PerformanceBoxplotBase,
  PerformanceParetoBase,
  PerformanceCapabilityBase,
} from '@variscout/charts';
import { calculateChannelPerformance } from '@variscout/core';
import type { AddInState } from '../lib/stateBridge';
import { getFilteredTableData } from '../lib/dataFilter';
import { darkTheme } from '../lib/darkTheme';

interface ContentPerformanceDashboardProps {
  state: AddInState;
  onSelectMeasure?: (measureId: string | null) => void;
  onDrillToMeasure?: (measureId: string) => void;
}

/**
 * Simple error boundary for chart components
 */
class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; chartName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; chartName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`Chart error in ${this.props.chartName}:`, error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            color: darkTheme.colorNeutralForeground2,
            textAlign: 'center',
            padding: darkTheme.spacingL,
          }}
        >
          <p>Chart failed to render</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: darkTheme.spacingS,
              padding: `${darkTheme.spacingXS}px ${darkTheme.spacingM}px`,
              backgroundColor: darkTheme.colorNeutralBackground3,
              border: 'none',
              borderRadius: darkTheme.borderRadiusS,
              color: darkTheme.colorNeutralForeground1,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ContentPerformanceDashboard: React.FC<ContentPerformanceDashboardProps> = ({
  state,
  onSelectMeasure,
  onDrillToMeasure,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [selectedMeasure, setSelectedMeasure] = useState<string | null>(
    state.selectedMeasure ?? null
  );
  const [boxplotExpanded, setBoxplotExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Observe container size for responsive charts
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Load data from Excel Table
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const tableData = await getFilteredTableData(
          state.dataSheetName,
          state.tableName,
          state.measureColumns?.[0] ?? '', // Use first measure column for validation
          [] // No factors for performance mode
        );
        if (isMounted) {
          setData(tableData);
          setError(null);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        console.error('Failed to load data:', err);
        if (isMounted) {
          setError('Unable to read data from table.');
          setIsLoading(false);
        }
      }
    };

    loadData();

    // Poll for data changes
    const interval = setInterval(loadData, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [state.dataSheetName, state.tableName, state.measureColumns]);

  // Calculate performance results
  const performanceResult = useMemo(() => {
    if (!data.length || !state.measureColumns?.length) return null;

    const specs = {
      usl: state.specs?.usl,
      lsl: state.specs?.lsl,
      target: state.specs?.target,
    };

    return calculateChannelPerformance(data, state.measureColumns, specs);
  }, [data, state.measureColumns, state.specs]);

  // Get selected channel for capability chart
  const selectedChannel = useMemo(() => {
    if (!selectedMeasure || !performanceResult) return null;
    return performanceResult.channels.find(c => c.id === selectedMeasure) ?? null;
  }, [performanceResult, selectedMeasure]);

  const handleMeasureClick = useCallback(
    (measureId: string) => {
      const newSelection = selectedMeasure === measureId ? null : measureId;
      setSelectedMeasure(newSelection);
      onSelectMeasure?.(newSelection);
    },
    [selectedMeasure, onSelectMeasure]
  );

  // Chart dimensions
  const topChartWidth = Math.max(200, containerSize.width - 32);
  const topChartHeight = Math.max(120, (containerSize.height - 120) * 0.4);
  const bottomChartWidth = Math.max(120, (containerSize.width - 48) / 3);
  const bottomChartHeight = Math.max(100, (containerSize.height - 120) * 0.5);

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading performance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!performanceResult || performanceResult.channels.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No performance data available</p>
        <p style={{ fontSize: darkTheme.fontSizeSmall, marginTop: darkTheme.spacingS }}>
          Check that measure columns are configured correctly.
        </p>
      </div>
    );
  }

  const { summary } = performanceResult;

  return (
    <div style={styles.container} ref={containerRef}>
      {/* Header with summary stats */}
      <div style={styles.header}>
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Channels</span>
            <span style={styles.statValue}>{summary.totalChannels}</span>
          </div>
          {summary.healthCounts.critical > 0 && (
            <div style={{ ...styles.stat, color: darkTheme.colorStatusDangerForeground }}>
              <span style={styles.statLabel}>Critical</span>
              <span style={styles.statValue}>{summary.healthCounts.critical}</span>
            </div>
          )}
          {summary.healthCounts.warning > 0 && (
            <div style={{ ...styles.stat, color: darkTheme.colorStatusWarningForeground }}>
              <span style={styles.statLabel}>Warning</span>
              <span style={styles.statValue}>{summary.healthCounts.warning}</span>
            </div>
          )}
          <div style={styles.stat}>
            <span style={styles.statLabel}>Avg Cpk</span>
            <span style={styles.statValue}>{summary.overall.meanCpk.toFixed(2)}</span>
          </div>
        </div>
        <div style={styles.headerButtons}>
          {selectedMeasure && onDrillToMeasure && (
            <button onClick={() => onDrillToMeasure(selectedMeasure)} style={styles.drillButton}>
              View in I-Chart &rarr;
            </button>
          )}
          {selectedMeasure && (
            <button onClick={() => handleMeasureClick(selectedMeasure)} style={styles.clearButton}>
              Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Top row: I-Chart */}
      <div style={styles.topRow}>
        <div style={styles.chartLabel}>Cpk by {state.measureLabel || 'Measure'}</div>
        <div style={styles.chartContainer}>
          <ChartErrorBoundary chartName="PerformanceIChart">
            <PerformanceIChartBase
              channels={performanceResult.channels}
              selectedMeasure={selectedMeasure}
              onChannelClick={handleMeasureClick}
              parentWidth={topChartWidth}
              parentHeight={topChartHeight}
              showBranding={false}
            />
          </ChartErrorBoundary>
        </div>
      </div>

      {/* Bottom row: Three charts */}
      <div style={styles.bottomRow}>
        <div style={styles.chartSection}>
          <div style={styles.chartLabel}>
            {selectedMeasure ? `${selectedMeasure} Distribution` : 'Worst Channels'}
          </div>
          <div style={styles.chartContainer}>
            <ChartErrorBoundary chartName="PerformanceBoxplot">
              <PerformanceBoxplotBase
                channels={performanceResult.channels}
                specs={state.specs || {}}
                selectedMeasure={selectedMeasure}
                onChannelClick={handleMeasureClick}
                parentWidth={bottomChartWidth}
                parentHeight={boxplotExpanded ? bottomChartHeight * 1.5 : bottomChartHeight}
                showBranding={false}
                expanded={boxplotExpanded}
                onToggleExpand={() => setBoxplotExpanded(prev => !prev)}
              />
            </ChartErrorBoundary>
          </div>
        </div>

        <div style={styles.chartSection}>
          <div style={styles.chartLabel}>Ranking (Worst First)</div>
          <div style={styles.chartContainer}>
            <ChartErrorBoundary chartName="PerformancePareto">
              <PerformanceParetoBase
                channels={performanceResult.channels}
                selectedMeasure={selectedMeasure}
                onChannelClick={handleMeasureClick}
                parentWidth={bottomChartWidth}
                parentHeight={bottomChartHeight}
                showBranding={false}
              />
            </ChartErrorBoundary>
          </div>
        </div>

        <div style={styles.chartSection}>
          <div style={styles.chartLabel}>
            {selectedMeasure ? `${selectedMeasure} Capability` : 'Select Channel'}
          </div>
          <div style={styles.chartContainer}>
            <ChartErrorBoundary chartName="PerformanceCapability">
              <PerformanceCapabilityBase
                channel={selectedChannel}
                specs={state.specs || {}}
                parentWidth={bottomChartWidth}
                parentHeight={bottomChartHeight}
                showBranding={false}
              />
            </ChartErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: darkTheme.colorNeutralBackground1,
    color: darkTheme.colorNeutralForeground1,
    padding: darkTheme.spacingM,
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: darkTheme.spacingM,
    padding: `${darkTheme.spacingS}px ${darkTheme.spacingM}px`,
    backgroundColor: darkTheme.colorNeutralBackground2,
    borderRadius: darkTheme.borderRadiusM,
    marginBottom: darkTheme.spacingM,
  },
  statsRow: {
    display: 'flex',
    gap: darkTheme.spacingXL,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: darkTheme.fontSizeCaption,
    color: darkTheme.colorNeutralForeground2,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: darkTheme.fontSizeTitle,
    fontWeight: darkTheme.fontWeightSemibold,
    fontFamily: 'monospace',
  },
  headerButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: darkTheme.spacingS,
  },
  drillButton: {
    padding: `${darkTheme.spacingXS}px ${darkTheme.spacingM}px`,
    backgroundColor: darkTheme.colorBrandForeground1,
    border: 'none',
    borderRadius: darkTheme.borderRadiusS,
    color: darkTheme.colorNeutralForeground1,
    fontSize: darkTheme.fontSizeSmall,
    fontWeight: darkTheme.fontWeightSemibold,
    cursor: 'pointer',
  },
  clearButton: {
    padding: `${darkTheme.spacingXS}px ${darkTheme.spacingM}px`,
    backgroundColor: 'transparent',
    border: 'none',
    color: darkTheme.colorNeutralForeground2,
    fontSize: darkTheme.fontSizeSmall,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  topRow: {
    flex: '0 0 40%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: darkTheme.spacingM,
  },
  bottomRow: {
    flex: '0 0 50%',
    display: 'flex',
    gap: darkTheme.spacingM,
  },
  chartSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: darkTheme.colorNeutralBackground2,
    borderRadius: darkTheme.borderRadiusM,
    overflow: 'hidden',
  },
  chartLabel: {
    fontSize: darkTheme.fontSizeCaption,
    color: darkTheme.colorNeutralForeground2,
    padding: `${darkTheme.spacingXS}px ${darkTheme.spacingS}px`,
    backgroundColor: darkTheme.colorNeutralBackground3,
  },
  chartContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: darkTheme.spacingS,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: darkTheme.colorNeutralForeground2,
  },
  spinner: {
    width: 24,
    height: 24,
    border: `2px solid ${darkTheme.colorNeutralStroke1}`,
    borderTopColor: darkTheme.colorBrandForeground1,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: darkTheme.colorNeutralForeground3,
    textAlign: 'center',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  errorText: {
    color: darkTheme.colorStatusDangerForeground,
    fontSize: darkTheme.fontSizeBody,
  },
};

export default ContentPerformanceDashboard;
