/**
 * RegressionPanel - Wrapper for RegressionPanelBase with Azure context and color scheme
 */
import React from 'react';
import {
  RegressionPanelBase,
  regressionPanelAzureColorScheme,
  SimpleRegressionView,
  AdvancedRegressionView,
  ExpandedScatterModal,
  regressionViewAzureColorScheme,
} from '@variscout/ui';
import { useData } from '../context/DataContext';

const RegressionPanel: React.FC = () => {
  const { filteredData, outcome, specs } = useData();

  return (
    <RegressionPanelBase
      filteredData={filteredData}
      outcome={outcome}
      specs={specs}
      renderSimpleView={props => (
        <SimpleRegressionView {...props} colorScheme={regressionViewAzureColorScheme} />
      )}
      renderAdvancedView={props => (
        <AdvancedRegressionView {...props} colorScheme={regressionViewAzureColorScheme} />
      )}
      renderExpandedModal={props => (
        <ExpandedScatterModal {...props} colorScheme={regressionViewAzureColorScheme} />
      )}
      colorScheme={regressionPanelAzureColorScheme}
    />
  );
};

export default RegressionPanel;
