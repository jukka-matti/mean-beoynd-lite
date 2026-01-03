import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnovaResults from '../AnovaResults';
import type { AnovaResult } from '@variscout/core';

describe('AnovaResults', () => {
  const mockResult: AnovaResult = {
    isSignificant: true,
    pValue: 0.003,
    fStatistic: 5.42,
    groups: [
      { name: 'Group A', mean: 10, n: 5, stdDev: 1 },
      { name: 'Group B', mean: 15, n: 5, stdDev: 1 },
    ],
    etaSquared: 0.45,
    insight: 'Group B is significantly higher than Group A',
  };

  it('should render nothing when result is null', () => {
    const { container } = render(<AnovaResults result={null} factorLabel="Machine" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render significant result correctly', () => {
    render(<AnovaResults result={mockResult} factorLabel="Machine" />);

    expect(screen.getByText('ANOVA: Machine')).toBeInTheDocument();
    expect(screen.getByText('Significant')).toHaveClass('bg-green-500/20');
    expect(screen.getByText('YES')).toHaveClass('text-green-400');
    expect(screen.getByText(/F = 5.42/)).toBeInTheDocument();
    expect(screen.getByText(/p = 0.003/)).toBeInTheDocument();
    expect(screen.getByText('Group B is significantly higher than Group A')).toBeInTheDocument();
  });

  it('should render group statistics', () => {
    render(<AnovaResults result={mockResult} factorLabel="Machine" />);

    expect(screen.getByText('Group A:')).toBeInTheDocument();
    expect(screen.getByText('10.0')).toBeInTheDocument();

    expect(screen.getByText('Group B:')).toBeInTheDocument();
    expect(screen.getByText('15.0')).toBeInTheDocument();

    // Both groups have n=5, so we use getAllByText
    const nLabels = screen.getAllByText('(n=5)');
    expect(nLabels).toHaveLength(2);
  });

  it('should render non-significant result correctly', () => {
    const nonSigResult = {
      ...mockResult,
      isSignificant: false,
      pValue: 0.45,
      fStatistic: 0.8,
      insight: undefined,
    };

    render(<AnovaResults result={nonSigResult} factorLabel="Machine" />);

    expect(screen.getByText('Not Significant')).toHaveClass('bg-slate-700');
    expect(screen.getByText('NO')).toBeInTheDocument();
    expect(
      screen.queryByText('Group B is significantly higher than Group A')
    ).not.toBeInTheDocument();
  });

  it('should format very small p-values correctly', () => {
    const smallPResult = {
      ...mockResult,
      pValue: 0.00001,
    };

    render(<AnovaResults result={smallPResult} factorLabel="Machine" />);
    expect(screen.getByText(/p = < 0.001/)).toBeInTheDocument();
  });
});
