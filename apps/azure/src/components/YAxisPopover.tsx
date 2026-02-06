/**
 * Re-export YAxisPopover from @variscout/ui with Azure color scheme
 *
 * This component has been moved to the shared UI package.
 * For new code, import directly from '@variscout/ui' and use yAxisPopoverAzureColorScheme.
 */
import {
  YAxisPopover as YAxisPopoverBase,
  yAxisPopoverAzureColorScheme,
  type YAxisPopoverProps as BaseProps,
} from '@variscout/ui';

export interface YAxisPopoverProps {
  isOpen: BaseProps['isOpen'];
  onClose: BaseProps['onClose'];
  currentMin?: BaseProps['currentMin'];
  currentMax?: BaseProps['currentMax'];
  autoMin: BaseProps['autoMin'];
  autoMax: BaseProps['autoMax'];
  onSave: BaseProps['onSave'];
  anchorPosition?: BaseProps['anchorPosition'];
}

const YAxisPopover = ({
  isOpen,
  onClose,
  currentMin,
  currentMax,
  autoMin,
  autoMax,
  onSave,
  anchorPosition,
}: YAxisPopoverProps) => {
  return (
    <YAxisPopoverBase
      isOpen={isOpen}
      onClose={onClose}
      currentMin={currentMin}
      currentMax={currentMax}
      autoMin={autoMin}
      autoMax={autoMax}
      onSave={onSave}
      anchorPosition={anchorPosition}
      colorScheme={yAxisPopoverAzureColorScheme}
    />
  );
};

export default YAxisPopover;
