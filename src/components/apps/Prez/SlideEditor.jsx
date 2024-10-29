import { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { usePrezStore } from './stores/prezStore';
import { ElementEditor } from './ElementEditor';

export function SlideEditor() {
  const editorRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const { currentSlide, updateElement, deleteElement } = usePrezStore();

  if (!currentSlide) return null;

  const handleElementChange = (id, changes) => {
    updateElement(currentSlide.id, id, changes);
  };

  const handleDelete = (id) => {
    deleteElement(currentSlide.id, id);
    setSelectedElement(null);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div 
        ref={editorRef}
        className="relative bg-white aspect-video w-full max-w-4xl shadow-xl rounded-lg overflow-hidden"
      >
        {currentSlide.elements.map((element) => (
          <Rnd
            key={element.id}
            default={{
              x: element.x,
              y: element.y,
              width: element.width,
              height: element.height
            }}
            onDragStop={(e, d) => {
              handleElementChange(element.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleElementChange(element.id, {
                width: ref.style.width,
                height: ref.style.height,
                ...position
              });
            }}
            onClick={() => setSelectedElement(element)}
            className={`
              ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''}
            `}
          >
            <ElementEditor
              element={element}
              isSelected={selectedElement?.id === element.id}
              onChange={(changes) => handleElementChange(element.id, changes)}
              onDelete={() => handleDelete(element.id)}
            />
          </Rnd>
        ))}
      </div>
    </div>
  );
}