export interface Cell {
  value: string | number;
  formula?: string;
  type: 'text' | 'number' | 'formula';
}

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  format?: {
    type: 'number' | 'currency' | 'percentage' | 'text';
    decimals?: number;
    currency?: string;
  };
}

export interface Selection {
  start: string;
  end: string;
}

export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie';
  title: string;
  dataRange: Selection;
  position: { x: number; y: number };
  width: number;
  height: number;
}