import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Share2, Check, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthentication } from '@/hooks/useAuthentication';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { AuthState } from '@/types/auth';
import AuthExplanationModal from '@/components/AuthExplanationModal';

const ShareAcceptPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authState } = useAuthentication();
  const { addRemoteList } = useShoppingLists();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const listId = searchParams.get('listId');
  const path = searchParams.get('path');
  const owner = searchParams.get('owner');

  useEffect(() => {
    if (!listId || !path) {
      setError(t('invalidShareLink', 'Enlace de compartir inválido'));
      return;
    }

    if (authState === AuthState.AUTHENTICATED) {
      handleAcceptShare();
    } else if (authState !== AuthState.LOADING) {
      // Show auth modal instead of auto-redirecting
      console.log('🔗 ShareAcceptPage: User not authenticated, showing auth modal');
    }
  }, [authState, listId, path]);

  const handleAcceptShare = async () => {
    if (!listId || !path) return;
    
    console.log('🔗 ShareAcceptPage: Accepting shared list:', { listId, path, owner });
    setIsProcessing(true);
    setError(null);
    
    try {
      const success = await addRemoteList({
        id: listId,
        name: t('sharedList', 'Lista Compartida'), // This will be updated when first loaded
        origin: 'remote',
        syncRef: {
          path,
          ownerEmail: owner || undefined
        }
      });

      if (success) {
        console.log('🔗 ShareAcceptPage: Successfully added remote list, navigating to detail');
        navigate(`/shopping-lists/${listId}`);
      } else {
        setError(t('failedToAcceptShare', 'No se pudo aceptar la lista compartida'));
      }
    } catch (error) {
      console.error('🔗 ShareAcceptPage: Error accepting share:', error);
      setError(t('failedToAcceptShare', 'No se pudo aceptar la lista compartida'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const headerProps = {
    title: t('acceptSharedList', 'Aceptar Lista Compartida'),
    showBackButton: true,
    showAvatar: false
  };

  if (!listId || !path) {
    return (
      <Layout currentView="share-accept" headerProps={headerProps}>
        <div className="h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-900">
                {t('invalidLink', 'Enlace Inválido')}
              </CardTitle>
              <CardDescription>
                {t('invalidShareLinkDescription', 'Este enlace de compartir no es válido o ha expirado')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/shopping-lists')}
                className="w-full"
              >
                {t('goToLists', 'Ir a Mis Listas')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentView="share-accept" headerProps={headerProps}>
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Share2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>
              {t('sharedListInvitation', 'Invitación a Lista Compartida')}
            </CardTitle>
            <CardDescription>
              {owner 
                ? t('sharedListFromUser', `${owner} ha compartido una lista contigo`)
                : t('sharedListDescription', 'Has sido invitado a una lista compartida')
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {authState !== AuthState.AUTHENTICATED && authState !== AuthState.LOADING ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  {t('authRequiredToAccept', 'Necesitas iniciar sesión para aceptar esta invitación')}
                </p>
                <Button 
                  onClick={handleAuthRequired}
                  className="w-full"
                >
                  {t('signInToContinue', 'Iniciar Sesión para Continuar')}
                </Button>
              </div>
            ) : authState === AuthState.AUTHENTICATED ? (
              <Button 
                onClick={handleAcceptShare}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('accepting', 'Aceptando...')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {t('acceptAndJoin', 'Aceptar y Unirse')}
                  </div>
                )}
              </Button>
            ) : (
              <div className="text-center text-sm text-gray-500">
                {t('loading', 'Cargando...')}
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/shopping-lists')}
                className="flex-1"
              >
                {t('goToMyLists', 'Mis Listas')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <AuthExplanationModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </Layout>
  );
};

export default ShareAcceptPage;