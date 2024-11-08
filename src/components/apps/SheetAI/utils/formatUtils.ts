interface CellFormat {
  type?: 'number' | 'currency' | 'percentage' | 'decimal';
  decimals?: number;
  currency?: string;
}

export function formatCellValue(value: any, format?: CellFormat): string {
  if (value === undefined || value === null) return '';
  
  if (!format?.type) return String(value);

  try {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);

    switch (format.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: format.currency || 'USD',
          minimumFractionDigits: format.decimals || 2,
          maximumFractionDigits: format.decimals || 2
        }).format(num);

      case 'percentage':
        return new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: format.decimals || 0,
          maximumFractionDigits: format.decimals || 0
        }).format(num / 100);

      case 'decimal':
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: format.decimals || 0,
          maximumFractionDigits: format.decimals || 0
        }).format(num);

      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(num);
    }
  } catch (error) {
    console.error('Error formatting cell value:', error);
    return String(value);
  }
}