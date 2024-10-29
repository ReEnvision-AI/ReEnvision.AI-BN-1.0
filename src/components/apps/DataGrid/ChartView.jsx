import { useState } from 'react';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
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

export function ChartView({ data, selectedCells, onCreateChart }) {
  const [chartType, setChartType] = useState('bar');
  const [chartOptions, setChartOptions] = useState({
    title: 'Chart Title',
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'rgb(59, 130, 246)',
    label: 'Data Series'
  });

  const handleCreateChart = () => {
    onCreateChart(chartType, chartOptions);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-4 mb-4">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="scatter">Scatter Plot</option>
        </select>

        <input
          type="text"
          value={chartOptions.title}
          onChange={(e) => setChartOptions(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Chart Title"
          className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
        />

        <input
          type="text"
          value={chartOptions.label}
          onChange={(e) => setChartOptions(prev => ({ ...prev, label: e.target.value }))}
          placeholder="Series Label"
          className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
        />

        <button
          onClick={handleCreateChart}
          disabled={selectedCells.length === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
        >
          Create Chart
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {selectedCells.length > 0 ? (
          <div className="h-full">
            <ChartPreview
              type={chartType}
              data={data}
              selectedCells={selectedCells}
              options={chartOptions}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select cells to visualize data
          </div>
        )}
      </div>
    </div>
  );
}

function ChartPreview({ type, data, selectedCells, options }) {
  const chartData = {
    labels: selectedCells.map(cell => `${String.fromCharCode(65 + cell.col)}${cell.row + 1}`),
    datasets: [{
      label: options.label,
      data: selectedCells.map(cell => parseFloat(data[cell.row]?.[cell.col]) || 0),
      backgroundColor: options.backgroundColor,
      borderColor: options.borderColor,
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
        text: options.title,
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
    }
  };

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
}