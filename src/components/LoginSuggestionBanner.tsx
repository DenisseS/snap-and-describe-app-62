
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoginSuggestionBannerProps {
  onLoginClick: () => void;
  onDismiss: () => void;
}

const LoginSuggestionBanner: React.FC<LoginSuggestionBannerProps> = ({
  onLoginClick,
  onDismiss
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 relative">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 text-blue-600 hover:text-blue-800 transition-colors"
        aria-label={t('close')}
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-center justify-between pr-8">
        <div className="flex items-center space-x-3">
          <Cloud className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div>
            <span className="text-sm text-blue-900 font-medium">
              {t('connectToSaveLists', 'Conecta con Dropbox para guardar tus listas en la nube')}
            </span>
          </div>
        </div>
        <Button
          onClick={onLoginClick}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
        >
          {t('connect', 'Conectar')}
        </Button>
      </div>
    </div>
  );
};

export default LoginSuggestionBanner;
