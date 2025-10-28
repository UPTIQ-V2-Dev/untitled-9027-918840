import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../../components/Calculator/Button';

describe('Button Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('should render button with correct value', () => {
    render(<Button value="5" type="number" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button', { name: 'Calculator button 5' });
    expect(button).toHaveTextContent('5');
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<Button value="5" type="number" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnClick).toHaveBeenCalledWith('5');
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    render(<Button value="5" type="number" onClick={mockOnClick} disabled />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should have correct styling for number buttons', () => {
    render(<Button value="5" type="number" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-background');
  });

  it('should have correct styling for operator buttons', () => {
    render(<Button value="+" type="operator" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('should have correct styling for function buttons', () => {
    render(<Button value="C" type="function" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-muted');
  });

  it('should have correct styling for memory buttons', () => {
    render(<Button value="MR" type="memory" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent');
  });

  it('should have correct styling for equal button', () => {
    render(<Button value="=" type="equal" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('font-bold');
  });

  it('should have correct styling for clear buttons', () => {
    render(<Button value="AC" type="clear" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('should span two columns for zero button', () => {
    render(<Button value="0" type="number" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('col-span-2');
  });

  it('should be smaller for memory buttons', () => {
    render(<Button value="MC" type="memory" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('text-sm');
  });

  it('should have proper accessibility attributes', () => {
    render(<Button value="5" type="number" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Calculator button 5');
    expect(button).toHaveAttribute('data-testid', 'calculator-button-5');
  });

  it('should apply custom className', () => {
    render(<Button value="5" type="number" onClick={mockOnClick} className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have active scale animation class', () => {
    render(<Button value="5" type="number" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('active:scale-95');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button value="5" type="number" onClick={mockOnClick} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});