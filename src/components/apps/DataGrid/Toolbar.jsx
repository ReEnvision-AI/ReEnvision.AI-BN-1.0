import { 
  Copy, 
  ClipboardCopy, 
  Save, 
  FileDown, 
  FileUp, 
  Printer,
  Brain, 
  Table2, 
  BarChart2, 
  Settings,
  FileText
} from 'lucide-react';
import { useSpreadsheetStore } from './stores/spreadsheetStore';

export function Toolbar({ 
  onAnalyze, 
  analyzing, 
  onViewChange, 
  currentView, 
  hasSelection,
  onCreateChart,
  onOpenAISettings 
}) {
  const { exportData, importData } = useSpreadsheetStore();

  const handleExport = async (format) => {
    const data = await exportData(format);
    const blob = new Blob([data], { 
      type: format === 'csv' 
        ? 'text/csv' 
        : 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const format = file.name.endsWith('.csv') ? 'csv' : 'json';
        importData(content, format);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onViewChange('spreadsheet')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'spreadsheet' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'hover:bg-gray-700/50 text-gray-400'
          }`}
        >
          <Table2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewChange('chart')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'chart'
              ? 'bg-blue-500/20 text-blue-400'
              : 'hover:bg-gray-700/50 text-gray-400'
          }`}
          disabled={!hasSelection}
          title={!hasSelection ? 'Select cells to create chart' : 'View chart'}
        >
          <BarChart2 className="w-5 h-5" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-700" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => {}} 
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
        >
          <Copy className="w-5 h-5" />
        </button>
        <button
          onClick={() => {}}
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
        >
          <ClipboardCopy className="w-5 h-5" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-700" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => handleExport('csv')}
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
          title="Export as CSV"
        >
          <FileText className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleExport('json')}
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
          title="Export as JSON"
        >
          <FileDown className="w-5 h-5" />
        </button>
        <label className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 cursor-pointer">
          <FileUp className="w-5 h-5" />
          <input
            type="file"
            accept=".csv,.json"
            className="hidden"
            onChange={handleImport}
          />
        </label>
      </div>

      <div className="w-px h-6 bg-gray-700" />

      <button
        onClick={() => window.print()}
        className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
      >
        <Printer className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <button
        onClick={onAnalyze}
        disabled={analyzing || !hasSelection}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          flex items-center gap-2
          ${analyzing
            ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
            : hasSelection
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
        `}
        title={!hasSelection ? 'Select cells to analyze' : 'Analyze selected data'}
      >
        <Brain className="w-5 h-5" />
        {analyzing ? 'Analyzing...' : 'Analyze Data'}
      </button>

      <button
        onClick={onOpenAISettings}
        className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}