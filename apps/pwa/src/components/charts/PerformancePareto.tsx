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
}

const PerformancePareto: React.FC<PerformanceParetoProps> = ({ onChannelClick }) => {
  const { performanceResult, selectedMeasure } = useData();

  return (
    <PerformanceParetoBase
      channels={performanceResult?.channels ?? []}
      selectedMeasure={selectedMeasure}
      onChannelClick={onChannelClick}
    />
  );
};

export default PerformancePareto;
