import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrezStore } from './stores/prezStore';

export function PresentationMode({ onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { slides } = usePrezStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Space':
          setCurrentIndex(prev => Math.min(prev + 1, slides.length - 1));
          break;
        case 'ArrowLeft':
          setCurrentIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Escape':
          onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onExit]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onExit}
          className="p-2 bg-gray-900/50 hover:bg-gray-900 rounded-full text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className="p-2 bg-gray-900/50 hover:bg-gray-900 rounded-full text-white disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <span className="text-white">
          {currentIndex + 1} / {slides.length}
        </span>

        <button
          onClick={() => setCurrentIndex(prev => Math.min(prev + 1, slides.length - 1))}
          disabled={currentIndex === slides.length - 1}
          className="p-2 bg-gray-900/50 hover:bg-gray-900 rounded-full text-white disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="h-full flex items-center justify-center p-8">
        <div className="relative bg-white aspect-video w-full max-w-6xl shadow-2xl">
          {currentSlide?.elements.map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height
              }}
            >
              <ElementEditor
                element={element}
                isSelected={false}
                onChange={() => {}}
                onDelete={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}