const FORMULA_REGEX = /([A-Z]+)([0-9]+)/g;
const FUNCTION_REGEX = /^=([A-Z]+)\((.*)\)$/;

function getCellReference(ref) {
  const col = ref.match(/[A-Z]+/)[0];
  const row = parseInt(ref.match(/[0-9]+/)[0]) - 1;
  const colNum = col.split('').reduce((acc, char) => 
    acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  return [row, colNum];
}

function getCellValue(ref, data) {
  const [row, col] = getCellReference(ref);
  const cell = data?.[row]?.[col];
  if (!cell) return 0;
  return parseFloat(cell.display || cell.raw) || 0;
}

function getRangeValues(range, data) {
  const [start, end] = range.split(':');
  const [startRow, startCol] = getCellReference(start);
  const [endRow, endCol] = getCellReference(end);

  const values = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = data[row]?.[col];
      values.push(parseFloat(cell?.display || cell?.raw) || 0);
    }
  }
  return values;
}

const functions = {
  SUM: (range, data) => {
    const values = getRangeValues(range, data);
    return values.reduce((sum, val) => sum + val, 0);
  },

  AVERAGE: (range, data) => {
    const values = getRangeValues(range, data);
    return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  },

  MIN: (range, data) => {
    const values = getRangeValues(range, data);
    return values.length ? Math.min(...values) : 0;
  },

  MAX: (range, data) => {
    const values = getRangeValues(range, data);
    return values.length ? Math.max(...values) : 0;
  },

  COUNT: (range, data) => {
    const values = getRangeValues(range, data);
    return values.filter(v => !isNaN(v)).length;
  }
};

export function evaluateFormula(formula, data) {
  if (!formula.startsWith('=')) return formula;

  try {
    // Handle built-in functions
    const functionMatch = formula.match(FUNCTION_REGEX);
    if (functionMatch) {
      const [_, name, args] = functionMatch;
      const fn = functions[name];
      if (fn) {
        return fn(args, data);
      }
      return '#NAME?';
    }

    // Handle arithmetic expressions
    let expression = formula.substring(1);
    expression = expression.replace(FORMULA_REGEX, (match) => {
      return getCellValue(match, data);
    });

    // Evaluate the resulting expression
    const result = new Function(`return ${expression}`)();
    return isNaN(result) ? '#ERROR!' : result;
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR!';
  }
}

export function formatCell(value, format = {}) {
  const {
    numberFormat,
    decimals = 2,
    prefix = '',
    suffix = '',
    bold,
    italic,
    underline,
    align = 'left',
    backgroundColor,
    textColor,
    fontSize,
    fontFamily
  } = format;

  let formatted = value;

  // Apply number formatting
  if (numberFormat && !isNaN(value)) {
    switch (numberFormat) {
      case 'currency':
        formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
        break;
      case 'percentage':
        formatted = new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: decimals
        }).format(value / 100);
        break;
      case 'number':
        formatted = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(value);
        break;
    }
  }

  // Apply prefix and suffix
  formatted = `${prefix}${formatted}${suffix}`;

  // Return formatting styles
  return {
    value: formatted,
    style: {
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      textDecoration: underline ? 'underline' : 'none',
      textAlign: align,
      backgroundColor,
      color: textColor,
      fontSize,
      fontFamily
    }
  };
}