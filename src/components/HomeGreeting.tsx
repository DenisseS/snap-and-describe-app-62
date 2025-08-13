
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuthentication } from '@/hooks/useAuthentication.ts';
import { AuthState } from '@/types/auth';
import { DataState, UserProfile } from '@/types/userData';

interface HomeGreetingProps {
  userProfile: UserProfile | null;
  userState: DataState;
}

const HomeGreeting: React.FC<HomeGreetingProps> = ({ userProfile, userState }) => {
  const { t } = useTranslation();
  const { authState, login } = useAuthentication();
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  const handleConnectDropbox = async () => {
    try {
      await login();
    } catch (error) {
      console.error('🔐 HomeGreeting: Login error:', error);
    }
  };

  // Pattern matching con AuthState y DataState como fuentes de verdad
  const renderContent = () => {
    switch (authState) {
      case AuthState.LOADING:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        );

      case AuthState.AUTHENTICATED:
        { const displayName = userProfile?.name ??  null;
        const isProcessing = userState === DataState.PROCESSING;

        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex-1 min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800 leading-tight">
                  {displayName ? `${getTimeBasedGreeting()}, ${displayName}!` : `${getTimeBasedGreeting()}!`}
                </h2>
                {isProcessing || !displayName && (
                  <div className="text-xs text-blue-500 flex items-center flex-shrink-0 ml-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500 mr-1"></div>
                    {t('syncing')}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('welcomeBack')}
              </p>
            </div>
          </div>
        ); }

      case AuthState.LOGGING_IN:
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex-1 min-h-0">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
                {getTimeBasedGreeting()}!
              </h2>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {t('connectForPersonalized')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={handleConnectDropbox}
                variant="outline"
                size="default"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 px-4 py-2 text-sm"
                disabled={true}
              >
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  {t('connecting')}
                </div>
              </Button>
            </div>
          </div>
        );

      case AuthState.IDLE:
      case AuthState.ERROR:
      default:
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex-1 min-h-0">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
                {getTimeBasedGreeting()}!
              </h2>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {t('connectForPersonalized')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={handleConnectDropbox}
                variant="outline"
                size="default"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 px-4 py-2 text-sm"
              >
                {t('connectDropbox')}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-sm min-h-[8rem] h-[17vh] md:h-[35vh] max-h-[12rem]">
      {renderContent()}
    </div>
  );
};

export default HomeGreeting;
