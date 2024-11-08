import { useState, useRef } from 'react';
import { X, Camera, Upload, Loader2 } from 'lucide-react';

export function ContactScanner({ onClose, onScanComplete }) {
  const [scanning, setScanning] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (error) {
      console.error('Failed to access camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImage(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    setScanning(true);
    try {
      // Simulate API call to OpenAI for business card OCR
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated response
      const contactData = {
        name: 'Sarah Johnson',
        company: 'Tech Innovations Inc.',
        role: 'Sales Director',
        email: 'sarah@techinnovations.com',
        phone: '+1 (555) 987-6543',
        location: 'San Francisco, CA',
        lastContact: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      onScanComplete(contactData);
    } catch (error) {
      console.error('Failed to process business card:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Scan Business Card</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!image ? (
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
              <img
                src={image}
                alt="Business card"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="flex justify-center gap-4">
            {!image ? (
              <>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Start Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setImage(null);
                    startCamera();
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Retake
                </button>
                <button
                  onClick={processImage}
                  disabled={scanning}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Process Image'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}