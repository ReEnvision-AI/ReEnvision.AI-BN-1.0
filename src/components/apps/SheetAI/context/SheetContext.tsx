import React, { createContext, useContext, useState } from 'react';
import { Cell, CellStyle } from '../types/sheet';

interface SheetContextType {
  cells: { [key: string]: Cell };
  styles: { [key: string]: CellStyle };
  selectedCell: string | null;
  selectedRange: { start: string; end: string } | null;
  getCellValue: (id: string) => Cell | undefined;
  updateCell: (id: string, cell: Cell) => void;
  updateStyle: (id: string, style: Partial<CellStyle>) => void;
  setSelectedCell: (id: string | null) => void;
  setSelectedRange: (range: { start: string; end: string } | null) => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [cells, setCells] = useState<{ [key: string]: Cell }>({});
  const [styles, setStyles] = useState<{ [key: string]: CellStyle }>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);

  const getCellValue = (id: string) => cells[id];

  const updateCell = (id: string, cell: Cell) => {
    setCells(prev => ({
      ...prev,
      [id]: cell
    }));
  };

  const updateStyle = (id: string, style: Partial<CellStyle>) => {
    setStyles(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...style
      }
    }));
  };

  return (
    <SheetContext.Provider
      value={{
        cells,
        styles,
        selectedCell,
        selectedRange,
        getCellValue,
        updateCell,
        updateStyle,
        setSelectedCell,
        setSelectedRange
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}

export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return context;
}