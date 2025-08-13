
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface IosInstallInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IosInstallInstructionsModal: React.FC<IosInstallInstructionsModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full animate-in zoom-in-95">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="pr-8">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              {t('installInstructions')}
            </h3>
            
            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {t('iosInstallText')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IosInstallInstructionsModal;
