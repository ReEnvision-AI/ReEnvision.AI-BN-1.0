import { useState } from 'react';
import { Trash2, Type, Move, Image } from 'lucide-react';

export function ElementEditor({ element, isSelected, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return isEditing ? (
          <textarea
            value={element.content}
            onChange={(e) => onChange({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="w-full h-full p-2 resize-none border-none outline-none"
            style={{
              fontSize: element.fontSize,
              fontWeight: element.bold ? 'bold' : 'normal',
              fontStyle: element.italic ? 'italic' : 'normal',
              textDecoration: element.underline ? 'underline' : 'none',
              color: element.color,
              textAlign: element.align
            }}
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditing(true)}
            className="w-full h-full p-2 cursor-text"
            style={{
              fontSize: element.fontSize,
              fontWeight: element.bold ? 'bold' : 'normal',
              fontStyle: element.italic ? 'italic' : 'normal',
              textDecoration: element.underline ? 'underline' : 'none',
              color: element.color,
              textAlign: element.align
            }}
          >
            {element.content}
          </div>
        );

      case 'shape':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.fill,
              borderRadius: element.type === 'circle' ? '50%' : 0
            }}
          />
        );

      case 'image':
        return (
          <img
            src={element.src}
            alt=""
            className="w-full h-full object-cover"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full group">
      {renderElement()}

      {isSelected && (
        <div className="absolute -top-8 left-0 flex items-center gap-1">
          <button
            onClick={onDelete}
            className="p-1 bg-gray-900 hover:bg-gray-800 rounded text-white"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}