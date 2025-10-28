import { Button } from './Button';
import type { CalculatorButton, ButtonType } from '../../types/calculator';

interface ButtonGridProps {
  onButtonClick: (value: CalculatorButton) => void;
  memoryValue: number;
  className?: string;
}

interface ButtonConfig {
  value: CalculatorButton;
  type: ButtonType;
  gridClass?: string;
}

const buttonLayout: ButtonConfig[][] = [
  // Memory row
  [
    { value: 'MC', type: 'memory' },
    { value: 'MR', type: 'memory' },
    { value: 'MS', type: 'memory' },
    { value: 'M+', type: 'memory' }
  ],
  // Function row
  [
    { value: 'AC', type: 'clear' },
    { value: 'C', type: 'clear' },
    { value: '+/-', type: 'function' },
    { value: '/', type: 'operator' }
  ],
  // Number rows
  [
    { value: '7', type: 'number' },
    { value: '8', type: 'number' },
    { value: '9', type: 'number' },
    { value: '*', type: 'operator' }
  ],
  [
    { value: '4', type: 'number' },
    { value: '5', type: 'number' },
    { value: '6', type: 'number' },
    { value: '-', type: 'operator' }
  ],
  [
    { value: '1', type: 'number' },
    { value: '2', type: 'number' },
    { value: '3', type: 'number' },
    { value: '+', type: 'operator' }
  ],
  [
    { value: '0', type: 'number', gridClass: 'col-span-2' },
    { value: '.', type: 'function' },
    { value: '=', type: 'equal' }
  ],
  // Advanced functions row
  [
    { value: '%', type: 'operator' },
    { value: '√', type: 'operator' },
    { value: '^', type: 'operator' },
    { value: 'M-', type: 'memory' }
  ]
];

export const ButtonGrid = ({ onButtonClick, memoryValue, className }: ButtonGridProps) => {
  const hasMemoryValue = memoryValue !== 0;
  
  return (
    <div className={`grid grid-cols-4 gap-2 ${className || ''}`}>
      {buttonLayout.flat().map((button, index) => {
        const isMemoryRecall = button.value === 'MR';
        const disabled = isMemoryRecall && !hasMemoryValue;
        
        return (
          <Button
            key={`${button.value}-${index}`}
            value={button.value}
            type={button.type}
            onClick={onButtonClick}
            disabled={disabled}
            className={button.gridClass}
          />
        );
      })}
    </div>
  );
};