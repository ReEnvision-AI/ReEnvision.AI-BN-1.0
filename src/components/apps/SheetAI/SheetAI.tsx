import React from 'react';
import { MenuBar } from './components/MenuBar';
import { Toolbar } from './components/Toolbar';
import { FormulaBar } from './components/FormulaBar';
import { Grid } from './components/Grid';
import { AIAssistant } from './components/AIAssistant';
import { SheetProvider } from './context/SheetContext';

export function SheetAI() {
  return (
    <SheetProvider>
      <div className="h-full flex flex-col bg-gray-900 text-white">
        <MenuBar />
        <Toolbar />
        <FormulaBar />
        <div className="flex-1 overflow-hidden">
          <Grid />
        </div>
        <AIAssistant />
      </div>
    </SheetProvider>
  );
}