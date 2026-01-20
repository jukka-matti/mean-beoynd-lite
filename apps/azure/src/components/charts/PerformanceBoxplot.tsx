/**
 * PerformanceBoxplot - Azure App Wrapper
 *
 * Thin wrapper that connects the shared PerformanceBoxplot component
 * to the Azure app's DataContext.
 */

import React, { useState } from 'react';
import { PerformanceBoxplot as PerformanceBoxplotBase } from '@variscout/charts';
import { useData } from '../../context/DataContext';

interface PerformanceBoxplotProps {
  onChannelClick?: (channelId: string) => void;
}

const PerformanceBoxplot: React.FC<PerformanceBoxplotProps> = ({ onChannelClick }) => {
  const { performanceResult, selectedMeasure, specs } = useData();
  const [expanded, setExpanded] = useState(false);

  return (
    <PerformanceBoxplotBase
      channels={performanceResult?.channels ?? []}
      specs={specs}
      selectedMeasure={selectedMeasure}
      onChannelClick={onChannelClick}
      expanded={expanded}
      onToggleExpand={() => setExpanded(prev => !prev)}
    />
  );
};

export default PerformanceBoxplot;
