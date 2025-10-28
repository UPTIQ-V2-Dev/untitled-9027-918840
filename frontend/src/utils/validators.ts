import type { CalculatorButton, CalculatorOperation } from '../types/calculator';

export const isNumberButton = (value: CalculatorButton): value is '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' => {
  return /^[0-9]$/.test(value);
};

export const isOperatorButton = (value: CalculatorButton): value is CalculatorOperation => {
  return ['+', '-', '*', '/', '%', '√', '^'].includes(value as CalculatorOperation);
};

export const isFunctionButton = (value: CalculatorButton): boolean => {
  return ['C', 'AC', '+/-', '.'].includes(value);
};

export const isMemoryButton = (value: CalculatorButton): boolean => {
  return ['MC', 'MR', 'MS', 'M+', 'M-'].includes(value);
};

export const isValidDecimalInput = (currentValue: string, newDigit: string): boolean => {
  // Don't allow multiple decimal points
  if (newDigit === '.' && currentValue.includes('.')) {
    return false;
  }
  
  // Don't allow leading zeros unless followed by decimal point
  if (newDigit === '0' && currentValue === '0') {
    return false;
  }
  
  return true;
};

export const isValidNumberInput = (currentValue: string, maxDigits = 12): boolean => {
  // Remove decimal point and negative sign for digit count
  const digitCount = currentValue.replace(/[.-]/g, '').length;
  return digitCount <= maxDigits;
};

export const canPerformOperation = (
  operation: CalculatorOperation,
  previousValue: number | null,
  currentValue: string
): boolean => {
  // Single operand operations
  if (operation === '√' || operation === '%') {
    return currentValue !== '' && !isNaN(Number(currentValue));
  }
  
  // Two operand operations
  return (
    previousValue !== null &&
    currentValue !== '' &&
    !isNaN(Number(currentValue))
  );
};

export const isValidKeyboardInput = (key: string): boolean => {
  const validKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '+', '-', '*', '/', '%', '=', '.', 'Enter',
    'Backspace', 'Delete', 'Escape', 'c', 'C'
  ];
  
  return validKeys.includes(key);
};

export const mapKeyboardInput = (key: string): CalculatorButton | null => {
  const keyMap: Record<string, CalculatorButton> = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '+': '+', '-': '-', '*': '*', '/': '/',
    '%': '%', '=': '=', 'Enter': '=', '.': '.',
    'Backspace': 'C', 'Delete': 'AC', 'Escape': 'AC',
    'c': 'C', 'C': 'AC'
  };
  
  return keyMap[key] || null;
};

export const validateCalculatorState = (
  display: string,
  previousValue: number | null,
  operation: CalculatorOperation | null
): { isValid: boolean; error?: string } => {
  // Check if display contains a valid number
  if (display !== '' && isNaN(Number(display))) {
    return { isValid: false, error: 'Invalid display value' };
  }
  
  // Check if previous value is valid when operation is set
  if (operation && previousValue === null) {
    return { isValid: false, error: 'Missing previous value for operation' };
  }
  
  // Check for division by zero
  if (operation === '/' && display === '0') {
    return { isValid: false, error: 'Division by zero' };
  }
  
  // Check for negative square root
  if (operation === '√' && Number(display) < 0) {
    return { isValid: false, error: 'Square root of negative number' };
  }
  
  return { isValid: true };
};