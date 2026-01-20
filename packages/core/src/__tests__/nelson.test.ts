import { describe, it, expect } from 'vitest';
import { getNelsonRule2ViolationPoints } from '../stats';

describe('Nelson Rule 2 Detection', () => {
  it('should return empty set for datasets with fewer than 9 points', () => {
    const violations = getNelsonRule2ViolationPoints([1, 2, 3, 4, 5, 6, 7, 8], 0);
    expect(violations.size).toBe(0);
  });

  it('should detect 9 consecutive points above mean', () => {
    // Mean is 0, all points above
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(9);
    for (let i = 0; i < 9; i++) {
      expect(violations.has(i)).toBe(true);
    }
  });

  it('should detect 9 consecutive points below mean', () => {
    // Mean is 0, all points below
    const values = [-1, -2, -3, -4, -5, -6, -7, -8, -9];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(9);
    for (let i = 0; i < 9; i++) {
      expect(violations.has(i)).toBe(true);
    }
  });

  it('should not detect violations with random data crossing mean', () => {
    // Data alternates above and below mean
    const values = [1, -1, 1, -1, 1, -1, 1, -1, 1, -1];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(0);
  });

  it('should detect exactly 9 points when run is exactly 9', () => {
    // 5 points below, then 9 above
    const values = [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(9);
    // Points 5-13 should be flagged
    for (let i = 5; i < 14; i++) {
      expect(violations.has(i)).toBe(true);
    }
    // Points 0-4 should not be flagged
    for (let i = 0; i < 5; i++) {
      expect(violations.has(i)).toBe(false);
    }
  });

  it('should detect extended runs (>9 points) and mark all', () => {
    // 12 points all above mean
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(12);
    for (let i = 0; i < 12; i++) {
      expect(violations.has(i)).toBe(true);
    }
  });

  it('should break run when point equals mean', () => {
    // 6 points above, then exact mean, then 6 points above = no violations
    const values = [1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(0);
  });

  it('should detect multiple separate runs', () => {
    // 9 below, 2 above, 9 below
    const values = [
      -1,
      -2,
      -3,
      -4,
      -5,
      -6,
      -7,
      -8,
      -9, // Run 1 (indices 0-8)
      1,
      2, // Break
      -1,
      -2,
      -3,
      -4,
      -5,
      -6,
      -7,
      -8,
      -9, // Run 2 (indices 11-19)
    ];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(18);
    // First run (0-8)
    for (let i = 0; i <= 8; i++) {
      expect(violations.has(i)).toBe(true);
    }
    // Second run (11-19)
    for (let i = 11; i <= 19; i++) {
      expect(violations.has(i)).toBe(true);
    }
    // Break points (9-10)
    expect(violations.has(9)).toBe(false);
    expect(violations.has(10)).toBe(false);
  });

  it('should not flag run of 8 points', () => {
    // 8 points all above - not enough
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(0);
  });

  it('should handle run that ends at array end', () => {
    // 3 random, then 9 above at the end
    const values = [-1, 0, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const violations = getNelsonRule2ViolationPoints(values, 0);

    expect(violations.size).toBe(9);
    for (let i = 3; i < 12; i++) {
      expect(violations.has(i)).toBe(true);
    }
  });

  it('should work with non-zero mean', () => {
    // Mean is 100, all values above 100
    const values = [101, 102, 103, 104, 105, 106, 107, 108, 109];
    const violations = getNelsonRule2ViolationPoints(values, 100);

    expect(violations.size).toBe(9);
  });

  it('should handle negative mean correctly', () => {
    // Mean is -10, all values above -10 (but negative)
    const values = [-9, -8, -7, -6, -5, -4, -3, -2, -1];
    const violations = getNelsonRule2ViolationPoints(values, -10);

    expect(violations.size).toBe(9);
  });

  it('should handle floating point values', () => {
    // Mean is 10.5, all values above
    const values = [10.6, 10.7, 10.8, 10.9, 11.0, 11.1, 11.2, 11.3, 11.4];
    const violations = getNelsonRule2ViolationPoints(values, 10.5);

    expect(violations.size).toBe(9);
  });

  it('should return empty set for empty array', () => {
    const violations = getNelsonRule2ViolationPoints([], 0);
    expect(violations.size).toBe(0);
  });
});
