import { cn } from '../../lib/utils';
import { Button as ShadcnButton } from '../ui/button';
import type { CalculatorButtonProps, ButtonType } from '../../types/calculator';

const getButtonVariant = (type: ButtonType) => {
  switch (type) {
    case 'number':
      return 'secondary';
    case 'operator':
      return 'default';
    case 'function':
      return 'outline';
    case 'memory':
      return 'ghost';
    case 'equal':
      return 'default';
    case 'clear':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getButtonSize = (value: string) => {
  // Make zero button wider
  if (value === '0') return 'lg';
  return 'default';
};

export const Button = ({ 
  value, 
  type, 
  onClick, 
  className, 
  disabled = false 
}: CalculatorButtonProps) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  const variant = getButtonVariant(type);
  const size = getButtonSize(value);
  
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'h-14 text-lg font-semibold transition-all active:scale-95',
        // Special styling for different button types
        type === 'number' && 'bg-background hover:bg-muted',
        type === 'operator' && 'bg-primary hover:bg-primary/90 text-primary-foreground',
        type === 'function' && 'bg-muted hover:bg-muted/80',
        type === 'memory' && 'bg-accent hover:bg-accent/80 text-accent-foreground text-sm',
        type === 'equal' && 'bg-primary hover:bg-primary/90 text-primary-foreground font-bold',
        type === 'clear' && 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
        // Special size for zero button
        value === '0' && 'col-span-2',
        // Memory buttons are smaller
        type === 'memory' && 'h-10 text-sm',
        className
      )}
      aria-label={`Calculator button ${value}`}
      data-testid={`calculator-button-${value}`}
    >
      {value}
    </ShadcnButton>
  );
};