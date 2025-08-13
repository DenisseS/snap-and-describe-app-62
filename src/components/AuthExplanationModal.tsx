
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Cloud, Lock } from 'lucide-react';
import { useAuthentication } from '@/hooks/useAuthentication.ts';
import { AuthState } from '@/types/auth';

interface AuthExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthExplanationModal: React.FC<AuthExplanationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { authState, login } = useAuthentication();

  const handleConnectDropbox = async () => {
    try {
      await login();
    } catch (error) {
      console.error('🔐 AuthExplanationModal: Login error:', error);
    }
  };

  const isConnecting = authState === AuthState.LOGGING_IN;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            {t('decentralizedApp')}
          </DialogTitle>
          <DialogDescription>
            {t('decentralizedAppDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Cloud className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">{t('yourDataYourControl')}</h4>
              <p className="text-xs text-gray-600">{t('yourDataYourControlDescription')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">{t('securePrivate')}</h4>
              <p className="text-xs text-gray-600">{t('noDataSharing')}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleConnectDropbox}
            disabled={isConnecting}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            {isConnecting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('connecting')}
              </div>
            ) : (
              t('connectDropbox')
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthExplanationModal;
