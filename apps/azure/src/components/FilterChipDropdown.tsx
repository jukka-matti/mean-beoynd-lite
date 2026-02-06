/**
 * Re-export FilterChipDropdown from @variscout/ui with Azure color scheme
 *
 * This component has been moved to the shared UI package.
 * For new code, import directly from '@variscout/ui' and use filterChipDropdownAzureColorScheme.
 */
import {
  FilterChipDropdown as FilterChipDropdownBase,
  filterChipDropdownAzureColorScheme,
  type FilterChipDropdownProps as BaseProps,
} from '@variscout/ui';

export interface FilterChipDropdownProps {
  chipData: BaseProps['chipData'];
  factorLabel: BaseProps['factorLabel'];
  onValuesChange: BaseProps['onValuesChange'];
  onClose: BaseProps['onClose'];
  anchorRect?: BaseProps['anchorRect'];
}

const FilterChipDropdown = ({
  chipData,
  factorLabel,
  onValuesChange,
  onClose,
  anchorRect,
}: FilterChipDropdownProps) => {
  return (
    <FilterChipDropdownBase
      chipData={chipData}
      factorLabel={factorLabel}
      onValuesChange={onValuesChange}
      onClose={onClose}
      anchorRect={anchorRect}
      colorScheme={filterChipDropdownAzureColorScheme}
    />
  );
};

export default FilterChipDropdown;
