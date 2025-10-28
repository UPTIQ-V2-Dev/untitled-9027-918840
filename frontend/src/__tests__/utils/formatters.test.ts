import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatDisplayValue,
  formatEquation,
  getOperatorSymbol,
  formatHistoryEntry,
  formatTimestamp
} from '../../utils/formatters';

describe('Formatter Utils', () => {
  describe('formatNumber', () => {
    it('should format regular numbers', () => {
      expect(formatNumber(123)).toBe('123');
      expect(formatNumber(123.45)).toBe('123.45');
      expect(formatNumber(-123)).toBe('-123');
      expect(formatNumber(0)).toBe('0');
    });

    it('should format large numbers with scientific notation', () => {
      expect(formatNumber(1e15)).toBe('1.000000e+15');
      expect(formatNumber(1e-15)).toBe('1.000000e-15');
    });

    it('should handle infinite numbers', () => {
      expect(formatNumber(Infinity)).toBe('Error');
      expect(formatNumber(-Infinity)).toBe('Error');
      expect(formatNumber(NaN)).toBe('Error');
    });

    it('should handle long numbers', () => {
      const longNumber = 123456789012345;
      const result = formatNumber(longNumber, 10);
      expect(result).toContain('e+');
    });
  });

  describe('formatDisplayValue', () => {
    it('should format string inputs', () => {
      expect(formatDisplayValue('')).toBe('0');
      expect(formatDisplayValue('0')).toBe('0');
      expect(formatDisplayValue('.')).toBe('0.');
      expect(formatDisplayValue('123')).toBe('123');
    });

    it('should format number inputs', () => {
      expect(formatDisplayValue(123)).toBe('123');
      expect(formatDisplayValue(123.45)).toBe('123.45');
    });

    it('should truncate long strings', () => {
      const longString = '1234567890123456';
      const result = formatDisplayValue(longString, 10);
      expect(result.length).toBeLessThanOrEqual(10);
    });
  });

  describe('formatEquation', () => {
    it('should format complete equations', () => {
      expect(formatEquation(2, '+', '3')).toBe('2 + 3');
      expect(formatEquation(10, '-', '5')).toBe('10 − 5');
      expect(formatEquation(4, '*', '3')).toBe('4 × 3');
      expect(formatEquation(8, '/', '2')).toBe('8 ÷ 2');
    });

    it('should handle null values', () => {
      expect(formatEquation(null, null, '5')).toBe('5');
      expect(formatEquation(2, null, '5')).toBe('5');
      expect(formatEquation(null, '+', '5')).toBe('5');
    });
  });

  describe('getOperatorSymbol', () => {
    it('should return correct symbols for operators', () => {
      expect(getOperatorSymbol('+')).toBe('+');
      expect(getOperatorSymbol('-')).toBe('−');
      expect(getOperatorSymbol('*')).toBe('×');
      expect(getOperatorSymbol('/')).toBe('÷');
      expect(getOperatorSymbol('%')).toBe('%');
      expect(getOperatorSymbol('√')).toBe('√');
      expect(getOperatorSymbol('^')).toBe('^');
    });

    it('should return original string for unknown operators', () => {
      expect(getOperatorSymbol('unknown')).toBe('unknown');
    });
  });

  describe('formatHistoryEntry', () => {
    it('should format history entries correctly', () => {
      expect(formatHistoryEntry('2 + 3', '5')).toBe('2 + 3 = 5');
      expect(formatHistoryEntry('√(9)', '3')).toBe('√(9) = 3');
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamps correctly', () => {
      const date = new Date('2023-12-25T15:30:45');
      const result = formatTimestamp(date);
      expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    });
  });
});