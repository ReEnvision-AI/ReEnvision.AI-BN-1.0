import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useSheetStore } from '../stores/sheetStore';
import { X, GripVertical } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartOverlayProps {
  id: string;
  type: 'bar' | 'line' | 'pie';
  title: string;
  dataRange: { start: string; end: string };
  position: { x: number; y: number };
  width: number;
  height: number;
}

export function ChartOverlay({
  id,
  type,
  title,
  dataRange,
  position,
  width,
  height
}: ChartOverlayProps) {
  const { getCellValue, removeChart, updateChartPosition } = useSheetStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const labels: string[] = [];
    const data: number[] = [];

    // Extract data from the selected range
    const [startCol, startRow] = dataRange.start.split(/([0-9]+)/);
    const [endCol, endRow] = dataRange.end.split(/([0-9]+)/);

    for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
      for (let row = parseInt(startRow); row <= parseInt(endRow); row++) {
        const cellId = `${String.fromCharCode(col)}${row}`;
        const value = getCellValue(cellId);
        
        if (typeof value === 'number') {
          labels.push(cellId);
          data.push(value);
        }
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          label: title,
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    });
  }, [dataRange, getCellValue, title]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    updateChartPosition(id, {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        text: title,
        color: '#ffffff'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    }
  };

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie
  }[type];

  if (!chartData) return null;

  return (
    <div
      className={`absolute bg-gray-800 rounded-lg shadow-xl border border-gray-700 ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        width,
        height,
        zIndex: isDragging ? 1000 : 100
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="flex items-center justify-between p-2 border-b border-gray-700 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        <button
          onClick={() => removeChart(id)}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4" style={{ height: 'calc(100% - 40px)' }}>
        <ChartComponent data={chartData} options={options} />
      </div>
    </div>
  );
}