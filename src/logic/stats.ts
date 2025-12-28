import * as d3 from 'd3';

export interface StatsResult {
    mean: number;
    stdDev: number;
    ucl: number;
    lcl: number;
    cp?: number;
    cpk?: number;
    outOfSpecPercentage: number;
    gradeCounts?: { label: string; count: number; percentage: number; color: string }[];
}

export function calculateStats(
    data: number[],
    usl?: number,
    lsl?: number,
    grades?: { max: number; label: string; color: string }[]
): StatsResult {
    if (data.length === 0) {
        return { mean: 0, stdDev: 0, ucl: 0, lcl: 0, outOfSpecPercentage: 0 };
    }

    const mean = d3.mean(data) || 0;
    const stdDev = d3.deviation(data) || 0;

    // Simple I-Chart Control Limits (3-sigma)
    const ucl = mean + 3 * stdDev;
    const lcl = mean - 3 * stdDev;

    let cp: number | undefined;
    let cpk: number | undefined;

    if (usl !== undefined && lsl !== undefined) {
        cp = (usl - lsl) / (6 * stdDev);
        const cpu = (usl - mean) / (3 * stdDev);
        const cpl = (mean - lsl) / (3 * stdDev);
        cpk = Math.min(cpu, cpl);
    } else if (usl !== undefined) {
        cpk = (usl - mean) / (3 * stdDev);
    } else if (lsl !== undefined) {
        cpk = (mean - lsl) / (3 * stdDev);
    }

    const outOfSpec = data.filter(d => {
        if (usl !== undefined && d > usl) return true;
        if (lsl !== undefined && d < lsl) return true;
        return false;
    });

    const outOfSpecPercentage = (outOfSpec.length / data.length) * 100;

    // Calculate Grade Counts if grades exist
    let gradeCounts: { label: string; count: number; percentage: number; color: string }[] | undefined;
    if (grades && grades.length > 0) {
        // Initialize counts
        const counts = new Map<string, number>();
        grades.forEach(g => counts.set(g.label, 0));

        // Count each data point
        data.forEach(val => {
            const grade = grades.find(g => val <= g.max);
            if (grade) {
                counts.set(grade.label, (counts.get(grade.label) || 0) + 1);
            } else {
                // Should technically be caught by last grade if it's high enough, 
                // but if not, it falls into the last bucket or a "Below" bucket implied
                // For this logic, we'll attribute to the last grade if > all max
                const lastGrade = grades[grades.length - 1];
                counts.set(lastGrade.label, (counts.get(lastGrade.label) || 0) + 1);
            }
        });

        gradeCounts = grades.map(g => ({
            label: g.label,
            color: g.color,
            count: counts.get(g.label) || 0,
            percentage: ((counts.get(g.label) || 0) / data.length) * 100
        }));
    }

    return {
        mean,
        stdDev,
        ucl,
        lcl,
        cp,
        cpk,
        outOfSpecPercentage,
        gradeCounts
    };
}

export function getEtaSquared(data: any[], factor: string, outcome: string): number {
    // Simple One-Way ANOVA effect size calculation
    // η² = SS_between / SS_total

    const totalMean = d3.mean(data, d => d[outcome]) || 0;
    const ssTotal = d3.sum(data, d => Math.pow(d[outcome] - totalMean, 2));

    const groups = d3.group(data, d => d[factor]);
    let ssBetween = 0;

    groups.forEach((groupData, key) => {
        const groupMean = d3.mean(groupData, d => d[outcome]) || 0;
        ssBetween += groupData.length * Math.pow(groupMean - totalMean, 2);
    });

    return ssTotal === 0 ? 0 : ssBetween / ssTotal;
}
