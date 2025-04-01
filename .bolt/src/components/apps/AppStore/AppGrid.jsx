import React from 'react';
import PropTypes from 'prop-types';
import { Download, Trash2, RefreshCw } from 'lucide-react';

export function AppGrid({ apps, onSelect, selectedId, installing, isInstalled }) {
  return (
    <div className="grid gap-4">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onSelect(app)}
          className={`
            flex items-center gap-3 p-3 rounded-lg text-left
            transition-colors w-full
            ${selectedId === app.id ? 'bg-blue-600' : 'hover:bg-gray-700/50'}
          `}
        >
          <app.icon className="w-8 h-8 text-gray-300 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white truncate">{app.name}</div>
            <div className="text-sm text-gray-400 truncate">{app.description.split('.')[0]}</div>
          </div>
          <div className="shrink-0">
            {installing[app.id] ? (
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
            ) : isInstalled(app.id) ? (
              <Trash2 className="w-5 h-5 text-red-400" />
            ) : (
              <Download className="w-5 h-5 text-green-400" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

AppGrid.propTypes = {
  apps: PropTypes.array,
  onSelect: PropTypes.func,
  selectedId: PropTypes.string,
  installing: PropTypes.array,
  isInstalled: PropTypes.func,
};
