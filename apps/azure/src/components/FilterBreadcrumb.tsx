/**
 * Re-export FilterBreadcrumb from @variscout/ui with Azure color scheme
 *
 * This component has been moved to the shared UI package.
 * For new code, import directly from '@variscout/ui' and use filterBreadcrumbAzureColorScheme.
 */
import {
  FilterBreadcrumb as FilterBreadcrumbBase,
  filterBreadcrumbAzureColorScheme,
  type FilterBreadcrumbProps as BaseProps,
} from '@variscout/ui';

export interface FilterBreadcrumbProps {
  filterChipData: BaseProps['filterChipData'];
  columnAliases?: BaseProps['columnAliases'];
  onUpdateFilterValues: BaseProps['onUpdateFilterValues'];
  onRemoveFilter: BaseProps['onRemoveFilter'];
  onClearAll?: BaseProps['onClearAll'];
  cumulativeVariationPct?: BaseProps['cumulativeVariationPct'];
}

const FilterBreadcrumb = ({
  filterChipData,
  columnAliases,
  onUpdateFilterValues,
  onRemoveFilter,
  onClearAll,
  cumulativeVariationPct,
}: FilterBreadcrumbProps) => {
  return (
    <FilterBreadcrumbBase
      filterChipData={filterChipData}
      columnAliases={columnAliases}
      onUpdateFilterValues={onUpdateFilterValues}
      onRemoveFilter={onRemoveFilter}
      onClearAll={onClearAll}
      cumulativeVariationPct={cumulativeVariationPct}
      colorScheme={filterBreadcrumbAzureColorScheme}
    />
  );
};

export default FilterBreadcrumb;
