import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../../hooks/useCalculator';

describe('useCalculator Hook', () => {
  let hook: ReturnType<typeof renderHook<ReturnType<typeof useCalculator>, unknown>>;

  beforeEach(() => {
    hook = renderHook(() => useCalculator());
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(hook.result.current.display).toBe('0');
      expect(hook.result.current.previousValue).toBe(null);
      expect(hook.result.current.operation).toBe(null);
      expect(hook.result.current.waitingForOperand).toBe(false);
      expect(hook.result.current.memory).toBe(0);
      expect(hook.result.current.equation).toBe('');
      expect(hook.result.current.error).toBe(null);
    });
  });

  describe('Number Input', () => {
    it('should handle number button presses', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
      });
      expect(hook.result.current.display).toBe('5');

      act(() => {
        hook.result.current.handleButtonPress('2');
      });
      expect(hook.result.current.display).toBe('52');
    });

    it('should replace display when waiting for operand', () => {
      // Set up a state where we're waiting for operand
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('+');
      });
      expect(hook.result.current.waitingForOperand).toBe(true);

      act(() => {
        hook.result.current.handleButtonPress('3');
      });
      expect(hook.result.current.display).toBe('3');
      expect(hook.result.current.waitingForOperand).toBe(false);
    });

    it('should handle decimal point input', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('.');
        hook.result.current.handleButtonPress('2');
      });
      expect(hook.result.current.display).toBe('5.2');
    });

    it('should not allow multiple decimal points', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('.');
        hook.result.current.handleButtonPress('2');
        hook.result.current.handleButtonPress('.');
      });
      expect(hook.result.current.display).toBe('5.2');
    });
  });

  describe('Basic Operations', () => {
    it('should perform addition correctly', () => {
      act(() => {
        hook.result.current.handleButtonPress('2');
        hook.result.current.handleButtonPress('+');
        hook.result.current.handleButtonPress('3');
        hook.result.current.handleButtonPress('=');
      });
      expect(hook.result.current.display).toBe('5');
    });

    it('should perform subtraction correctly', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('-');
        hook.result.current.handleButtonPress('3');
        hook.result.current.handleButtonPress('=');
      });
      expect(hook.result.current.display).toBe('2');
    });

    it('should perform multiplication correctly', () => {
      act(() => {
        hook.result.current.handleButtonPress('4');
        hook.result.current.handleButtonPress('*');
        hook.result.current.handleButtonPress('3');
        hook.result.current.handleButtonPress('=');
      });
      expect(hook.result.current.display).toBe('12');
    });

    it('should perform division correctly', () => {
      act(() => {
        hook.result.current.handleButtonPress('8');
        hook.result.current.handleButtonPress('/');
        hook.result.current.handleButtonPress('2');
        hook.result.current.handleButtonPress('=');
      });
      expect(hook.result.current.display).toBe('4');
    });

    it('should handle division by zero', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('/');
        hook.result.current.handleButtonPress('0');
        hook.result.current.handleButtonPress('=');
      });
      expect(hook.result.current.display).toBe('Error');
      expect(hook.result.current.error).toBe('Cannot divide by zero');
    });
  });

  describe('Advanced Operations', () => {
    it('should perform percentage calculation', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('0');
        hook.result.current.handleButtonPress('%');
      });
      expect(hook.result.current.display).toBe('0.5');
    });

    it('should perform square root calculation', () => {
      act(() => {
        hook.result.current.handleButtonPress('9');
        hook.result.current.handleButtonPress('√');
      });
      expect(hook.result.current.display).toBe('3');
    });

    it('should handle negative square root', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('+/-');
        hook.result.current.handleButtonPress('√');
      });
      expect(hook.result.current.display).toBe('Error');
      expect(hook.result.current.error).toBe('Invalid operation');
    });

    it('should perform power calculation', () => {
      act(() => {
        hook.result.current.handleButtonPress('2');
        hook.result.current.handleButtonPress('^');
        hook.result.current.handleButtonPress('3');
        hook.result.current.handleButtonPress('=');
      });
      expect(hook.result.current.display).toBe('8');
    });
  });

  describe('Clear Functions', () => {
    it('should clear current entry with C', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('2');
        hook.result.current.handleButtonPress('C');
      });
      expect(hook.result.current.display).toBe('0');
      expect(hook.result.current.waitingForOperand).toBe(false);
    });

    it('should clear everything with AC', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('+');
        hook.result.current.handleButtonPress('3');
        hook.result.current.handleButtonPress('AC');
      });
      expect(hook.result.current.display).toBe('0');
      expect(hook.result.current.previousValue).toBe(null);
      expect(hook.result.current.operation).toBe(null);
      expect(hook.result.current.waitingForOperand).toBe(false);
      expect(hook.result.current.equation).toBe('');
    });
  });

  describe('Sign Toggle', () => {
    it('should toggle sign of positive number', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('+/-');
      });
      expect(hook.result.current.display).toBe('-5');
    });

    it('should toggle sign of negative number', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('+/-');
        hook.result.current.handleButtonPress('+/-');
      });
      expect(hook.result.current.display).toBe('5');
    });
  });

  describe('Memory Functions', () => {
    it('should store value in memory', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('MS');
      });
      expect(hook.result.current.memory).toBe(5);
    });

    it('should recall value from memory', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('MS');
        hook.result.current.handleButtonPress('AC');
        hook.result.current.handleButtonPress('MR');
      });
      expect(hook.result.current.display).toBe('5');
      expect(hook.result.current.waitingForOperand).toBe(true);
    });

    it('should clear memory', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('MS');
        hook.result.current.handleButtonPress('MC');
      });
      expect(hook.result.current.memory).toBe(0);
    });

    it('should add to memory', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('MS');
        hook.result.current.handleButtonPress('3');
        hook.result.current.handleButtonPress('M+');
      });
      expect(hook.result.current.memory).toBe(8);
    });

    it('should subtract from memory', () => {
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('MS');
        hook.result.current.handleButtonPress('2');
        hook.result.current.handleButtonPress('M-');
      });
      expect(hook.result.current.memory).toBe(3);
    });
  });

  describe('Operation Chaining', () => {
    it('should chain multiple operations', () => {
      act(() => {
        hook.result.current.handleButtonPress('2');
        hook.result.current.handleButtonPress('+');
        hook.result.current.handleButtonPress('3');
        hook.result.current.handleButtonPress('*');
        hook.result.current.handleButtonPress('4');
        hook.result.current.handleButtonPress('=');
      });
      expect(hook.result.current.display).toBe('20'); // (2 + 3) * 4 = 20
    });
  });

  describe('Error Handling', () => {
    it('should clear error on new input', () => {
      // Create an error first
      act(() => {
        hook.result.current.handleButtonPress('5');
        hook.result.current.handleButtonPress('/');
        hook.result.current.handleButtonPress('0');
        hook.result.current.handleButtonPress('=');
      });
      expect(hook.result.current.error).toBe('Cannot divide by zero');

      // Clear error with new input
      act(() => {
        hook.result.current.handleButtonPress('2');
      });
      expect(hook.result.current.error).toBe(null);
    });
  });
});