import type { CalculatorOperation, CalculatorError } from '../types/calculator';

// Precision handling for floating point operations
const PRECISION = 10;

export const roundToPrecision = (num: number, precision = PRECISION): number => {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const add = (a: number, b: number): number => {
  return roundToPrecision(a + b);
};

export const subtract = (a: number, b: number): number => {
  return roundToPrecision(a - b);
};

export const multiply = (a: number, b: number): number => {
  return roundToPrecision(a * b);
};

export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return roundToPrecision(a / b);
};

export const percentage = (a: number): number => {
  return roundToPrecision(a / 100);
};

export const squareRoot = (a: number): number => {
  if (a < 0) {
    throw new Error('Square root of negative number');
  }
  return roundToPrecision(Math.sqrt(a));
};

export const power = (a: number, b: number): number => {
  const result = Math.pow(a, b);
  if (!isFinite(result)) {
    throw new Error('Result overflow');
  }
  return roundToPrecision(result);
};

export const calculate = (
  previousValue: number,
  nextValue: number,
  operation: CalculatorOperation
): number => {
  switch (operation) {
    case '+':
      return add(previousValue, nextValue);
    case '-':
      return subtract(previousValue, nextValue);
    case '*':
      return multiply(previousValue, nextValue);
    case '/':
      return divide(previousValue, nextValue);
    case '%':
      return percentage(nextValue);
    case '√':
      return squareRoot(nextValue);
    case '^':
      return power(previousValue, nextValue);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
};

export const isValidNumber = (input: string): boolean => {
  if (input === '' || input === '.') return false;
  return !isNaN(Number(input)) && isFinite(Number(input));
};

export const parseCalculatorInput = (input: string): number => {
  const num = parseFloat(input);
  if (!isFinite(num)) {
    throw new Error('Invalid number');
  }
  return num;
};

export const handleCalculatorError = (error: unknown): CalculatorError => {
  if (error instanceof Error) {
    if (error.message.includes('Division by zero')) {
      return {
        type: 'division_by_zero',
        message: 'Cannot divide by zero'
      };
    }
    if (error.message.includes('Square root of negative')) {
      return {
        type: 'invalid_operation',
        message: 'Invalid operation'
      };
    }
    if (error.message.includes('overflow') || error.message.includes('Infinity')) {
      return {
        type: 'overflow',
        message: 'Result too large'
      };
    }
    if (error.message.includes('Invalid number')) {
      return {
        type: 'invalid_input',
        message: 'Invalid input'
      };
    }
  }
  
  return {
    type: 'invalid_operation',
    message: 'Invalid operation'
  };
};