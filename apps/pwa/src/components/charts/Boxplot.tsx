import React, { useMemo, useState } from 'react';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import * as d3 from 'd3';
import { useData } from '../../context/DataContext';
import { useChartScale } from '../../hooks/useChartScale';
import {
  useResponsiveChartMargins,
  useResponsiveChartFonts,
} from '../../hooks/useResponsiveChartMargins';
import AxisEditor from '../AxisEditor';
import ChartSourceBar, { getSourceBarHeight } from './ChartSourceBar';
import ChartSignature from './ChartSignature';
import { Edit2 } from 'lucide-react';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { VARIATION_THRESHOLDS } from '@variscout/core';
import { chartColors, useChartTheme } from '@variscout/charts';

interface BoxplotProps {
  factor: string;
  parentWidth: number;
  parentHeight: number;
  onDrillDown?: (factor: string, value: string) => void;
  /** Variation % explained by this factor (for drill suggestion indicator) */
  variationPct?: number;
  /** Category contributions - Map from category key to % of total variation */
  categoryContributions?: Map<string | number, number>;
}

const Boxplot = ({
  factor,
  parentWidth,
  parentHeight,
  onDrillDown,
  variationPct,
  categoryContributions,
}: BoxplotProps) => {
  const { chrome } = useChartTheme();
  // Determine if this factor should be highlighted as a drill target
  const isHighVariation =
    variationPct !== undefined && variationPct >= VARIATION_THRESHOLDS.HIGH_IMPACT;
  const sourceBarHeight = getSourceBarHeight();
  const margin = useResponsiveChartMargins(parentWidth, 'boxplot', sourceBarHeight);
  const fonts = useResponsiveChartFonts(parentWidth);
  const {
    filteredData,
    outcome,
    filters,
    setFilters,
    columnAliases,
    setColumnAliases,
    valueLabels,
    setValueLabels,
    specs,
    displayOptions,
  } = useData();
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<any>();

  const data = useMemo(() => {
    if (!outcome) return [];
    const groups = d3.group(filteredData, (d: any) => d[factor]);
    return Array.from(groups, ([key, groupValues]) => {
      const v = groupValues
        .map((d: any) => Number(d[outcome]))
        .filter(val => !isNaN(val))
        .sort(d3.ascending);
      if (v.length === 0) return null;
      const q1 = d3.quantile(v, 0.25) || 0;
      const median = d3.quantile(v, 0.5) || 0;
      const q3 = d3.quantile(v, 0.75) || 0;
      const iqr = q3 - q1;
      const min = Math.max(v[0], q1 - 1.5 * iqr);
      const max = Math.min(v[v.length - 1], q3 + 1.5 * iqr);
      const mean = d3.mean(v) || 0;
      return {
        key,
        q1,
        median,
        q3,
        min,
        max,
        mean,
        outliers: v.filter(x => x < min || x > max),
        values: v,
      };
    }).filter(d => d !== null) as any[];
  }, [filteredData, factor, outcome]);

  const width = Math.max(0, parentWidth - margin.left - margin.right);
  const height = Math.max(0, parentHeight - margin.top - margin.bottom);

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, width],
        domain: data.map(d => d.key),
        padding: 0.4,
      }),
    [data, width]
  );

  const { min, max } = useChartScale();

  const yScale = useMemo(() => {
    return scaleLinear({
      range: [height, 0],
      domain: [min, max],
      nice: true,
    });
  }, [height, min, max]);

  const handleBoxClick = (key: string) => {
    if (onDrillDown) {
      onDrillDown(factor, key);
    } else {
      // Fallback to current behavior
      const currentFilters = filters[factor] || [];
      const newFilters = currentFilters.includes(key)
        ? currentFilters.filter(v => v !== key)
        : [...currentFilters, key];
      setFilters({ ...filters, [factor]: newFilters });
    }
  };

  const handleSaveAlias = (newAlias: string, newValueLabels?: Record<string, string>) => {
    setColumnAliases({
      ...columnAliases,
      [factor]: newAlias,
    });
    if (newValueLabels) {
      setValueLabels({
        ...valueLabels,
        [factor]: newValueLabels,
      });
    }
  };

  if (!outcome || data.length === 0) return null;

  const alias = columnAliases[factor] || factor;
  const factorLabels = valueLabels[factor] || {};

  // Responsive axis label positioning
  const yLabelOffset = parentWidth < 400 ? -25 : parentWidth < 768 ? -40 : -50;
  const xLabelOffset = parentWidth < 400 ? 35 : 50;

  const xParams = {
    label: alias,
    x: width / 2,
    y: height + xLabelOffset,
  };

  return (
    <div className="relative w-full h-full">
      <svg width={parentWidth} height={parentHeight}>
        <Group left={margin.left} top={margin.top}>
          {/* Spec Lines */}
          {displayOptions.showSpecs !== false && specs && (
            <>
              {specs.usl !== undefined && (
                <line
                  x1={0}
                  x2={width}
                  y1={yScale(specs.usl)}
                  y2={yScale(specs.usl)}
                  stroke={chartColors.spec}
                  strokeWidth={2}
                  strokeDasharray="4,4"
                />
              )}
              {specs.lsl !== undefined && (
                <line
                  x1={0}
                  x2={width}
                  y1={yScale(specs.lsl)}
                  y2={yScale(specs.lsl)}
                  stroke={chartColors.spec}
                  strokeWidth={2}
                  strokeDasharray="4,4"
                />
              )}
              {specs.target !== undefined && (
                <line
                  x1={0}
                  x2={width}
                  y1={yScale(specs.target)}
                  y2={yScale(specs.target)}
                  stroke={chartColors.target}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              )}
            </>
          )}
          {data.map((d: any, i: number) => {
            const x = xScale(d.key) || 0;
            const barWidth = xScale.bandwidth();
            const isSelected = (filters[factor] || []).includes(d.key);
            const opacity = filters[factor] && filters[factor].length > 0 && !isSelected ? 0.3 : 1;

            return (
              <Group
                key={i}
                onClick={() => handleBoxClick(d.key)}
                onMouseOver={event => {
                  const coords = { x: event.clientX, y: event.clientY }; // localPoint might be better but let's try client first
                  showTooltip({
                    tooltipLeft: x + barWidth,
                    tooltipTop: yScale(d.median),
                    tooltipData: d,
                  });
                }}
                onMouseLeave={hideTooltip}
                className="cursor-pointer"
                opacity={opacity}
              >
                {/* Transparent capture rect for better clickability */}
                <rect x={x - 5} y={0} width={barWidth + 10} height={height} fill="transparent" />

                {/* Whisker Line */}
                <line
                  x1={x + barWidth / 2}
                  x2={x + barWidth / 2}
                  y1={yScale(d.min)}
                  y2={yScale(d.max)}
                  stroke={chrome.whisker}
                  strokeWidth={1}
                />

                {/* Box */}
                <rect
                  x={x}
                  y={yScale(d.q3)}
                  width={barWidth}
                  height={Math.abs(yScale(d.q1) - yScale(d.q3))}
                  fill={chartColors.selected}
                  stroke={chartColors.selectedBorder}
                  rx={2}
                />

                {/* Median Line */}
                <line
                  x1={x}
                  x2={x + barWidth}
                  y1={yScale(d.median)}
                  y2={yScale(d.median)}
                  stroke="#f97316"
                  strokeWidth={2}
                />

                {/* Mean marker (diamond) */}
                <polygon
                  points={`
                    ${x + barWidth / 2},${yScale(d.mean) - 4}
                    ${x + barWidth / 2 + 4},${yScale(d.mean)}
                    ${x + barWidth / 2},${yScale(d.mean) + 4}
                    ${x + barWidth / 2 - 4},${yScale(d.mean)}
                  `}
                  fill={chrome.labelPrimary}
                />

                {/* Outliers */}
                {d.outliers.map((o: number, j: number) => (
                  <circle
                    key={j}
                    cx={x + barWidth / 2}
                    cy={yScale(o)}
                    r={3}
                    fill={chartColors.fail}
                    opacity={0.6}
                  />
                ))}
              </Group>
            );
          })}
          <AxisLeft
            scale={yScale}
            stroke={chrome.axisPrimary}
            tickStroke={chrome.axisPrimary}
            label=""
            tickLabelProps={() => ({
              fill: chrome.labelPrimary,
              fontSize: fonts.tickLabel,
              textAnchor: 'end',
              dx: -4,
              dy: 3,
              fontFamily: 'monospace',
            })}
          />

          {/* Interactive Y-Axis Label */}
          <Group onClick={() => setIsEditingLabel(true)} className="cursor-pointer group/label">
            <text
              x={yLabelOffset}
              y={height / 2}
              transform={`rotate(-90 ${yLabelOffset} ${height / 2})`}
              textAnchor="middle"
              fill={chrome.labelPrimary}
              fontSize={fonts.axisLabel}
              fontWeight={500}
              className="group-hover/label:fill-blue-400 transition-colors"
            >
              {columnAliases[outcome] || outcome}
            </text>
            {/* Edit Icon */}
            <foreignObject
              x={yLabelOffset - 8}
              y={height / 2 + 10}
              width={16}
              height={16}
              transform={`rotate(-90 ${yLabelOffset} ${height / 2})`}
              className="opacity-0 group-hover/label:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-center text-blue-400">
                <Edit2 size={14} />
              </div>
            </foreignObject>
          </Group>

          <AxisBottom
            top={height}
            scale={xScale}
            stroke={chrome.axisPrimary}
            tickStroke={chrome.axisPrimary}
            label={''} // Custom Label below
            tickFormat={val => factorLabels[val] || val}
            tickLabelProps={() => ({
              fill: chrome.labelSecondary,
              fontSize: fonts.tickLabel,
              textAnchor: 'middle',
              dy: 2,
            })}
          />

          {/* Contribution Labels (below X-axis) */}
          {displayOptions.showContributionLabels &&
            categoryContributions &&
            data.map(d => {
              const contribution = categoryContributions.get(d.key);
              if (contribution === undefined) return null;
              const x = xScale(d.key) || 0;
              const barWidth = xScale.bandwidth();
              return (
                <text
                  key={`contrib-${d.key}`}
                  x={x + barWidth / 2}
                  y={height + (parentWidth < 400 ? 24 : 28)}
                  textAnchor="middle"
                  fill={
                    contribution >= VARIATION_THRESHOLDS.HIGH_IMPACT
                      ? '#f87171'
                      : chrome.labelSecondary
                  }
                  fontSize={fonts.statLabel}
                  fontWeight={contribution >= VARIATION_THRESHOLDS.HIGH_IMPACT ? 600 : 400}
                >
                  {Math.round(contribution)}%
                </text>
              );
            })}

          {/* n Labels (always visible below contribution labels or below x-axis) */}
          {data.map(d => {
            const x = xScale(d.key) || 0;
            const barWidth = xScale.bandwidth();
            const nLabelOffset =
              displayOptions.showContributionLabels && categoryContributions?.has(d.key)
                ? parentWidth < 400
                  ? 36
                  : 42
                : parentWidth < 400
                  ? 24
                  : 28;
            return (
              <text
                key={`n-${d.key}`}
                x={x + barWidth / 2}
                y={height + nLabelOffset}
                textAnchor="middle"
                fill={chrome.labelMuted}
                fontSize={fonts.statLabel - 1}
              >
                n={d.values.length}
              </text>
            );
          })}

          {/* Custom Clickable Axis Label with Variation Indicator */}
          <Group onClick={() => setIsEditingLabel(true)} className="cursor-pointer group/label2">
            <text
              x={xParams.x}
              y={xParams.y}
              textAnchor="middle"
              fill={isHighVariation ? '#f87171' : chrome.labelSecondary}
              fontSize={13}
              fontWeight={isHighVariation ? 600 : 500}
              className="group-hover/label2:fill-blue-400 transition-colors"
            >
              {xParams.label}
              {variationPct !== undefined && ` (${Math.round(variationPct)}%)`}
            </text>
            {/* Drill suggestion indicator */}
            {isHighVariation && (
              <text
                x={xParams.x}
                y={xParams.y + 14}
                textAnchor="middle"
                fill="#f87171"
                fontSize={10}
                className="pointer-events-none"
              >
                ↓ drill here
              </text>
            )}
            <foreignObject
              x={xParams.x + (variationPct !== undefined ? 40 : 8)}
              y={xParams.y - 12}
              width={16}
              height={16}
              className="opacity-0 group-hover/label2:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-center text-blue-400">
                <Edit2 size={14} />
              </div>
            </foreignObject>
          </Group>

          {/* Signature (painter-style branding) */}
          <ChartSignature x={width - 10} y={height + margin.bottom - sourceBarHeight - 18} />

          {/* Source Bar (branding) */}
          <ChartSourceBar
            width={width}
            top={height + margin.bottom - sourceBarHeight}
            n={filteredData.length}
          />
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          left={margin.left + (tooltipLeft ?? 0)}
          top={margin.top + (tooltipTop ?? 0)}
          style={{
            ...defaultStyles,
            backgroundColor: chrome.tooltipBg,
            color: chrome.tooltipText,
            border: `1px solid ${chrome.tooltipBorder}`,
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: fonts.tooltipText,
          }}
        >
          <div>
            <strong>{factorLabels[tooltipData.key] || tooltipData.key}</strong>
          </div>
          <div>Median: {tooltipData.median.toFixed(2)}</div>
          <div>Mean: {tooltipData.mean.toFixed(2)}</div>
          <div>Q1: {tooltipData.q1.toFixed(2)}</div>
          <div>Q3: {tooltipData.q3.toFixed(2)}</div>
          <div>n: {tooltipData.values?.length ?? 0}</div>
          {categoryContributions && categoryContributions.has(tooltipData.key) && (
            <div style={{ color: '#f87171', fontWeight: 500, marginTop: 4 }}>
              Impact: {Math.round(categoryContributions.get(tooltipData.key) ?? 0)}% of total
              variation
            </div>
          )}
        </TooltipWithBounds>
      )}

      {/* In-Place Label Editor Popover */}
      {isEditingLabel && (
        <AxisEditor
          title="Edit Axis & Categorles"
          originalName={factor}
          alias={alias}
          values={data.map(d => d.key)}
          valueLabels={factorLabels}
          onSave={handleSaveAlias}
          onClose={() => setIsEditingLabel(false)}
          style={{ bottom: 10, left: margin.left + width / 2 - 120 }}
        />
      )}
    </div>
  );
};

export default withParentSize(Boxplot);
