import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import IosInstallInstructionsModal from '@/components/IosInstallInstructionsModal';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

enum PWAInstallState {
  LOADING = 'loading',
  AVAILABLE = 'available',
  REJECTED = 'rejected',
  INSTALLED = 'installed',
  NOT_SUPPORTED = 'not_supported'
}

interface PWAContextType {
  installState: PWAInstallState;
  currentVersion: string | null;
  canInstall: boolean;
  canShowAppleInstructions: boolean;
  installApp: () => Promise<boolean>;
  showInstallPrompt: () => void;
  hideInstallPrompt: () => void;
  getAppleInstallInstructions: () => string;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

const STORAGE_KEY = 'pwa-install-state';

const checkInstallationStatus = (): boolean => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAppleInstalled = isApple && (window.navigator as any).standalone;
  
  console.log('PWA: Installation check - standalone:', isStandalone, 'apple:', isAppleInstalled);
  return isStandalone || isAppleInstalled;
};

const isAppleDevice = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isAppleDeviceNotInstalled = (): boolean => {
  return isAppleDevice() && !checkInstallationStatus();
};

const loadStateFromStorage = (): PWAInstallState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Object.values(PWAInstallState).includes(stored as PWAInstallState)) {
      console.log('PWA: Loaded state from storage:', stored);
      return stored as PWAInstallState;
    }
  } catch (error) {
    console.warn('PWA: Failed to load from localStorage:', error);
  }
  return PWAInstallState.LOADING;
};

