import { Download, Trash2, Check } from 'lucide-react';
import { useLocalAIStore } from './stores/localAIStore';

export function ModelManager() {
  const { 
    availableModels,
    downloadedModels,
    downloadModel,
    deleteModel,
    setActiveModel,
    activeModelId,
    downloadProgress 
  } = useLocalAIStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Models</h2>
        <div className="grid gap-4">
          {availableModels.map((model) => {
            const isDownloaded = downloadedModels.some(m => m.id === model.id);
            const isActive = model.id === activeModelId;
            const progress = downloadProgress[model.id];

            return (
              <div
                key={model.id}
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{model.name}</h3>
                  <p className="text-sm text-gray-400">{model.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Size: {model.size} • Parameters: {model.parameters}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isDownloaded ? (
                    <>
                      <button
                        onClick={() => setActiveModel(model.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteModel(model.id)}
                        className="p-2 bg-gray-700 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => downloadModel(model.id)}
                      disabled={progress !== undefined}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                    >
                      {progress !== undefined ? (
                        <span>{Math.round(progress)}%</span>
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}