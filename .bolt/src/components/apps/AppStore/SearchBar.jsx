import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search apps..."
        className="
          w-full bg-gray-700/50 text-white pl-10 pr-4 py-2 rounded-lg
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />
      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
