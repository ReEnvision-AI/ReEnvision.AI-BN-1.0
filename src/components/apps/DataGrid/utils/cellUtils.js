export function getColumnLabel(index) {
  let label = '';
  while (index >= 0) {
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
}

export function getCellLabel(row, col) {
  return `${getColumnLabel(col)}${row + 1}`;
}

export function parseCellLabel(label) {
  const match = label.match(/([A-Z]+)([0-9]+)/);
  if (!match) return null;

  const [_, col, row] = match;
  const colIndex = col.split('').reduce((acc, char) => 
    acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  return {
    row: parseInt(row) - 1,
    col: colIndex
  };
}

export function getSelectedRange(start, end) {
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  const cells = [];
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      cells.push({ row, col });
    }
  }
  return cells;
}

export function sortCells(cells, data, columnIndex, direction) {
  return [...cells].sort((a, b) => {
    const aValue = data[a.row]?.[columnIndex]?.display || '';
    const bValue = data[b.row]?.[columnIndex]?.display || '';
    
    if (isNaN(aValue) || isNaN(bValue)) {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return direction === 'asc'
      ? parseFloat(aValue) - parseFloat(bValue)
      : parseFloat(bValue) - parseFloat(aValue);
  });
}

export function filterCells(cells, data, filters) {
  return cells.filter(cell => {
    return Object.entries(filters).every(([col, filterFn]) => {
      const value = data[cell.row]?.[parseInt(col)]?.display;
      return filterFn(value);
    });
  });
}