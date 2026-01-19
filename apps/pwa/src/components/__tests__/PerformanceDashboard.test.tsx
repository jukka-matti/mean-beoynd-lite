import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PerformanceDashboard from '../PerformanceDashboard';
import * as DataContextModule from '../../context/DataContext';

// Mock child components
vi.mock('../PerformanceSummary', () => ({
  default: () => <div data-testid="performance-summary">Summary</div>,
}));
vi.mock('../charts/PerformanceIChart', () => ({
  default: ({ capabilityMetric, onChannelClick }: any) => (
    <div
      data-testid="performance-ichart"
      data-capability-metric={capabilityMetric}
      onClick={() => onChannelClick?.('V1')}
    >
      I-Chart (metric: {capabilityMetric})
    </div>
  ),
}));
vi.mock('../charts/PerformanceBoxplot', () => ({
  default: () => <div data-testid="performance-boxplot">Boxplot</div>,
}));
vi.mock('../charts/PerformancePareto', () => ({
  default: () => <div data-testid="performance-pareto">Pareto</div>,
}));
vi.mock('../charts/PerformanceCapability', () => ({
  default: () => <div data-testid="performance-capability">Capability</div>,
}));
vi.mock('../PerformanceSetupPanel', () => ({
  default: () => <div data-testid="performance-setup">Setup Panel</div>,
}));

