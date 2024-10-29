import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

export function FormulaBar({ value, onChange }) {
  const [formula, setFormula] = useState(value);

  useEffect(() => {
    setFormula(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setFormula(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-1 px-2 text-gray-400">
        <Calculator className="w-4 h-4" />
        <span className="text-sm font-medium">fx</span>
      </div>
      <input
        type="text"
        value={formula}
        onChange={handleChange}
        className="flex-1 bg-gray-700/50 px-3 py-1.5 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter a value or formula (start with =)"
      />
    </div>
  );
}