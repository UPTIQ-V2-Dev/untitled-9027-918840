import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from '../../../components/Calculator/Calculator';

// Mock the hooks
vi.mock('../../../hooks/useCalculator', () => ({
  useCalculator: () => ({
    display: '0',
    equation: '',
    error: null,
    memory: 0,
    handleButtonPress: vi.fn(),
    clearError: vi.fn(),
  }),
}));

vi.mock('../../../hooks/useCalculatorHistory', () => ({
  useCalculatorHistory: () => ({
    history: [],
    addHistoryEntry: vi.fn(),
    clearHistory: vi.fn(),
    removeHistoryEntry: vi.fn(),
    copyToClipboard: vi.fn(),
    exportHistory: vi.fn(),
    importHistory: vi.fn(),
    searchHistory: vi.fn(() => []),
  }),
}));

vi.mock('../../../hooks/useKeyboardInput', () => ({
  useKeyboardInput: () => ({}),
}));

describe('Calculator Component', () => {
  it('should render calculator title', () => {
    render(<Calculator />);
    
    expect(screen.getByText('Calculator')).toBeInTheDocument();
  });

  it('should render display component', () => {
    render(<Calculator />);
    
    expect(screen.getByTestId('calculator-display')).toBeInTheDocument();
  });

  it('should render all number buttons', () => {
    render(<Calculator />);
    
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByTestId(`calculator-button-${i}`)).toBeInTheDocument();
    }
  });

  it('should render operator buttons', () => {
    render(<Calculator />);
    
    const operators = ['+', '-', '*', '/'];
    operators.forEach(op => {
      expect(screen.getByTestId(`calculator-button-${op}`)).toBeInTheDocument();
    });
  });

  it('should render function buttons', () => {
    render(<Calculator />);
    
    const functions = ['C', 'AC', '+/-', '.', '='];
    functions.forEach(func => {
      expect(screen.getByTestId(`calculator-button-${func}`)).toBeInTheDocument();
    });
  });

  it('should render memory buttons', () => {
    render(<Calculator />);
    
    const memoryButtons = ['MC', 'MR', 'MS', 'M+', 'M-'];
    memoryButtons.forEach(button => {
      expect(screen.getByTestId(`calculator-button-${button}`)).toBeInTheDocument();
    });
  });

  it('should render advanced operator buttons', () => {
    render(<Calculator />);
    
    const advancedOps = ['%', '√', '^'];
    advancedOps.forEach(op => {
      expect(screen.getByTestId(`calculator-button-${op}`)).toBeInTheDocument();
    });
  });

  it('should render history panel trigger', () => {
    render(<Calculator />);
    
    expect(screen.getByLabelText('View calculation history')).toBeInTheDocument();
  });

  it('should show keyboard shortcuts hint', () => {
    render(<Calculator />);
    
    expect(screen.getByText(/Use keyboard for quick input/)).toBeInTheDocument();
  });

  it('should apply custom className when provided', () => {
    render(<Calculator className="custom-calculator" />);
    
    const container = screen.getByText('Calculator').closest('.custom-calculator');
    expect(container).toBeInTheDocument();
  });

  it('should be contained within max-width wrapper', () => {
    render(<Calculator />);
    
    const wrapper = screen.getByText('Calculator').closest('.max-w-md');
    expect(wrapper).toBeInTheDocument();
  });

  it('should center the calculator', () => {
    render(<Calculator />);
    
    const wrapper = screen.getByText('Calculator').closest('.mx-auto');
    expect(wrapper).toBeInTheDocument();
  });
});

// Integration test with real hooks
describe('Calculator Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should perform basic calculation when buttons are clicked', async () => {
    // Remove the mocks for this test
    vi.doUnmock('../../../hooks/useCalculator');
    vi.doUnmock('../../../hooks/useCalculatorHistory');
    vi.doUnmock('../../../hooks/useKeyboardInput');

    const user = userEvent.setup();
    render(<Calculator />);

    // Perform 2 + 3 = 5
    await user.click(screen.getByTestId('calculator-button-2'));
    await user.click(screen.getByTestId('calculator-button-+'));
    await user.click(screen.getByTestId('calculator-button-3'));
    await user.click(screen.getByTestId('calculator-button-='));

    expect(screen.getByTestId('calculator-display')).toHaveTextContent('5');
  });
});