/**
 * RegressionPanel - Wrapper for RegressionPanelBase with Azure context and components
 */
import React from 'react';
import { RegressionPanelBase, regressionPanelAzureColorScheme } from '@variscout/ui';
import { useData } from '../context/DataContext';
import { ExpandedScatterModal, SimpleRegressionView, AdvancedRegressionView } from './regression';

const RegressionPanel: React.FC = () => {
  const { filteredData, outcome, specs } = useData();

  return (
    <RegressionPanelBase
      filteredData={filteredData}
      outcome={outcome}
      specs={specs}
      renderSimpleView={props => <SimpleRegressionView {...props} />}
      renderAdvancedView={props => <AdvancedRegressionView {...props} />}
      renderExpandedModal={props => <ExpandedScatterModal {...props} />}
      colorScheme={regressionPanelAzureColorScheme}
    />
  );
};

export default RegressionPanel;
