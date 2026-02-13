/**
 * Tests for DataQualityBanner component
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataQualityBanner } from '../index';
import type { DataQualityReport } from '@variscout/core';

function makeReport(overrides: Partial<DataQualityReport> = {}): DataQualityReport {
  return {
    totalRows: 100,
    validRows: 100,
    excludedRows: [],
    columnIssues: [],
    ...overrides,
  };
}

describe('DataQualityBanner', () => {
  it('renders with no issues', () => {
    const report = makeReport();
    render(<DataQualityBanner report={report} />);

    expect(screen.getByText('100 rows')).toBeDefined();
    expect(screen.getByText('All data valid')).toBeDefined();
  });

  it('renders filename when provided', () => {
    render(<DataQualityBanner report={makeReport()} filename="test.csv" />);
    expect(screen.getByText('test.csv')).toBeDefined();
  });

  it('shows default filename when not provided', () => {
    render(<DataQualityBanner report={makeReport()} />);
    expect(screen.getByText('Data File')).toBeDefined();
  });

  it('renders valid rows count', () => {
    const report = makeReport({ validRows: 95 });
    render(<DataQualityBanner report={report} />);

    expect(screen.getByText('95')).toBeDefined();
    expect(screen.getByText('rows ready for analysis')).toBeDefined();
  });

  it('renders excluded rows warning', () => {
    const report = makeReport({
      validRows: 95,
      excludedRows: [
        { index: 0, reasons: [{ type: 'missing', column: 'weight' }] },
        { index: 1, reasons: [{ type: 'missing', column: 'weight' }] },
        { index: 2, reasons: [{ type: 'non_numeric', column: 'weight' }] },
        { index: 3, reasons: [{ type: 'missing', column: 'weight' }] },
        { index: 4, reasons: [{ type: 'missing', column: 'weight' }] },
      ],
      columnIssues: [{ column: 'weight', type: 'missing', count: 5, severity: 'warning' }],
    });
    render(<DataQualityBanner report={report} />);

    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('rows excluded:')).toBeDefined();
  });

  it('renders View Excluded button when handler provided', () => {
    const onView = vi.fn();
    const report = makeReport({
      validRows: 95,
      excludedRows: [{ index: 0, reasons: [{ type: 'missing', column: 'weight' }] }],
      columnIssues: [{ column: 'weight', type: 'missing', count: 1, severity: 'warning' }],
    });
    render(<DataQualityBanner report={report} onViewExcludedRows={onView} />);

    const button = screen.getByText('View Excluded Rows');
    fireEvent.click(button);
    expect(onView).toHaveBeenCalledOnce();
  });

  it('renders View All Data button when handler provided', () => {
    const onViewAll = vi.fn();
    render(<DataQualityBanner report={makeReport()} onViewAllData={onViewAll} />);

    const button = screen.getByText('View All Data');
    fireEvent.click(button);
    expect(onViewAll).toHaveBeenCalledOnce();
  });

  it('renders Continue button when handler provided', () => {
    const onContinue = vi.fn();
    render(<DataQualityBanner report={makeReport()} onContinue={onContinue} />);

    const button = screen.getByText('Continue');
    fireEvent.click(button);
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('hides actions when showActions is false', () => {
    render(<DataQualityBanner report={makeReport()} showActions={false} onContinue={() => {}} />);
    expect(screen.queryByText('Continue')).toBeNull();
  });

  it('has role="status" for screen readers', () => {
    const { container } = render(<DataQualityBanner report={makeReport()} />);
    const statusElement = container.querySelector('[role="status"]');
    expect(statusElement).not.toBeNull();
  });

  it('shows no variation info message', () => {
    const report = makeReport({
      columnIssues: [{ column: 'weight', type: 'no_variation', count: 100, severity: 'info' }],
    });
    render(<DataQualityBanner report={report} />);

    expect(screen.getByText(/Outcome column has no variation/)).toBeDefined();
  });
});
