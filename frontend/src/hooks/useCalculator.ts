import { useState, useCallback } from 'react';
import type { 
  CalculatorState, 
  CalculatorButton, 
  CalculatorOperation 
} from '../types/calculator';
import { calculate, handleCalculatorError, parseCalculatorInput } from '../utils/calculator';
import { formatDisplayValue, formatEquation } from '../utils/formatters';
import { 
  isNumberButton, 
  isOperatorButton, 
  isValidDecimalInput, 
  isValidNumberInput,
  canPerformOperation 
} from '../utils/validators';

const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  memory: 0,
  equation: '',
  error: null
};

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>(initialState);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const inputNumber = useCallback((digit: string) => {
    clearError();
    
    setState(prev => {
      // If waiting for operand, replace display
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: digit,
          waitingForOperand: false
        };
      }
      
      // Don't allow invalid decimal input
      if (!isValidDecimalInput(prev.display, digit)) {
        return prev;
      }
      
      // Don't exceed maximum digits
      const newDisplay = prev.display === '0' ? digit : prev.display + digit;
      if (!isValidNumberInput(newDisplay)) {
        return prev;
      }
      
      return {
        ...prev,
        display: newDisplay
      };
    });
  }, [clearError]);

  const inputDecimal = useCallback(() => {
    clearError();
    
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: '0.',
          waitingForOperand: false
        };
      }
      
      if (!isValidDecimalInput(prev.display, '.')) {
        return prev;
      }
      
      return {
        ...prev,
        display: prev.display + '.'
      };
    });
  }, [clearError]);

  const inputOperator = useCallback((nextOperation: CalculatorOperation) => {
    clearError();
    
    setState(prev => {
      try {
        const inputValue = parseCalculatorInput(prev.display);
        
        // Handle single operand operations
        if (nextOperation === '√' || nextOperation === '%') {
          const result = calculate(0, inputValue, nextOperation);
          const newEquation = nextOperation === '√' 
            ? `√(${prev.display})` 
            : `${prev.display}%`;
          
          return {
            ...prev,
            display: formatDisplayValue(result),
            previousValue: null,
            operation: null,
            waitingForOperand: true,
            equation: newEquation
          };
        }
        
        // If we have a previous operation, calculate it first
        if (prev.previousValue !== null && prev.operation && !prev.waitingForOperand) {
          const result = calculate(prev.previousValue, inputValue, prev.operation);
          const newEquation = formatEquation(prev.previousValue, prev.operation, prev.display);
          
          return {
            ...prev,
            display: formatDisplayValue(result),
            previousValue: result,
            operation: nextOperation,
            waitingForOperand: true,
            equation: newEquation
          };
        }
        
        // Set up for next operation
        return {
          ...prev,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForOperand: true,
          equation: formatEquation(inputValue, nextOperation, '')
        };
      } catch (error) {
        const calculatorError = handleCalculatorError(error);
        return {
          ...prev,
          error: calculatorError.message,
          display: 'Error'
        };
      }
    });
  }, [clearError]);

  const calculate_result = useCallback(() => {
    clearError();
    
    setState(prev => {
      if (prev.operation && prev.previousValue !== null) {
        try {
          const inputValue = parseCalculatorInput(prev.display);
          const result = calculate(prev.previousValue, inputValue, prev.operation);
          const equation = formatEquation(prev.previousValue, prev.operation, prev.display);
          
          return {
            ...prev,
            display: formatDisplayValue(result),
            previousValue: null,
            operation: null,
            waitingForOperand: true,
            equation: equation + ' = ' + formatDisplayValue(result)
          };
        } catch (error) {
          const calculatorError = handleCalculatorError(error);
          return {
            ...prev,
            error: calculatorError.message,
            display: 'Error'
          };
        }
      }
      
      return prev;
    });
  }, [clearError]);

  const clear = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: '0',
      waitingForOperand: false,
      error: null
    }));
  }, []);

  const allClear = useCallback(() => {
    setState(initialState);
  }, []);

  const toggleSign = useCallback(() => {
    clearError();
    
    setState(prev => {
      const currentValue = parseCalculatorInput(prev.display);
      const newValue = -currentValue;
      
      return {
        ...prev,
        display: formatDisplayValue(newValue)
      };
    });
  }, [clearError]);

  const memoryStore = useCallback(() => {
    clearError();
    
    setState(prev => {
      const currentValue = parseCalculatorInput(prev.display);
      return {
        ...prev,
        memory: currentValue
      };
    });
  }, [clearError]);

  const memoryRecall = useCallback(() => {
    clearError();
    
    setState(prev => ({
      ...prev,
      display: formatDisplayValue(prev.memory),
      waitingForOperand: true
    }));
  }, [clearError]);

  const memoryClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      memory: 0
    }));
  }, []);

  const memoryAdd = useCallback(() => {
    clearError();
    
    setState(prev => {
      const currentValue = parseCalculatorInput(prev.display);
      return {
        ...prev,
        memory: prev.memory + currentValue
      };
    });
  }, [clearError]);

  const memorySubtract = useCallback(() => {
    clearError();
    
    setState(prev => {
      const currentValue = parseCalculatorInput(prev.display);
      return {
        ...prev,
        memory: prev.memory - currentValue
      };
    });
  }, [clearError]);

  const handleButtonPress = useCallback((button: CalculatorButton) => {
    if (isNumberButton(button)) {
      inputNumber(button);
    } else if (button === '.') {
      inputDecimal();
    } else if (isOperatorButton(button)) {
      inputOperator(button);
    } else if (button === '=') {
      calculate_result();
    } else if (button === 'C') {
      clear();
    } else if (button === 'AC') {
      allClear();
    } else if (button === '+/-') {
      toggleSign();
    } else if (button === 'MS') {
      memoryStore();
    } else if (button === 'MR') {
      memoryRecall();
    } else if (button === 'MC') {
      memoryClear();
    } else if (button === 'M+') {
      memoryAdd();
    } else if (button === 'M-') {
      memorySubtract();
    }
  }, [
    inputNumber,
    inputDecimal,
    inputOperator,
    calculate_result,
    clear,
    allClear,
    toggleSign,
    memoryStore,
    memoryRecall,
    memoryClear,
    memoryAdd,
    memorySubtract
  ]);

  return {
    ...state,
    handleButtonPress,
    clearError
  };
};