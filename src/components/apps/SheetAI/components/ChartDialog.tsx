import React, { useState } from 'react';
import { useSheetStore } from '../stores/sheetStore';
import { X, BarChart2, LineChart, PieChart } from 'lucide-react';
import { ChartConfig } from '../types/sheet';
import toast from 'react-hot-toast';

interface ChartDialogProps {
  type: 'bar' | 'line' | 'pie';
  onClose: () => void;
}

export function ChartDialog({ type, onClose }: ChartDialogProps) {
  const { selectedRange, addChart } = useSheetStore();
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const chartTypes = {
    bar: { icon: BarChart2, label: 'Bar Chart' },
    line: { icon: LineChart, label: 'Line Chart' },
    pie: { icon: PieChart, label: 'Pie Chart' }
  };

  const handleCreate = () => {
    if (!selectedRange) {
      toast.error('Please select a data range first');
      return;
    }

    if (!title) {
      toast.error('Please enter a chart title');
      return;
    }

    const chartConfig: ChartConfig = {
      id: `chart-${Date.now()}`,
      type,
      title,
      dataRange: selectedRange,
      position,
      width: 400,
      height: 300
    };

    addChart(chartConfig);
    toast.success('Chart created successfully');
    onClose();
  };

  const ChartIcon = chartTypes[type].icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-[500px]">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Create {chartTypes[type].label}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Chart Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter chart title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Data Range
            </label>
            <input
              type="text"
              value={selectedRange ? `${selectedRange.start}:${selectedRange.end}` : ''}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
              placeholder="Select data range"
              readOnly
            />
            <p className="mt-1 text-sm text-gray-400">
              Select cells in the spreadsheet to set the data range
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Position X
              </label>
              <input
                type="number"
                value={position.x}
                onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value) })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Position Y
              </label>
              <input
                type="number"
                value={position.y}
                onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value) })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Create Chart
          </button>
        </div>
      </div>
    </div>
  );
}