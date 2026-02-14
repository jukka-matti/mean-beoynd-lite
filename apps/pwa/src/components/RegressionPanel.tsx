/**
 * RegressionPanel - Wrapper for RegressionPanelBase with PWA context
 */
import React from 'react';
import {
  RegressionPanelBase,
  SimpleRegressionView,
  AdvancedRegressionView,
  ExpandedScatterModal,
} from '@variscout/ui';
import { useData } from '../context/DataContext';

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
