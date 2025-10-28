export type CalculatorOperation = '+' | '-' | '*' | '/' | '%' | '√' | '^';

export type CalculatorButton = 
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '+' | '-' | '*' | '/' | '%' | '√' | '^'
  | '=' | '.' | 'C' | 'AC' | '+/-'
  | 'MC' | 'MR' | 'MS' | 'M+' | 'M-';

export type ButtonType = 'number' | 'operator' | 'function' | 'memory' | 'equal' | 'clear';

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: CalculatorOperation | null;
  waitingForOperand: boolean;
  memory: number;
  equation: string;
  error: string | null;
}

export interface CalculatorHistory {
  id: string;
  equation: string;
  result: string;
  timestamp: Date;
}

export interface CalculatorButtonProps {
  value: CalculatorButton;
  type: ButtonType;
  onClick: (value: CalculatorButton) => void;
  className?: string;
  disabled?: boolean;
}

export interface CalculatorError {
  type: 'division_by_zero' | 'invalid_input' | 'overflow' | 'underflow' | 'invalid_operation';
  message: string;
}

export interface CalculatorConfig {
  maxDigits: number;
  maxHistory: number;
  decimalPlaces: number;
  useLocalStorage: boolean;
}