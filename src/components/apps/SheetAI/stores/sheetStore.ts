import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cell, CellStyle, Selection, ChartConfig } from '../types/sheet';
import { evaluateFormula, isCellInRange, offsetCellId } from '../utils/cellUtils';

interface SheetState {
  cells: Record<string, Cell>;
  styles: Record<string, CellStyle>;
  selectedCell: string | null;
  selectedRange: Selection | null;
  clipboard: {
    cells: Record<string, Cell>;
    styles: Record<string, CellStyle>;
    range: Selection;
  } | null;
  history: Array<{
    cells: Record<string, Cell>;
    styles: Record<string, CellStyle>;
  }>;
  historyIndex: number;
  charts: ChartConfig[];

  // Cell operations
  updateCell: (id: string, value: string, formula?: string) => void;
  updateStyle: (id: string, style: Partial<CellStyle>) => void;
  getCellValue: (id: string) => string;
  
  // Selection
  setSelectedCell: (id: string | null) => void;
  setSelectedRange: (range: Selection | null) => void;
  
  // Clipboard operations
  copy: () => void;
  cut: () => void;
  paste: () => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  
  // Chart operations
  addChart: (chart: ChartConfig) => void;
  removeChart: (id: string) => void;
  updateChartPosition: (id: string, position: { x: number; y: number }) => void;
}

export const useSheetStore = create<SheetState>()(
  persist(
    (set, get) => ({
      cells: {},
      styles: {},
      selectedCell: null,
      selectedRange: null,
      clipboard: null,
      history: [],
      historyIndex: -1,
      charts: [],

      updateCell: (id, value, formula) => {
        const state = get();
        const newCells = { ...state.cells };
        
        if (formula) {
          const result = evaluateFormula(formula, {
            getCellValue: (ref) => state.getCellValue(ref)
          });
          newCells[id] = { value: result, formula };
        } else {
          newCells[id] = { value };
        }

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          cells: { ...state.cells },
          styles: { ...state.styles }
        });

        set({
          cells: newCells,
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },

      updateStyle: (id, style) => {
        const state = get();
        const newStyles = { ...state.styles };
        newStyles[id] = { ...newStyles[id], ...style };

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({
          cells: { ...state.cells },
          styles: { ...state.styles }
        });

        set({
          styles: newStyles,
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },

      getCellValue: (id) => {
        const state = get();
        const cell = state.cells[id];
        if (!cell) return '';
        
        if (cell.formula) {
          return evaluateFormula(cell.formula, {
            getCellValue: (ref) => state.getCellValue(ref)
          });
        }
        
        return cell.value;
      },

      setSelectedCell: (id) => set({ selectedCell: id, selectedRange: null }),

      setSelectedRange: (range) => set({ selectedRange: range, selectedCell: null }),

      copy: () => {
        const state = get();
        if (!state.selectedRange && !state.selectedCell) return;

        const range = state.selectedRange || {
          start: state.selectedCell!,
          end: state.selectedCell!
        };

        const cells: Record<string, Cell> = {};
        const styles: Record<string, CellStyle> = {};

        Object.entries(state.cells).forEach(([id, cell]) => {
          if (isCellInRange(id, range)) {
            cells[id] = { ...cell };
            if (state.styles[id]) {
              styles[id] = { ...state.styles[id] };
            }
          }
        });

        set({ clipboard: { cells, styles, range } });
      },

      cut: () => {
        const state = get();
        state.copy();
        
        if (!state.selectedRange && !state.selectedCell) return;

        const range = state.selectedRange || {
          start: state.selectedCell!,
          end: state.selectedCell!
        };

        const newCells = { ...state.cells };
        const newStyles = { ...state.styles };

        Object.keys(state.cells).forEach(id => {
          if (isCellInRange(id, range)) {
            delete newCells[id];
            delete newStyles[id];
          }
        });

        set({ cells: newCells, styles: newStyles });
      },

      paste: () => {
        const state = get();
        if (!state.clipboard || !state.selectedCell) return;

        const targetCell = state.selectedCell;
        const newCells = { ...state.cells };
        const newStyles = { ...state.styles };

        Object.entries(state.clipboard.cells).forEach(([id, cell]) => {
          const newId = offsetCellId(id, targetCell);
          newCells[newId] = { ...cell };
          if (state.clipboard!.styles[id]) {
            newStyles[newId] = { ...state.clipboard!.styles[id] };
          }
        });

        set({ cells: newCells, styles: newStyles });
      },

      undo: () => {
        const state = get();
        if (state.historyIndex <= 0) return;

        const previousState = state.history[state.historyIndex - 1];
        set({
          cells: { ...previousState.cells },
          styles: { ...previousState.styles },
          historyIndex: state.historyIndex - 1
        });
      },

      redo: () => {
        const state = get();
        if (state.historyIndex >= state.history.length - 1) return;

        const nextState = state.history[state.historyIndex + 1];
        set({
          cells: { ...nextState.cells },
          styles: { ...nextState.styles },
          historyIndex: state.historyIndex + 1
        });
      },

      addChart: (chart) => {
        const state = get();
        set({ charts: [...state.charts, chart] });
      },

      removeChart: (id) => {
        const state = get();
        set({ charts: state.charts.filter(chart => chart.id !== id) });
      },

      updateChartPosition: (id, position) => {
        const state = get();
        set({
          charts: state.charts.map(chart =>
            chart.id === id ? { ...chart, position } : chart
          )
        });
      }
    }),
    {
      name: 'sheet-storage',
      partialize: (state) => ({
        cells: state.cells,
        styles: state.styles,
        charts: state.charts
      })
    }
  )
);