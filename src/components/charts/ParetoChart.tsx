import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Bar, LinePath, Circle } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { withParentSize } from '@visx/responsive';
import * as d3 from 'd3';
import { useData } from '../../context/DataContext';

interface ParetoChartProps {
    factor: string;
    parentWidth: number;
    parentHeight: number;
}

const margin = { top: 20, right: 20, bottom: 60, left: 60 };

const ParetoChart = ({ factor, parentWidth, parentHeight }: ParetoChartProps) => {
    const { filteredData, filters, setFilters } = useData();

    const { data, totalCount } = useMemo(() => {
        const counts = d3.rollup(filteredData, (v: any) => v.length, (d: any) => d[factor]);
        let sorted = Array.from(counts, ([key, value]: any) => ({ key, value }))
            .sort((a: any, b: any) => b.value - a.value);

        const total = d3.sum(sorted, d => d.value);
        let cumulative = 0;
        const withCumulative = sorted.map(d => {
            cumulative += d.value;
            return { ...d, cumulative, cumulativePercentage: (cumulative / total) * 100 };
        });

        return { data: withCumulative, totalCount: total };
    }, [filteredData, factor]);

    const width = Math.max(0, parentWidth - margin.left - margin.right);
    const height = Math.max(0, parentHeight - margin.top - margin.bottom);

    const xScale = useMemo(() => scaleBand({
        range: [0, width],
        domain: data.map(d => d.key),
        padding: 0.2
    }), [data, width]);

    const yScale = useMemo(() => scaleLinear({
        range: [height, 0],
        domain: [0, Math.max(0, ...data.map(d => d.value))],
        nice: true
    }), [data, height]);

    const yPercScale = useMemo(() => scaleLinear({
        range: [height, 0],
        domain: [0, 100],
    }), [height]);

    const handleBarClick = (key: any) => {
        const currentFilters = filters[factor] || [];
        const newFilters = currentFilters.includes(key)
            ? currentFilters.filter(v => v !== key)
            : [...currentFilters, key];

        setFilters({ ...filters, [factor]: newFilters });
    };

    if (data.length === 0) return null;

    return (
        <svg width={parentWidth} height={parentHeight}>
            <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={width} stroke="#1e293b" />

                {/* Bars */}
                {data.map((d, i) => {
                    const isSelected = (filters[factor] || []).includes(d.key);
                    return (
                        <Bar
                            key={i}
                            x={xScale(d.key)}
                            y={yScale(d.value)}
                            width={xScale.bandwidth()}
                            height={height - yScale(d.value)}
                            fill={isSelected ? "#007FBD" : "#475569"}
                            rx={4}
                            onClick={() => handleBarClick(d.key)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    );
                })}

                {/* 80% Reference Line */}
                <line
                    x1={0} x2={width}
                    y1={yPercScale(80)} y2={yPercScale(80)}
                    stroke="#FF8213" strokeWidth={1} strokeDasharray="4,4"
                    opacity={0.8}
                />
                <text x={width - 5} y={yPercScale(80) - 5} fill="#FF8213" fontSize={10} textAnchor="end">80%</text>

                {/* Cumulative Line */}
                <LinePath
                    data={data}
                    x={d => (xScale(d.key) || 0) + xScale.bandwidth() / 2}
                    y={d => yPercScale(d.cumulativePercentage)}
                    stroke="#FF8213"
                    strokeWidth={2}
                />
                {data.map((d, i) => (
                    <Circle
                        key={i}
                        cx={(xScale(d.key) || 0) + xScale.bandwidth() / 2}
                        cy={yPercScale(d.cumulativePercentage)}
                        r={3}
                        fill="#FF8213"
                        stroke="#0f172a"
                        strokeWidth={1}
                    />
                ))}

                {/* Axes */}
                <AxisLeft
                    scale={yScale}
                    stroke="#94a3b8"
                    tickStroke="#94a3b8"
                    label="Count"
                    labelProps={{
                        fill: '#cbd5e1', fontSize: 10, textAnchor: 'middle', dx: -35
                    }}
                    tickLabelProps={() => ({
                        fill: '#cbd5e1', fontSize: 10, textAnchor: 'end', dx: -4, dy: 3
                    })}
                />
                <AxisRight
                    scale={yPercScale}
                    left={width}
                    stroke="#94a3b8"
                    tickStroke="#94a3b8"
                    label="Cumulative %"
                    labelProps={{
                        fill: '#cbd5e1', fontSize: 10, textAnchor: 'middle', dx: 35
                    }}
                    tickLabelProps={() => ({
                        fill: '#cbd5e1', fontSize: 10, textAnchor: 'start', dx: 4, dy: 3
                    })}
                />
                <AxisBottom
                    top={height}
                    scale={xScale}
                    stroke="#94a3b8"
                    tickStroke="#94a3b8"
                    label={factor}
                    labelProps={{
                        fill: '#cbd5e1', fontSize: 10, textAnchor: 'middle', dy: 0
                    }}
                    tickLabelProps={() => ({
                        fill: '#cbd5e1', fontSize: 10, textAnchor: 'middle', dy: 2
                    })}
                />
            </Group>
        </svg>
    );
};

export default withParentSize(ParetoChart);
