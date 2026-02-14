import React, { useMemo, useState, useEffect } from 'react';
import { GageRRChart, InteractionPlot } from '@variscout/charts';
import { calculateGageRR, type GageRRResult, type DataRow } from '@variscout/core';
import { HelpTooltip } from '../HelpTooltip';
import { useGlossary } from '../../hooks';
import { ErrorBoundary } from '../ErrorBoundary';
import { ChevronDown, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Color scheme for GageRRPanel
 */
export interface GageRRPanelColorScheme {
  /** Main container background */
  containerBg: string;
  /** Section bar background (toolbars, footer) */
  sectionBg: string;
  /** Card/panel background */
  cardBg: string;
  /** Primary border */
  border: string;
  /** Subtle border (50% opacity variant) */
  borderSubtle: string;
  /** Input/select background */
  inputBg: string;
  /** Input/select border */
  inputBorder: string;
  /** Primary content text */
  contentText: string;
  /** Secondary/label text */
  secondaryText: string;
  /** Muted/placeholder text */
  mutedText: string;
}

export const gageRRPanelDefaultColorScheme: GageRRPanelColorScheme = {
  containerBg: 'bg-surface',
  sectionBg: 'bg-surface-secondary/50',
  cardBg: 'bg-surface-secondary',
  border: 'border-edge',
  borderSubtle: 'border-edge/50',
  inputBg: 'bg-surface',
  inputBorder: 'border-edge-secondary',
  contentText: 'text-content',
  secondaryText: 'text-content-secondary',
  mutedText: 'text-content-muted',
};

export const gageRRPanelAzureColorScheme: GageRRPanelColorScheme = {
  containerBg: 'bg-slate-900',
  sectionBg: 'bg-slate-800/50',
  cardBg: 'bg-slate-800',
  border: 'border-slate-700',
  borderSubtle: 'border-slate-700/50',
  inputBg: 'bg-slate-900',
  inputBorder: 'border-slate-600',
  contentText: 'text-slate-300',
  secondaryText: 'text-slate-400',
  mutedText: 'text-slate-500',
};

export interface GageRRPanelBaseProps {
  /** Filtered data rows */
  filteredData: DataRow[];
  /** Current outcome variable (used for auto-selecting measurement column) */
  outcome: string | null;
  /** Whether to show chart branding */
  showBranding?: boolean;
  /** Color scheme for styling */
  colorScheme?: GageRRPanelColorScheme;
}

/**
 * GageRRPanelBase - Gage R&R (Measurement System Analysis) panel
 *
 * Props-based component with auto-detection of part/operator/measurement columns.
 */
const GageRRPanelBase: React.FC<GageRRPanelBaseProps> = ({
  filteredData,
  outcome,
  showBranding = true,
  colorScheme = gageRRPanelDefaultColorScheme,
}) => {
  const { getTerm } = useGlossary();
  const c = colorScheme;

  // Column selectors
  const [partColumn, setPartColumn] = useState<string>('');
  const [operatorColumn, setOperatorColumn] = useState<string>('');
  const [measurementColumn, setMeasurementColumn] = useState<string>('');

  // Get available columns
  const categoricalColumns = useMemo(() => {
    if (filteredData.length === 0) return [];
    const row = filteredData[0];
    return Object.keys(row).filter(key => typeof row[key] === 'string');
  }, [filteredData]);

  const numericColumns = useMemo(() => {
    if (filteredData.length === 0) return [];
    const row = filteredData[0];
    return Object.keys(row).filter(key => typeof row[key] === 'number');
  }, [filteredData]);

  // Auto-select defaults
  useEffect(() => {
    if (!partColumn && categoricalColumns.length > 0) {
      const partLike = categoricalColumns.find(col => /part|sample|item|piece|unit/i.test(col));
      setPartColumn(partLike || categoricalColumns[0]);
    }
  }, [categoricalColumns, partColumn]);

  useEffect(() => {
    if (!operatorColumn && categoricalColumns.length > 1) {
      const opLike = categoricalColumns.find(col =>
        /operator|op|inspector|measurer|tech/i.test(col)
      );
      setOperatorColumn(opLike || categoricalColumns[1] || categoricalColumns[0]);
    }
  }, [categoricalColumns, operatorColumn]);

  useEffect(() => {
    if (!measurementColumn && numericColumns.length > 0) {
      if (outcome && numericColumns.includes(outcome)) {
        setMeasurementColumn(outcome);
      } else {
        setMeasurementColumn(numericColumns[0]);
      }
    }
  }, [numericColumns, measurementColumn, outcome]);

  // Calculate Gage R&R
  const result: GageRRResult | null = useMemo(() => {
    if (!partColumn || !operatorColumn || !measurementColumn || filteredData.length === 0) {
      return null;
    }
    return calculateGageRR(filteredData, partColumn, operatorColumn, measurementColumn);
  }, [filteredData, partColumn, operatorColumn, measurementColumn]);

  // Verdict styling
  const getVerdictStyle = (verdict: 'excellent' | 'marginal' | 'unacceptable') => {
    switch (verdict) {
      case 'excellent':
        return { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle };
      case 'marginal':
        return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: AlertTriangle };
      case 'unacceptable':
        return { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle };
    }
  };

  if (categoricalColumns.length < 2 || numericColumns.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${c.mutedText}`}>
        <div className="text-center">
          <AlertCircle className="mx-auto mb-2" size={24} />
          <p>Gage R&R requires at least 2 categorical columns</p>
          <p className="text-sm">(Part ID and Operator) and 1 numeric column</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${c.containerBg} overflow-hidden`}>
      {/* Column selectors */}
      <div className={`flex-none px-4 py-3 border-b ${c.border} ${c.sectionBg}`}>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Part selector */}
          <div className="flex items-center gap-2">
            <span className={`text-xs ${c.secondaryText} uppercase tracking-wider`}>Part:</span>
            <div className="relative">
              <select
                value={partColumn}
                onChange={e => setPartColumn(e.target.value)}
                className={`${c.inputBg} border ${c.inputBorder} text-xs text-white rounded px-2 py-1.5 pr-6 outline-none focus:border-blue-500`}
              >
                {categoricalColumns.map(col => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className={`absolute right-2 top-1/2 -translate-y-1/2 ${c.secondaryText} pointer-events-none`}
              />
            </div>
          </div>

          {/* Operator selector */}
          <div className="flex items-center gap-2">
            <span className={`text-xs ${c.secondaryText} uppercase tracking-wider`}>Operator:</span>
            <div className="relative">
              <select
                value={operatorColumn}
                onChange={e => setOperatorColumn(e.target.value)}
                className={`${c.inputBg} border ${c.inputBorder} text-xs text-white rounded px-2 py-1.5 pr-6 outline-none focus:border-blue-500`}
              >
                {categoricalColumns.map(col => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className={`absolute right-2 top-1/2 -translate-y-1/2 ${c.secondaryText} pointer-events-none`}
              />
            </div>
          </div>

          {/* Measurement selector */}
          <div className="flex items-center gap-2">
            <span className={`text-xs ${c.secondaryText} uppercase tracking-wider`}>
              Measurement:
            </span>
            <div className="relative">
              <select
                value={measurementColumn}
                onChange={e => setMeasurementColumn(e.target.value)}
                className={`${c.inputBg} border ${c.inputBorder} text-xs text-white rounded px-2 py-1.5 pr-6 outline-none focus:border-blue-500`}
              >
                {numericColumns.map(col => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className={`absolute right-2 top-1/2 -translate-y-1/2 ${c.secondaryText} pointer-events-none`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="flex-1 p-4 overflow-auto">
        {!result ? (
          <div className={`flex items-center justify-center h-full ${c.mutedText}`}>
            <div className="text-center">
              <AlertCircle className="mx-auto mb-2" size={24} />
              <p>Unable to calculate Gage R&R</p>
              <p className="text-sm">Need at least 2 parts, 2 operators, and 2 replicates</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Left column: Variance breakdown chart + stats */}
            <div className="flex flex-col gap-4 min-h-0 h-full">
              {/* %GRR Result card */}
              <div
                className={`p-4 rounded-xl border ${c.border} ${getVerdictStyle(result.verdict).bg} flex-none`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`text-xs ${c.secondaryText} uppercase tracking-wider mb-1 flex items-center gap-1`}
                    >
                      %GRR (Study Variation)
                      <HelpTooltip term={getTerm('grr')} iconSize={12} />
                    </div>
                    <div className={`text-3xl font-bold ${getVerdictStyle(result.verdict).text}`}>
                      {result.pctGRR.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right">
                    {React.createElement(getVerdictStyle(result.verdict).icon, {
                      size: 32,
                      className: getVerdictStyle(result.verdict).text,
                    })}
                    <div
                      className={`text-sm font-medium ${getVerdictStyle(result.verdict).text} capitalize mt-1`}
                    >
                      {result.verdict}
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${c.secondaryText} mt-2`}>{result.verdictText}</p>
              </div>

              {/* Variance breakdown chart */}
              <div
                className={`flex-1 ${c.cardBg} rounded-xl border ${c.border} overflow-hidden min-h-0 flex flex-col`}
              >
                <div className={`flex-none px-3 py-2 border-b ${c.borderSubtle}`}>
                  <span className={`text-xs font-medium ${c.contentText} flex items-center gap-1`}>
                    Variance Components (%Study Variation)
                    <HelpTooltip term={getTerm('repeatability')} iconSize={12} />
                  </span>
                </div>
                <div className="flex-1 min-h-0 relative">
                  <div className="absolute inset-0">
                    <ErrorBoundary componentName="Gage R&R Chart">
                      <GageRRChart
                        pctPart={result.pctPart}
                        pctRepeatability={result.pctRepeatability}
                        pctReproducibility={result.pctReproducibility}
                        pctGRR={result.pctGRR}
                        showBranding={showBranding}
                      />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>

              {/* Study summary */}
              <div className={`${c.cardBg} rounded-xl border ${c.border} p-4 flex-none`}>
                <div className={`text-xs ${c.secondaryText} uppercase tracking-wider mb-2`}>
                  Study Summary
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className={c.secondaryText}>Parts:</span>
                    <span className="text-white font-mono">{result.partCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={c.secondaryText}>Operators:</span>
                    <span className="text-white font-mono">{result.operatorCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={c.secondaryText}>Replicates:</span>
                    <span className="text-white font-mono">{result.replicates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={c.secondaryText}>Measurements:</span>
                    <span className="text-white font-mono">{result.totalMeasurements}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Interaction plot */}
            <div
              className={`${c.cardBg} rounded-xl border ${c.border} overflow-hidden flex flex-col min-h-0 h-full`}
            >
              <div className={`flex-none px-3 py-2 border-b ${c.borderSubtle}`}>
                <span className={`text-xs font-medium ${c.contentText} flex items-center gap-1`}>
                  Operator &times; Part Interaction
                  <HelpTooltip term={getTerm('reproducibility')} iconSize={12} />
                </span>
                <span className={`text-xs ${c.mutedText} ml-2`}>
                  (parallel lines = no interaction)
                </span>
              </div>
              <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0">
                  <ErrorBoundary componentName="Interaction Plot">
                    <InteractionPlot data={result.interactionData} showBranding={showBranding} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AIAG guidelines reference */}
      {result && (
        <div className={`flex-none px-4 py-2 border-t ${c.border} ${c.sectionBg}`}>
          <div className={`flex items-center gap-4 text-xs ${c.mutedText}`}>
            <span>AIAG Guidelines:</span>
            <span className="text-green-400">&lt;10% Excellent</span>
            <span className="text-amber-400">10-30% Marginal</span>
            <span className="text-red-400">&gt;30% Unacceptable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GageRRPanelBase;
