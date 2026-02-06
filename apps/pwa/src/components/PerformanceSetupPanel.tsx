/**
 * PerformanceSetupPanel - PWA wrapper for PerformanceSetupPanelBase
 *
 * Connects the shared base component to PWA DataContext.
 * Uses PWA color scheme (semantic tokens).
 */

import React, { useMemo, useCallback } from 'react';
import { PerformanceSetupPanelBase, performanceSetupPanelPwaColorScheme } from '@variscout/ui';
import { useData } from '../context/DataContext';
import { detectChannelColumns } from '@variscout/core';

interface PerformanceSetupPanelProps {
  /** 'inline' for PerformanceDashboard, 'modal' for dialog */
  variant?: 'inline' | 'modal';
  /** Initial selection (for modal) */
  initialSelection?: string[];
  /** Initial label (for modal) */
  initialLabel?: string;
  /** Callback when setup is confirmed */
  onEnable?: (columns: string[], label: string) => void;
  /** Callback when cancelled (modal only) */
  onCancel?: () => void;
  /** Callback to navigate to settings */
  onOpenSettings?: () => void;
}

const PerformanceSetupPanel: React.FC<PerformanceSetupPanelProps> = ({
  variant = 'inline',
  initialSelection,
  initialLabel,
  onEnable,
  onCancel,
  onOpenSettings,
}) => {
  const {
    rawData,
    specs,
    measureColumns: currentMeasureColumns,
    measureLabel: currentMeasureLabel,
    cpkTarget: currentCpkTarget,
    setMeasureColumns,
    setMeasureLabel,
    setPerformanceMode,
    setCpkTarget,
  } = useData();

  // Detect available numeric columns
  const availableColumns = useMemo(() => {
    if (rawData.length === 0) return [];
    return detectChannelColumns(rawData);
  }, [rawData]);

  const hasData = rawData.length > 0;
  const hasSpecs = specs.usl !== undefined || specs.lsl !== undefined;

  const handleEnable = useCallback(
    (columns: string[], label: string, cpkTarget: number) => {
      if (onEnable) {
        onEnable(columns, label);
      } else {
        setMeasureColumns(columns);
        setMeasureLabel(label);
        setCpkTarget(cpkTarget);
        setPerformanceMode(true);
      }
    },
    [onEnable, setMeasureColumns, setMeasureLabel, setCpkTarget, setPerformanceMode]
  );

  return (
    <PerformanceSetupPanelBase
      variant={variant}
      availableColumns={availableColumns}
      hasData={hasData}
      hasSpecs={hasSpecs}
      initialSelection={initialSelection ?? currentMeasureColumns ?? []}
      initialLabel={initialLabel ?? currentMeasureLabel ?? 'Measure'}
      initialCpkTarget={currentCpkTarget ?? 1.33}
      onEnable={handleEnable}
      onCancel={onCancel}
      onOpenSettings={onOpenSettings}
      colorScheme={performanceSetupPanelPwaColorScheme}
    />
  );
};

export default PerformanceSetupPanel;
