import React from 'react';
import { useData } from '../context/DataContext';
import {
  WhatIfPageBase,
  whatIfPageAzureColorScheme,
  whatIfSimulatorAzureColorScheme,
} from '@variscout/ui';

interface WhatIfPageProps {
  onBack: () => void;
  filterCount?: number;
}

const WhatIfPage: React.FC<WhatIfPageProps> = ({ onBack, filterCount = 0 }) => {
  const { filteredData, rawData, outcome, specs } = useData();

  return (
    <WhatIfPageBase
      filteredData={filteredData}
      rawData={rawData}
      outcome={outcome}
      specs={specs}
      filterCount={filterCount}
      onBack={onBack}
      colorScheme={whatIfPageAzureColorScheme}
      simulatorColorScheme={whatIfSimulatorAzureColorScheme}
    />
  );
};

export default WhatIfPage;
