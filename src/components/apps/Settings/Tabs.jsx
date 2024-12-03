import React from 'react';
import PropTypes from 'prop-types';

export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-700">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2 text-sm font-medium transition-colors
            ${activeTab === tab.id 
              ? 'text-white border-b-2 border-blue-500' 
              : 'text-gray-400 hover:text-white'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
}