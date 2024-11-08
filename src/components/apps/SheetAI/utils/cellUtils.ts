export function getCellId(col: number, row: number): string {
  return `${col}-${row}`;
}

export function parseCellId(cellId: string): [number, number] {
  const [col, row] = cellId.split('-').map(Number);
  return [col, row];
}

export function isCellInRange(cellId: string, range: { start: string; end: string }): boolean {
  const [startCol, startRow] = parseCellId(range.start);
  const [endCol, endRow] = parseCellId(range.end);
  const [col, row] = parseCellId(cellId);
  
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  
  return col >= minCol && col <= maxCol && row >= minRow && row <= maxRow;
}

export function getCellRange(start: string, end: string): string[] {
  const [startCol, startRow] = parseCellId(start);
  const [endCol, endRow] = parseCellId(end);
  
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  
  const cells: string[] = [];
  for (let col = minCol; col <= maxCol; col++) {
    for (let row = minRow; row <= maxRow; row++) {
      cells.push(getCellId(col, row));
    }
  }
  return cells;
}

export function evaluateFormula(formula: string, context: { getCellValue: (id: string) => any }): string | number {
  try {
    if (!formula.startsWith('=')) return formula;

    // Replace cell references with values
    const evaluatedFormula = formula.substring(1).replace(/[A-Z]+\d+/g, (ref) => {
      const value = context.getCellValue(ref);
      return value === undefined ? '0' : value.toString();
    });

    // Safely evaluate the formula
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict";return (${evaluatedFormula})`)();
    return result;
  } catch (error) {
    return '#ERROR!';
  }
}

export function formatCellValue(value: any, format?: { type: string; decimals?: number; currency?: string }): string {
  if (value === undefined || value === null) return '';
  
  if (!format) return String(value);

  try {
    const num = Number(value);
    if (isNaN(num)) return String(value);

    switch (format.type) {
      case 'number':
        return num.toFixed(format.decimals || 0);
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: format.currency || 'USD',
          minimumFractionDigits: format.decimals || 2,
          maximumFractionDigits: format.decimals || 2
        }).format(num);
      case 'percentage':
        return new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: format.decimals || 0,
          maximumFractionDigits: format.decimals || 0
        }).format(num / 100);
      default:
        return String(value);
    }
  } catch (error) {
    return String(value);
  }
}

export function offsetCellId(cellId: string, colOffset: number, rowOffset: number): string {
  const [col, row] = parseCellId(cellId);
  return getCellId(col + colOffset, row + rowOffset);
}

export function getCellStyle(cell: { 
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
}): React.CSSProperties {
  return {
    fontWeight: cell.bold ? 'bold' : 'normal',
    fontStyle: cell.italic ? 'italic' : 'normal',
    textDecoration: cell.underline ? 'underline' : 'none',
    textAlign: cell.align || 'left',
    backgroundColor: cell.backgroundColor || 'transparent',
    color: cell.textColor || 'inherit',
    fontSize: `${cell.fontSize || 14}px`,
    fontFamily: cell.fontFamily || 'inherit'
  };
}