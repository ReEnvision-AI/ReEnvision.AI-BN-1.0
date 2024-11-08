import React, { useCallback } from 'react';
import { Cell } from './Cell';
import { ChartOverlay } from './ChartOverlay';
import { useSheetStore } from '../stores/sheetStore';

export function Grid() {
  const { selectedRange, setSelectedRange, charts } = useSheetStore();
  const [isDragging, setIsDragging] = React.useState(false);

  const ROWS = 100;
  const COLS = 26;

  const getColumnLabel = (index: number): string => {
    let label = '';
    let num = index;
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
    }
    return label;
  };

  const getCellId = (col: number, row: number) => `${getColumnLabel(col)}${row + 1}`;

  const handleMouseDown = useCallback((e: React.MouseEvent, cellId: string) => {
    setIsDragging(true);
    setSelectedRange({ start: cellId, end: cellId });
  }, [setSelectedRange]);

  const handleMouseMove = useCallback((e: React.MouseEvent, cellId: string) => {
    if (isDragging && selectedRange) {
      setSelectedRange({ ...selectedRange, end: cellId });
    }
  }, [isDragging, selectedRange, setSelectedRange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="relative flex-1 overflow-auto">
      <div 
        className="grid"
        style={{
          gridTemplateColumns: `40px repeat(${COLS}, minmax(100px, 1fr))`,
          gridTemplateRows: `40px repeat(${ROWS}, 24px)`,
        }}
        onMouseUp={handleMouseUp}
      >
        {/* Top-left corner */}
        <div className="bg-gray-800 border-b border-r border-gray-700" />

        {/* Column headers */}
        {Array.from({ length: COLS }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="bg-gray-800 border-b border-r border-gray-700 flex items-center justify-center font-semibold"
          >
            {getColumnLabel(i)}
          </div>
        ))}

        {/* Row headers and cells */}
        {Array.from({ length: ROWS }).map((_, row) => (
          <React.Fragment key={`row-${row}`}>
            <div className="bg-gray-800 border-b border-r border-gray-700 flex items-center justify-center">
              {row + 1}
            </div>
            {Array.from({ length: COLS }).map((_, col) => {
              const cellId = getCellId(col, row);
              return (
                <Cell
                  key={cellId}
                  id={cellId}
                  isSelected={selectedRange ? (
                    cellId === selectedRange.start || 
                    cellId === selectedRange.end
                  ) : false}
                  onMouseDown={(e) => handleMouseDown(e, cellId)}
                  onMouseMove={(e) => handleMouseMove(e, cellId)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Charts overlay */}
      {charts.map((chart) => (
        <ChartOverlay
          key={chart.id}
          id={chart.id}
          type={chart.type}
          title={chart.title}
          dataRange={chart.dataRange}
          position={chart.position}
          width={chart.width}
          height={chart.height}
        />
      ))}
    </div>
  );
}