interface FormulaContext {
  getCellValue: (ref: string) => string;
}

export function evaluateFormula(formula: string, context: FormulaContext): string {
  try {
    if (!formula.startsWith('=')) return formula;

    // Extract function name and arguments
    const match = formula.match(/=([A-Z]+)\((.*)\)/i);
    if (!match) {
      // Handle cell references and basic arithmetic
      const expr = formula.substring(1).replace(/[A-Z]+\d+/g, (ref) => {
        const value = context.getCellValue(ref);
        return isNaN(Number(value)) ? '0' : value;
      });
      
      try {
        const result = Function('"use strict";return (' + expr + ')')();
        return result.toString();
      } catch {
        return '#ERROR!';
      }
    }

    const [_, functionName, args] = match;
    const evaluatedArgs = args.split(',').map(arg => {
      arg = arg.trim();
      if (/^[A-Z]+\d+$/.test(arg)) {
        return context.getCellValue(arg);
      }
      if (/^[A-Z]+\d+:[A-Z]+\d+$/.test(arg)) {
        // Handle ranges
        const [start, end] = arg.split(':');
        // Implementation needed for range handling
        return '0';
      }
      return arg;
    });

    switch (functionName.toUpperCase()) {
      case 'SUM':
        return evaluatedArgs
          .map(arg => Number(arg) || 0)
          .reduce((a, b) => a + b, 0)
          .toString();
      
      case 'AVERAGE':
        const numbers = evaluatedArgs.map(arg => Number(arg) || 0);
        return (numbers.reduce((a, b) => a + b, 0) / numbers.length).toString();
      
      case 'MIN':
        return Math.min(...evaluatedArgs.map(arg => Number(arg) || 0)).toString();
      
      case 'MAX':
        return Math.max(...evaluatedArgs.map(arg => Number(arg) || 0)).toString();
      
      default:
        return '#NAME?';
    }
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR!';
  }
}