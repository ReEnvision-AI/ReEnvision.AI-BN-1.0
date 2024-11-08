import { useCallback } from 'react';
import { Cell, CellStyle } from '../types/sheet';
import { isCellInRange, getCellOffset, offsetCellId } from '../utils/cellUtils';

interface ClipboardData {
  cells: Record<string, Cell>;
  styles: Record<string, CellStyle>;
  range: { start: string; end: string };
}

export function useClipboard() {
  const copyToClipboard = useCallback((
    cells: Record<string, Cell>,
    styles: Record<string, CellStyle>,
    range: { start: string; end: string }
  ) => {
    const clipboardData: ClipboardData = {
      cells: {},
      styles: {},
      range
    };

    Object.entries(cells).forEach(([cellId, cell]) => {
      if (isCellInRange(cellId, range)) {
        clipboardData.cells[cellId] = cell;
        if (styles[cellId]) {
          clipboardData.styles[cellId] = styles[cellId];
        }
      }
    });

    return clipboardData;
  }, []);

  const pasteFromClipboard = useCallback((
    clipboardData: ClipboardData,
    targetCell: { row: number; col: number }
  ) => {
    const offset = getCellOffset(clipboardData.range.start, targetCell);
    const newCells: Record<string, Cell> = {};
    const newStyles: Record<string, CellStyle> = {};

    Object.entries(clipboardData.cells).forEach(([cellId, cell]) => {
      const newCellId = offsetCellId(cellId, offset);
      newCells[newCellId] = { ...cell };
      
      if (clipboardData.styles[cellId]) {
        newStyles[newCellId] = { ...clipboardData.styles[cellId] };
      }
    });

    return { cells: newCells, styles: newStyles };
  }, []);

  return {
    copyToClipboard,
    pasteFromClipboard
  };
}