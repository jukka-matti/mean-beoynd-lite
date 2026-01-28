import { describe, it, expect } from 'vitest';
import { simulateDirectAdjustment } from '../variation';

describe('simulateDirectAdjustment', () => {
  describe('basic adjustments', () => {
    it('returns unchanged stats when adjustments are zero', () => {
      const currentStats = { mean: 100, stdDev: 2.0, cpk: 1.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      expect(result.projectedMean).toBe(100);
      expect(result.projectedStdDev).toBe(2.0);
      expect(result.projectedCpk).toBeCloseTo(1.0, 2);
    });

    it('applies mean shift correctly', () => {
      const currentStats = { mean: 102.5, stdDev: 2.0 };
      const result = simulateDirectAdjustment(currentStats, {
        meanShift: -2.5,
        variationReduction: 0,
      });

      expect(result.projectedMean).toBe(100);
      expect(result.projectedStdDev).toBe(2.0);
    });

    it('applies positive mean shift correctly', () => {
      const currentStats = { mean: 97.5, stdDev: 2.0 };
      const result = simulateDirectAdjustment(currentStats, {
        meanShift: 2.5,
        variationReduction: 0,
      });

      expect(result.projectedMean).toBe(100);
    });

    it('applies variation reduction correctly', () => {
      const currentStats = { mean: 100, stdDev: 2.3 };
      const result = simulateDirectAdjustment(currentStats, {
        meanShift: 0,
        variationReduction: 0.3,
      });

      // 30% reduction: 2.3 * (1 - 0.3) = 2.3 * 0.7 = 1.61
      expect(result.projectedMean).toBe(100);
      expect(result.projectedStdDev).toBeCloseTo(1.61, 2);
    });
  });

  describe('capability calculations', () => {
    it('calculates Cpk with both specs', () => {
      const currentStats = { mean: 100, stdDev: 2.0, cpk: 1.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      // Cpk = min((106-100)/(3*2), (100-94)/(3*2)) = min(1, 1) = 1.0
      expect(result.projectedCpk).toBeCloseTo(1.0, 2);
      // Cp = (106-94)/(6*2) = 12/12 = 1.0
      expect(result.projectedCp).toBeCloseTo(1.0, 2);
    });

    it('calculates Cpk with only USL', () => {
      const currentStats = { mean: 100, stdDev: 2.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106 }
      );

      // Cpk = (106-100)/(3*2) = 1.0
      expect(result.projectedCpk).toBeCloseTo(1.0, 2);
      expect(result.projectedCp).toBeUndefined();
    });

    it('calculates Cpk with only LSL', () => {
      const currentStats = { mean: 100, stdDev: 2.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { lsl: 94 }
      );

      // Cpk = (100-94)/(3*2) = 1.0
      expect(result.projectedCpk).toBeCloseTo(1.0, 2);
    });

    it('significantly improves Cpk with combined adjustment', () => {
      // Process off-center with high variation
      const currentStats = { mean: 102.5, stdDev: 2.3, cpk: 0.82 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: -2.5, variationReduction: 0.3 },
        { usl: 110, lsl: 90, target: 100 }
      );

      // After adjustment: mean=100, stdDev=1.61
      // Cpk = min((110-100)/(3*1.61), (100-90)/(3*1.61)) = min(2.07, 2.07) = 2.07
      expect(result.projectedMean).toBe(100);
      expect(result.projectedStdDev).toBeCloseTo(1.61, 2);
      expect(result.projectedCpk).toBeGreaterThan(1.5);

      // Improvement should be significant
      expect(result.improvements.cpkImprovementPct).toBeGreaterThan(50);
    });
  });

  describe('yield and PPM calculations', () => {
    it('calculates yield for centered process', () => {
      const currentStats = { mean: 100, stdDev: 2.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      // For centered process with Cpk=1.0, yield should be ~99.73%
      expect(result.projectedYield).toBeGreaterThan(99);
      expect(result.projectedPPM).toBeLessThan(3000);
    });

    it('calculates yield for off-center process', () => {
      const currentStats = { mean: 103, stdDev: 2.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      // Off-center process should have lower yield
      expect(result.projectedYield).toBeLessThan(99);
      expect(result.projectedYield).toBeGreaterThan(90);
    });

    it('shows yield improvement after adjustment', () => {
      const currentStats = { mean: 103, stdDev: 2.5, cpk: 0.6 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: -3, variationReduction: 0.2 },
        { usl: 106, lsl: 94 }
      );

      // Adjustment should improve yield
      expect(result.improvements.yieldImprovementPct).toBeGreaterThan(0);
    });

    it('calculates yield with only USL', () => {
      const currentStats = { mean: 100, stdDev: 2.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106 }
      );

      // With only USL, yield = P(X <= USL)
      expect(result.projectedYield).toBeGreaterThan(99);
    });

    it('calculates yield with only LSL', () => {
      const currentStats = { mean: 100, stdDev: 2.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { lsl: 94 }
      );

      // With only LSL, yield = P(X >= LSL)
      expect(result.projectedYield).toBeGreaterThan(99);
    });
  });

  describe('edge cases', () => {
    it('handles missing specs gracefully', () => {
      const currentStats = { mean: 100, stdDev: 2.0 };
      const result = simulateDirectAdjustment(currentStats, {
        meanShift: -2,
        variationReduction: 0.2,
      });

      expect(result.projectedMean).toBe(98);
      expect(result.projectedStdDev).toBeCloseTo(1.6, 2);
      expect(result.projectedCpk).toBeUndefined();
      expect(result.projectedCp).toBeUndefined();
      expect(result.projectedYield).toBeUndefined();
      expect(result.projectedPPM).toBeUndefined();
    });

    it('handles maximum variation reduction (50%)', () => {
      const currentStats = { mean: 100, stdDev: 2.0, cpk: 1.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0.5 },
        { usl: 106, lsl: 94 }
      );

      // 50% reduction: 2.0 * 0.5 = 1.0
      expect(result.projectedStdDev).toBe(1.0);
      // Cpk doubles when stdDev halves
      expect(result.projectedCpk).toBeCloseTo(2.0, 2);
    });

    it('handles zero stdDev edge case', () => {
      const currentStats = { mean: 100, stdDev: 0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      expect(result.projectedStdDev).toBe(0);
      expect(result.projectedCpk).toBeUndefined(); // Division by zero protection
      expect(result.projectedYield).toBe(100); // Mean within specs
    });

    it('handles zero stdDev when mean outside specs', () => {
      const currentStats = { mean: 110, stdDev: 0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      expect(result.projectedYield).toBe(0); // Mean outside specs
    });

    it('handles very small variation reduction', () => {
      const currentStats = { mean: 100, stdDev: 2.0 };
      const result = simulateDirectAdjustment(currentStats, {
        meanShift: 0,
        variationReduction: 0.05,
      });

      // 5% reduction: 2.0 * 0.95 = 1.9
      expect(result.projectedStdDev).toBeCloseTo(1.9, 2);
    });

    it('handles negative current Cpk scenario', () => {
      // Process mean outside spec limits
      const currentStats = { mean: 112, stdDev: 2.0, cpk: -1.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: -12, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      // Moving mean back in range should give positive Cpk
      expect(result.projectedMean).toBe(100);
      expect(result.projectedCpk).toBeCloseTo(1.0, 2);
    });

    it('clamps yield between 0 and 100', () => {
      const currentStats = { mean: 100, stdDev: 0.001 }; // Very low variation
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      expect(result.projectedYield).toBeLessThanOrEqual(100);
      expect(result.projectedYield).toBeGreaterThanOrEqual(0);
    });
  });

  describe('improvement calculations', () => {
    it('calculates Cpk improvement percentage', () => {
      const currentStats = { mean: 102, stdDev: 2.0, cpk: 0.67 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: -2, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      // Original Cpk = 0.67, new Cpk = 1.0
      // Improvement = (1.0 - 0.67) / 0.67 * 100 ≈ 49%
      expect(result.improvements.cpkImprovementPct).toBeGreaterThan(40);
    });

    it('handles zero current Cpk (no improvement calc)', () => {
      const currentStats = { mean: 100, stdDev: 2.0, cpk: 0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: 0, variationReduction: 0.2 },
        { usl: 106, lsl: 94 }
      );

      // Can't calculate % improvement from zero
      expect(result.improvements.cpkImprovementPct).toBeUndefined();
    });

    it('calculates yield improvement', () => {
      const currentStats = { mean: 103, stdDev: 2.0 };
      const result = simulateDirectAdjustment(
        currentStats,
        { meanShift: -3, variationReduction: 0 },
        { usl: 106, lsl: 94 }
      );

      // Centering should improve yield
      expect(result.improvements.yieldImprovementPct).toBeGreaterThan(0);
    });
  });
});
