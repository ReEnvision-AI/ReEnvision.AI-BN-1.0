import { useState } from 'react';
import { Toolbar } from './Toolbar';
import { SlideList } from './SlideList';
import { SlideEditor } from './SlideEditor';
import { usePrezStore } from './stores/prezStore';
import { PresentationMode } from './PresentationMode';

export function Prez() {
  const [isPresenting, setIsPresenting] = useState(false);
  const { currentSlide } = usePrezStore();

  if (isPresenting) {
    return <PresentationMode onExit={() => setIsPresenting(false)} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <Toolbar onPresent={() => setIsPresenting(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        <SlideList />
        
        <div className="flex-1 p-4 overflow-auto">
          {currentSlide ? (
            <SlideEditor />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a slide or create a new one to begin editing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}