/**
 * FilterBar Component for Content Add-in
 *
 * Displays active slicer filters as pills with a Clear All button.
 * Uses dark theme styling to match the Content Add-in dashboard.
 */

import React from 'react';
import { darkTheme } from '../lib/darkTheme';

export interface ActiveFilter {
  column: string;
  values: string[];
}

interface FilterBarProps {
  filters: ActiveFilter[];
  onClearAll: () => void;
  onClearFilter?: (column: string) => void;
}

/**
 * Displays active slicer filters as styled pills
 */
const FilterBar: React.FC<FilterBarProps> = ({ filters, onClearAll, onClearFilter }) => {
  // Don't render if no filters active
  if (filters.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.filterList}>
        <span style={styles.label}>Filters:</span>
        {filters.map(filter => (
          <div key={filter.column} style={styles.pill}>
            <span style={styles.pillColumn}>{filter.column}:</span>
            <span style={styles.pillValues}>
              {filter.values.slice(0, 3).join(', ')}
              {filter.values.length > 3 && ` +${filter.values.length - 3} more`}
            </span>
            {onClearFilter && (
              <button
                onClick={() => onClearFilter(filter.column)}
                style={styles.pillClose}
                title={`Clear ${filter.column} filter`}
                aria-label={`Clear ${filter.column} filter`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={onClearAll} style={styles.clearButton} title="Clear all filters">
        Clear All
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacingM,
    padding: `${darkTheme.spacingXS}px ${darkTheme.spacingM}px`,
    backgroundColor: darkTheme.colorNeutralBackground2,
    borderRadius: darkTheme.borderRadiusM,
    marginBottom: darkTheme.spacingM,
    minHeight: 36,
  },
  filterList: {
    display: 'flex',
    alignItems: 'center',
    gap: darkTheme.spacingS,
    flexWrap: 'wrap',
    flex: 1,
  },
  label: {
    fontSize: darkTheme.fontSizeSmall,
    color: darkTheme.colorNeutralForeground2,
    marginRight: darkTheme.spacingXS,
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: darkTheme.spacingXS,
    padding: `${darkTheme.spacingXS}px ${darkTheme.spacingS}px`,
    backgroundColor: darkTheme.colorNeutralBackground3,
    borderRadius: darkTheme.borderRadiusS,
    fontSize: darkTheme.fontSizeSmall,
    color: darkTheme.colorNeutralForeground1,
  },
  pillColumn: {
    fontWeight: darkTheme.fontWeightSemibold,
    color: darkTheme.colorBrandForeground1,
  },
  pillValues: {
    color: darkTheme.colorNeutralForeground1,
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  pillClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    padding: 0,
    marginLeft: darkTheme.spacingXS,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: darkTheme.borderRadiusCircular,
    color: darkTheme.colorNeutralForeground2,
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: 1,
  },
  clearButton: {
    padding: `${darkTheme.spacingXS}px ${darkTheme.spacingM}px`,
    backgroundColor: 'transparent',
    border: `1px solid ${darkTheme.colorNeutralStroke1}`,
    borderRadius: darkTheme.borderRadiusS,
    color: darkTheme.colorNeutralForeground1,
    fontSize: darkTheme.fontSizeSmall,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.15s, border-color 0.15s',
  },
};

export default FilterBar;
