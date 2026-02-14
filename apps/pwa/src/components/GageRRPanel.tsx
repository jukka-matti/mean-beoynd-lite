/**
 * GageRRPanel - Wrapper for GageRRPanelBase with PWA context
 */
import React from 'react';
import { GageRRPanelBase } from '@variscout/ui';
import { useData } from '../context/DataContext';

const GageRRPanel: React.FC = () => {
  const { filteredData, outcome } = useData();

  return <GageRRPanelBase filteredData={filteredData} outcome={outcome} />;
};

export default GageRRPanel;
