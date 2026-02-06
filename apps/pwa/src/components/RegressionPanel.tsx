/**
 * RegressionPanel - Wrapper for RegressionPanelBase with PWA context and components
 */
import React from 'react';
import { RegressionPanelBase } from '@variscout/ui';
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
    />
  );
};

export default RegressionPanel;
