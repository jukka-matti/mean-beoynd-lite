/**
 * PerformanceCapability - PWA Wrapper
 *
 * Thin wrapper that connects the shared PerformanceCapability component
 * to the PWA's DataContext.
 */

import React, { useMemo } from 'react';
import { PerformanceCapability as PerformanceCapabilityBase } from '@variscout/charts';
import { useData } from '../../context/DataContext';

const PerformanceCapability: React.FC = () => {
  const { performanceResult, selectedMeasure, specs } = useData();

  // Get the selected channel's data
  const selectedChannel = useMemo(() => {
    if (!selectedMeasure || !performanceResult) return null;
    return performanceResult.channels.find(c => c.id === selectedMeasure) ?? null;
  }, [performanceResult, selectedMeasure]);

  return <PerformanceCapabilityBase channel={selectedChannel} specs={specs} />;
};

export default PerformanceCapability;
