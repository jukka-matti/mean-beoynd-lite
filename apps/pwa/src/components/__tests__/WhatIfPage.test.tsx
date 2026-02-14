import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WhatIfPage from '../WhatIfPage';

// Mock DataContext
const defaultContextValue = {
  filteredData: [
    { Machine: 'A', Value: 10 },
    { Machine: 'A', Value: 11 },
    { Machine: 'B', Value: 20 },
    { Machine: 'B', Value: 19 },
  ],
  rawData: [
    { Machine: 'A', Value: 10 },
    { Machine: 'A', Value: 11 },
    { Machine: 'B', Value: 20 },
    { Machine: 'B', Value: 19 },
  ],
  outcome: 'Value',
  specs: { usl: 25, lsl: 5 },
  filters: {},
};

let contextValue = { ...defaultContextValue };

vi.mock('../../context/DataContext', () => ({
  useData: () => contextValue,
}));

// Mock calculateStats
vi.mock('@variscout/core', () => ({
  calculateStats: vi.fn(() => ({
    mean: 15,
    stdDev: 5,
    cpk: 0.67,
    n: 4,
  })),
}));

// Mock WhatIfSimulator
vi.mock('../WhatIfSimulator', () => ({
  default: (props: any) => (
    <div data-testid="simulator" data-expanded={props.defaultExpanded}>
      WhatIfSimulator
    </div>
  ),
}));

describe('WhatIfPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contextValue = { ...defaultContextValue };
  });

  it('shows empty state when no outcome set', () => {
    contextValue = { ...defaultContextValue, outcome: '' };
    render(<WhatIfPage onBack={() => {}} />);
    expect(screen.getByText('Load data and set specification limits first.')).toBeInTheDocument();
  });

  it('shows empty state when rawData is empty', () => {
    contextValue = { ...defaultContextValue, rawData: [], filteredData: [] };
    render(<WhatIfPage onBack={() => {}} />);
    expect(screen.getByText('Load data and set specification limits first.')).toBeInTheDocument();
  });

  it('shows back button that calls onBack', () => {
    const onBack = vi.fn();
    render(<WhatIfPage onBack={onBack} />);

    // Click the back button (ArrowLeft icon button)
    const backButton = screen.getByTitle('Back to Dashboard');
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('shows specs warning when no USL/LSL set', () => {
    contextValue = {
      ...defaultContextValue,
      specs: { usl: undefined, lsl: undefined },
    };
    render(<WhatIfPage onBack={() => {}} />);
    expect(
      screen.getByText('Set specification limits (USL/LSL) to see Cpk and yield projections.')
    ).toBeInTheDocument();
  });

  it('does not show specs warning when specs are set', () => {
    render(<WhatIfPage onBack={() => {}} />);
    expect(
      screen.queryByText('Set specification limits (USL/LSL) to see Cpk and yield projections.')
    ).not.toBeInTheDocument();
  });

  it('renders WhatIfSimulator when data and stats available', () => {
    render(<WhatIfPage onBack={() => {}} />);
    expect(screen.getByTestId('simulator')).toBeInTheDocument();
  });

  it('shows outcome name and sample count in header', () => {
    render(<WhatIfPage onBack={() => {}} />);
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('n = 4')).toBeInTheDocument();
  });

  it('shows filter count when filters active', () => {
    contextValue = {
      ...defaultContextValue,
      filters: { Machine: ['A'] },
    };
    render(<WhatIfPage onBack={() => {}} />);
    expect(screen.getByText('1 filter')).toBeInTheDocument();
  });

  it('shows plural filters label for multiple filters', () => {
    contextValue = {
      ...defaultContextValue,
      filters: { Machine: ['A'], Shift: ['Morning'] },
    };
    render(<WhatIfPage onBack={() => {}} />);
    expect(screen.getByText('2 filters')).toBeInTheDocument();
  });

  it('shows What-If Simulator heading', () => {
    render(<WhatIfPage onBack={() => {}} />);
    const headings = screen.getAllByText('What-If Simulator');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('back button works in empty state too', () => {
    contextValue = { ...defaultContextValue, outcome: '' };
    const onBack = vi.fn();
    render(<WhatIfPage onBack={onBack} />);

    // There should still be a back button
    const buttons = screen.getAllByRole('button');
    // Click the first button (back arrow)
    fireEvent.click(buttons[0]);
    expect(onBack).toHaveBeenCalledOnce();
  });
});
