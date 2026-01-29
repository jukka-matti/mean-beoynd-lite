import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InteractionGuidance from '../InteractionGuidance';

describe('InteractionGuidance', () => {
  it('renders nothing when fewer than 2 factors are selected', () => {
    const { container } = render(<InteractionGuidance drillFactorCount={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when 0 factors are selected', () => {
    const { container } = render(<InteractionGuidance drillFactorCount={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders guidance when 2+ factors are selected', () => {
    render(<InteractionGuidance drillFactorCount={2} />);

    expect(screen.getByText('Analyzing multiple factors?')).toBeInTheDocument();
    expect(screen.getByText(/main effects/)).toBeInTheDocument();
    // "interact" appears in both span and text - check for the educational text
    expect(screen.getByText(/To check if factors/)).toBeInTheDocument();
  });

  it('shows factor names in example text when provided', () => {
    render(<InteractionGuidance drillFactorCount={2} drillFactors={['Machine', 'Shift']} />);

    expect(screen.getByText(/Machine performance varies by Shift/)).toBeInTheDocument();
  });

  it('uses column aliases when provided', () => {
    render(
      <InteractionGuidance
        drillFactorCount={2}
        drillFactors={['machine_id', 'shift_type']}
        columnAliases={{ machine_id: 'Machine', shift_type: 'Shift' }}
      />
    );

    expect(screen.getByText(/Machine performance varies by Shift/)).toBeInTheDocument();
  });

  it('shows default example when no factors provided', () => {
    render(<InteractionGuidance drillFactorCount={2} drillFactors={[]} />);

    expect(screen.getByText(/Machine C is only problematic on Night shift/)).toBeInTheDocument();
  });

  it('renders "Check Interactions" button when callback provided', () => {
    const mockNavigate = vi.fn();
    render(<InteractionGuidance drillFactorCount={2} onNavigateToRegression={mockNavigate} />);

    const button = screen.getByText('Check Interactions');
    expect(button).toBeInTheDocument();
  });

  it('calls onNavigateToRegression when button is clicked', () => {
    const mockNavigate = vi.fn();
    render(<InteractionGuidance drillFactorCount={2} onNavigateToRegression={mockNavigate} />);

    const button = screen.getByText('Check Interactions');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('does not show button when no callback provided', () => {
    render(<InteractionGuidance drillFactorCount={2} />);

    expect(screen.queryByText('Check Interactions')).not.toBeInTheDocument();
  });

  it('renders for more than 2 factors', () => {
    render(
      <InteractionGuidance drillFactorCount={3} drillFactors={['Machine', 'Shift', 'Operator']} />
    );

    expect(screen.getByText('Analyzing multiple factors?')).toBeInTheDocument();
    // Should use first two factors for example
    expect(screen.getByText(/Machine performance varies by Shift/)).toBeInTheDocument();
  });
});
