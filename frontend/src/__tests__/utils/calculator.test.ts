import { describe, it, expect } from 'vitest';
import {
  add,
  subtract,
  multiply,
  divide,
  percentage,
  squareRoot,
  power,
  calculate,
  isValidNumber,
  parseCalculatorInput,
  handleCalculatorError,
  roundToPrecision
} from '../../utils/calculator';

describe('Calculator Utils', () => {
  describe('Basic Operations', () => {
    it('should add numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(-2, 3)).toBe(1);
      expect(add(0.1, 0.2)).toBe(0.3);
    });

    it('should subtract numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
      expect(subtract(-2, 3)).toBe(-5);
      expect(subtract(0.3, 0.1)).toBe(0.2);
    });

    it('should multiply numbers correctly', () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(0.1, 3)).toBe(0.3);
    });

    it('should divide numbers correctly', () => {
      expect(divide(6, 3)).toBe(2);
      expect(divide(-6, 3)).toBe(-2);
      expect(divide(0.6, 0.2)).toBe(3);
    });

    it('should handle division by zero', () => {
      expect(() => divide(5, 0)).toThrow('Division by zero');
    });
  });

  describe('Advanced Operations', () => {
    it('should calculate percentage correctly', () => {
      expect(percentage(50)).toBe(0.5);
      expect(percentage(100)).toBe(1);
      expect(percentage(0)).toBe(0);
    });

    it('should calculate square root correctly', () => {
      expect(squareRoot(9)).toBe(3);
      expect(squareRoot(16)).toBe(4);
      expect(squareRoot(0)).toBe(0);
    });

    it('should handle negative square root', () => {
      expect(() => squareRoot(-1)).toThrow('Square root of negative number');
    });

    it('should calculate power correctly', () => {
      expect(power(2, 3)).toBe(8);
      expect(power(5, 2)).toBe(25);
      expect(power(10, 0)).toBe(1);
    });
  });

  describe('Calculate Function', () => {
    it('should perform addition', () => {
      expect(calculate(2, 3, '+')).toBe(5);
    });

    it('should perform subtraction', () => {
      expect(calculate(5, 3, '-')).toBe(2);
    });

    it('should perform multiplication', () => {
      expect(calculate(2, 3, '*')).toBe(6);
    });

    it('should perform division', () => {
      expect(calculate(6, 3, '/')).toBe(2);
    });

    it('should perform percentage', () => {
      expect(calculate(0, 50, '%')).toBe(0.5);
    });

    it('should perform square root', () => {
      expect(calculate(0, 9, '√')).toBe(3);
    });

    it('should perform power', () => {
      expect(calculate(2, 3, '^')).toBe(8);
    });

    it('should throw error for unknown operation', () => {
      expect(() => calculate(2, 3, 'x' as any)).toThrow('Unknown operation');
    });
  });

  describe('Validation', () => {
    it('should validate numbers correctly', () => {
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('123.45')).toBe(true);
      expect(isValidNumber('-123')).toBe(true);
      expect(isValidNumber('0')).toBe(true);
      expect(isValidNumber('')).toBe(false);
      expect(isValidNumber('.')).toBe(false);
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('123abc')).toBe(false);
    });

    it('should parse calculator input correctly', () => {
      expect(parseCalculatorInput('123')).toBe(123);
      expect(parseCalculatorInput('123.45')).toBe(123.45);
      expect(parseCalculatorInput('-123')).toBe(-123);
    });

    it('should throw error for invalid input', () => {
      expect(() => parseCalculatorInput('abc')).toThrow('Invalid number');
      expect(() => parseCalculatorInput('')).toThrow('Invalid number');
    });
  });

  describe('Error Handling', () => {
    it('should handle division by zero error', () => {
      const error = new Error('Division by zero');
      const result = handleCalculatorError(error);
      expect(result.type).toBe('division_by_zero');
      expect(result.message).toBe('Cannot divide by zero');
    });

    it('should handle square root of negative error', () => {
      const error = new Error('Square root of negative');
      const result = handleCalculatorError(error);
      expect(result.type).toBe('invalid_operation');
      expect(result.message).toBe('Invalid operation');
    });

    it('should handle overflow error', () => {
      const error = new Error('Result overflow');
      const result = handleCalculatorError(error);
      expect(result.type).toBe('overflow');
      expect(result.message).toBe('Result too large');
    });

    it('should handle invalid input error', () => {
      const error = new Error('Invalid number');
      const result = handleCalculatorError(error);
      expect(result.type).toBe('invalid_input');
      expect(result.message).toBe('Invalid input');
    });

    it('should handle unknown error', () => {
      const error = new Error('Something else');
      const result = handleCalculatorError(error);
      expect(result.type).toBe('invalid_operation');
      expect(result.message).toBe('Invalid operation');
    });
  });

  describe('Precision', () => {
    it('should handle floating point precision', () => {
      expect(add(0.1, 0.2)).toBe(0.3);
      expect(multiply(0.1, 3)).toBe(0.3);
      expect(roundToPrecision(0.30000000000000004)).toBe(0.3);
    });
  });
});