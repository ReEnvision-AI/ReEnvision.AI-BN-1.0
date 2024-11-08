import { Cell } from '../types/sheet';

interface FormulaContext {
  getCellValue: (id: string) => Cell | undefined;
}

export function evaluateFormula(formula: string, context: FormulaContext): string | number {
  try {
    if (!formula.startsWith('=')) {
      return formula;
    }

    const functionMatch = formula.match(/^=([A-Z]+)\((.*)\)$/i);
    if (functionMatch) {
      const [_, functionName, args] = functionMatch;
      return evaluateFunction(functionName, args.split(','), context);
    }

    // Handle basic arithmetic and cell references
    const expression = formula.substring(1).replace(/[A-Z]+\d+/g, (cellId) => {
      const cell = context.getCellValue(cellId);
      return cell?.value?.toString() || '0';
    });

    try {
      // Using Function constructor for arithmetic evaluation
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict";return (' + expression + ')')();
      return typeof result === 'number' ? result : '#ERROR!';
    } catch {
      return '#ERROR!';
    }
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR!';
  }
}

function evaluateFunction(name: string, args: string[], context: FormulaContext): string | number {
  const evaluatedArgs = args.map(arg => {
    arg = arg.trim();
    if (/^[A-Z]+\d+$/.test(arg)) {
      const cell = context.getCellValue(arg);
      return Number(cell?.value) || 0;
    }
    if (/^[A-Z]+\d+:[A-Z]+\d+$/.test(arg)) {
      // Handle ranges by getting all cells in range
      const [start, end] = arg.split(':');
      const range = getRangeCells(start, end);
      return range.map(cellId => {
        const cell = context.getCellValue(cellId);
        return Number(cell?.value) || 0;
      });
    }
    return Number(arg) || 0;
  });

  switch (name.toUpperCase()) {
    case 'SUM':
      return evaluatedArgs
        .flat()
        .reduce((sum, val) => sum + (Number(val) || 0), 0);

    case 'AVERAGE':
      const numbers = evaluatedArgs.flat().map(val => Number(val) || 0);
      return numbers.reduce((sum, val) => sum + val, 0) / numbers.length;

    case 'MIN':
      return Math.min(...evaluatedArgs.flat().map(val => Number(val) || 0));

    case 'MAX':
      return Math.max(...evaluatedArgs.flat().map(val => Number(val) || 0));

    case 'COUNT':
      return evaluatedArgs.flat().filter(val => !isNaN(Number(val))).length;

    default:
      return '#NAME?';
  }
}

function getRangeCells(start: string, end: string): string[] {
  const startMatch = start.match(/([A-Z]+)(\d+)/);
  const endMatch = end.match(/([A-Z]+)(\d+)/);
  
  if (!startMatch || !endMatch) return [];

  const startCol = columnToNumber(startMatch[1]);
  const startRow = parseInt(startMatch[2]);
  const endCol = columnToNumber(endMatch[1]);
  const endRow = parseInt(endMatch[2]);

  const cells: string[] = [];
  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      cells.push(`${numberToColumn(col)}${row}`);
    }
  }
  return cells;
}

function columnToNumber(column: string): number {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result *= 26;
    result += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
  }
  return result;
}

function numberToColumn(num: number): string {
  let result = '';
  while (num > 0) {
    num--;
    result = String.fromCharCode('A'.charCodeAt(0) + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
}