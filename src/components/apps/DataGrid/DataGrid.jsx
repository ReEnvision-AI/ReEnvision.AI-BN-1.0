import { useState, useCallback } from 'react';
import { SpreadsheetView } from './SpreadsheetView';
import { ChartView } from './ChartView';
import { AIInsights } from './AIInsights';
import { AISettings } from './AISettings';
import { Toolbar } from './Toolbar';
import { useDataGridAI } from './hooks/useDataGridAI';
import { useSpreadsheetStore } from './stores/spreadsheetStore';

export function DataGrid() {
  const { 
    data, 
    selectedCells,
    selectedRows,
    selectedColumns,
    activeCell, 
    setActiveCell,
    updateCell,
    selectCells,
    selectRows,
    selectColumns,
    updateColumnWidth
  } = useSpreadsheetStore();

  const [view, setView] = useState('spreadsheet');
  const [chartWindows, setChartWindows] = useState([]);
  const [showAISettings, setShowAISettings] = useState(false);
  const { insights, analyzing, analyzeData } = useDataGridAI();

  const handleCellSelect = useCallback((row, col, isMultiSelect, selection) => {
    setActiveCell({ row, col });
    if (selection) {
      selectCells(selection);
    } else if (isMultiSelect) {
      selectCells([{ row, col }], true);
    } else {
      selectCells([{ row, col }], false);
    }
  }, [setActiveCell, selectCells]);

  const handleRowSelect = useCallback((row, isMultiSelect, selection) => {
    if (selection) {
      selectRows(selection);
    } else if (isMultiSelect) {
      selectRows([row], true);
    } else {
      selectRows([row], false);
    }
  }, [selectRows]);

  const handleColumnSelect = useCallback((col, isMultiSelect, selection) => {
    if (selection) {
      selectColumns(selection);
    } else if (isMultiSelect) {
      selectColumns([col], true);
    } else {
      selectColumns([col], false);
    }
  }, [selectColumns]);

  const createChart = useCallback((type, config = {}) => {
    const newChart = {
      id: Date.now(),
      type,
      position: { x: 20, y: 20 },
      size: { width: 400, height: 300 },
      config
    };
    setChartWindows(prev => [...prev, newChart]);
  }, []);

  const closeChart = useCallback((id) => {
    setChartWindows(prev => prev.filter(chart => chart.id !== id));
  }, []);

  const minimizeChart = useCallback((id) => {
    setChartWindows(prev => prev.map(chart => 
      chart.id === id ? { ...chart, minimized: !chart.minimized } : chart
    ));
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <Toolbar
        onAnalyze={analyzeData}
        analyzing={analyzing}
        onViewChange={setView}
        currentView={view}
        hasSelection={selectedCells.length > 0}
        onCreateChart={createChart}
        onOpenAISettings={() => setShowAISettings(true)}
      />

      {showAISettings ? (
        <div className="flex-1 p-4 overflow-auto">
          <AISettings
            onClose={() => setShowAISettings(false)}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          {view === 'spreadsheet' && (
            <SpreadsheetView
              data={data}
              activeCell={activeCell}
              selectedCells={selectedCells}
              selectedRows={selectedRows}
              selectedColumns={selectedColumns}
              onCellChange={updateCell}
              onCellSelect={handleCellSelect}
              onRowSelect={handleRowSelect}
              onColumnSelect={handleColumnSelect}
              onColumnResize={updateColumnWidth}
              chartWindows={chartWindows}
              onCloseChart={closeChart}
              onMinimizeChart={minimizeChart}
            />
          )}
          {view === 'chart' && (
            <ChartView 
              data={data} 
              selectedCells={selectedCells}
              onCreateChart={createChart}
            />
          )}
          {view === 'insights' && (
            <AIInsights insights={insights} analyzing={analyzing} />
          )}
        </div>
      )}
    </div>
  );
}