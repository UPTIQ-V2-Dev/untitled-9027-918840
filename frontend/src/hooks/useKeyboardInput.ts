import { useEffect, useCallback } from 'react';
import type { CalculatorButton } from '../types/calculator';
import { isValidKeyboardInput, mapKeyboardInput } from '../utils/validators';

interface UseKeyboardInputOptions {
  onButtonPress: (button: CalculatorButton) => void;
  enabled?: boolean;
}

export const useKeyboardInput = ({ 
  onButtonPress, 
  enabled = true 
}: UseKeyboardInputOptions) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { key } = event;
    
    // Prevent default browser behavior for calculator keys
    if (isValidKeyboardInput(key)) {
      event.preventDefault();
    }
    
    const calculatorButton = mapKeyboardInput(key);
    
    if (calculatorButton) {
      onButtonPress(calculatorButton);
    }
  }, [onButtonPress, enabled]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { key, ctrlKey, metaKey } = event;
    
    // Handle special key combinations
    if ((ctrlKey || metaKey) && key === 'a') {
      // Ctrl/Cmd + A for All Clear
      event.preventDefault();
      onButtonPress('AC');
      return;
    }
    
    if ((ctrlKey || metaKey) && key === 'c') {
      // Don't interfere with copy operations when there's selected text
      if (window.getSelection()?.toString()) {
        return;
      }
      // Otherwise treat as Clear
      event.preventDefault();
      onButtonPress('C');
      return;
    }
    
    if ((ctrlKey || metaKey) && key === 'v') {
      // Handle paste operations
      event.preventDefault();
      handlePaste();
      return;
    }
    
    // Handle function keys
    if (key === 'F9') {
      event.preventDefault();
      onButtonPress('+/-');
      return;
    }
    
    if (key === 'F12') {
      event.preventDefault();
      onButtonPress('√');
      return;
    }
  }, [onButtonPress, enabled]);

  const handlePaste = useCallback(async () => {
    if (!enabled) return;
    
    try {
      const text = await navigator.clipboard.readText();
      const number = parseFloat(text.trim());
      
      if (!isNaN(number) && isFinite(number)) {
        // Clear current display and input the pasted number
        onButtonPress('AC');
        
        // Convert number to string and input each digit
        const numberStr = number.toString();
        for (const char of numberStr) {
          if (/[0-9.]/.test(char)) {
            onButtonPress(char as CalculatorButton);
          } else if (char === '-' && numberStr.indexOf(char) === 0) {
            // Handle negative sign at the beginning
            onButtonPress('+/-');
          }
        }
      }
    } catch (error) {
      console.warn('Failed to read clipboard:', error);
    }
  }, [onButtonPress, enabled]);

  // Set up keyboard event listeners
  useEffect(() => {
    if (!enabled) return;

    // Use keydown for most keys to prevent repeat issues
    document.addEventListener('keydown', handleKeyDown);
    // Use keypress for better handling of some characters
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyDown, handleKeyPress, enabled]);

  // Return utilities for manual keyboard simulation
  return {
    simulateKeyPress: useCallback((key: string) => {
      const calculatorButton = mapKeyboardInput(key);
      if (calculatorButton) {
        onButtonPress(calculatorButton);
      }
    }, [onButtonPress]),
    
    simulatePaste: handlePaste,
    
    getKeyboardShortcuts: useCallback(() => ({
      'Numbers (0-9)': 'Input digits',
      'Operators (+, -, *, /)': 'Mathematical operations',
      '%': 'Percentage',
      '= or Enter': 'Calculate result',
      '. (period)': 'Decimal point',
      'Backspace': 'Clear current entry',
      'Delete or Escape': 'All clear',
      'Ctrl/Cmd + A': 'All clear',
      'Ctrl/Cmd + C': 'Clear (when no text selected)',
      'Ctrl/Cmd + V': 'Paste number',
      'F9': 'Toggle sign (+/-)',
      'F12': 'Square root'
    }), [])
  };
};