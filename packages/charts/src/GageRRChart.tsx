import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Bar } from '@visx/shape';
import { withParentSize } from '@visx/responsive';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import ChartSourceBar, { getSourceBarHeight } from './ChartSourceBar';
import { chartColors, chromeColors } from './colors';
import { useChartLayout, useChartTooltip } from './hooks';
import { interactionStyles } from './styles/interactionStyles';
import { getBarA11yProps } from './utils/accessibility';

export interface GageRRChartProps {
  /** % contribution from Part-to-Part */
  pctPart: number;
  /** % contribution from Repeatability (Equipment) */
  pctRepeatability: number;
  /** % contribution from Reproducibility (Operator + Interaction) */
  pctReproducibility: number;
  /** Total %GRR */
  pctGRR: number;
  /** Container width from withParentSize */
  parentWidth: number;
  /** Container height from withParentSize */
  parentHeight: number;
  /** Show branding footer */
  showBranding?: boolean;
  /** Custom branding text */
  brandingText?: string;
}

interface BarData {
  label: string;
  value: number;
  color: string;
  description: string;
}

/**
 * GageRRChart - Horizontal bar chart showing variance component breakdown
 */
const GageRRChartBase: React.FC<GageRRChartProps> = ({
  pctPart,
  pctRepeatability,
  pctReproducibility,
  pctGRR: _pctGRR,
  parentWidth,
  parentHeight,
  showBranding = true,
  brandingText,
}) => {
  void _pctGRR; // pctGRR is passed for API consistency but not displayed (it's the sum of repeatability + reproducibility)

  // GageRRChart uses custom margins (different from responsive margins)
  const customSourceBarHeight = getSourceBarHeight(showBranding);
  const customMargin = useMemo(
    () => ({
      top: 20,
      right: 60, // Space for percentage labels
      bottom: 30 + customSourceBarHeight,
      left: 100, // Space for category labels
    }),
    [customSourceBarHeight]
  );

  const { fonts, margin, width, height, sourceBarHeight } = useChartLayout({
    parentWidth,
    parentHeight,
    chartType: 'histogram', // closest match for base calculations
    showBranding,
    marginOverride: customMargin,
  });

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltipAtPoint, hideTooltip } =
    useChartTooltip<BarData>();

  // Data for horizontal bars
  const barData: BarData[] = useMemo(
    () => [
      {
        label: 'Part-to-Part',
        value: pctPart,
        color: chartColors.pass,
        description: 'Actual variation between parts',
      },
      {
        label: 'Repeatability',
        value: pctRepeatability,
        color: chartColors.mean,
        description: 'Equipment variation (same operator, same part)',
      },
      {
        label: 'Reproducibility',
        value: pctReproducibility,
        color: chartColors.warning,
        description: 'Operator variation (different operators)',
      },
    ],
    [pctPart, pctRepeatability, pctReproducibility]
  );

  // Scales
  const yScale = useMemo(
    () =>
      scaleBand({
        range: [0, height],
        domain: barData.map(d => d.label),
        padding: 0.3,
      }),
    [barData, height]
  );

  const xScale = useMemo(
    () =>
      scaleLinear({
        range: [0, width],
        domain: [0, 100],
        nice: true,
      }),
    [width]
  );

  if (parentWidth < 100 || parentHeight < 100) return null;

  return (
    <>
      <svg
        width={parentWidth}
        height={parentHeight}
        role="img"
        aria-label="Gage R&R chart: measurement system analysis"
      >
        <Group left={margin.left} top={margin.top}>
          {/* Bars */}
          {barData.map(d => {
            const barWidth = xScale(d.value);
            const barHeight = yScale.bandwidth();
            const y = yScale(d.label) ?? 0;

            return (
              <Group key={d.label}>
                {/* Background bar (100%) */}
                <Bar
                  x={0}
                  y={y}
                  width={width}
                  height={barHeight}
                  fill={chromeColors.barBackground}
                  rx={4}
                />
                {/* Value bar */}
                <Bar
                  x={0}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={d.color}
                  rx={4}
                  className={interactionStyles.clickable}
                  onMouseMove={e => showTooltipAtPoint(e, d)}
                  onMouseLeave={hideTooltip}
                  {...getBarA11yProps(d.label, d.value)}
                />
                {/* Percentage label on right */}
                <text
                  x={width + 8}
                  y={y + barHeight / 2}
                  fill={chromeColors.tooltipText}
                  fontSize={fonts.statLabel}
                  fontWeight={600}
                  dominantBaseline="middle"
                >
                  {d.value.toFixed(1)}%
                </text>
              </Group>
            );
          })}

          {/* Y Axis (category labels) */}
          <AxisLeft
            scale={yScale}
            stroke={chromeColors.stageDivider}
            strokeWidth={0}
            tickStroke="transparent"
            tickLabelProps={() => ({
              fill: chromeColors.labelSecondary,
              fontSize: fonts.tickLabel,
              textAnchor: 'end',
              dy: '0.33em',
              dx: -8,
            })}
          />

          {/* X Axis (percentage) */}
          <AxisBottom
            scale={xScale}
            top={height}
            stroke={chromeColors.stageDivider}
            tickStroke={chromeColors.stageDivider}
            numTicks={5}
            tickFormat={v => `${v}%`}
            tickLabelProps={() => ({
              fill: chromeColors.labelSecondary,
              fontSize: fonts.tickLabel,
              textAnchor: 'middle',
            })}
          />

          {/* %GRR Reference line at 10% and 30% */}
          {[10, 30].map(threshold => (
            <line
              key={threshold}
              x1={xScale(threshold)}
              x2={xScale(threshold)}
              y1={0}
              y2={height}
              stroke={threshold === 10 ? chartColors.pass : chartColors.fail}
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.5}
            />
          ))}
        </Group>

        {/* Branding */}
        {showBranding && (
          <ChartSourceBar
            left={0}
            top={parentHeight - sourceBarHeight}
            width={parentWidth}
            brandingText={brandingText}
            fontSize={fonts.brandingText}
          />
        )}
      </svg>

      {/* Tooltip */}
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          left={tooltipLeft}
          top={tooltipTop}
          style={{
            ...defaultStyles,
            background: chromeColors.tooltipBg,
            border: `1px solid ${chromeColors.tooltipBorder}`,
            color: chromeColors.tooltipText,
            fontSize: fonts.tooltipText,
            padding: '8px 12px',
            maxWidth: 200,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4, color: tooltipData.color }}>
            {tooltipData.label}
          </div>
          <div style={{ marginBottom: 4 }}>
            <strong>{tooltipData.value.toFixed(1)}%</strong> of total variation
          </div>
          <div style={{ fontSize: fonts.tooltipText, color: chromeColors.labelSecondary }}>
            {tooltipData.description}
          </div>
        </TooltipWithBounds>
      )}
    </>
  );
};

// Wrapped version with responsive sizing
const GageRRChart = withParentSize(GageRRChartBase);

export { GageRRChart as default, GageRRChartBase };
