import { 
  Play, Save, Plus, Image, Type, Square, Circle, 
  Triangle, Pencil, Palette, Download, Upload 
} from 'lucide-react';
import { usePrezStore } from './stores/prezStore';

export function Toolbar({ onPresent }) {
  const { 
    addSlide, 
    addShape, 
    addText, 
    addImage,
    savePresentation,
    loadPresentation,
    exportPresentation 
  } = usePrezStore();

  return (
    <div className="border-b border-gray-800 p-2 flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={addSlide}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="New Slide"
        >
          <Plus className="w-4 h-4" />
        </button>
        
        <button
          onClick={savePresentation}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Save"
        >
          <Save className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.prez';
            input.onchange = (e) => {
              const file = e.target.files?.[0];
              if (file) loadPresentation(file);
            };
            input.click();
          }}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Open"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={exportPresentation}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Export"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-800" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => addText()}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Add Text"
        >
          <Type className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => addShape('rectangle')}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Rectangle"
        >
          <Square className="w-4 h-4" />
        </button>

        <button
          onClick={() => addShape('circle')}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Circle"
        >
          <Circle className="w-4 h-4" />
        </button>

        <button
          onClick={() => addShape('triangle')}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Triangle"
        >
          <Triangle className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => addImage(e.target?.result);
                reader.readAsDataURL(file);
              }
            };
            input.click();
          }}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Add Image"
        >
          <Image className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-800" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => {}}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Draw"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => {}}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          title="Color"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1" />

      <button
        onClick={onPresent}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        Present
      </button>
    </div>
  );
}