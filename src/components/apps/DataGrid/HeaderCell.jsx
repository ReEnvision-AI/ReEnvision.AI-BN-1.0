import { ArrowUp, ArrowDown } from 'lucide-react';

export function HeaderCell({ value, isColumn, onSort, sortDirection }) {
  return (
    <div 
      className={`
        flex items-center justify-between px-2 w-full h-full
        ${onSort ? 'cursor-pointer hover:bg-gray-700/50' : ''}
      `}
      onClick={onSort}
    >
      <span className="text-gray-300">{value}</span>
      {onSort && (
        <div className="flex items-center">
          {sortDirection === 'asc' ? (
            <ArrowUp className="w-4 h-4 text-blue-400" />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className="w-4 h-4 text-blue-400" />
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>
      )}
    </div>
  );
}