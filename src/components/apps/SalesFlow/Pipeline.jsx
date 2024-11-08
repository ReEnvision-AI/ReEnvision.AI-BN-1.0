import { useState } from 'react';
import { DollarSign, BarChart2, Users, CheckCircle, AlertCircle } from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'lead', name: 'Lead', icon: Users, color: 'text-blue-400' },
  { id: 'qualified', name: 'Qualified', icon: AlertCircle, color: 'text-yellow-400' },
  { id: 'pending', name: 'Pending', icon: BarChart2, color: 'text-purple-400' },
  { id: 'won', name: 'Won', icon: DollarSign, color: 'text-green-400' },
  { id: 'implemented', name: 'Implemented', icon: CheckCircle, color: 'text-blue-400' }
];

const MOCK_DEALS = [
  {
    id: 1,
    name: 'Enterprise Software Solution',
    company: 'Tech Corp',
    value: 75000,
    stage: 'lead',
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    name: 'Cloud Migration Project',
    company: 'Data Systems Inc',
    value: 120000,
    stage: 'qualified',
    lastUpdated: '2024-01-14'
  },
  {
    id: 3,
    name: 'Security Implementation',
    company: 'SecureNet',
    value: 45000,
    stage: 'pending',
    lastUpdated: '2024-01-13'
  },
  {
    id: 4,
    name: 'Digital Transformation',
    company: 'Future Corp',
    value: 250000,
    stage: 'won',
    lastUpdated: '2024-01-12'
  },
  {
    id: 5,
    name: 'AI Integration',
    company: 'Smart Solutions',
    value: 180000,
    stage: 'implemented',
    lastUpdated: '2024-01-11'
  }
];

export function Pipeline() {
  const [deals, setDeals] = useState(MOCK_DEALS);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (stage) => {
    if (!draggedDeal) return;

    setDeals(prev => prev.map(deal => 
      deal.id === draggedDeal.id ? { ...deal, stage } : deal
    ));
    setDraggedDeal(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="grid grid-cols-5 gap-4 flex-1">
        {PIPELINE_STAGES.map(stage => (
          <div
            key={stage.id}
            className="flex flex-col bg-gray-800 rounded-lg"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
          >
            <div className="p-3 border-b border-gray-700 flex items-center gap-2">
              <stage.icon className={`w-5 h-5 ${stage.color}`} />
              <span className="font-medium text-white">{stage.name}</span>
              <span className="text-sm text-gray-400 ml-auto">
                {deals.filter(d => d.stage === stage.id).length}
              </span>
            </div>

            <div className="p-2 flex-1 space-y-2 overflow-auto">
              {deals
                .filter(deal => deal.stage === stage.id)
                .map(deal => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    className="bg-gray-700 p-3 rounded-lg cursor-move hover:bg-gray-600 transition-colors"
                  >
                    <div className="font-medium text-white mb-1">{deal.name}</div>
                    <div className="text-sm text-gray-400">{deal.company}</div>
                    <div className="text-sm font-medium text-green-400 mt-2">
                      {formatCurrency(deal.value)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}