import { cn } from '../../lib/utils';
import { Card } from '../ui/card';

interface DisplayProps {
  value: string;
  equation?: string;
  error?: string | null;
  className?: string;
}

export const Display = ({ value, equation, error, className }: DisplayProps) => {
  const displayValue = error || value || '0';
  const hasError = Boolean(error);
  
  return (
    <Card 
      className={cn(
        'p-4 mb-4 bg-background border-2',
        hasError && 'border-destructive',
        className
      )}
    >
      <div className="text-right">
        {/* Equation display */}
        {equation && !hasError && (
          <div 
            className="text-sm text-muted-foreground mb-1 min-h-[1.25rem] break-all"
            data-testid="calculator-equation"
          >
            {equation}
          </div>
        )}
        
        {/* Main display */}
        <div 
          className={cn(
            'text-3xl md:text-4xl font-mono font-bold min-h-[3rem] flex items-center justify-end break-all',
            hasError ? 'text-destructive' : 'text-foreground'
          )}
          data-testid="calculator-display"
          aria-live="polite"
          aria-atomic="true"
        >
          {displayValue}
        </div>
        
        {/* Error message */}
        {hasError && (
          <div 
            className="text-sm text-destructive mt-1"
            data-testid="calculator-error"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    </Card>
  );
};