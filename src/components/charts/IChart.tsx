import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { LinePath, Circle } from '@visx/shape';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { withParentSize } from '@visx/responsive';
import { useData } from '../../context/DataContext';
import { useChartScale } from '../../hooks/useChartScale';

interface IChartProps {
    parentWidth: number;
    parentHeight: number;
}

const margin = { top: 40, right: 40, bottom: 60, left: 60 };

const IChart = ({ parentWidth, parentHeight }: IChartProps) => {
    const { filteredData, outcome, timeColumn, stats, specs, grades } = useData();

    const width = Math.max(0, parentWidth - margin.left - margin.right);
    const height = Math.max(0, parentHeight - margin.top - margin.bottom);

    const data = useMemo(() => {
        if (!outcome) return [];
        return filteredData.map((d: any, i: number) => ({
            x: timeColumn ? new Date(d[timeColumn]) : i,
            y: Number(d[outcome])
        })).filter((d: any) => !isNaN(d.y));
    }, [filteredData, outcome, timeColumn]);

    const xScale = useMemo(() => {
        if (timeColumn) {
            return scaleTime({
                range: [0, width],
                domain: [
                    Math.min(...data.map((d: any) => (d.x as Date).getTime())),
                    Math.max(...data.map((d: any) => (d.x as Date).getTime()))
                ]
            });
        }
        return scaleLinear({
            range: [0, width],
            domain: [0, data.length - 1]
        });
    }, [data, width, timeColumn]);

    const { min, max } = useChartScale();

    const yScale = useMemo(() => {
        return scaleLinear({
            range: [height, 0],
            domain: [min, max],
            nice: true
        });
    }, [height, min, max]);

    if (!outcome || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500 italic">
                No data available for I-Chart
            </div>
        );
    }

    // Helper to get color for a value
    const getPointColor = (val: number) => {
        if (grades && grades.length > 0) {
            // Find the lowest grade max that the value satisfies
            const grade = grades.find(g => val <= g.max);
            // If it exceeds all grades (e.g. Off-Grade), use the last one's color or red
            if (!grade) return grades[grades.length - 1].color;
            return grade.color;
        }

        // Fallback to USL/LSL logic
        if ((specs.usl !== undefined && val > specs.usl) ||
            (specs.lsl !== undefined && val < specs.lsl)) {
            return "#ef4444";
        }
        return "#007FBD";
    };

    return (
        <svg width={parentWidth} height={parentHeight}>
            <Group left={margin.left} top={margin.top}>

                {/* Grade Bands (Background) */}
                {grades && grades.length > 0 && grades.map((grade, i) => {
                    const prevMax = i === 0 ? 0 : grades[i - 1].max;
                    if (grade.max > yScale.domain()[1] && prevMax > yScale.domain()[1]) return null;

                    const yTop = yScale(Math.min(grade.max, yScale.domain()[1]));
                    const yBottom = yScale(Math.max(prevMax, yScale.domain()[0]));
                    const bandHeight = Math.abs(yBottom - yTop);

                    if (bandHeight <= 0) return null;

                    return (
                        <rect
                            key={i}
                            x={0}
                            y={yTop}
                            width={width}
                            height={bandHeight}
                            fill={grade.color}
                            opacity={0.1}
                        />
                    );
                })}

                <GridRows scale={yScale} width={width} stroke="#1e293b" />
                <GridColumns scale={xScale} height={height} stroke="#1e293b" />

                {/* Spec Lines (Only if grades are NOT used or if distinct) */}
                {(!grades || grades.length === 0) && specs.usl !== undefined && (
                    <line
                        x1={0} x2={width}
                        y1={yScale(specs.usl)} y2={yScale(specs.usl)}
                        stroke="#ef4444" strokeWidth={2} strokeDasharray="4,4"
                    />
                )}
                {(!grades || grades.length === 0) && specs.lsl !== undefined && (
                    <line
                        x1={0} x2={width}
                        y1={yScale(specs.lsl)} y2={yScale(specs.lsl)}
                        stroke="#ef4444" strokeWidth={2} strokeDasharray="4,4"
                    />
                )}

                {/* Control Limits (always show lines) */}
                {stats && (
                    <>
                        <line
                            x1={0} x2={width}
                            y1={yScale(stats.ucl)} y2={yScale(stats.ucl)}
                            stroke="#64748b" strokeWidth={1} strokeDasharray="4,4"
                        />
                        <line
                            x1={0} x2={width}
                            y1={yScale(stats.lcl)} y2={yScale(stats.lcl)}
                            stroke="#64748b" strokeWidth={1} strokeDasharray="4,4"
                        />
                        <line
                            x1={0} x2={width}
                            y1={yScale(stats.mean)} y2={yScale(stats.mean)}
                            stroke="#64748b" strokeWidth={1}
                        />
                    </>
                )}

                <LinePath
                    data={data}
                    x={d => xScale(d.x as any)}
                    y={d => yScale(d.y)}
                    stroke="#94a3b8"
                    strokeWidth={2}
                />

                {data.map((d: any, i: number) => (
                    <Circle
                        key={i}
                        cx={xScale(d.x as any)}
                        cy={yScale(d.y)}
                        r={4}
                        fill={getPointColor(d.y)}
                        stroke="#0f172a"
                        strokeWidth={1}
                    />
                ))}

                <AxisLeft
                    scale={yScale}
                    stroke="#94a3b8"
                    tickStroke="#94a3b8"
                    label={outcome}
                    labelProps={{
                        fill: '#cbd5e1',
                        fontSize: 12,
                        textAnchor: 'middle',
                        dx: -40
                    }}
                    tickLabelProps={() => ({
                        fill: '#cbd5e1',
                        fontSize: 10,
                        textAnchor: 'end',
                        dx: -4,
                        dy: 3,
                    })}
                />
                <AxisBottom
                    top={height}
                    scale={xScale}
                    stroke="#94a3b8"
                    tickStroke="#94a3b8"
                    numTicks={width > 500 ? 10 : 5}
                    label={timeColumn ? "Time" : "Sequence"}
                    labelProps={{
                        fill: '#cbd5e1',
                        fontSize: 12,
                        textAnchor: 'middle',
                    }}
                    tickLabelProps={() => ({
                        fill: '#cbd5e1',
                        fontSize: 10,
                        textAnchor: 'middle',
                        dy: 2,
                    })}
                />
            </Group>
        </svg>
    );
};

export default withParentSize(IChart);
