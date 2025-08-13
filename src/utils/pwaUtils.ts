
export const isPWAInstalled = (): boolean => {
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check for iOS standalone mode
  const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAppleStandalone = isApple && (window.navigator as any).standalone;
  
  return isStandalone || isAppleStandalone;
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const addOnlineListener = (callback: () => void): (() => void) => {
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
};

export const addOfflineListener = (callback: () => void): (() => void) => {
  window.addEventListener('offline', callback);
  return () => window.removeEventListener('offline', callback);
};

export const getConnectionType = (): string => {
  const connection = (navigator as any).connection || 
                   (navigator as any).mozConnection || 
                   (navigator as any).webkitConnection;
  
  return connection?.effectiveType || 'unknown';
};

export const shouldShowInstallPrompt = (): boolean => {
  // Don't show if already installed
  if (isPWAInstalled()) return false;
  
  // Don't show if dismissed recently
  const dismissed = localStorage.getItem('pwa-prompt-dismissed');
  if (dismissed) {
    const dismissedTime = parseInt(dismissed);
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    if (now - dismissedTime < oneDayInMs) return false;
  }
  
  // Don't show immediately - wait for user engagement
  const firstVisit = localStorage.getItem('first-visit');
  if (!firstVisit) {
    localStorage.setItem('first-visit', Date.now().toString());
    return false;
  }
  
  const visitTime = parseInt(firstVisit);
  const fiveMinutesInMs = 5 * 60 * 1000;
  
  return (Date.now() - visitTime) > fiveMinutesInMs;
};

export const dismissInstallPrompt = (): void => {
  localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
};
