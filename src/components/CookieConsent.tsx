import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Settings } from 'lucide-react';
import { cookieConsentService } from '@/services/CookieConsentService';
import CookiePreferencesModal from './CookiePreferencesModal';

const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const hasConsent = cookieConsentService.hasConsent();
    if (!hasConsent) {
      setIsVisible(true);
    }
    
    // Load Google Ads if user has already given consent
    if (hasConsent) {
      cookieConsentService.loadGoogleAds();
    }
  }, []);

  const handleAcceptAll = () => {
    cookieConsentService.acceptAll();
    setIsVisible(false);
    
    // Load Google Ads after accepting
    setTimeout(() => {
      cookieConsentService.loadGoogleAds();
    }, 100);
  };

  const handleRejectAll = () => {
    cookieConsentService.rejectAll();
    setIsVisible(false);
  };

  const handleShowPreferences = () => {
    setShowPreferences(true);
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
    // If user saved preferences, hide the main banner
    if (cookieConsentService.hasConsent()) {
      setIsVisible(false);
    }
  };

  const handleClose = () => {
    // Only allow closing if user has already given some consent
    if (cookieConsentService.hasConsent()) {
      setIsVisible(false);
    }
  };

  if (!isVisible) return (
    <>
      <CookiePreferencesModal 
        isOpen={showPreferences} 
        onClose={handleClosePreferences} 
      />
    </>
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{ bottom: 'var(--bottom-nav-height)' }}>
        <Card className="bg-background border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-2">{t('legal:cookieConsent')}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('legal:cookieConsentDescription')}{' '}
                  <button 
                    onClick={handleShowPreferences}
                    className="underline hover:no-underline text-foreground"
                  >
                    {t('legal:cookieSettings')}
                  </button>
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    onClick={handleAcceptAll}
                    className="text-xs"
                  >
                    {t('legal:acceptAll')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRejectAll}
                    className="text-xs"
                  >
                    {t('legal:rejectAll')}
                  </Button>
                </div>
              </div>
              {cookieConsentService.hasConsent() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="p-1 h-auto"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <CookiePreferencesModal 
        isOpen={showPreferences} 
        onClose={handleClosePreferences} 
      />
    </>
  );
};

export default CookieConsent;