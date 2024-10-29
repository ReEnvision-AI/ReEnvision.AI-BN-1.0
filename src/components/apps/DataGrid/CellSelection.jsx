import { useEffect, useRef } from 'react';

export function CellSelection({ 
  startCell,
  currentCell,
  gridRef,
  onSelectionChange 
}) {
  const selectionRef = useRef(null);

  useEffect(() => {
    if (!startCell || !currentCell || !gridRef.current) return;

    const grid = gridRef.current;
    const gridRect = grid.getBoundingClientRect();
    const selection = selectionRef.current;

    const startElem = grid.querySelector(
      `[data-row="${startCell.row}"][data-col="${startCell.col}"]`
    );
    const currentElem = grid.querySelector(
      `[data-row="${currentCell.row}"][data-col="${currentCell.col}"]`
    );

    if (!startElem || !currentElem || !selection) return;

    const startRect = startElem.getBoundingClientRect();
    const currentRect = currentElem.getBoundingClientRect();

    const left = Math.min(startRect.left, currentRect.left) - gridRect.left;
    const top = Math.min(startRect.top, currentRect.top) - gridRect.top;
    const width = Math.abs(currentRect.left - startRect.left) + currentRect.width;
    const height = Math.abs(currentRect.top - startRect.top) + currentRect.height;

    selection.style.left = `${left}px`;
    selection.style.top = `${top}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;

    // Calculate selected cells
    const minRow = Math.min(startCell.row, currentCell.row);
    const maxRow = Math.max(startCell.row, currentCell.row);
    const minCol = Math.min(startCell.col, currentCell.col);
    const maxCol = Math.max(startCell.col, currentCell.col);

    const selectedCells = [];
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        selectedCells.push({ row, col });
      }
    }

    onSelectionChange(selectedCells);
  }, [startCell, currentCell, gridRef, onSelectionChange]);

  if (!startCell || !currentCell) return null;

  return (
    <div
      ref={selectionRef}
      className="absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10"
      style={{ transition: 'all 0.05s ease-out' }}
    />
  );
}