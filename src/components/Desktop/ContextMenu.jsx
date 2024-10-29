import { useEffect, useRef } from 'react';

export function ContextMenu({ x, y, onDelete, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-800 rounded-lg shadow-lg py-1 z-50 min-w-[120px]"
      style={{ 
        top: Math.min(y, window.innerHeight - 100), 
        left: Math.min(x, window.innerWidth - 120) 
      }}
    >
      <button
        className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 text-sm"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}