/**
 * State Bridge for Task Pane ↔ Content Add-in Communication
 *
 * Uses Excel Custom Document Properties to share state between
 * the Task Pane and Content Add-in (which can't share a runtime).
 */

import { CPK_THRESHOLDS, validateThresholds, type CpkThresholds } from '@variscout/core';

export interface AddInState {
  /** Version number for change detection */
  version: number;
  /** Address of the data range (e.g., "Sheet1!A1:D100") */
  dataRange: string;
  /** Name of the worksheet containing the data */
  dataSheetName: string;
  /** Name of the Excel Table */
  tableName: string;
  /** Column name for outcome (Y variable) */
  outcomeColumn: string;
  /** Column names for factors (X variables) */
  factorColumns: string[];
  /** Specification limits */
  specs: {
    usl?: number;
    lsl?: number;
    target?: number;
    cpkTarget?: number;
  };
  /** Names of created slicers */
  slicerNames: string[];
  /** Column name for stage grouping (optional) */
  stageColumn?: string | null;
  /** Stage order mode: auto-detect or as-in-data */
  stageOrderMode?: 'auto' | 'data-order';
  /** Display options */
  displayOptions?: {
    lockYAxisToFullData?: boolean;
  };
  /** Full data Y-axis domain (stored when first calculated) */
  fullDataDomain?: { min: number; max: number } | null;
  /** Performance mode - multi-measure analysis */
  isPerformanceMode?: boolean;
  /** Column names selected as measure columns for performance mode */
  measureColumns?: string[];
  /** Custom label for measures (e.g., "Head", "Valve", "Nozzle") */
  measureLabel?: string;
  /** Currently selected measure in performance mode */
  selectedMeasure?: string | null;
  /** Drill context for navigating from Performance Mode to I-Chart */
  drillContext?: {
    measureId: string;
    returnToPerformance: boolean;
  } | null;
  /** Custom Cpk thresholds for health classification (optional) */
  cpkThresholds?: CpkThresholds;
  /** ISO timestamp of last update */
  lastUpdated: string;
}

const STATE_PROPERTY_KEY = 'VariScoutState';

/**
 * Save add-in state to Custom Document Properties
 *
 * Called by Task Pane when configuration changes.
 */
export async function saveAddInState(state: AddInState): Promise<void> {
  return Excel.run(async context => {
    const properties = context.workbook.properties.custom;

    // Delete existing property if it exists
    const existingItems = properties.items;
    properties.load('items');
    await context.sync();

    for (const item of existingItems) {
      if (item.key === STATE_PROPERTY_KEY) {
        item.delete();
        break;
      }
    }

    // Save new state
    properties.add(STATE_PROPERTY_KEY, JSON.stringify(state));
    await context.sync();
  });
}

/**
 * Load add-in state from Custom Document Properties
 *
 * Called by Content Add-in to read configuration.
 */
export async function loadAddInState(): Promise<AddInState | null> {
  return Excel.run(async context => {
    const properties = context.workbook.properties.custom;
    properties.load('items');
    await context.sync();

    for (const item of properties.items) {
      if (item.key === STATE_PROPERTY_KEY) {
        item.load('value');
        await context.sync();
        try {
          const state = JSON.parse(item.value) as AddInState;

          // Apply defaults for missing or invalid cpkThresholds
          if (!state.cpkThresholds || !validateThresholds(state.cpkThresholds)) {
            state.cpkThresholds = CPK_THRESHOLDS;
          }

          return state;
        } catch (e) {
          console.error('Failed to parse state:', e);
          return null;
        }
      }
    }

    return null;
  });
}

/**
 * Clear add-in state
 *
 * Called when resetting the add-in configuration.
 */
export async function clearAddInState(): Promise<void> {
  return Excel.run(async context => {
    const properties = context.workbook.properties.custom;
    properties.load('items');
    await context.sync();

    for (const item of properties.items) {
      if (item.key === STATE_PROPERTY_KEY) {
        item.delete();
        break;
      }
    }

    await context.sync();
  });
}

/**
 * Create initial state with defaults
 */
export function createInitialState(
  dataRange: string,
  dataSheetName: string,
  tableName: string,
  outcomeColumn: string,
  factorColumns: string[] = []
): AddInState {
  return {
    version: 1,
    dataRange,
    dataSheetName,
    tableName,
    outcomeColumn,
    factorColumns,
    specs: {},
    slicerNames: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Update state with new values (increments version)
 */
export function updateState(
  currentState: AddInState,
  updates: Partial<Omit<AddInState, 'version' | 'lastUpdated'>>
): AddInState {
  return {
    ...currentState,
    ...updates,
    version: currentState.version + 1,
    lastUpdated: new Date().toISOString(),
  };
}
