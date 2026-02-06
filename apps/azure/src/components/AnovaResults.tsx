/**
 * Re-export AnovaResults from @variscout/ui with Azure color scheme
 *
 * This component has been moved to the shared UI package.
 * For new code, import directly from '@variscout/ui' and use anovaAzureColorScheme.
 */
import {
  AnovaResults as AnovaResultsBase,
  anovaAzureColorScheme,
  type AnovaResultsProps as BaseProps,
} from '@variscout/ui';

export interface AnovaResultsProps {
  result: BaseProps['result'];
  factorLabel: BaseProps['factorLabel'];
}

const AnovaResults = ({ result, factorLabel }: AnovaResultsProps) => {
  return (
    <AnovaResultsBase
      result={result}
      factorLabel={factorLabel}
      colorScheme={anovaAzureColorScheme}
    />
  );
};

export default AnovaResults;
