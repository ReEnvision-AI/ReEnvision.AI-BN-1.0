import { useState, useEffect } from 'react';
import { 
  FileArchive, FolderOpen, Copy, Check, 
  AlertCircle, Loader2, FileJson, FileCode 
} from 'lucide-react';

const STEPS = {
  UPLOAD: 'upload',
  UNZIP: 'unzip',
  VALIDATE: 'validate',
  COPY: 'copy',
  INSTALL: 'install'
};

export function ImportProgress({ file, status, error, progress }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(STEPS.UPLOAD);

  useEffect(() => {
    if (status === 'uploading') {
      setCurrentStep(STEPS.UPLOAD);
    } else if (status === 'unzipping') {
      setCompletedSteps(prev => [...prev, STEPS.UPLOAD]);
      setCurrentStep(STEPS.UNZIP);
    } else if (status === 'validating') {
      setCompletedSteps(prev => [...prev, STEPS.UPLOAD, STEPS.UNZIP]);
      setCurrentStep(STEPS.VALIDATE);
    } else if (status === 'copying') {
      setCompletedSteps(prev => [...prev, STEPS.UPLOAD, STEPS.UNZIP, STEPS.VALIDATE]);
      setCurrentStep(STEPS.COPY);
    } else if (status === 'installing') {
      setCompletedSteps(prev => [...prev, STEPS.UPLOAD, STEPS.UNZIP, STEPS.VALIDATE, STEPS.COPY]);
      setCurrentStep(STEPS.INSTALL);
    } else if (status === 'complete') {
      setCompletedSteps([STEPS.UPLOAD, STEPS.UNZIP, STEPS.VALIDATE, STEPS.COPY, STEPS.INSTALL]);
      setCurrentStep(null);
    }
  }, [status]);

  const steps = [
    {
      id: STEPS.UPLOAD,
      label: 'Upload ZIP File',
      icon: FileArchive,
      description: 'Uploading application package'
    },
    {
      id: STEPS.UNZIP,
      label: 'Extract Contents',
      icon: FolderOpen,
      description: 'Extracting package contents'
    },
    {
      id: STEPS.VALIDATE,
      label: 'Validate Package',
      icon: FileJson,
      description: 'Validating manifest and files'
    },
    {
      id: STEPS.COPY,
      label: 'Copy Files',
      icon: Copy,
      description: 'Copying to application directory'
    },
    {
      id: STEPS.INSTALL,
      label: 'Install App',
      icon: FileCode,
      description: 'Installing in App Store'
    }
  ];

  return (
    <div className="space-y-4">
      {/* File Info */}
      {file && (
        <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
          <FileArchive className="w-5 h-5 text-blue-400" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {file.name}
            </div>
            <div className="text-xs text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isComplete = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div 
              key={step.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-colors
                ${isCurrent ? 'bg-blue-500/10' : isComplete ? 'bg-green-500/10' : 'bg-gray-800'}
              `}
            >
              <div className="shrink-0">
                {isCurrent ? (
                  <div className="w-6 h-6 text-blue-400">
                    <Loader2 className="w-full h-full animate-spin" />
                  </div>
                ) : isComplete ? (
                  <div className="w-6 h-6 text-green-400">
                    <Check className="w-full h-full" />
                  </div>
                ) : (
                  <Icon className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className={`font-medium ${
                    isCurrent ? 'text-blue-400' : 
                    isComplete ? 'text-green-400' : 
                    'text-gray-300'
                  }`}>
                    {step.label}
                  </div>
                  {isCurrent && progress && (
                    <div className="text-sm text-blue-400">
                      {Math.round(progress)}%
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {step.description}
                </div>

                {/* Progress bar for current step */}
                {isCurrent && progress && (
                  <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Error message */}
                {isCurrent && error && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall status */}
      {status === 'complete' && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-400 rounded-lg">
          <Check className="w-5 h-5" />
          <span>Application imported successfully</span>
        </div>
      )}
    </div>
  );
}