describe('PerformanceDashboard', () => {
  const mockSetSelectedMeasure = vi.fn();

  const mockPerformanceResult = {
    channels: [
      { id: 'V1', label: 'V1', n: 100, mean: 50, stdDev: 2, cp: 1.2, cpk: 1.1 },
      { id: 'V2', label: 'V2', n: 100, mean: 51, stdDev: 2.5, cp: 1.0, cpk: 0.9 },
    ],
    overallStats: { n: 200, mean: 50.5, minCpk: 0.9 },
  };

  const mockDataContextWithData = {
    performanceResult: mockPerformanceResult,
    selectedMeasure: null as string | null,
    setSelectedMeasure: mockSetSelectedMeasure,
    specs: { usl: 60, lsl: 40 },
    measureColumns: ['V1', 'V2'],
  };

  const mockDataContextNoData = {
    performanceResult: null,
    selectedMeasure: null,
    setSelectedMeasure: mockSetSelectedMeasure,
    specs: {},
    measureColumns: [],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Setup Panel', () => {
    it('shows setup panel when no measure columns configured', () => {
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(mockDataContextNoData as any);

      render(<PerformanceDashboard />);

      expect(screen.getByTestId('performance-setup')).toBeInTheDocument();
      expect(screen.queryByTestId('performance-ichart')).not.toBeInTheDocument();
    });
  });

  describe('Cp/Cpk Toggle', () => {
    it('defaults to cpk metric', () => {
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(mockDataContextWithData as any);

      render(<PerformanceDashboard />);

      // Check the chart receives cpk as default
      const chart = screen.getByTestId('performance-ichart');
      expect(chart).toHaveAttribute('data-capability-metric', 'cpk');

      // Cpk button should be active (bg-blue-600 class)
      const cpkButton = screen.getByRole('button', { name: 'Cpk' });
      expect(cpkButton).toHaveClass('bg-blue-600');
    });

    it('switches to cp metric when Cp button clicked', () => {
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(mockDataContextWithData as any);

      render(<PerformanceDashboard />);

      // Click Cp button
      const cpButton = screen.getByRole('button', { name: 'Cp' });
      fireEvent.click(cpButton);

      // Chart should now receive cp metric
      const chart = screen.getByTestId('performance-ichart');
      expect(chart).toHaveAttribute('data-capability-metric', 'cp');

      // Cp button should now be active
      expect(cpButton).toHaveClass('bg-blue-600');
    });

    it('switches back to cpk when Cpk button clicked after switching to cp', () => {
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(mockDataContextWithData as any);

      render(<PerformanceDashboard />);

      // Switch to Cp
      const cpButton = screen.getByRole('button', { name: 'Cp' });
      fireEvent.click(cpButton);

      // Switch back to Cpk
      const cpkButton = screen.getByRole('button', { name: 'Cpk' });
      fireEvent.click(cpkButton);

      // Chart should be back to cpk
      const chart = screen.getByTestId('performance-ichart');
      expect(chart).toHaveAttribute('data-capability-metric', 'cpk');
    });
  });

  describe('Channel Selection', () => {
    it('calls setSelectedMeasure when channel is clicked', () => {
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(mockDataContextWithData as any);

      render(<PerformanceDashboard />);

      // Click on the chart (mock triggers onChannelClick with 'V1')
      const chart = screen.getByTestId('performance-ichart');
      fireEvent.click(chart);

      expect(mockSetSelectedMeasure).toHaveBeenCalledWith('V1');
    });

    it('toggles selection off when clicking same channel', () => {
      const contextWithSelection = {
        ...mockDataContextWithData,
        selectedMeasure: 'V1',
      };
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(contextWithSelection as any);

      render(<PerformanceDashboard />);

      // Click on the chart (same channel V1 is selected)
      const chart = screen.getByTestId('performance-ichart');
      fireEvent.click(chart);

      // Should set to null (toggle off)
      expect(mockSetSelectedMeasure).toHaveBeenCalledWith(null);
    });
  });

  describe('Drill to I-Chart Button', () => {
    it('does not show drill button when no measure selected', () => {
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(mockDataContextWithData as any);

      render(<PerformanceDashboard onDrillToMeasure={() => {}} />);

      expect(screen.queryByRole('button', { name: /view in i-chart/i })).not.toBeInTheDocument();
    });

    it('shows drill button when measure is selected', () => {
      const contextWithSelection = {
        ...mockDataContextWithData,
        selectedMeasure: 'V1',
      };
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(contextWithSelection as any);

      render(<PerformanceDashboard onDrillToMeasure={() => {}} />);

      expect(screen.getByRole('button', { name: /view in i-chart/i })).toBeInTheDocument();
    });

    it('calls onDrillToMeasure with selected measure when drill button clicked', () => {
      const mockDrillToMeasure = vi.fn();
      const contextWithSelection = {
        ...mockDataContextWithData,
        selectedMeasure: 'V1',
      };
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(contextWithSelection as any);

      render(<PerformanceDashboard onDrillToMeasure={mockDrillToMeasure} />);

      const drillButton = screen.getByRole('button', { name: /view in i-chart/i });
      fireEvent.click(drillButton);

      expect(mockDrillToMeasure).toHaveBeenCalledWith('V1');
    });

    it('does not show drill button when onDrillToMeasure not provided', () => {
      const contextWithSelection = {
        ...mockDataContextWithData,
        selectedMeasure: 'V1',
      };
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(contextWithSelection as any);

      render(<PerformanceDashboard />);

      expect(screen.queryByRole('button', { name: /view in i-chart/i })).not.toBeInTheDocument();
    });
  });

  describe('Spec Warning Banner', () => {
    it('shows warning when no specs defined', () => {
      const contextNoSpecs = {
        ...mockDataContextWithData,
        specs: {},
      };
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(contextNoSpecs as any);

      render(<PerformanceDashboard />);

      expect(
        screen.getByText(/set specification limits.*to enable cpk calculations/i)
      ).toBeInTheDocument();
    });

    it('does not show warning when specs are defined', () => {
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(mockDataContextWithData as any);

      render(<PerformanceDashboard />);

      expect(
        screen.queryByText(/set specification limits.*to enable cpk calculations/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Chart Header', () => {
    it('shows selected measure in header', () => {
      const contextWithSelection = {
        ...mockDataContextWithData,
        selectedMeasure: 'V1',
      };
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(contextWithSelection as any);

      render(<PerformanceDashboard />);

      expect(screen.getByText(/selected: v1/i)).toBeInTheDocument();
    });

    it('updates header label based on selected metric', () => {
      vi.spyOn(DataContextModule, 'useData').mockReturnValue(mockDataContextWithData as any);

      render(<PerformanceDashboard />);

      // Default is Cpk
      expect(screen.getByText(/cpk by measure/i)).toBeInTheDocument();

      // Switch to Cp
      const cpButton = screen.getByRole('button', { name: 'Cp' });
      fireEvent.click(cpButton);

      expect(screen.getByText(/cp by measure/i)).toBeInTheDocument();
    });
  });
});
