import { useState, useCallback, useEffect } from 'react';

export function GridResizer({ type, index, onResize }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [startSize, setStartSize] = useState(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.closest(type === 'column' ? 'th' : 'td').getBoundingClientRect();
    setStartPos(type === 'column' ? e.clientX : e.clientY);
    setStartSize(type === 'column' ? rect.width : rect.height);
    setIsDragging(true);
  }, [type]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || startPos === null || startSize === null) return;

    const currentPos = type === 'column' ? e.clientX : e.clientY;
    const delta = currentPos - startPos;
    const newSize = Math.max(50, startSize + delta);

    onResize(index, newSize);
  }, [isDragging, startPos, startSize, type, index, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setStartPos(null);
    setStartSize(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`
        absolute ${type === 'column' ? 'right-0 top-0 w-1 h-full cursor-col-resize' : 'bottom-0 left-0 w-full h-1 cursor-row-resize'}
        hover:bg-blue-500 group touch-manipulation
      `}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <div className={`
        absolute ${type === 'column' ? 'w-1 h-full' : 'w-full h-1'}
        ${isDragging ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-500'}
        transition-colors
      `} />
    </div>
  );
}