const saveStateToStorage = (state: PWAInstallState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, state);
    console.log('PWA: Saved state to storage:', state);
  } catch (error) {
    console.warn('PWA: Failed to save to localStorage:', error);
  }
};

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Simplified state management
  const [installState, setInstallState] = useState<PWAInstallState>(() => {
    if (checkInstallationStatus()) {
      saveStateToStorage(PWAInstallState.INSTALLED);
      return PWAInstallState.INSTALLED;
    }
    return loadStateFromStorage();
  });

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  // Derived state - no redundant state variables
  const canInstall = installState === PWAInstallState.AVAILABLE && installPrompt !== null;
  const canShowAppleInstructions = isAppleDeviceNotInstalled() && installState !== PWAInstallState.INSTALLED;

  const hideInstallPrompt = useCallback(() => {
    console.log('PWA: Hiding install prompt');
    setShouldShowPrompt(false);
  }, []);

  const showInstallPrompt = useCallback(() => {
    console.log('PWA: Showing install prompt manually');
    if (canInstall || canShowAppleInstructions) {
      setShouldShowPrompt(true);
    }
  }, [canInstall, canShowAppleInstructions]);

  const installApp = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      console.log('PWA: No install prompt available');
      return false;
    }

    try {
      console.log('PWA: Showing install prompt');
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      console.log('PWA: User choice outcome:', outcome);
      
      if (outcome === 'accepted') {
        setInstallState(PWAInstallState.INSTALLED);
        setInstallPrompt(null);
        setShouldShowPrompt(false);
        saveStateToStorage(PWAInstallState.INSTALLED);
        return true;
      } else {
        // User rejected - hide prompt but keep state as available for manual trigger
        setShouldShowPrompt(false);
        console.log('PWA: User rejected installation');
      }
    } catch (error) {
      console.error('PWA Install error:', error);
      setShouldShowPrompt(false);
    }
    
    return false;
  }, [installPrompt]);

  const getAppleInstallInstructions = useCallback(() => {
    return "📱 Tap the Share button\n\n⬇️ Scroll down and tap 'Add to Home Screen'\n\n✅ Tap 'Add' to install NutriScan on your home screen";
  }, []);

  // Single useEffect with minimal dependencies to avoid re-runs
  useEffect(() => {
    // Skip if already installed
    if (installState === PWAInstallState.INSTALLED) {
      return;
    }

    console.log('PWA: Setting up installation detection, current state:', installState);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event received!');
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      setInstallPrompt(promptEvent);
      setInstallState(PWAInstallState.AVAILABLE);
      saveStateToStorage(PWAInstallState.AVAILABLE);
      
      // Only show automatically if user hasn't seen it before
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen');
      if (!hasSeenPrompt) {
        setShouldShowPrompt(true);
        localStorage.setItem('pwa-prompt-seen', 'true');
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed event received');
      setInstallState(PWAInstallState.INSTALLED);
      setInstallPrompt(null);
      setShouldShowPrompt(false);
      saveStateToStorage(PWAInstallState.INSTALLED);
    };

    // Setup Service Worker communication
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.active) {
          const messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = (event) => {
            if (event.data.type === 'VERSION_RESPONSE') {
              console.log('PWA: Received SW version:', event.data.version);
              setCurrentVersion(event.data.version);
            }
          };
          
          registration.active.postMessage(
            { type: 'GET_VERSION' },
            [messageChannel.port2]
          );
        }
      });
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Simplified installability check
    const checkInstallability = () => {
      console.log('PWA: Checking installability criteria...');
      
      // Check basic PWA requirements
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasManifest = document.querySelector('link[rel="manifest"]');
      const hasHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      
      console.log('PWA: Basic checks - SW:', hasServiceWorker, 'Manifest:', !!hasManifest, 'HTTPS:', hasHTTPS);
      
      if (!hasServiceWorker || !hasManifest || !hasHTTPS) {
        console.log('PWA: Basic requirements not met');
        setInstallState(PWAInstallState.NOT_SUPPORTED);
        saveStateToStorage(PWAInstallState.NOT_SUPPORTED);
        return;
      }

      // For iOS, set as available even without beforeinstallprompt
      const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isApple && installState === PWAInstallState.LOADING) {
        console.log('PWA: iOS detected, setting as available');
        setInstallState(PWAInstallState.AVAILABLE);
        saveStateToStorage(PWAInstallState.AVAILABLE);
      }

      // Timeout for non-iOS browsers
      setTimeout(() => {
        if (installState === PWAInstallState.LOADING && !installPrompt) {
          console.log('PWA: No install prompt after timeout, setting as not supported');
          setInstallState(PWAInstallState.NOT_SUPPORTED);
          saveStateToStorage(PWAInstallState.NOT_SUPPORTED);
        }
      }, 3000);
    };

    // Run check after a brief delay
    const checkTimer = setTimeout(checkInstallability, 500);

    return () => {
      clearTimeout(checkTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []); // Empty dependency array - only run once

  const contextValue: PWAContextType = {
    installState,
    currentVersion,
    canInstall,
    canShowAppleInstructions,
    installApp,
    showInstallPrompt,
    hideInstallPrompt,
    getAppleInstallInstructions
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      {/* Android/Desktop prompt */}
      {shouldShowPrompt && canInstall && (
        <PWAInstallPromptComponent onInstall={installApp} onDismiss={hideInstallPrompt} />
      )}
      {/* iOS instructions modal */}
      {shouldShowPrompt && canShowAppleInstructions && (
        <IosInstallInstructionsModal isOpen={true} onClose={hideInstallPrompt} />
      )}
    </PWAContext.Provider>
  );
};

// Simple inline prompt component to avoid circular dependencies
const PWAInstallPromptComponent: React.FC<{
  onInstall: () => Promise<boolean>;
  onDismiss: () => void;
}> = ({ onInstall, onDismiss }) => {
  const handleInstall = async () => {
    await onInstall();
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">
            Install NutriScan
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Get quick access and work offline
          </p>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            >
              Install
            </button>
            <button
              onClick={onDismiss}
              className="border border-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-50"
            >
              Not now
            </button>
          </div>
        </div>
        
        <button
          onClick={onDismiss}
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const usePWAContext = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWAContext must be used within a PWAProvider');
  }
  return context;
};
