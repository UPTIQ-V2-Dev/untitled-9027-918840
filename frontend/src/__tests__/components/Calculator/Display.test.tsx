import { describe, it, expect } from 'vitest';
import { render, screen } from '../../setup/test-utils';
import { Display } from '../../../components/Calculator/Display';

describe('Display Component', () => {
  it('should render display value correctly', () => {
    render(<Display value="123.45" />);
    
    const display = screen.getByTestId('calculator-display');
    expect(display).toHaveTextContent('123.45');
  });

  it('should render equation when provided', () => {
    render(<Display value="5" equation="2 + 3" />);
    
    const equation = screen.getByTestId('calculator-equation');
    const display = screen.getByTestId('calculator-display');
    
    expect(equation).toHaveTextContent('2 + 3');
    expect(display).toHaveTextContent('5');
  });

  it('should display error message when error is provided', () => {
    render(<Display value="Error" error="Cannot divide by zero" />);
    
    const display = screen.getByTestId('calculator-display');
    const error = screen.getByTestId('calculator-error');
    
    expect(display).toHaveTextContent('Error');
    expect(error).toHaveTextContent('Cannot divide by zero');
    expect(display).toHaveClass('text-destructive');
  });

  it('should hide equation when error is present', () => {
    render(<Display value="Error" equation="5 / 0" error="Cannot divide by zero" />);
    
    expect(screen.queryByTestId('calculator-equation')).not.toBeInTheDocument();
    expect(screen.getByTestId('calculator-error')).toBeInTheDocument();
  });

  it('should display "0" when value is empty', () => {
    render(<Display value="" />);
    
    const display = screen.getByTestId('calculator-display');
    expect(display).toHaveTextContent('0');
  });

  it('should prioritize error over display value', () => {
    render(<Display value="123" error="Invalid operation" />);
    
    const display = screen.getByTestId('calculator-display');
    expect(display).toHaveTextContent('Invalid operation');
  });

  it('should have proper accessibility attributes', () => {
    render(<Display value="123" />);
    
    const display = screen.getByTestId('calculator-display');
    expect(display).toHaveAttribute('aria-live', 'polite');
    expect(display).toHaveAttribute('aria-atomic', 'true');
  });

  it('should have error role when error is present', () => {
    render(<Display value="Error" error="Something went wrong" />);
    
    const error = screen.getByTestId('calculator-error');
    expect(error).toHaveAttribute('role', 'alert');
  });

  it('should apply custom className when provided', () => {
    render(<Display value="123" className="custom-class" />);
    
    const container = screen.getByTestId('calculator-display').closest('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('should break long values properly', () => {
    const longValue = '123456789012345678901234567890';
    render(<Display value={longValue} />);
    
    const display = screen.getByTestId('calculator-display');
    expect(display).toHaveClass('break-all');
    expect(display).toHaveTextContent(longValue);
  });
});