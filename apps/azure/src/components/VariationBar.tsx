/**
 * Re-export VariationBar from @variscout/ui with Azure color scheme
 *
 * This component has been moved to the shared UI package.
 * For new code, import directly from '@variscout/ui' and use variationBarAzureColorScheme.
 */
import {
  VariationBar as VariationBarBase,
  variationBarAzureColorScheme,
  type VariationBarProps as BaseProps,
} from '@variscout/ui';

export interface VariationBarProps {
  isolatedPct: BaseProps['isolatedPct'];
  showLabels?: BaseProps['showLabels'];
  className?: BaseProps['className'];
}

const VariationBar = ({ isolatedPct, showLabels, className }: VariationBarProps) => {
  return (
    <VariationBarBase
      isolatedPct={isolatedPct}
      showLabels={showLabels}
      className={className}
      colorScheme={variationBarAzureColorScheme}
    />
  );
};

export default VariationBar;
