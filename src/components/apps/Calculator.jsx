import { useState } from 'react';
import { Divide, X, Minus, Plus, Equal, RotateCcw } from 'lucide-react';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [newNumber, setNewNumber] = useState(true);
  const [operator, setOperator] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);

  const calculate = (a, b, op) => {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    
    switch (op) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return num2 !== 0 ? num1 / num2 : 'Error';
      default:
        return b;
    }
  };

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operator) {
      const result = calculate(previousValue, current, operator);
      setPreviousValue(result);
      setDisplay(String(result));
    }
    
    setOperator(op);
    setEquation(`${previousValue === null ? current : previousValue} ${op}`);
    setNewNumber(true);
  };

  const handleEqual = () => {
    if (operator && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operator);
      
      setDisplay(String(result));
      setEquation('');
      setPreviousValue(null);
      setOperator(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPreviousValue(null);
    setOperator(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="bg-gray-700/30 rounded-lg p-4 mb-2">
        <div className="text-gray-400 text-sm h-6">{equation}</div>
        <div className="text-2xl text-white font-mono">{display}</div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button 
          onClick={handleClear}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-200 p-4 rounded-lg cursor-pointer"
        >
          C
        </button>
        <button 
          onClick={() => handleOperator('/')}
          className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer"
        >
          <Divide className="w-4 h-4 mx-auto" />
        </button>
        <button 
          onClick={() => handleOperator('*')}
          className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4 mx-auto" />
        </button>
        <button 
          onClick={() => handleOperator('-')}
          className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer"
        >
          <Minus className="w-4 h-4 mx-auto" />
        </button>

        <button onClick={() => handleNumber('7')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">7</button>
        <button onClick={() => handleNumber('8')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">8</button>
        <button onClick={() => handleNumber('9')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">9</button>
        <button 
          onClick={() => handleOperator('+')}
          className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer row-span-2"
        >
          <Plus className="w-4 h-4 mx-auto" />
        </button>

        <button onClick={() => handleNumber('4')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">4</button>
        <button onClick={() => handleNumber('5')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">5</button>
        <button onClick={() => handleNumber('6')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">6</button>

        <button onClick={() => handleNumber('1')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">1</button>
        <button onClick={() => handleNumber('2')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">2</button>
        <button onClick={() => handleNumber('3')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">3</button>
        <button 
          onClick={handleEqual}
          className="bg-blue-600 hover:bg-blue-700 text-gray-200 p-4 rounded-lg cursor-pointer row-span-2"
        >
          <Equal className="w-4 h-4 mx-auto" />
        </button>

        <button onClick={() => handleNumber('0')} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer col-span-2">0</button>
        <button onClick={handleDecimal} className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-200 p-4 rounded-lg cursor-pointer">.</button>
      </div>
    </div>
  );
}