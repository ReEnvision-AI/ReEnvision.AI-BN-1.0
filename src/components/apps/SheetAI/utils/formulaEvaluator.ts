interface FormulaContext {
  getCellValue: (cellId: string) => string | number;
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
      const value = context.getCellValue(cellId);
      return isNaN(Number(value)) ? '0' : value.toString();
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
      return Number(context.getCellValue(arg)) || 0;
    }
    if (/^[A-Z]+\d+:[A-Z]+\d+$/.test(arg)) {
      // Handle ranges by getting all cells in range
      const [start, end] = arg.split(':');
      const range = getRangeCells(start, end);
      return range.map(cellId => Number(context.getCellValue(cellId)) || 0);
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

    case 'PRODUCT':
      return evaluatedArgs
        .flat()
        .reduce((product, val) => product * (Number(val) || 1), 1);

    case 'CONCATENATE':
      return evaluatedArgs.flat().join('');

    case 'IF':
      const [condition, trueValue, falseValue] = evaluatedArgs;
      return condition ? trueValue : falseValue;

    case 'ROUND':
      const [value, decimals] = evaluatedArgs;
      return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);

    default:
      return '#NAME?';
  }
}

function getRangeCells(start: string, end: string): string[] {
  const startMatch = start.match(/([A-Z]+)(\d+)/);
  const endMatch = end.match(/([A-Z]+)(\d+)/);
  
  if (!startMatch || !endMatch) {
    return [];
  }

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

export function isFormula(value: string): boolean {
  return typeof value === 'string' && value.startsWith('=');
}

export function getReferencedCells(formula: string): string[] {
  if (!isFormula(formula)) {
    return [];
  }

  const cellRefs = new Set<string>();
  const cellPattern = /[A-Z]+\d+/g;
  const rangePattern = /[A-Z]+\d+:[A-Z]+\d+/g;

  // Find individual cell references
  const cellMatches = formula.match(cellPattern) || [];
  cellMatches.forEach(cell => cellRefs.add(cell));

  // Find and expand range references
  const rangeMatches = formula.match(rangePattern) || [];
  rangeMatches.forEach(range => {
    const [start, end] = range.split(':');
    getRangeCells(start, end).forEach(cell => cellRefs.add(cell));
  });

  return Array.from(cellRefs);
}

export function detectCircularReference(
  formula: string,
  currentCell: string,
  getCellFormula: (cellId: string) => string
): boolean {
  const visited = new Set<string>();
  
  function checkCell(cellId: string): boolean {
    if (visited.has(cellId)) {
      return cellId === currentCell;
    }
    
    visited.add(cellId);
    const cellFormula = getCellFormula(cellId);
    
    if (!isFormula(cellFormula)) {
      return false;
    }
    
    const referencedCells = getReferencedCells(cellFormula);
    return referencedCells.some(ref => checkCell(ref));
  }
  
  return getReferencedCells(formula).some(ref => checkCell(ref));
}