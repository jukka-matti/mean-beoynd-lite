import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Bar } from '@visx/shape';
import { withParentSize } from '@visx/responsive';
import { getResponsiveMargins, getResponsiveFonts } from './responsive';
import ChartSourceBar, { getSourceBarHeight } from './ChartSourceBar';

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
}

/**
 * GageRRChart - Horizontal bar chart showing variance component breakdown
 */
const GageRRChartBase: React.FC<GageRRChartProps> = ({
  pctPart,
  pctRepeatability,
  pctReproducibility,
  pctGRR,
  parentWidth,
  parentHeight,
  showBranding = true,
  brandingText,
}) => {
  const sourceBarHeight = getSourceBarHeight(showBranding);
  const margin = useMemo(
    () => ({
      top: 20,
      right: 60, // Space for percentage labels
      bottom: 30 + sourceBarHeight,
      left: 100, // Space for category labels
    }),
    [sourceBarHeight]
  );
  const fonts = getResponsiveFonts(parentWidth);

  const width = Math.max(0, parentWidth - margin.left - margin.right);
  const height = Math.max(0, parentHeight - margin.top - margin.bottom);

  // Data for horizontal bars
  const barData: BarData[] = useMemo(
    () => [
      { label: 'Part-to-Part', value: pctPart, color: '#22c55e' }, // green-500
      { label: 'Repeatability', value: pctRepeatability, color: '#3b82f6' }, // blue-500
      { label: 'Reproducibility', value: pctReproducibility, color: '#f59e0b' }, // amber-500
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
      <svg width={parentWidth} height={parentHeight}>
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
                  fill="#334155" // slate-700
                  rx={4}
                />
                {/* Value bar */}
                <Bar x={0} y={y} width={barWidth} height={barHeight} fill={d.color} rx={4} />
                {/* Percentage label on right */}
                <text
                  x={width + 8}
                  y={y + barHeight / 2}
                  fill="#f1f5f9"
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
            stroke="#475569"
            strokeWidth={0}
            tickStroke="transparent"
            tickLabelProps={() => ({
              fill: '#94a3b8',
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
            stroke="#475569"
            tickStroke="#475569"
            numTicks={5}
            tickFormat={v => `${v}%`}
            tickLabelProps={() => ({
              fill: '#94a3b8',
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
              stroke={threshold === 10 ? '#22c55e' : '#ef4444'}
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
          />
        )}
      </svg>
    </>
  );
};

// Wrapped version with responsive sizing
const GageRRChart = withParentSize(GageRRChartBase);

export { GageRRChart as default, GageRRChartBase };
