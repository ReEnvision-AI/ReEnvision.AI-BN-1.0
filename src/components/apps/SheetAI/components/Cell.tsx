import React, { useState, useEffect, useRef } from 'react';
import { useSheetStore } from '../stores/sheetStore';
import { evaluateFormula } from '../utils/formulaUtils';
import { formatCellValue } from '../utils/formatUtils';

interface CellProps {
  id: string;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

export function Cell({ id, isSelected, onMouseDown, onMouseMove }: CellProps) {
  const { getCellValue, updateCell, styles } = useSheetStore();
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const cell = getCellValue(id);
  const style = styles[id];

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
    setInputValue(cell?.formula || cell?.value?.toString() || '');
  };

  const handleBlur = () => {
    setEditing(false);
    if (inputValue.startsWith('=')) {
      updateCell(id, {
        value: evaluateFormula(inputValue, { getCellValue }),
        formula: inputValue,
        type: 'formula'
      });
    } else {
      updateCell(id, {
        value: inputValue,
        type: isNaN(Number(inputValue)) ? 'text' : 'number'
      });
    }
  };

  const displayValue = cell?.value !== undefined && cell?.value !== null 
    ? formatCellValue(cell.value, style?.format)
    : '';

  const cellStyle = {
    fontWeight: style?.bold ? 'bold' : 'normal',
    fontStyle: style?.italic ? 'italic' : 'normal',
    textDecoration: style?.underline ? 'underline' : 'none',
    textAlign: style?.align || 'left',
    backgroundColor: style?.backgroundColor || 'transparent',
    color: style?.color || 'white',
    fontSize: `${style?.fontSize || 14}px`,
    fontFamily: style?.fontFamily || 'system-ui',
  };

  return (
    <div
      className={`
        border border-gray-700 min-h-[24px] relative bg-gray-800
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
      `}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onDoubleClick={handleDoubleClick}
      style={cellStyle}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleBlur();
            }
          }}
          className="w-full h-full bg-gray-800 text-white px-2 py-1 focus:outline-none"
        />
      ) : (
        <div className="w-full h-full px-2 py-1 cursor-text overflow-hidden text-ellipsis whitespace-nowrap">
          {displayValue}
        </div>
      )}
    </div>
  );
}