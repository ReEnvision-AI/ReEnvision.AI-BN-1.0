import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { evaluateFormula } from '../utils/formulas';

export const useSpreadsheetStore = create(
  persist(
    (set, get) => ({
      data: {},
      activeCell: null,
      selectedCells: [],
      selectedRows: [],
      selectedColumns: [],
      columnWidths: {},
      undoStack: [],
      redoStack: [],
      formatting: {
        bold: false,
        italic: false,
        underline: false,
        align: 'left'
      },
      
      setActiveCell: (cell) => set({ activeCell: cell }),
      
      selectCells: (cells, append = false) => set(state => ({
        selectedCells: append ? [...state.selectedCells, ...cells] : cells,
        selectedRows: [],
        selectedColumns: []
      })),

      selectRows: (rows, append = false) => set(state => ({
        selectedRows: append ? [...state.selectedRows, ...rows] : rows,
        selectedCells: [],
        selectedColumns: []
      })),

      selectColumns: (columns, append = false) => set(state => ({
        selectedColumns: append ? [...state.selectedColumns, ...columns] : columns,
        selectedCells: [],
        selectedRows: []
      })),

      updateColumnWidth: (columnIndex, width) => set(state => ({
        columnWidths: {
          ...state.columnWidths,
          [columnIndex]: Math.max(50, width)
        }
      })),

      updateCell: (row, col, value) => {
        const { data, undoStack } = get();
        const oldValue = data[row]?.[col];
        
        undoStack.push({
          type: 'cell',
          row,
          col,
          oldValue,
          newValue: value
        });
        
        set((state) => ({
          data: {
            ...state.data,
            [row]: {
              ...state.data[row],
              [col]: value
            }
          },
          undoStack: [...state.undoStack],
          redoStack: []
        }));
      },
      
      undo: () => {
        const { undoStack, redoStack } = get();
        if (undoStack.length === 0) return;
        
        const action = undoStack[undoStack.length - 1];
        redoStack.push(action);
        
        set((state) => ({
          data: {
            ...state.data,
            [action.row]: {
              ...state.data[action.row],
              [action.col]: action.oldValue
            }
          },
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack]
        }));
      },
      
      redo: () => {
        const { redoStack } = get();
        if (redoStack.length === 0) return;
        
        const action = redoStack[redoStack.length - 1];
        
        set((state) => ({
          data: {
            ...state.data,
            [action.row]: {
              ...state.data[action.row],
              [action.col]: action.newValue
            }
          },
          undoStack: [...state.undoStack, action],
          redoStack: state.redoStack.slice(0, -1)
        }));
      },

      canUndo: () => get().undoStack.length > 0,
      canRedo: () => get().redoStack.length > 0,
      
      setFormatting: (format) => {
        set((state) => ({
          formatting: {
            ...state.formatting,
            ...format
          }
        }));
      },
      
      exportData: async (format) => {
        const { data } = get();
        switch (format) {
          case 'csv':
            const csv = Object.values(data).map(row => 
              Object.values(row).join(',')
            ).join('\n');
            return csv;
          
          case 'json':
            return JSON.stringify(data, null, 2);
          
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
      },
      
      importData: (data, format) => {
        switch (format) {
          case 'csv':
            const rows = data.split('\n').map(row => 
              row.split(',').map(cell => cell.trim())
            );
            set({ data: rows });
            break;
          
          case 'json':
            set({ data: JSON.parse(data) });
            break;
          
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
      }
    }),
    {
      name: 'spreadsheet-storage'
    }
  )
);