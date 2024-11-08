import { useCallback, useRef } from 'react';
import { Cell, CellStyle } from '../types/sheet';

interface HistoryState {
  cells: Record<string, Cell>;
  styles: Record<string, CellStyle>;
}

export function useHistory(maxSize = 100) {
  const undoStack = useRef<HistoryState[]>([]);
  const redoStack = useRef<HistoryState[]>([]);
  const isUndoing = useRef(false);

  const pushState = useCallback((state: HistoryState) => {
    if (isUndoing.current) return;
    
    undoStack.current.push(state);
    if (undoStack.current.length > maxSize) {
      undoStack.current.shift();
    }
    redoStack.current = [];
  }, [maxSize]);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return null;
    
    isUndoing.current = true;
    const currentState = undoStack.current.pop()!;
    redoStack.current.push(currentState);
    const previousState = undoStack.current[undoStack.current.length - 1];
    isUndoing.current = false;
    
    return previousState;
  }, []);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return null;
    
    const nextState = redoStack.current.pop()!;
    undoStack.current.push(nextState);
    return nextState;
  }, []);

  const canUndo = useCallback(() => undoStack.current.length > 0, []);
  const canRedo = useCallback(() => redoStack.current.length > 0, []);

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  };
}