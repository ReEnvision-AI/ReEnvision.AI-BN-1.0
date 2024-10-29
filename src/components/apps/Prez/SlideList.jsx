import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Copy, Trash2 } from 'lucide-react';
import { usePrezStore } from './stores/prezStore';

export function SlideList() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { 
    slides, 
    currentSlideIndex,
    setCurrentSlide,
    addSlide,
    duplicateSlide,
    deleteSlide 
  } = usePrezStore();

  return (
    <div 
      className={`
        border-r border-gray-800 flex flex-col
        ${isCollapsed ? 'w-12' : 'w-64'}
        transition-all duration-200
      `}
    >
      <div className="p-2 border-b border-gray-800 flex items-center justify-between">
        <h2 className={`font-medium text-white ${isCollapsed ? 'hidden' : ''}`}>
          Slides
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-800 rounded"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              group relative mb-2 cursor-pointer
              ${currentSlideIndex === index ? 'ring-2 ring-blue-500' : ''}
            `}
            onClick={() => setCurrentSlide(index)}
          >
            <div className="aspect-video bg-white rounded-lg overflow-hidden">
              {/* Slide Preview */}
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  Slide {index + 1}
                </span>
              </div>
            </div>

            {!isCollapsed && (
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSlide(index);
                  }}
                  className="p-1 bg-gray-900/80 hover:bg-gray-900 rounded"
                >
                  <Copy className="w-3 h-3 text-gray-300" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(index);
                  }}
                  className="p-1 bg-gray-900/80 hover:bg-gray-900 rounded"
                >
                  <Trash2 className="w-3 h-3 text-gray-300" />
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addSlide}
          className={`
            w-full p-2 flex items-center justify-center gap-2
            border-2 border-dashed border-gray-700 rounded-lg
            hover:border-gray-600 hover:bg-gray-800/50
            ${isCollapsed ? 'aspect-square' : 'aspect-video'}
          `}
        >
          <Plus className="w-4 h-4 text-gray-400" />
          {!isCollapsed && (
            <span className="text-gray-400 text-sm">Add Slide</span>
          )}
        </button>
      </div>
    </div>
  );
}