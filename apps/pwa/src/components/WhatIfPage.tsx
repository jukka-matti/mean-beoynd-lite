import React from 'react';
import { useData } from '../context/DataContext';
import { WhatIfPageBase } from '@variscout/ui';

interface WhatIfPageProps {
  onBack: () => void;
}

const WhatIfPage: React.FC<WhatIfPageProps> = ({ onBack }) => {
  const { filteredData, rawData, outcome, specs, filters } = useData();
  const filterCount = Object.keys(filters).length;

  return (
    <WhatIfPageBase
      filteredData={filteredData}
      rawData={rawData}
      outcome={outcome}
      specs={specs}
      filterCount={filterCount}
      onBack={onBack}
    />
  );
};

export default WhatIfPage;
