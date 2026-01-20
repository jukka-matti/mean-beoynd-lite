import { useMemo, useState } from 'react';
import { Group } from '@visx/group';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Line } from '@visx/shape';
import { useTooltip, TooltipWithBounds } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import {
  calculateChannelPerformance,
  sortChannels,
  CPK_THRESHOLDS,
  type ChannelResult,
  type SpecLimits,
  type DataRow,
} from '@variscout/core';
import { getSample } from '@variscout/data';
import { chromeColors } from '@variscout/charts';
import ChartContainer from './ChartContainer';

interface PerformanceDemoProps {
  sampleKey: string;
  height?: number;
  showBranding?: boolean;
}

// Simplified two-color scheme: below target / meets target
const TARGET_CPK = CPK_THRESHOLDS.warning; // 1.33

const getPointColor = (cpk: number): string => {
  return cpk >= TARGET_CPK ? '#22c55e' : '#ef4444'; // green-500 / red-500
};

/**
 * Performance Analysis demo chart for website tool page.
 * Shows Cpk by channel as a dot plot with single target line.
 */
export default function PerformanceDemo({
  sampleKey,
  height = 550,
  showBranding = true,
}: PerformanceDemoProps) {
  const sample = getSample(sampleKey);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const { showTooltip, hideTooltip, tooltipOpen, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip<ChannelResult>();

  // Calculate channel performance
  const performanceData = useMemo(() => {
    if (!sample || !sample.config.channelColumns || !sample.config.specs) {
      return null;
    }

    const specs: SpecLimits = sample.config.specs;
    const channels = sample.config.channelColumns;

    // Cast to DataRow[] - sample data structure is compatible
    const data = sample.data as DataRow[];
    return calculateChannelPerformance(data, channels, specs);
  }, [sample]);

  // Calculate summary counts for simplified display
  const summaryCounts = useMemo(() => {
    if (!performanceData) return { belowTarget: 0, meetsTarget: 0 };

    let belowTarget = 0;
    let meetsTarget = 0;

    performanceData.channels.forEach(channel => {
      const cpk = channel.cpk ?? 0;
      if (cpk >= TARGET_CPK) {
        meetsTarget++;
      } else {
        belowTarget++;
      }
    });

    return { belowTarget, meetsTarget };
  }, [performanceData]);

  if (!sample || !performanceData) {
    return (
      <div
        className="flex items-center justify-center bg-slate-900 rounded-lg text-slate-500"
        style={{ height }}
      >
        Sample "{sampleKey}" not found or not in wide format
      </div>
    );
  }

  // Sort channels by name for display
  const sortedChannels = sortChannels(performanceData.channels, 'name');

  return (
    <ChartContainer height={height}>
      {({ width, height: containerHeight }) => {
        const margin = { top: 40, right: 50, bottom: 60, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = containerHeight - margin.top - margin.bottom;

        // X scale - categorical channels
        const xScale = scaleBand({
          domain: sortedChannels.map(c => c.label),
          range: [0, innerWidth],
          padding: 0.2,
        });

        // Y scale - Cpk values (0 to max + some padding)
        const maxCpk = Math.max(...sortedChannels.map(c => c.cpk ?? 0), TARGET_CPK + 0.5);
        const yScale = scaleLinear({
          domain: [0, Math.ceil(maxCpk * 10) / 10 + 0.3],
          range: [innerHeight, 0],
          nice: true,
        });

        const handleMouseMove = (event: React.MouseEvent, channel: ChannelResult) => {
          const coords = localPoint(event);
          if (coords) {
            showTooltip({
              tooltipData: channel,
              tooltipLeft: coords.x,
              tooltipTop: coords.y - 10,
            });
          }
        };

        return (
          <>
            <svg width={width} height={containerHeight}>
              <Group left={margin.left} top={margin.top}>
                {/* Single target line at 1.33 */}
                <Line
                  from={{ x: 0, y: yScale(TARGET_CPK) }}
                  to={{ x: innerWidth, y: yScale(TARGET_CPK) }}
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="6,4"
                  opacity={0.8}
                />

                {/* Target line label */}
                <text
                  x={innerWidth + 5}
                  y={yScale(TARGET_CPK)}
                  fill="#06b6d4"
                  fontSize={11}
                  fontWeight={500}
                  alignmentBaseline="middle"
                >
                  1.33
                </text>

                {/* Channel dots */}
                {sortedChannels.map(channel => {
                  const cpk = channel.cpk ?? 0;
                  const x = (xScale(channel.label) ?? 0) + xScale.bandwidth() / 2;
                  const y = yScale(cpk);
                  const isSelected = selectedChannel === channel.id;
                  const color = getPointColor(cpk);

                  return (
                    <circle
                      key={channel.id}
                      cx={x}
                      cy={y}
                      r={isSelected ? 10 : 8}
                      fill={color}
                      stroke={isSelected ? '#fff' : chromeColors.pointStroke}
                      strokeWidth={isSelected ? 3 : 2}
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onClick={() => setSelectedChannel(isSelected ? null : channel.id)}
                      onMouseMove={e => handleMouseMove(e, channel)}
                      onMouseLeave={hideTooltip}
                    />
                  );
                })}

                {/* X Axis - Channels */}
                <AxisBottom
                  top={innerHeight}
                  scale={xScale}
                  stroke={chromeColors.axisPrimary}
                  tickStroke={chromeColors.axisPrimary}
                  tickLabelProps={() => ({
                    fill: chromeColors.labelPrimary,
                    fontSize: 11,
                    textAnchor: 'middle',
                    dy: '0.25em',
                  })}
                  label="Head"
                  labelProps={{
                    fill: chromeColors.labelSecondary,
                    fontSize: 12,
                    textAnchor: 'middle',
                    dy: 40,
                  }}
                />

                {/* Y Axis - Cpk */}
                <AxisLeft
                  scale={yScale}
                  stroke={chromeColors.axisPrimary}
                  tickStroke={chromeColors.axisPrimary}
                  tickLabelProps={() => ({
                    fill: chromeColors.labelPrimary,
                    fontSize: 11,
                    textAnchor: 'end',
                    dx: '-0.25em',
                    dy: '0.25em',
                  })}
                  label="Cpk"
                  labelProps={{
                    fill: chromeColors.labelSecondary,
                    fontSize: 12,
                    textAnchor: 'middle',
                    dx: -40,
                  }}
                />
              </Group>

              {/* Simplified health summary legend */}
              <Group left={margin.left} top={10}>
                {summaryCounts.belowTarget > 0 && (
                  <Group left={0}>
                    <circle cx={6} cy={6} r={5} fill="#ef4444" />
                    <text
                      x={16}
                      y={6}
                      fill={chromeColors.labelPrimary}
                      fontSize={11}
                      alignmentBaseline="middle"
                    >
                      {summaryCounts.belowTarget} below target
                    </text>
                  </Group>
                )}
                {summaryCounts.meetsTarget > 0 && (
                  <Group left={summaryCounts.belowTarget > 0 ? 120 : 0}>
                    <circle cx={6} cy={6} r={5} fill="#22c55e" />
                    <text
                      x={16}
                      y={6}
                      fill={chromeColors.labelPrimary}
                      fontSize={11}
                      alignmentBaseline="middle"
                    >
                      {summaryCounts.meetsTarget} meets target
                    </text>
                  </Group>
                )}
              </Group>
            </svg>

            {/* Tooltip */}
            {tooltipOpen && tooltipData && (
              <TooltipWithBounds
                left={tooltipLeft}
                top={tooltipTop}
                style={{
                  backgroundColor: chromeColors.tooltipBg,
                  color: chromeColors.tooltipText,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  border: `1px solid ${chromeColors.tooltipBorder}`,
                }}
              >
                <div
                  className="font-semibold"
                  style={{ color: getPointColor(tooltipData.cpk ?? 0) }}
                >
                  {tooltipData.label}
                </div>
                <div className="mt-1 space-y-0.5">
                  <div>
                    Cpk: <span className="font-mono">{tooltipData.cpk?.toFixed(2) ?? 'N/A'}</span>
                  </div>
                  <div>
                    Mean: <span className="font-mono">{tooltipData.mean.toFixed(2)}</span>
                  </div>
                  <div>
                    Std Dev: <span className="font-mono">{tooltipData.stdDev.toFixed(3)}</span>
                  </div>
                  <div>
                    n: <span className="font-mono">{tooltipData.n}</span>
                  </div>
                </div>
              </TooltipWithBounds>
            )}

            {/* Branding */}
            {showBranding && (
              <div className="absolute bottom-2 right-4 text-xs text-slate-500">VariScout Lite</div>
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
