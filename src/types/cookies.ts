export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export interface CookieCategory {
  id: keyof Omit<CookieConsent, 'timestamp'>;
  nameKey: string;
  descriptionKey: string;
  required: boolean;
  cookies: CookieInfo[];
}

export interface CookieInfo {
  nameKey: string;
  domain: string;
  expiration: string;
  path: string;
  descriptionKey: string;
}

export const COOKIE_CONSENT_KEY = 'cookie-consent-v2';
export const COOKIE_PREFERENCES_SHOWN_KEY = 'cookie-preferences-shown';