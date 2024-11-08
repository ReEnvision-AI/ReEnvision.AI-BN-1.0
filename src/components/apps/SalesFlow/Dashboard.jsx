import { useState } from 'react';
import { DollarSign, TrendingUp, Users, BarChart2 } from 'lucide-react';

const MOCK_DATA = {
  revenue: 1250000,
  growth: 23.5,
  leads: 145,
  conversion: 68
};

export function Dashboard() {
  const [timeframe] = useState('month');
  const [metrics] = useState(MOCK_DATA);

  return (
    <div className="p-6 space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
          }).format(metrics.revenue)}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Growth"
          value={`${metrics.growth}%`}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="New Leads"
          value={metrics.leads}
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversion}%`}
          icon={BarChart2}
          color="yellow"
        />
      </div>

      {/* Visualization Placeholders */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">Revenue Trend</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="space-y-2 w-full">
              {[65, 73, 89, 92, 110, 125].map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="text-sm text-gray-400 w-12">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                  </div>
                  <div className="flex-1 h-8 bg-gray-700 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(value / 125) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-400 w-20">
                    ${value}k
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">Pipeline Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="space-y-4 w-full">
              {[
                { stage: 'Lead', count: 45, color: 'bg-blue-500' },
                { stage: 'Qualified', count: 32, color: 'bg-yellow-500' },
                { stage: 'Pending', count: 28, color: 'bg-purple-500' },
                { stage: 'Won', count: 22, color: 'bg-green-500' },
                { stage: 'Implemented', count: 18, color: 'bg-blue-400' }
              ].map((item) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.stage}</span>
                    <span className="text-gray-400">{item.count} deals</span>
                  </div>
                  <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${(item.count / 45) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    yellow: 'bg-yellow-500/10 text-yellow-400'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">{title}</h3>
          <div className="text-2xl font-bold text-white mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
}