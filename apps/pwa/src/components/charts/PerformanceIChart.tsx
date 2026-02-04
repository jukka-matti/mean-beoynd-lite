/**
 * PerformanceIChart - PWA Wrapper
 *
 * Thin wrapper that connects the shared PerformanceIChart component
 * to the PWA's DataContext.
 */

import React from 'react';
import { PerformanceIChart as PerformanceIChartBase, type CpkThresholds } from '@variscout/charts';
import { useData } from '../../context/DataContext';

interface PerformanceIChartProps {
  onChannelClick?: (channelId: string) => void;
  /** Which capability metric to display: 'cpk' (default), 'cp', or 'both' */
  capabilityMetric?: 'cp' | 'cpk' | 'both';
  /** User-defined Cpk/Cp target line (default: 1.33) */
  cpkTarget?: number;
  /** Custom Cpk thresholds for health classification (defaults to industry standards) */
  cpkThresholds?: CpkThresholds;
}

const PerformanceIChart: React.FC<PerformanceIChartProps> = ({
  onChannelClick,
  capabilityMetric = 'cpk',
  cpkTarget,
  cpkThresholds,
}) => {
  const { performanceResult, selectedMeasure } = useData();

  return (
    <PerformanceIChartBase
      channels={performanceResult?.channels ?? []}
      selectedMeasure={selectedMeasure}
      onChannelClick={onChannelClick}
      capabilityMetric={capabilityMetric}
      cpkTarget={cpkTarget}
      cpkThresholds={cpkThresholds}
    />
  );
};

export default PerformanceIChart;
