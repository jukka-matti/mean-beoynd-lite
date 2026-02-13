/**
 * Tests for useColumnClassification hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useColumnClassification } from '../useColumnClassification';

describe('useColumnClassification', () => {
  it('returns empty arrays for empty data', () => {
    const { result } = renderHook(() => useColumnClassification([]));
    expect(result.current).toEqual({ numeric: [], categorical: [] });
  });

  it('classifies numeric columns', () => {
    const data = [
      { weight: 10.5, height: 20.3, name: 'A' },
      { weight: 11.2, height: 21.1, name: 'B' },
    ];
    const { result } = renderHook(() => useColumnClassification(data));
    expect(result.current.numeric).toContain('weight');
    expect(result.current.numeric).toContain('height');
  });

  it('classifies categorical columns with few unique values', () => {
    const data = [
      { value: 10, machine: 'A', operator: 'Bob' },
      { value: 20, machine: 'B', operator: 'Alice' },
      { value: 30, machine: 'A', operator: 'Bob' },
    ];
    const { result } = renderHook(() => useColumnClassification(data));
    expect(result.current.categorical).toContain('machine');
    expect(result.current.categorical).toContain('operator');
  });

  it('excludes specified column', () => {
    const data = [
      { weight: 10, machine: 'A' },
      { weight: 20, machine: 'B' },
    ];
    const { result } = renderHook(() => useColumnClassification(data, { excludeColumn: 'weight' }));
    expect(result.current.numeric).not.toContain('weight');
    expect(result.current.categorical).toContain('machine');
  });

  it('respects maxCategoricalUnique threshold', () => {
    // Create data with 15 unique string values
    const data = Array.from({ length: 15 }, (_, i) => ({
      value: i,
      id: `item-${i}`,
    }));
    const { result } = renderHook(() =>
      useColumnClassification(data, { maxCategoricalUnique: 10 })
    );
    // 15 unique values exceeds threshold of 10
    expect(result.current.categorical).not.toContain('id');
  });

  it('classifies string columns with many unique values as neither', () => {
    const data = Array.from({ length: 20 }, (_, i) => ({
      value: i,
      label: `unique-${i}`,
    }));
    const { result } = renderHook(() => useColumnClassification(data));
    expect(result.current.categorical).not.toContain('label');
    expect(result.current.numeric).not.toContain('label');
  });

  it('handles single row of data', () => {
    const data = [{ x: 42, name: 'test' }];
    const { result } = renderHook(() => useColumnClassification(data));
    expect(result.current.numeric).toContain('x');
    expect(result.current.categorical).toContain('name');
  });

  it('handles data with only numeric columns', () => {
    const data = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const { result } = renderHook(() => useColumnClassification(data));
    expect(result.current.numeric).toEqual(['a', 'b', 'c']);
    expect(result.current.categorical).toEqual([]);
  });

  it('handles data with only categorical columns', () => {
    const data = [
      { x: 'a', y: 'b' },
      { x: 'c', y: 'd' },
    ];
    const { result } = renderHook(() => useColumnClassification(data));
    expect(result.current.numeric).toEqual([]);
    expect(result.current.categorical).toEqual(['x', 'y']);
  });

  it('excludeColumn as null includes all columns', () => {
    const data = [{ weight: 10, machine: 'A' }];
    const { result } = renderHook(() => useColumnClassification(data, { excludeColumn: null }));
    expect(result.current.numeric).toContain('weight');
    expect(result.current.categorical).toContain('machine');
  });
});
