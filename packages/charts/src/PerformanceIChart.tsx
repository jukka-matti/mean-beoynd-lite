/**
 * PerformanceIChart - Cpk by Channel Chart
 *
 * Displays Cpk values for each channel as a scatter plot.
 * X-axis: Channel index/name
 * Y-axis: Cpk value
 * Reference lines at Cpk = 1.0 (minimum) and 1.33 (target)
 *
 * Props-based component for sharing across PWA, Azure, and Excel Add-in.
 */

import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Circle, Line } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { withParentSize } from '@visx/responsive';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import type { PerformanceIChartProps, ChannelResult } from './types';
import { chartColors } from './colors';
import { useChartTheme } from './useChartTheme';
import { getResponsiveMargins, getResponsiveFonts, getResponsiveTickCount } from './responsive';
import ChartSourceBar, { getSourceBarHeight } from './ChartSourceBar';

interface TooltipData {
  channel: ChannelResult;
  x: number;
  y: number;
}

export const PerformanceIChartBase: React.FC<PerformanceIChartProps> = ({
  parentWidth,
  parentHeight,
  channels,
  selectedMeasure,
  onChannelClick,
  showBranding = true,
  capabilityMetric = 'cpk',
}) => {
  const { chrome } = useChartTheme();
  const sourceBarHeight = getSourceBarHeight(showBranding);
  const margin = getResponsiveMargins(parentWidth, 'ichart', sourceBarHeight);
  const fonts = getResponsiveFonts(parentWidth);

  const [tooltipData, setTooltipData] = React.useState<TooltipData | null>(null);
  const [tooltipLeft, setTooltipLeft] = React.useState(0);
  const [tooltipTop, setTooltipTop] = React.useState(0);

  const width = Math.max(0, parentWidth - margin.left - margin.right);
  const height = Math.max(0, parentHeight - margin.top - margin.bottom);

  // X scale - band scale for channels
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, width],
        domain: channels.map((_, i) => i.toString()),
        padding: 0.1,
      }),
    [channels, width]
  );

  // Metric label for display
  const metricLabel = capabilityMetric === 'cp' ? 'Cp' : 'Cpk';

  // Y scale - capability metric values with padding
  const yScale = useMemo(() => {
    if (channels.length === 0) {
      return scaleLinear({ range: [height, 0], domain: [0, 2] });
    }

    const metricValues = channels.map(c => c[capabilityMetric] ?? 0).filter(v => v > 0);
    const minMetric = Math.min(...metricValues, 0);
    const maxMetric = Math.max(...metricValues, 2);
    const padding = (maxMetric - minMetric) * 0.1;

    return scaleLinear({
      range: [height, 0],
      domain: [Math.min(minMetric - padding, 0), maxMetric + padding],
      nice: true,
    });
  }, [channels, height, capabilityMetric]);

  const xTickCount = getResponsiveTickCount(width, 'x');

  // Get point color based on health classification
  const getPointColor = (channel: ChannelResult): string => {
    switch (channel.health) {
      case 'critical':
        return chartColors.fail; // Red
      case 'warning':
        return chartColors.warning; // Amber
      case 'capable':
        return chartColors.pass; // Green
      case 'excellent':
        return chartColors.mean; // Blue
      default:
        return chrome.labelSecondary;
    }
  };

  const showTooltip = (channel: ChannelResult, index: number) => {
    const x = (xScale(index.toString()) ?? 0) + xScale.bandwidth() / 2;
    const y = yScale(channel[capabilityMetric] ?? 0);
    setTooltipData({ channel, x, y });
    setTooltipLeft(x + margin.left);
    setTooltipTop(y + margin.top);
  };

  const hideTooltip = () => {
    setTooltipData(null);
  };

  if (channels.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: parentHeight,
          color: chrome.labelSecondary,
        }}
      >
        <p>No channel performance data available</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <svg width={parentWidth} height={parentHeight}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={yScale} width={width} stroke={chrome.gridLine} />

          {/* Metric = 1.0 reference line (minimum capability) */}
          <Line
            from={{ x: 0, y: yScale(1.0) }}
            to={{ x: width, y: yScale(1.0) }}
            stroke={chartColors.fail}
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />
          <text
            x={width - 4}
            y={yScale(1.0) - 4}
            fill={chartColors.fail}
            fontSize={fonts.statLabel}
            textAnchor="end"
          >
            {metricLabel} = 1.0
          </text>

          {/* Metric = 1.33 reference line (target capability) */}
          <Line
            from={{ x: 0, y: yScale(1.33) }}
            to={{ x: width, y: yScale(1.33) }}
            stroke={chartColors.pass}
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />
          <text
            x={width - 4}
            y={yScale(1.33) - 4}
            fill={chartColors.pass}
            fontSize={fonts.statLabel}
            textAnchor="end"
          >
            {metricLabel} = 1.33
          </text>

          {/* Data points */}
          {channels.map((channel, i) => {
            const metricValue = channel[capabilityMetric] ?? 0;
            const x = (xScale(i.toString()) ?? 0) + xScale.bandwidth() / 2;
            const y = yScale(metricValue);
            const isSelected = selectedMeasure === channel.id;

            return (
              <Circle
                key={channel.id}
                cx={x}
                cy={y}
                r={isSelected ? 8 : 5}
                fill={getPointColor(channel)}
                stroke={isSelected ? '#fff' : chrome.pointStroke}
                strokeWidth={isSelected ? 2 : 1}
                opacity={selectedMeasure && !isSelected ? 0.4 : 1}
                style={{ cursor: onChannelClick ? 'pointer' : 'default' }}
                onClick={() => onChannelClick?.(channel.id)}
                onMouseEnter={() => showTooltip(channel, i)}
                onMouseLeave={hideTooltip}
              />
            );
          })}

          {/* X Axis */}
          <AxisBottom
            scale={xScale}
            top={height}
            stroke={chrome.axisPrimary}
            tickStroke={chrome.axisPrimary}
            numTicks={Math.min(xTickCount, channels.length)}
            tickFormat={(_, i) => {
              // Show channel labels for smaller datasets, or indices for larger
              if (channels.length <= 20) {
                return channels[Number(i)]?.label ?? '';
              }
              return String(Number(i) + 1);
            }}
            tickLabelProps={() => ({
              fill: chrome.labelPrimary,
              fontSize: fonts.tickLabel,
              textAnchor: 'middle',
              dy: 4,
            })}
          />

          {/* X Axis Label */}
          <text
            x={width / 2}
            y={height + margin.bottom - 10}
            fill={chrome.labelPrimary}
            fontSize={fonts.axisLabel}
            textAnchor="middle"
          >
            Channel
          </text>

          {/* Y Axis */}
          <AxisLeft
            scale={yScale}
            stroke={chrome.axisPrimary}
            tickStroke={chrome.axisPrimary}
            tickLabelProps={() => ({
              fill: chrome.labelPrimary,
              fontSize: fonts.tickLabel,
              textAnchor: 'end',
              dx: -4,
              dy: 3,
              fontFamily: 'monospace',
            })}
          />

          {/* Y Axis Label */}
          <text
            x={-height / 2}
            y={-margin.left + 14}
            fill={chrome.labelPrimary}
            fontSize={fonts.axisLabel}
            textAnchor="middle"
            transform="rotate(-90)"
          >
            {metricLabel}
          </text>
        </Group>

        {/* Source Bar */}
        {showBranding && (
          <ChartSourceBar
            width={parentWidth}
            top={parentHeight - getSourceBarHeight()}
            n={channels.length}
          />
        )}
      </svg>

      {/* Tooltip */}
      {tooltipData && (
        <TooltipWithBounds
          left={tooltipLeft}
          top={tooltipTop}
          style={{
            ...defaultStyles,
            backgroundColor: chrome.tooltipBg,
            color: chrome.labelPrimary,
            border: `1px solid ${chrome.gridLine}`,
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: fonts.tickLabel,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontWeight: 600 }}>{tooltipData.channel.label}</div>
            <div>
              Cp:{' '}
              <span style={{ fontFamily: 'monospace' }}>
                {tooltipData.channel.cp?.toFixed(2) ?? 'N/A'}
              </span>
            </div>
            <div>
              Cpk:{' '}
              <span style={{ fontFamily: 'monospace' }}>
                {tooltipData.channel.cpk?.toFixed(2) ?? 'N/A'}
              </span>
            </div>
            <div>
              n: <span style={{ fontFamily: 'monospace' }}>{tooltipData.channel.n}</span>
            </div>
            <div>
              Mean:{' '}
              <span style={{ fontFamily: 'monospace' }}>{tooltipData.channel.mean.toFixed(2)}</span>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'capitalize',
                color: getPointColor(tooltipData.channel),
              }}
            >
              {tooltipData.channel.health}
            </div>
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
};

const PerformanceIChart = withParentSize(PerformanceIChartBase);
export default PerformanceIChart;
