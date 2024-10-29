import { Copy, Paste, Trash2, Type, Calculator } from 'lucide-react';

export function ContextMenu({ x, y, onClose, cell, onAction }) {
  const menuItems = [
    { icon: Copy, label: 'Copy', action: 'copy' },
    { icon: Paste, label: 'Paste', action: 'paste' },
    { icon: Trash2, label: 'Clear', action: 'clear' },
    { icon: Type, label: 'Format', action: 'format' },
    { icon: Calculator, label: 'Insert Formula', action: 'formula' }
  ];

  return (
    <div 
      className="fixed bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-50"
      style={{
        top: Math.min(y, window.innerHeight - 200),
        left: Math.min(x, window.innerWidth - 200)
      }}
      onMouseLeave={onClose}
    >
      {menuItems.map(({ icon: Icon, label, action }) => (
        <button
          key={action}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
          onClick={() => onAction(action)}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}