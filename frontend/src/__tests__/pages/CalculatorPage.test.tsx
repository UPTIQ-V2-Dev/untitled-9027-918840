import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../setup/test-utils';
import { CalculatorPage } from '../../pages/CalculatorPage';

// Mock the Calculator component
vi.mock('../../components/Calculator/Calculator', () => ({
  Calculator: ({ className }: { className?: string }) => (
    <div data-testid="calculator-component" className={className}>
      Mocked Calculator Component
    </div>
  ),
}));

describe('CalculatorPage', () => {
  it('should render the Calculator component', () => {
    render(<CalculatorPage />);
    
    expect(screen.getByTestId('calculator-component')).toBeInTheDocument();
  });

  it('should center the calculator vertically and horizontally', () => {
    render(<CalculatorPage />);
    
    const container = screen.getByTestId('calculator-component').parentElement;
    expect(container).toHaveClass('min-h-[80vh]');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });

  it('should have proper layout structure', () => {
    render(<CalculatorPage />);
    
    const wrapper = screen.getByTestId('calculator-component').parentElement;
    expect(wrapper?.tagName.toLowerCase()).toBe('div');
  });
});