import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { X, Maximize2, Minimize2, Settings } from 'lucide-react';

export function ChartWindow({ 
  id, 
  type, 
  position, 
  size,
  data,
  selectedCells,
  onClose,
  onMinimize,
  config,
  onConfigChange 
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const chartData = {
    labels: selectedCells.map(cell => `${String.fromCharCode(65 + cell.col)}${cell.row + 1}`),
    datasets: [{
      label: config?.label || 'Data',
      data: selectedCells.map(cell => parseFloat(data[cell.row]?.[cell.col]?.display || 0)),
      backgroundColor: config?.backgroundColor || 'rgba(59, 130, 246, 0.5)',
      borderColor: config?.borderColor || 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'rgb(209, 213, 219)' }
      },
      title: {
        display: true,
        text: config?.title || 'Chart',
        color: 'rgb(209, 213, 219)'
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(75, 85, 99, 0.2)' },
        ticks: { color: 'rgb(209, 213, 219)' }
      },
      x: {
        grid: { color: 'rgba(75, 85, 99, 0.2)' },
        ticks: { color: 'rgb(209, 213, 219)' }
      }
    },
    ...config?.options
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="chart-window-handle"
      enableResizing={!isMaximized}
      disableDragging={isMaximized}
      size={isMaximized ? { width: '100%', height: '100%' } : undefined}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
    >
      <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="chart-window-handle flex items-center justify-between p-2 bg-gray-900">
          <span className="text-white text-sm font-medium">{config?.title || 'Chart'}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onMinimize}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <Minimize2 className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <Maximize2 className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-500/20 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          {showSettings ? (
            <ChartSettings config={config} onChange={onConfigChange} />
          ) : (
            renderChart()
          )}
        </div>
      </div>
    </Rnd>
  );
}

function ChartSettings({ config, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Chart Title
        </label>
        <input
          type="text"
          value={config?.title || ''}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Series Label
        </label>
        <input
          type="text"
          value={config?.label || ''}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Colors
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Background
            </label>
            <input
              type="color"
              value={config?.backgroundColor || '#3B82F6'}
              onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
              className="w-full h-8 bg-transparent rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Border
            </label>
            <input
              type="color"
              value={config?.borderColor || '#3B82F6'}
              onChange={(e) => onChange({ ...config, borderColor: e.target.value })}
              className="w-full h-8 bg-transparent rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}