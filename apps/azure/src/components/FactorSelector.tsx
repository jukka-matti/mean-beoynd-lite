/**
 * FactorSelector wrapper for Azure app
 *
 * Applies Azure Slate color scheme to the shared FactorSelector from @variscout/ui.
 * For new code, import directly from '@variscout/ui' and use factorSelectorAzureColorScheme.
 */
import React from 'react';
import {
  FactorSelector as SharedFactorSelector,
  factorSelectorAzureColorScheme,
  type FactorSelectorProps,
} from '@variscout/ui';

const FactorSelector = (props: Omit<FactorSelectorProps, 'colorScheme'>) => (
  <SharedFactorSelector {...props} colorScheme={factorSelectorAzureColorScheme} />
);

export default FactorSelector;
