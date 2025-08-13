import { useState, useEffect, useCallback } from 'react';
import { cookieConsentService } from '@/services/CookieConsentService';
import { CookieConsent } from '@/types/cookies';

export const useCookiePreferences = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Get initial consent
    const initialConsent = cookieConsentService.getConsent();
    setConsent(initialConsent);

    // Subscribe to consent changes
    const unsubscribe = cookieConsentService.subscribe((newConsent) => {
      setConsent(newConsent);
    });

    return unsubscribe;
  }, []);

  const openPreferences = useCallback(() => {
    setShowPreferences(true);
  }, []);

  const closePreferences = useCallback(() => {
    setShowPreferences(false);
  }, []);

  const hasMarketingConsent = useCallback(() => {
    return cookieConsentService.hasMarketingConsent();
  }, []);

  const hasAnalyticsConsent = useCallback(() => {
    return cookieConsentService.hasAnalyticsConsent();
  }, []);

  const acceptAll = useCallback(() => {
    cookieConsentService.acceptAll();
    setShowPreferences(false);
  }, []);

  const rejectAll = useCallback(() => {
    cookieConsentService.rejectAll();
    setShowPreferences(false);
  }, []);

  return {
    consent,
    showPreferences,
    openPreferences,
    closePreferences,
    hasMarketingConsent,
    hasAnalyticsConsent,
    acceptAll,
    rejectAll
  };
};