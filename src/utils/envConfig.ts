/**
 * Environment configuration utilities for deployment flexibility
 * Centralizes URL configuration across the application
 */

export interface EnvConfig {
  siteUrl: string;
  cdnUrl: string;
  dropboxClientId: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

/**
 * Get the base site URL with fallback logic
 */
export const getSiteUrl = (): string => {
  // Priority: ENV var > window.location.origin > fallback
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL;
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return 'https://yourapp.com';
};

/**
 * Get CDN URL for static assets
 */
export const getCdnUrl = (): string => {
  return import.meta.env.VITE_CDN_URL || getSiteUrl();
};

/**
 * Generate full URL from relative path
 */
export const getFullUrl = (path: string): string => {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generate redirect URI for OAuth
 */
export const getAuthRedirectUri = (): string => {
  return getFullUrl('/auth/callback');
};

/**
 * Get all environment configuration
 */
export const getEnvConfig = (): EnvConfig => {
  return {
    siteUrl: getSiteUrl(),
    cdnUrl: getCdnUrl(),
    dropboxClientId: import.meta.env.VITE_DROPBOX_CLIENT_ID || '',
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
  };
};

/**
 * Validate environment configuration
 */
export const validateEnvConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = getEnvConfig();
  
  if (!config.dropboxClientId) {
    errors.push('VITE_DROPBOX_CLIENT_ID is required for authentication');
  }
  
  if (!config.siteUrl || config.siteUrl === 'https://yourapp.com') {
    console.warn('⚠️ Using default site URL. Set VITE_SITE_URL for production.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};