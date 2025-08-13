import { CookieConsent, COOKIE_CONSENT_KEY, COOKIE_PREFERENCES_SHOWN_KEY } from '@/types/cookies';

export class CookieConsentService {
  private static instance: CookieConsentService;
  private listeners: Set<(consent: CookieConsent | null) => void> = new Set();

  private constructor() {}

  public static getInstance(): CookieConsentService {
    if (!CookieConsentService.instance) {
      CookieConsentService.instance = new CookieConsentService();
    }
    return CookieConsentService.instance;
  }

  public getConsent(): CookieConsent | null {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  public setConsent(consent: Omit<CookieConsent, 'timestamp'>): void {
    const fullConsent: CookieConsent = {
      ...consent,
      timestamp: Date.now()
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullConsent));
    this.notifyListeners(fullConsent);
    
    // Handle Google Ads consent
    this.handleGoogleAdsConsent(fullConsent);
  }

  public hasShownPreferences(): boolean {
    return localStorage.getItem(COOKIE_PREFERENCES_SHOWN_KEY) === 'true';
  }

  public markPreferencesShown(): void {
    localStorage.setItem(COOKIE_PREFERENCES_SHOWN_KEY, 'true');
  }

  public acceptAll(): void {
    this.setConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
  }

  public rejectAll(): void {
    this.setConsent({
      necessary: true, // Always required
      functional: false,
      analytics: false,
      marketing: false
    });
  }

  public hasConsent(): boolean {
    return this.getConsent() !== null;
  }

  public hasMarketingConsent(): boolean {
    const consent = this.getConsent();
    return consent?.marketing === true;
  }

  public hasAnalyticsConsent(): boolean {
    const consent = this.getConsent();
    return consent?.analytics === true;
  }

  public subscribe(listener: (consent: CookieConsent | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(consent: CookieConsent): void {
    this.listeners.forEach(listener => listener(consent));
  }

  private handleGoogleAdsConsent(consent: CookieConsent): void {
    // Update gtag consent mode
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: consent.marketing ? 'granted' : 'denied',
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        functionality_storage: consent.functional ? 'granted' : 'denied',
        personalization_storage: consent.marketing ? 'granted' : 'denied',
        security_storage: 'granted'
      });
    }
  }

  public loadGoogleAds(): void {
    if (!this.hasMarketingConsent()) {
      console.log('🍪 CookieConsentService: Marketing consent not granted, Google Ads not loaded');
      return;
    }

    // Only load Google Ads if we have marketing consent
    if (typeof window !== 'undefined' && !(window as any).gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        }
        (window as any).gtag = gtag;

        // Initialize with current consent
        const consent = this.getConsent();
        gtag('consent', 'default', {
          ad_storage: consent?.marketing ? 'granted' : 'denied',
          analytics_storage: consent?.analytics ? 'granted' : 'denied',
          functionality_storage: consent?.functional ? 'granted' : 'denied',
          personalization_storage: consent?.marketing ? 'granted' : 'denied',
          security_storage: 'granted'
        });

        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
      };
    }
  }
}

export const cookieConsentService = CookieConsentService.getInstance();