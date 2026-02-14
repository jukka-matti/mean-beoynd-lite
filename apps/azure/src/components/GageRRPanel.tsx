/**
 * GageRRPanel - Wrapper for GageRRPanelBase with Azure context and color scheme
 */
import React from 'react';
import { GageRRPanelBase, gageRRPanelAzureColorScheme } from '@variscout/ui';
import { useData } from '../context/DataContext';

const GageRRPanel: React.FC = () => {
  const { filteredData, outcome } = useData();

  return (
    <GageRRPanelBase
      filteredData={filteredData}
      outcome={outcome}
      colorScheme={gageRRPanelAzureColorScheme}
    />
  );
};

export default GageRRPanel;
