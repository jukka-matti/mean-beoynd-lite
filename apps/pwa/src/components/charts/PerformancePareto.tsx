/**
 * PerformancePareto - PWA Wrapper
 *
 * Thin wrapper that connects the shared PerformancePareto component
 * to the PWA's DataContext.
 */

import React from 'react';
import { PerformancePareto as PerformanceParetoBase } from '@variscout/charts';
import { useData } from '../../context/DataContext';

interface PerformanceParetoProps {
  onChannelClick?: (channelId: string) => void;
  /** Maximum number of channels to display (default: 20) */
  maxDisplayed?: number;
}

const PerformancePareto: React.FC<PerformanceParetoProps> = ({ onChannelClick, maxDisplayed }) => {
  const { performanceResult, selectedMeasure } = useData();

  return (
    <PerformanceParetoBase
      channels={performanceResult?.channels ?? []}
      selectedMeasure={selectedMeasure}
      onChannelClick={onChannelClick}
      maxDisplayed={maxDisplayed}
    />
  );
};

export default PerformancePareto;
