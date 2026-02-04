/**
 * PerformanceIChart - I-Chart for Capability Metrics (Cpk/Cp)
 *
 * Displays Cpk or Cp values for each channel as an Individuals Control Chart.
 * X-axis: Channel index (1, 2, 3, ... n)
 * Y-axis: Cpk or Cp value
 * Control limits: UCL/LCL calculated from Cpk/Cp distribution across channels
 * Point coloring: Standard I-Chart logic (blue = in-control, red = out-of-control)
 * Target line: User-defined reference (default 1.33)
 *
 * Props-based component for sharing across PWA, Azure, and Excel Add-in.
 */

import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { withParentSize } from '@visx/responsive';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import type { PerformanceIChartProps, ChannelResult } from './types';
import { chartColors } from './colors';
import { useChartTheme } from './useChartTheme';
import { getResponsiveMargins, getScaledFonts, getResponsiveTickCount } from './responsive';
import ChartSourceBar, { getSourceBarHeight } from './ChartSourceBar';
import { SpecLimitLine } from './components/SpecLimitLine';
import ChartLegend from './ChartLegend';
import { getDataPointA11yProps } from './utils/accessibility';
import {
  calculateCapabilityControlLimits,
  getCapabilityControlStatus,
  type CapabilityControlStatus,
} from '@variscout/core';

interface TooltipData {
  channel: ChannelResult;
  x: number;
  y: number;
  status: CapabilityControlStatus | undefined;
}

/** Default Cpk target (industry standard for ~63 PPM defects) */
const DEFAULT_CPK_TARGET = 1.33;

export interface PerformanceIChartBaseProps extends PerformanceIChartProps {
  /** User-defined Cpk/Cp target line (default: 1.33) */
  cpkTarget?: number;
  /** Show control status legend (default: false) */
  showLegend?: boolean;
}

