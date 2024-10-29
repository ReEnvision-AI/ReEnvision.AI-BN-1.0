import { forwardRef, useState, useCallback, useEffect } from 'react';
import { GridResizer } from './GridResizer';
import { ChartWindow } from './ChartWindow';
import { useSpreadsheetStore } from './stores/spreadsheetStore';
import { getColumnLabel } from './utils/cellUtils';

export const Grid = forwardRef(({ 
  data, 
  activeCell, 
  selectedCells = [], 
  selectedRows = [],
  selectedColumns = [],
  onCellSelect,
  onRowSelect,
  onColumnSelect,
  onCellChange,
  onColumnResize,
  chartWindows = []
}, ref) => {
  const [columns, setColumns] = useState(26); // A-Z
  const [rows, setRows] = useState(100);
  const [selectionStart, setSelectionStart] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionType, setSelectionType] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [rowHeights, setRowHeights] = useState({});

  // Ensure selectedColumns is always an array
  const normalizedSelectedColumns = Array.isArray(selectedColumns) ? selectedColumns : [];

  const handleMouseDown = (e, row, col, type = 'cell') => {
    if (e.button !== 0) return;
    
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelectionType(type);
    
    if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
      switch (type) {
        case 'cell':
          onCellSelect?.(row, col, false);
          break;
        case 'row':
          onRowSelect?.(row, false);
          break;
        case 'column':
          onColumnSelect?.(col, false);
          break;
      }
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isSelecting || !selectionStart) return;

    const element = e.target.closest('td, th');
    if (!element) return;

    const row = parseInt(element.dataset.row);
    const col = parseInt(element.dataset.col);

    if (row === undefined || col === undefined) return;

    switch (selectionType) {
      case 'cell':
        const minRow = Math.min(selectionStart.row, row);
        const maxRow = Math.max(selectionStart.row, row);
        const minCol = Math.min(selectionStart.col, col);
        const maxCol = Math.max(selectionStart.col, col);

        const newSelection = [];
        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            newSelection.push({ row: r, col: c });
          }
        }
        onCellSelect?.(row, col, true, newSelection);
        break;

      case 'row':
        const rowSelection = [];
        const [startRow, endRow] = [Math.min(selectionStart.row, row), Math.max(selectionStart.row, row)];
        for (let r = startRow; r <= endRow; r++) {
          rowSelection.push(r);
        }
        onRowSelect?.(row, true, rowSelection);
        break;

      case 'column':
        const colSelection = [];
        const [startCol, endCol] = [Math.min(selectionStart.col, col), Math.max(selectionStart.col, col)];
        for (let c = startCol; c <= endCol; c++) {
          colSelection.push(c);
        }
        onColumnSelect?.(col, true, colSelection);
        break;
    }
  }, [isSelecting, selectionStart, selectionType, onCellSelect, onRowSelect, onColumnSelect]);

  useEffect(() => {
    if (isSelecting) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => {
        setIsSelecting(false);
        setSelectionStart(null);
      });
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', () => {});
      };
    }
  }, [isSelecting, handleMouseMove]);

  const handleColumnResize = useCallback((index, width) => {
    setColumnWidths(prev => ({ ...prev, [index]: width }));
    onColumnResize?.(index, width);
  }, [onColumnResize]);

  const handleRowResize = useCallback((index, height) => {
    setRowHeights(prev => ({ ...prev, [index]: height }));
  }, []);

  return (
    <div ref={ref} className="relative overflow-auto">
      {chartWindows.map((chart) => (
        <ChartWindow
          key={chart.id}
          {...chart}
          data={data}
          selectedCells={selectedCells}
        />
      ))}

      <table className="border-collapse">
        <thead>
          <tr>
            <th className="sticky top-0 left-0 z-20 w-12 h-8 bg-gray-800 border border-gray-700"></th>
            {Array.from({ length: columns }).map((_, i) => (
              <th 
                key={i}
                className="sticky top-0 z-10 h-8 bg-gray-800 border border-gray-700 relative"
                data-col={i}
                onClick={(e) => handleMouseDown(e, null, i, 'column')}
                style={{ 
                  width: columnWidths[i] || 96,
                  backgroundColor: normalizedSelectedColumns.includes(i) ? 'rgba(59, 130, 246, 0.1)' : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium px-2">
                    {getColumnLabel(i)}
                  </span>
                  <GridResizer
                    type="column"
                    index={i}
                    onResize={handleColumnResize}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row}>
              <td 
                className="sticky left-0 z-10 bg-gray-800 border border-gray-700 relative"
                data-row={row}
                onClick={(e) => handleMouseDown(e, row, null, 'row')}
                style={{
                  height: rowHeights[row] || 32,
                  backgroundColor: selectedRows.includes(row) ? 'rgba(59, 130, 246, 0.1)' : undefined
                }}
              >
                <span className="text-gray-400 text-sm font-medium px-2">
                  {row + 1}
                </span>
                <GridResizer
                  type="row"
                  index={row}
                  onResize={handleRowResize}
                />
              </td>
              {Array.from({ length: columns }).map((_, col) => {
                const isActive = activeCell?.row === row && activeCell?.col === col;
                const isSelected = selectedCells.some(cell => 
                  cell.row === row && cell.col === col
                );
                
                return (
                  <td
                    key={col}
                    data-row={row}
                    data-col={col}
                    className={`
                      border border-gray-700 select-none relative
                      ${isActive ? 'bg-blue-500/20' : isSelected ? 'bg-blue-500/10' : 'bg-gray-900'}
                      ${selectedRows.includes(row) || normalizedSelectedColumns.includes(col) ? 'bg-blue-500/5' : ''}
                    `}
                    style={{
                      width: columnWidths[col],
                      height: rowHeights[row]
                    }}
                    onMouseDown={(e) => handleMouseDown(e, row, col)}
                  >
                    <input
                      type="text"
                      value={data[row]?.[col]?.display || ''}
                      onChange={(e) => onCellChange?.(row, col, e.target.value)}
                      className="w-full h-full bg-transparent px-2 outline-none text-white"
                      onFocus={() => onCellSelect?.(row, col, false)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

Grid.displayName = 'Grid';