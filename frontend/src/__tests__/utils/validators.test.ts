import { describe, it, expect } from 'vitest';
import {
  isNumberButton,
  isOperatorButton,
  isFunctionButton,
  isMemoryButton,
  isValidDecimalInput,
  isValidNumberInput,
  canPerformOperation,
  isValidKeyboardInput,
  mapKeyboardInput,
  validateCalculatorState
} from '../../utils/validators';

describe('Validator Utils', () => {
  describe('Button Type Validation', () => {
    it('should identify number buttons correctly', () => {
      expect(isNumberButton('0')).toBe(true);
      expect(isNumberButton('5')).toBe(true);
      expect(isNumberButton('9')).toBe(true);
      expect(isNumberButton('+')).toBe(false);
      expect(isNumberButton('C')).toBe(false);
    });

    it('should identify operator buttons correctly', () => {
      expect(isOperatorButton('+')).toBe(true);
      expect(isOperatorButton('-')).toBe(true);
      expect(isOperatorButton('*')).toBe(true);
      expect(isOperatorButton('/')).toBe(true);
      expect(isOperatorButton('%')).toBe(true);
      expect(isOperatorButton('√')).toBe(true);
      expect(isOperatorButton('^')).toBe(true);
      expect(isOperatorButton('5')).toBe(false);
      expect(isOperatorButton('=')).toBe(false);
    });

    it('should identify function buttons correctly', () => {
      expect(isFunctionButton('C')).toBe(true);
      expect(isFunctionButton('AC')).toBe(true);
      expect(isFunctionButton('+/-')).toBe(true);
      expect(isFunctionButton('.')).toBe(true);
      expect(isFunctionButton('5')).toBe(false);
      expect(isFunctionButton('+')).toBe(false);
    });

    it('should identify memory buttons correctly', () => {
      expect(isMemoryButton('MC')).toBe(true);
      expect(isMemoryButton('MR')).toBe(true);
      expect(isMemoryButton('MS')).toBe(true);
      expect(isMemoryButton('M+')).toBe(true);
      expect(isMemoryButton('M-')).toBe(true);
      expect(isMemoryButton('5')).toBe(false);
      expect(isMemoryButton('+')).toBe(false);
    });
  });

  describe('Input Validation', () => {
    it('should validate decimal input correctly', () => {
      expect(isValidDecimalInput('123', '.')).toBe(true);
      expect(isValidDecimalInput('123.', '5')).toBe(true);
      expect(isValidDecimalInput('123.45', '.')).toBe(false);
      expect(isValidDecimalInput('0', '0')).toBe(false);
      expect(isValidDecimalInput('', '0')).toBe(true);
    });

    it('should validate number input length', () => {
      expect(isValidNumberInput('123', 5)).toBe(true);
      expect(isValidNumberInput('12345', 5)).toBe(true);
      expect(isValidNumberInput('123456', 5)).toBe(false);
      expect(isValidNumberInput('-123.45', 10)).toBe(true);
    });
  });

  describe('Operation Validation', () => {
    it('should validate single operand operations', () => {
      expect(canPerformOperation('√', null, '9')).toBe(true);
      expect(canPerformOperation('√', null, '')).toBe(false);
      expect(canPerformOperation('√', null, 'abc')).toBe(false);
      expect(canPerformOperation('%', null, '50')).toBe(true);
    });

    it('should validate two operand operations', () => {
      expect(canPerformOperation('+', 5, '3')).toBe(true);
      expect(canPerformOperation('+', null, '3')).toBe(false);
      expect(canPerformOperation('+', 5, '')).toBe(false);
      expect(canPerformOperation('+', 5, 'abc')).toBe(false);
    });
  });

  describe('Keyboard Input', () => {
    it('should validate keyboard input', () => {
      expect(isValidKeyboardInput('0')).toBe(true);
      expect(isValidKeyboardInput('+')).toBe(true);
      expect(isValidKeyboardInput('Enter')).toBe(true);
      expect(isValidKeyboardInput('Escape')).toBe(true);
      expect(isValidKeyboardInput('a')).toBe(false);
      expect(isValidKeyboardInput('Space')).toBe(false);
    });

    it('should map keyboard input correctly', () => {
      expect(mapKeyboardInput('0')).toBe('0');
      expect(mapKeyboardInput('+')).toBe('+');
      expect(mapKeyboardInput('Enter')).toBe('=');
      expect(mapKeyboardInput('=')).toBe('=');
      expect(mapKeyboardInput('Backspace')).toBe('C');
      expect(mapKeyboardInput('Escape')).toBe('AC');
      expect(mapKeyboardInput('c')).toBe('C');
      expect(mapKeyboardInput('C')).toBe('AC');
      expect(mapKeyboardInput('x')).toBe(null);
    });
  });

  describe('State Validation', () => {
    it('should validate valid calculator state', () => {
      const result = validateCalculatorState('123', null, null);
      expect(result.isValid).toBe(true);
    });

    it('should validate state with operation', () => {
      const result = validateCalculatorState('123', 5, '+');
      expect(result.isValid).toBe(true);
    });

    it('should detect invalid display value', () => {
      const result = validateCalculatorState('abc', null, null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid display value');
    });

    it('should detect missing previous value for operation', () => {
      const result = validateCalculatorState('123', null, '+');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Missing previous value for operation');
    });

    it('should detect division by zero', () => {
      const result = validateCalculatorState('0', 5, '/');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Division by zero');
    });

    it('should detect negative square root', () => {
      const result = validateCalculatorState('-5', null, '√');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Square root of negative number');
    });

    it('should handle empty display', () => {
      const result = validateCalculatorState('', null, null);
      expect(result.isValid).toBe(true);
    });
  });
});