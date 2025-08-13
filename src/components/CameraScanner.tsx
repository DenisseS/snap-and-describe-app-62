
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import { Scan, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraScannerProps {
  onPhotoTaken: (photo: string) => void;
  isAnalyzing?: boolean;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onPhotoTaken, isAnalyzing = false }) => {
  const { t } = useTranslation();
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const videoConstraints = {
    width: 1280,
    height: 1280,
    facingMode: facingMode
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      console.log('📸 CameraScanner: Photo captured, calling onPhotoTaken');
      onPhotoTaken(imageSrc);
    }
  }, [onPhotoTaken]);

  const switchCamera = () => {
    setFacingMode(prevFacingMode => 
      prevFacingMode === 'user' ? 'environment' : 'user'
    );
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-sm flex flex-col space-y-4 h-full justify-center">
        {/* Camera View - Responsive size */}
        <div className="relative bg-black rounded-2xl overflow-hidden w-full aspect-square max-h-80">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
            onUserMediaError={(error) => {
              console.error('Camera error:', error);
            }}
          />
          
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm"
              onClick={switchCamera}
              disabled={isAnalyzing}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Analysis overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">{t('analyzing')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center px-2">
          <p className="text-gray-600 text-sm">
            {isAnalyzing 
              ? t('processingImage')
              : t('scanInstructions')
            }
          </p>
        </div>

        {/* Take Photo Button */}
        <Button
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-base font-medium flex items-center justify-center gap-3 disabled:bg-blue-300"
          onClick={capture}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t('analyzing')}</span>
            </>
          ) : (
            <>
              <Scan className="h-5 w-5" />
              <span>{t('takePhoto')}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CameraScanner;