export const PerformanceIChartBase: React.FC<PerformanceIChartBaseProps> = ({
  parentWidth,
  parentHeight,
  channels,
  selectedMeasure,
  onChannelClick,
  showBranding = true,
  capabilityMetric = 'cpk',
  cpkTarget = DEFAULT_CPK_TARGET,
  showLegend = false,
}) => {
  const { chrome, fontScale } = useChartTheme();
  const sourceBarHeight = getSourceBarHeight(showBranding);
  const margin = getResponsiveMargins(parentWidth, 'ichart', sourceBarHeight);
  const fonts = getScaledFonts(parentWidth, fontScale);

  const [tooltipData, setTooltipData] = React.useState<TooltipData | null>(null);
  const [tooltipLeft, setTooltipLeft] = React.useState(0);
  const [tooltipTop, setTooltipTop] = React.useState(0);

  const width = Math.max(0, parentWidth - margin.left - margin.right);
  const height = Math.max(0, parentHeight - margin.top - margin.bottom);

  // Calculate control limits from capability values across channels
  // Use 'cpk' for control limits when in 'both' mode (can't show control limits for both metrics)
  const controlLimits = useMemo(() => {
    const metric = capabilityMetric === 'both' ? 'cpk' : capabilityMetric;
    return calculateCapabilityControlLimits(channels, metric);
  }, [channels, capabilityMetric]);

  // Determine control status for each channel
  const controlStatus = useMemo(() => {
    if (!controlLimits) return new Map<string, CapabilityControlStatus>();
    const metric = capabilityMetric === 'both' ? 'cpk' : capabilityMetric;
    return getCapabilityControlStatus(channels, controlLimits, metric);
  }, [channels, controlLimits, capabilityMetric]);

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

  // Y scale - capability metric values with control limits and target
  const yScale = useMemo(() => {
    if (channels.length === 0) {
      return scaleLinear({ range: [height, 0], domain: [0, 2] });
    }

    let metricValues: number[];
    if (capabilityMetric === 'both') {
      // Include both Cp and Cpk values when in 'both' mode
      const cpValues = channels.map(c => c.cp ?? 0).filter(v => v > 0);
      const cpkValues = channels.map(c => c.cpk ?? 0).filter(v => v > 0);
      metricValues = [...cpValues, ...cpkValues];
    } else {
      metricValues = channels.map(c => c[capabilityMetric] ?? 0).filter(v => v > 0);
    }

    let minMetric = Math.min(...metricValues, 0);
    let maxMetric = Math.max(...metricValues, 2);

    // Include control limits in scale
    if (controlLimits) {
      minMetric = Math.min(minMetric, controlLimits.lcl);
      maxMetric = Math.max(maxMetric, controlLimits.ucl);
    }

    // Include target in scale
    maxMetric = Math.max(maxMetric, cpkTarget);

    const padding = (maxMetric - minMetric) * 0.1;

    return scaleLinear({
      range: [height, 0],
      domain: [Math.min(minMetric - padding, 0), maxMetric + padding],
      nice: true,
    });
  }, [channels, height, capabilityMetric, controlLimits, cpkTarget]);

  // Label Collision Detection (adapted from PWA IChart)
  const resolvedLabels = useMemo(() => {
    const labels: Array<{
      y: number;
      text: string;
      fill: string;
    }> = [];

    // Collect control limit labels (when available)
    if (controlLimits) {
      labels.push({
        y: yScale(controlLimits.ucl),
        text: `UCL: ${controlLimits.ucl.toFixed(2)}`,
        fill: chrome.axisSecondary,
      });
      labels.push({
        y: yScale(controlLimits.mean),
        text: `Mean: ${controlLimits.mean.toFixed(2)}`,
        fill: chartColors.mean,
      });
      labels.push({
        y: yScale(controlLimits.lcl),
        text: `LCL: ${controlLimits.lcl.toFixed(2)}`,
        fill: chrome.axisSecondary,
      });
    }

    // Add target label
    labels.push({
      y: yScale(cpkTarget),
      text: `Target: ${cpkTarget.toFixed(2)}`,
      fill: chartColors.target,
    });

    // Sort by Y position (top to bottom)
    labels.sort((a, b) => a.y - b.y);

    // Apply collision resolution
    const minSpacing = (fonts.statLabel || 10) + 2;

    for (let i = 1; i < labels.length; i++) {
      const prev = labels[i - 1];
      const curr = labels[i];
      if (curr.y < prev.y + minSpacing) {
        curr.y = prev.y + minSpacing; // Push down overlapping labels
      }
    }

    return labels;
  }, [
    controlLimits,
    cpkTarget,
    yScale,
    fonts.statLabel,
    chrome.axisSecondary,
    chartColors.mean,
    chartColors.target,
  ]);

  const xTickCount = getResponsiveTickCount(width, 'x');

  // Get point color based on control status (I-Chart style)
  const getPointColor = (channelId: string): string => {
    const status = controlStatus.get(channelId);
    if (!status) return chrome.labelSecondary;

    // Out of control = red, in control = blue
    if (!status.inControl || status.nelsonRule2Violation) {
      return chartColors.fail; // Red
    }
    return chartColors.mean; // Blue (in-control)
  };

  const showTooltip = (channel: ChannelResult, index: number) => {
    const x = (xScale(index.toString()) ?? 0) + xScale.bandwidth() / 2;
    // Use cpk value for tooltip positioning when in 'both' mode
    const yValue =
      capabilityMetric === 'both' ? (channel.cpk ?? 0) : (channel[capabilityMetric] ?? 0);
    const y = yScale(yValue);
    const status = controlStatus.get(channel.id);
    setTooltipData({ channel, x, y, status });
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

          {/* Control Limits (when available) */}
          {controlLimits && (
            <>
              <SpecLimitLine
                value={controlLimits.ucl}
                type="ucl"
                yScale={yScale}
                width={width}
                fonts={fonts}
                showLabel={false}
                decimalPlaces={2}
              />
              <SpecLimitLine
                value={controlLimits.mean}
                type="mean"
                yScale={yScale}
                width={width}
                fonts={fonts}
                showLabel={false}
                decimalPlaces={2}
              />
              <SpecLimitLine
                value={controlLimits.lcl}
                type="lcl"
                yScale={yScale}
                width={width}
                fonts={fonts}
                showLabel={false}
                decimalPlaces={2}
              />
            </>
          )}

          {/* Target line (user-defined reference) */}
          <SpecLimitLine
            value={cpkTarget}
            type="target"
            yScale={yScale}
            width={width}
            fonts={fonts}
            showLabel={false}
            decimalPlaces={2}
          />

          {/* Data points */}
          {channels.map((channel, i) => {
            const x = (xScale(i.toString()) ?? 0) + xScale.bandwidth() / 2;
            const isSelected = selectedMeasure === channel.id;

            if (capabilityMetric === 'both') {
              // Render BOTH Cp and Cpk dots
              const cpValue = channel.cp ?? 0;
              const cpkValue = channel.cpk ?? 0;

              return (
                <Group key={channel.id}>
                  {/* Cpk dot (darker blue) */}
                  <Circle
                    cx={x}
                    cy={yScale(cpkValue)}
                    r={isSelected ? 8 : 5}
                    fill={chartColors.mean} // #3b82f6 (darker)
                    stroke={isSelected ? '#fff' : chrome.pointStroke}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={selectedMeasure && !isSelected ? 0.4 : 1}
                    style={{ cursor: onChannelClick ? 'pointer' : 'default' }}
                    onClick={() => onChannelClick?.(channel.id)}
                    onMouseEnter={() => showTooltip(channel, i)}
                    onMouseLeave={hideTooltip}
                    {...getDataPointA11yProps(
                      'Cpk',
                      cpkValue,
                      i,
                      onChannelClick ? () => onChannelClick(channel.id) : undefined
                    )}
                  />
                  {isSelected && (
                    <Circle
                      cx={x}
                      cy={yScale(cpkValue)}
                      r={12}
                      fill="transparent"
                      stroke={chartColors.mean}
                      strokeWidth={2}
                      className="animate-pulse"
                      pointerEvents="none"
                    />
                  )}
                  {/* Cp dot (lighter blue) */}
                  <Circle
                    cx={x}
                    cy={yScale(cpValue)}
                    r={isSelected ? 8 : 5}
                    fill={chartColors.meanAlt} // #60a5fa (lighter)
                    stroke={isSelected ? '#fff' : chrome.pointStroke}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={selectedMeasure && !isSelected ? 0.4 : 1}
                    style={{ cursor: onChannelClick ? 'pointer' : 'default' }}
                    onClick={() => onChannelClick?.(channel.id)}
                    onMouseEnter={() => showTooltip(channel, i)}
                    onMouseLeave={hideTooltip}
                    {...getDataPointA11yProps(
                      'Cp',
                      cpValue,
                      i,
                      onChannelClick ? () => onChannelClick(channel.id) : undefined
                    )}
                  />
                  {isSelected && (
                    <Circle
                      cx={x}
                      cy={yScale(cpValue)}
                      r={12}
                      fill="transparent"
                      stroke={chartColors.meanAlt}
                      strokeWidth={2}
                      className="animate-pulse"
                      pointerEvents="none"
                    />
                  )}
                </Group>
              );
            } else {
              // Render single dot (existing logic)
              const metricValue = channel[capabilityMetric] ?? 0;
              const y = yScale(metricValue);
              const pointColor = getPointColor(channel.id);

              return (
                <Group key={channel.id}>
                  <Circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 8 : 5}
                    fill={pointColor}
                    stroke={isSelected ? '#fff' : chrome.pointStroke}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={selectedMeasure && !isSelected ? 0.4 : 1}
                    style={{ cursor: onChannelClick ? 'pointer' : 'default' }}
                    onClick={() => onChannelClick?.(channel.id)}
                    onMouseEnter={() => showTooltip(channel, i)}
                    onMouseLeave={hideTooltip}
                    {...getDataPointA11yProps(
                      metricLabel,
                      metricValue,
                      i,
                      onChannelClick ? () => onChannelClick(channel.id) : undefined
                    )}
                  />
                  {isSelected && (
                    <Circle
                      cx={x}
                      cy={y}
                      r={12}
                      fill="transparent"
                      stroke={chartColors.mean}
                      strokeWidth={2}
                      className="animate-pulse"
                      pointerEvents="none"
                    />
                  )}
                </Group>
              );
            }
          })}

          {/* Render collision-resolved limit labels */}
          {resolvedLabels.map((label, i) => (
            <text
              key={i}
              x={width + 4}
              y={label.y}
              fill={label.fill}
              fontSize={fonts.statLabel}
              textAnchor="start"
              dominantBaseline="middle"
            >
              {label.text}
            </text>
          ))}

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

        {/* Control Status Legend (optional) */}
        {showLegend && capabilityMetric !== 'both' && (
          <ChartLegend
            mode="practical"
            width={parentWidth}
            top={parentHeight - (showBranding ? sourceBarHeight + 30 : 30)}
            show={showLegend}
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
            {/* Control status */}
            {tooltipData.status && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    tooltipData.status.inControl && !tooltipData.status.nelsonRule2Violation
                      ? chartColors.mean
                      : chartColors.fail,
                }}
              >
                {!tooltipData.status.inControl
                  ? 'Out of control (beyond UCL/LCL)'
                  : tooltipData.status.nelsonRule2Violation
                    ? 'Nelson Rule 2 violation'
                    : 'In control'}
              </div>
            )}
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
};

const PerformanceIChart = withParentSize(PerformanceIChartBase);
export default PerformanceIChart;
