import React from 'react';
import { useSheetStore } from '../stores/sheetStore';
import { FunctionSquare } from 'lucide-react';

export function FormulaBar() {
  const { currentCell, updateCell } = useSheetStore();

  const handleFormulaChange = (value: string) => {
    if (!currentCell) return;
    updateCell(currentCell.row, currentCell.col, value);
  };

  return (
    <div className="border-b border-gray-800 p-2 flex items-center gap-2">
      <div className="text-gray-400">
        <FunctionSquare className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={currentCell?.formula || ''}
        onChange={(e) => handleFormulaChange(e.target.value)}
        placeholder="Enter formula or value"
        className="flex-1 bg-gray-800 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}