
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import SessionService from '../services/SessionService';
import { UserProfile } from '../types/userData';
import UserDataService from '../services/UserDataService';
import ShoppingListService from '../services/ShoppingListService';
import { AuthState } from '../types/auth';
import { useUserCache } from '../hooks/useUserCache';
import { useTranslation } from 'react-i18next';
import { getAuthRedirectUri } from '@/utils/envConfig';
import { QueueClient } from '@/services/sw/QueueClient';

interface AuthContextType {
  // Estado centralizado - AuthState como única fuente de verdad
  authState: AuthState;
  userInfo: UserProfile | null;
  error: string | null;
  
  // Servicios
  sessionService: SessionService;
  
  // Acciones
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Create a single instance of SessionService
const sessionService = new SessionService({
  clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID || '',
  redirectUri: getAuthRedirectUri(),
});

// Create UserDataService instance and configure it with SessionService
const userDataService = UserDataService.getInstance();
userDataService.setDropboxService(sessionService);

// Create ShoppingListService instance and configure it with SessionService
const shoppingListService = ShoppingListService.getInstance();
shoppingListService.setSessionService(sessionService);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOADING);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { clearUserCache, getUserCacheInfo } = useUserCache();
  const { t } = useTranslation();

  const refreshUserInfo = useCallback(async () => {
    const isAuth = sessionService.isAuthenticated();
    
    if (!isAuth) {
      console.log('🔐 Auth: No authenticated, setting IDLE state');
      setAuthState(AuthState.IDLE);
      return;
    }

    // Avoid double initialization - check if user info already exists
    if (userInfo && authState === AuthState.AUTHENTICATED) {
      console.log('🔐 Auth: User info already loaded, skipping refresh');
      return;
    }

    try {
      console.log('🔐 Auth: Refreshing user info...');
      setError(null);
      
      const userInfo = await userDataService.getUserInfo();
      
      if (userInfo) {
        console.log('🔐 Auth: User info loaded successfully', userInfo);
        setUserInfo(userInfo);
        setAuthState(AuthState.AUTHENTICATED);
      } else {
        // Si getUserInfo devuelve null pero no lanzó error, probablemente el usuario fue deslogueado
        console.log('🔐 Auth: User info is null, user may have been logged out');
        setUserInfo(null);
        setAuthState(AuthState.IDLE);
      }
    } catch (error) {
      console.error('🔐 Auth: Error refreshing user info:', error);
      
      // Si hay error, verificar si es por desautenticación
      if (!sessionService.isAuthenticated()) {
        // Usuario fue deslogueado automáticamente por el servicio
        console.log('🔐 Auth: User was automatically logged out by service');
        setUserInfo(null);
        setAuthState(AuthState.IDLE);
      } else {
        // Error diferente
        setUserInfo(null);
        setAuthState(AuthState.ERROR);
        setError('Error loading user information');
      }
    }
  }, [authState, userInfo]);

  const login = useCallback(async () => {
    try {
      console.log('🔐 Auth: Starting login process...');
      setAuthState(AuthState.LOGGING_IN);
      setError(null);
      
      await sessionService.startAuth();
      // Note: El estado se actualizará cuando regrese del callback
    } catch (error) {
      console.error('🔐 Auth: Login error:', error);
      setAuthState(AuthState.ERROR);
      setError('Error during login');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🔐 Auth: Starting logout process...');
      setAuthState(AuthState.LOGGING_OUT);
      setError(null);

      // Limpiar datos del servicio
      sessionService.logout();
      
      // Limpiar cache del usuario (pero NO las shopping lists locales)
      const cacheInfo = getUserCacheInfo();
      console.log('🔐 Auth: Current user cache:', cacheInfo);
      
      const removedKeys = clearUserCache();
      console.log(`🔐 Auth: Removed ${removedKeys} cache keys during logout`);

      // Limpiar estado local
      setUserInfo(null);
      setError(null);
      
      // Pequeño delay para mostrar el spinner
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAuthState(AuthState.IDLE);
      console.log('🔐 Auth: Logout completed successfully');
      
    } catch (error) {
      console.error('🔐 Auth: Logout error:', error);
      setAuthState(AuthState.ERROR);
      setError('Error during logout');
    }
  }, [clearUserCache, getUserCacheInfo]);

  // Inicialización simplificada
  useEffect(() => {
    console.log('🔐 Auth: Initializing authentication state...');
    refreshUserInfo();
  }, [refreshUserInfo]);

  // Bootstrap SW Queue token as soon as user is authenticated
  useEffect(() => {
    (async () => {
      if (authState === AuthState.AUTHENTICATED) {
        try {
          const token = await sessionService.getAccessToken();
          if (token) {
            console.log('🔐 Auth: Bootstrapping SW Queue with access token');
            await QueueClient.getInstance().start(token);
          } else {
            console.log('🔐 Auth: No token available to bootstrap SW Queue');
          }
        } catch (e) {
          console.error('🔐 Auth: Error bootstrapping SW Queue', e);
        }
      }
    })();
  }, [authState]);

  const contextValue: AuthContextType = {
    // Estado centralizado - solo AuthState como fuente de verdad
    authState,
    userInfo,
    error,
    
    // Servicios
    sessionService,
    
    // Acciones
    login,
    logout,
    refreshUserInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
