export const formatNumber = (num: number, maxDigits = 12): string => {
  if (!isFinite(num)) {
    return 'Error';
  }

  // Handle very large numbers with scientific notation
  if (Math.abs(num) >= Math.pow(10, maxDigits) || Math.abs(num) < Math.pow(10, -maxDigits)) {
    return num.toExponential(6);
  }

  // Remove trailing zeros and unnecessary decimal points
  const formatted = num.toString();
  
  // If the number is too long, use scientific notation
  if (formatted.replace('-', '').replace('.', '').length > maxDigits) {
    return num.toExponential(6);
  }

  return formatted;
};

export const formatDisplayValue = (value: string | number, maxDigits = 12): string => {
  if (typeof value === 'string') {
    // Handle string inputs (during typing)
    if (value === '' || value === '0') return '0';
    if (value === '.') return '0.';
    if (value.length > maxDigits) {
      return value.slice(0, maxDigits);
    }
    return value;
  }

  return formatNumber(value, maxDigits);
};

export const formatEquation = (
  previousValue: number | null,
  operation: string | null,
  currentValue: string
): string => {
  if (previousValue === null || operation === null) {
    return currentValue;
  }

  const prevFormatted = formatNumber(previousValue);
  const operatorSymbol = getOperatorSymbol(operation);
  
  return `${prevFormatted} ${operatorSymbol} ${currentValue}`;
};

export const getOperatorSymbol = (operation: string): string => {
  switch (operation) {
    case '+':
      return '+';
    case '-':
      return '−'; // Using proper minus sign
    case '*':
      return '×'; // Using proper multiplication sign
    case '/':
      return '÷'; // Using proper division sign
    case '%':
      return '%';
    case '√':
      return '√';
    case '^':
      return '^';
    default:
      return operation;
  }
};

export const formatHistoryEntry = (equation: string, result: string): string => {
  return `${equation} = ${result}`;
};

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};