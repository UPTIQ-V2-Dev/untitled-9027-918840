import { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Card } from '../ui/card';
import { Display } from './Display';
import { ButtonGrid } from './ButtonGrid';
import { HistoryPanel } from './HistoryPanel';
import { useCalculator } from '../../hooks/useCalculator';
import { useCalculatorHistory } from '../../hooks/useCalculatorHistory';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';

interface CalculatorProps {
  className?: string;
}

export const Calculator = ({ className }: CalculatorProps) => {
  const calculator = useCalculator();
  const history = useCalculatorHistory();
  
  // Set up keyboard input handling
  useKeyboardInput({
    onButtonPress: calculator.handleButtonPress,
    enabled: true
  });

  // Add calculation to history when a calculation is completed
  useEffect(() => {
    if (calculator.equation.includes('=')) {
      const [equation, result] = calculator.equation.split(' = ');
      if (equation && result) {
        history.addHistoryEntry(equation, result);
      }
    }
  }, [calculator.equation, history]);

  return (
    <div className={cn('max-w-md mx-auto', className)}>
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header with history button */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Calculator</h1>
            <HistoryPanel
              history={history.history}
              onClearHistory={history.clearHistory}
              onRemoveEntry={history.removeHistoryEntry}
              onCopyToClipboard={history.copyToClipboard}
              onExportHistory={history.exportHistory}
              onImportHistory={history.importHistory}
              onSearchHistory={history.searchHistory}
            />
          </div>

          {/* Display */}
          <Display
            value={calculator.display}
            equation={calculator.equation}
            error={calculator.error}
          />

          {/* Memory indicator */}
          {calculator.memory !== 0 && (
            <div className="text-sm text-muted-foreground text-center">
              Memory: {calculator.memory}
            </div>
          )}

          {/* Button grid */}
          <ButtonGrid
            onButtonClick={calculator.handleButtonPress}
            memoryValue={calculator.memory}
          />

          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-muted-foreground text-center">
            Use keyboard for quick input • Press F1 for help
          </div>
        </div>
      </Card>
    </div>
  );
};