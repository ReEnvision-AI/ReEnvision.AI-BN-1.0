import { useCallback, useRef } from 'react';
import { Grid } from './Grid';
import { FormulaBar } from './FormulaBar';

export function SpreadsheetView({ 
  data, 
  activeCell, 
  selectedCells = [], 
  selectedRows = [],
  selectedColumns = [],
  onCellChange, 
  onCellSelect,
  onRowSelect,
  onColumnSelect,
  onColumnResize,
  chartWindows = [],
  onCloseChart,
  onMinimizeChart
}) {
  const gridRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (!activeCell) return;

    const { row, col } = activeCell;
    switch (e.key) {
      case 'ArrowUp':
        if (row > 0) onCellSelect?.(row - 1, col, e.shiftKey);
        break;
      case 'ArrowDown':
        onCellSelect?.(row + 1, col, e.shiftKey);
        break;
      case 'ArrowLeft':
        if (col > 0) onCellSelect?.(row, col - 1, e.shiftKey);
        break;
      case 'ArrowRight':
        onCellSelect?.(row, col + 1, e.shiftKey);
        break;
      default:
        return;
    }
    e.preventDefault();
  }, [activeCell, onCellSelect]);

  return (
    <div className="flex flex-col h-full">
      <FormulaBar
        value={activeCell ? data[activeCell.row]?.[activeCell.col] || '' : ''}
        onChange={(value) => activeCell && onCellChange?.(activeCell.row, activeCell.col, value)}
      />
      <div className="flex-1 overflow-auto">
        <Grid
          ref={gridRef}
          data={data}
          activeCell={activeCell}
          selectedCells={selectedCells}
          selectedRows={selectedRows}
          selectedColumns={selectedColumns}
          onCellSelect={onCellSelect}
          onRowSelect={onRowSelect}
          onColumnSelect={onColumnSelect}
          onCellChange={onCellChange}
          onColumnResize={onColumnResize}
          chartWindows={chartWindows}
          onCloseChart={onCloseChart}
          onMinimizeChart={onMinimizeChart}
        />
      </div>
    </div>
  );
}