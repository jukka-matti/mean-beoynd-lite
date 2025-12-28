import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { withParentSize } from '@visx/responsive';
import * as d3 from 'd3';
import { useData } from '../../context/DataContext';
import { useChartScale } from '../../hooks/useChartScale';

interface BoxplotProps {
    factor: string;
    parentWidth: number;
    parentHeight: number;
}

const margin = { top: 20, right: 20, bottom: 60, left: 60 };

const Boxplot = ({ factor, parentWidth, parentHeight }: BoxplotProps) => {
    const { filteredData, outcome, filters, setFilters } = useData();

    const data = useMemo(() => {
        if (!outcome) return [];
        const groups = d3.group(filteredData, (d: any) => d[factor]);
        return Array.from(groups, ([key, values]) => {
            const v = values.map((d: any) => Number(d[outcome])).filter(val => !isNaN(val)).sort(d3.ascending);
            if (v.length === 0) return null;
            const q1 = d3.quantile(v, 0.25) || 0;
            const median = d3.quantile(v, 0.5) || 0;
            const q3 = d3.quantile(v, 0.75) || 0;
            const iqr = q3 - q1;
            const min = Math.max(v[0], q1 - 1.5 * iqr);
            const max = Math.min(v[v.length - 1], q3 + 1.5 * iqr);
            return { key, q1, median, q3, min, max, outliers: v.filter(x => x < min || x > max) };
        }).filter(d => d !== null) as any[];
    }, [filteredData, factor, outcome]);

    const width = Math.max(0, parentWidth - margin.left - margin.right);
    const height = Math.max(0, parentHeight - margin.top - margin.bottom);

    const xScale = useMemo(() => scaleBand({
        range: [0, width],
        domain: data.map(d => d.key),
        padding: 0.4
    }), [data, width]);

    const { min, max } = useChartScale();

    const yScale = useMemo(() => {
        return scaleLinear({
            range: [height, 0],
            domain: [min, max],
            nice: true
        });
    }, [height, min, max]);

    const handleBoxClick = (key: string) => {
        const currentFilters = filters[factor] || [];
        const newFilters = currentFilters.includes(key)
            ? currentFilters.filter(v => v !== key)
            : [...currentFilters, key];

        setFilters({ ...filters, [factor]: newFilters });
    };

    if (!outcome || data.length === 0) return null;

    return (
        <svg width={parentWidth} height={parentHeight}>
            <Group left={margin.left} top={margin.top}>
                {data.map((d: any, i: number) => {
                    const x = xScale(d.key) || 0;
                    const barWidth = xScale.bandwidth();
                    const isSelected = (filters[factor] || []).includes(d.key);
                    const opacity = filters[factor] && filters[factor].length > 0 && !isSelected ? 0.3 : 1;

                    return (
                        <Group
                            key={i}
                            onClick={() => handleBoxClick(d.key)}
                            className="cursor-pointer"
                            opacity={opacity}
                        >
                            {/* Transparent capture rect for better clickability */}
                            <rect
                                x={x - 5}
                                y={0}
                                width={barWidth + 10}
                                height={height}
                                fill="transparent"
                            />

                            {/* Whisker Line */}
                            <line
                                x1={x + barWidth / 2}
                                x2={x + barWidth / 2}
                                y1={yScale(d.min)}
                                y2={yScale(d.max)}
                                stroke="#94a3b8"
                                strokeWidth={1}
                            />

                            {/* Box */}
                            <rect
                                x={x}
                                y={yScale(d.q3)}
                                width={barWidth}
                                height={Math.abs(yScale(d.q1) - yScale(d.q3))}
                                fill="#007FBD"
                                stroke="#005a8c"
                                rx={2}
                            />

                            {/* Median Line */}
                            <line
                                x1={x}
                                x2={x + barWidth}
                                y1={yScale(d.median)}
                                y2={yScale(d.median)}
                                stroke="#FF8213"
                                strokeWidth={2}
                            />

                            {/* Outliers */}
                            {d.outliers.map((o: number, j: number) => (
                                <circle
                                    key={j}
                                    cx={x + barWidth / 2}
                                    cy={yScale(o)}
                                    r={3}
                                    fill="#ef4444"
                                    opacity={0.6}
                                />
                            ))}
                        </Group>
                    );
                })}
                <AxisLeft
                    scale={yScale}
                    stroke="#94a3b8"
                    tickStroke="#94a3b8"
                    label={outcome || ''}
                    labelProps={{
                        fill: '#94a3b8',
                        fontSize: 10,
                        textAnchor: 'middle',
                        dx: -35
                    }}
                />
                <AxisBottom
                    top={height}
                    scale={xScale}
                    stroke="#94a3b8"
                    tickStroke="#94a3b8"
                    label={factor}
                    labelProps={{
                        fill: '#94a3b8',
                        fontSize: 10,
                        textAnchor: 'middle',
                        dy: 0
                    }}
                />
            </Group>
        </svg>
    );
};

export default withParentSize(Boxplot);
