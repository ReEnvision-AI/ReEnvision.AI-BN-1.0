import { Code2, Server, Package } from 'lucide-react';

export function AppBuilderSidebar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'frontend', label: 'Frontend', icon: Code2 },
    { id: 'backend', label: 'Backend', icon: Server },
    { id: 'dependencies', label: 'Dependencies', icon: Package }
  ];

  return (
    <div className="w-16 bg-gray-800 border-r border-gray-700">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              w-full p-4 flex flex-col items-center gap-1
              text-xs transition-colors
              ${activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}